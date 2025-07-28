const Location = require('../models/Location');
const asyncHandler = require('express-async-handler');

const updateLocation = asyncHandler(async (req, res) => {
    const driverId = req.user.id;
    const { latitude, longitude, orderId } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const newLocation = await Location.create({
      driverId,
      orderId,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });

    res.json({ 
      message: 'Location updated', 
      location: newLocation 
    });
})


const getLocation = asyncHandler(
async (req, res) => {
  
    const driverId = req.params.driverId;
    const location = await Location.findOne({ driverId })
                                  .sort({ timestamp: -1 });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({
      latitude: location.location.coordinates[1],
      longitude: location.location.coordinates[0],
      timestamp: location.timestamp
    }); 
})



const saveLocationToDB = asyncHandler(

async (data) => {
  
    await Location.create({
      driverId: data.driverId,
      orderId: data.orderId,
      location: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude]
      }
    });
  
}
)


module.exports = {
  updateLocation,
  getLocation,
  saveLocationToDB
};