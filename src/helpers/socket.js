// This module is responsible for all the WebSocket logic.

const { saveLocationToDB } = require('../controllers/loaction.controller');
const Order = require('../models/Order'); 

// Function to calculate the distance between two points (in kilometers)
function getDistance(coords1, coords2) {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


module.exports = function(io) {

    io.on('connection', (socket) => {

        const user = socket.request.user;
        if (!user) {
            return socket.disconnect();
        }
        console.log(` User connected: (ID: ${user.id}) (Role: ${user.role})`);

       // The drivers joining their own private room 
        if (user.role === 'Driver') {
            socket.join('drivers_room');
            console.log(`Driver ${user.id} joined the drivers_room.`);
        }

        // Joining a private room for the request (for the driver client)        
        socket.on('joinOrderRoom', (orderId) => {
            if (!orderId) return;
            socket.join(orderId);
            console.log(`[Room Joined] User (ID: ${user.id}) joined room: ${orderId}`);
        });

        // Receiving updates from the driver site        
        socket.on('updateDriverLocation', async (data) => {
            const { orderId, latitude, longitude } = data;
            
            if (!orderId || latitude === undefined || longitude === undefined) {
                return console.error('Invalid location data from driver');
            }

            // Broadcast site update to the client            
            io.to(orderId).emit('driverLocationUpdated', { orderId, latitude, longitude });

            // Checking for proximity          
            try {
                const order = await Order.findById(orderId);

                // Check if the request exists and if a proximity notification has not been sent before                
                if (order && !order.proximityNotified) {
                    const driverCoords = [longitude, latitude];
                    const clientCoords = order.deliveryLocation.coordinates;
                    
                    // Calculate the distance (for example, if it is less than 1 kilometer)                    
                    const distance = getDistance(driverCoords, clientCoords);
                    if (distance < 1) {
                        io.to(orderId).emit('driverApproaching', { message: 'المندوب على وشك الوصول!' });
                        console.log(`Driver is approaching for order ${orderId}. Notifying client.`);
                        
                        // Update the request to prevent resending the notification again                        
                        order.proximityNotified = true;
                        await order.save();
                    }
                }
            } catch (error) {
                console.error(`Error checking proximity for order ${orderId}:`, error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: (ID: ${user.id})`);
        });
    });
};
