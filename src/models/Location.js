const mongoose = require('mongoose');
const aragon2 = require('aragon2');


const LocationSchema = new mongoose.Schema({
    driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true
});
LocationSchema.index({ coordinates: '2dsphere' });

const Location = mongoose.model('User', LocationSchema);

module.exports = Location;