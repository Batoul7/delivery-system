const http = require('http');
const { Server } = require("socket.io");
const app = require('./app');
const jwt = require('jsonwebtoken');

const server = http.createServer(app);

// --- Socket.IO Setup ---
const io = require('socket.io')(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "post"]
    },
    // Socket.IO authentication middleware
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

// Import and initialize socket event handlers
require('./src/helpers/socket')(io);

// Make io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});