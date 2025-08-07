const fs = require('fs');
const path = require('path');
const Log = require('../models/Log');
const logger = require('../helpers/logger');

/**
 * Archives all logs to a file and then deletes them from the database.
 * This function is designed to run in the background.
 */
const archiveAndClearLogs = async () => {
    try {
        console.log('Starting log archival process...');
        logger.log('SYSTEM', { action: 'ARCHIVE_START', details: 'Log archival process initiated.' });

        // Use a cursor to read data in streams, which is memory-efficient.
        const logsCursor = Log.find({}).cursor();

        // Create a unique filename with a timestamp.
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const archiveDir = path.join(__dirname, '..', 'archives');
        const archiveFilePath = path.join(archiveDir, `logs-archive-${timestamp}.jsonl`);

        // Ensure the 'archives' directory exists.
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir);
        }

        const writeStream = fs.createWriteStream(archiveFilePath);

        let logCount = 0;
        // Loop through the cursor and write each log to the file.
        for (let doc = await logsCursor.next(); doc != null; doc = await logsCursor.next()) {
            // Write each log as a JSON string followed by a newline (JSONL format).
            writeStream.write(JSON.stringify(doc) + '\n');
            logCount++;
        }

        writeStream.end();

        // Listen for the 'finish' event, which means the file has been successfully written.
        writeStream.on('finish', async () => {
            console.log(`Successfully archived ${logCount} logs to ${archiveFilePath}`);
            logger.log('SYSTEM', {
                action: 'ARCHIVE_SUCCESS',
                details: `Archived ${logCount} logs to file: ${archiveFilePath}`
            });

            // Only delete logs after confirming the archive was successful.
            console.log('Deleting logs from the database...');
            await Log.deleteMany({});
            console.log('Successfully deleted logs from the database.');
            logger.log('SYSTEM', { action: 'DELETE_SUCCESS', details: 'Cleared all logs from the database after archival.' });
        });

        writeStream.on('error', (err) => {
            console.error('Error writing to archive file. Logs will NOT be deleted.', err);
            logger.log('SYSTEM', { action: 'ARCHIVE_FAILURE', status: 'FAILURE', details: err.message });
        });

    } catch (error) {
        console.error('A critical error occurred during the log archival process:', error);
        logger.log('SYSTEM', { action: 'ARCHIVE_PROCESS_ERROR', status: 'FAILURE', details: error.message });
    }
};

module.exports = {
    archiveAndClearLogs,
};
