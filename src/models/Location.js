const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  driverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  timestamp: { type: Date, default: Date.now }
});

locationSchema.index({ location: '2dsphere' }); // إنشاء الفهرس

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;