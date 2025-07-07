

const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],  
      required: true,
      index: '2dsphere' 
    }
  },
  incidentType: {
    type: String,
    enum: ['Flooding', 'Fire', 'Road Blockage', 'Structural Damage', 'Earthquake' ,'Landslide' , 'Cyclone' , 'Accident' , 'Other'],
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['unverified', 'verified', 'dismissed'],
    default: 'unverified' 
  },
}, { timestamps: true });


const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;