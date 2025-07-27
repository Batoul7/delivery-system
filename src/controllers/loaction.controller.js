const Location = require('../models/Location');

const updateLocation = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Update location error:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      error: err.message 
    });
  }
};

const getLocation = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Get location error:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      error: err.message 
    });
  }
};

const saveLocationToDB = async (data) => {
  try {
    await Location.create({
      driverId: data.driverId,
      orderId: data.orderId,
      location: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude]
      }
    });
  } catch (error) {
    console.error('Failed to save location:', error);
  }
};

module.exports = {
  updateLocation,
  getLocation,
  saveLocationToDB
};