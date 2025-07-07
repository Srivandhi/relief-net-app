const Incident = require('../models/Incident');
const { getIO } = require('../socket');


//get request to get all verified incidents
const getAllVerifiedIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({ status: 'verified' });
    res.status(200).json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


//post request creating a new incident
const createIncident = async (req, res) => {
  try {
    const { longitude, latitude, incidentType, description } = req.body;
    const newIncident = new Incident({
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      incidentType,
      description
    });
    const savedIncident = await newIncident.save();

    getIO().emit('newUnverifiedIncident', savedIncident);


    res.status(201).json(savedIncident);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating incident', error: error.message });
  }
};

module.exports = {
  getAllVerifiedIncidents,
  createIncident
};