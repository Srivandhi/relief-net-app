// server/models/Resource.js

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    enum: ['Shelter', 'Medical Aid', 'Food', 'Ambulance', 'Other'], // Good to add an enum
    required: true
  },
  description: String,
  contact: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere' // Add this for performance!
    }
  },
  // --- ADD THIS ENTIRE STATUS FIELD ---
  status: {
    type: String,
    enum: ['unverified', 'verified' , 'dismissed'],
    default: 'unverified'
  }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;