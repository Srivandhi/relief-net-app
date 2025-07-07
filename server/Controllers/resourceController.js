// server/controllers/resourceController.js

const Resource = require('../models/Resource');
// --- 1. IMPORT getIO from our central socket.js file ---
const { getIO } = require('../socket');

// @desc    Get all VERIFIED resources for the public map
// @route   GET /api/resources
// @access  Public
const getAllResources = async (req, res) => {
  try {
    // This query correctly only finds resources with status 'verified'
    const resources = await Resource.find({ status: 'verified' });
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error in getAllResources:", error);
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};


// @desc    Public user creates a new, UNVERIFIED resource
// @route   POST /api/resources
// @access  Public
const createResource = async (req, res) => {
  try {
    const { resourceType, description, contact, longitude, latitude } = req.body;

    const newResource = new Resource({
      resourceType,
      description,
      contact,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
      // The 'status' field will automatically default to 'unverified'
      // based on the schema in your Resource model.
    });

    const savedResource = await newResource.save();

    // --- 2. Use getIO() to get the socket instance and emit the event ---
    // This notifies the admin dashboard that a new resource needs review.
    getIO().emit('newUnverifiedResource', savedResource);

    res.status(201).json(savedResource);
  } catch (error) {
    console.error("CRASH in createResource:", error);
    res.status(400).json({ message: 'Error creating resource', error: error.message });
  }
};

module.exports = {
  getAllResources,
  createResource
};