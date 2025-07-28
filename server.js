// server.js
const http = require('http');
const app = require('./app');
const { init } = require('./src/socket'); 

const server = http.createServer(app);

// --- init Socket.IO ---
init(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
