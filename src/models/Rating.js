const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  orderId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Order',
      required: true, 
      unique: true },

  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },

  driverId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User',
      required: true },
      
  stars: {
     type: Number,
      min: 1,
      max: 5,
       required: true },
  comment: {
     type: String },

},
 { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);