/**
 * This module exports a single function.
 * When invoked in server.js, it receives an instance of the Socket.IO server (io) and sets up event handlers for connections.
 *  @param {SocketIO.Server} io - The instance of the Socket.IO server configured in server.js.
 */

const { saveLocationToDB } = require('../controllers/loaction.controller');

module.exports = function (io) {

    io.on('connection', (socket) => {

        const user = socket.request.user;
        if (!user) {
            console.error('Socket connection without authenticated user.');
            return socket.disconnect();
        }
        console.log(` User connected: ${user.email} (Socket ID: ${socket.id})`);

        //Joining a private room for requests        
        socket.on('joinOrderRoom', (orderId) => {
            if (!orderId) {
                console.warn(`[Socket WARN] Socket ${socket.id} tried to join a room without an orderId.`);
                return;
            }
            socket.join(orderId);

            // This record will confirm to us that the user has successfully joined the room.
            console.log(` [Room Joined] User ${user.email} (Socket ID: ${socket.id}) successfully joined room: ${orderId}`);
        });

        // Receiving updates from the representative's site        
        socket.on('updateDriverLocation', async (data) => {
            const { orderId, latitude, longitude } = data;

            if (!orderId || latitude === undefined || longitude === undefined) {
                console.error(' [Socket ERROR] Invalid location update data received:', data);
                return;
            }

            // Save the location in the database            
            try {
                const locationDataToSave = {
                    driverId: user.id,
                    orderId,
                    latitude,
                    longitude
                };
                await saveLocationToDB(locationDataToSave);
                // console.log(`Location saved for driver ${user.id}`);  

            } catch (error) {
                console.error(' [DB ERROR] Failed to save location:', error);
            }

            // --- Add a record for verification before broadcasting ---            
            console.log(` [Broadcasting] Sending location update to room: ${orderId}`);

            // Broadcast the site to everyone in the room            
            io.to(orderId).emit('driverLocationUpdated', {
                orderId,
                latitude,
                longitude
            });
        });

        //Disconnecting from the server        
        socket.on('disconnect', () => {
            console.log(` User disconnected: ${user.email} (Socket ID: ${socket.id})`);
        });
    });
};
