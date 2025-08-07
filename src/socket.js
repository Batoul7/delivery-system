
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

let io;

/**
 * A function to initialize a Socket.IO server and link it to an HTTP server.
 *  @param {http.Server} httpServer - An instance of the HTTP server from Express.
 *  @returns {io} - An instance of the Socket.IO server.
 */
function init(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        allowRequest: (req, callback) => {
            const token = req._query.token;
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        console.error('Socket.IO Auth Error: Invalid token', err.message);
                        return callback('Invalid token', false);
                    }
                    req.user = decoded;
                    callback(null, true);
                });
            } else {
                console.log('Socket.IO Auth Error: No token provided');
                callback('No token provided', false);
            }
        }
    });

 // Import and activate event handlers from the helpers file

    require('./helpers/socket')(io);

    return io;
}

/**
 * A function to get an io server instance from anywhere in the application.
 *  @returns {io} - An instance of the Socket.IO server.
 */
function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = { init, getIO };
