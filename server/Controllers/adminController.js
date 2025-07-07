// server/controllers/adminController.js

const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const { getIO } = require('../socket'); // Make sure this import is here

// --- INCIDENT CONTROLLERS ---

exports.getUnverifiedIncidents = async (req, res) => {
    // ... this function doesn't emit, so it's fine
    try {
        const incidents = await Incident.find({ status: 'unverified' }).sort({ createdAt: -1 });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.verifyIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });
        
        incident.status = 'verified';
        const updatedIncident = await incident.save();

        // Use getIO() here
        getIO().emit('incidentVerified', updatedIncident);
        getIO().emit('incidentRemovedFromAdminList', { _id: updatedIncident._id });

        res.json({ message: 'Incident verified successfully', incident: updatedIncident });
    } catch (error) {
        console.error("CRASH in verifyIncident:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.dismissIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });
        
        incident.status = 'dismissed';
        const updatedIncident = await incident.save();

        // --- THIS IS THE FIX ---
        // Change req.io.emit to getIO().emit
        getIO().emit('incidentRemovedFromAdminList', { _id: updatedIncident._id });

        res.json({ message: 'Incident dismissed successfully', incident: updatedIncident });
    } catch (error) {
        console.error("CRASH in dismissIncident:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- RESOURCE CONTROLLERS ---

exports.getUnverifiedResources = async (req, res) => {
    // ... this function doesn't emit, so it's fine
    try {
        const resources = await Resource.find({ status: 'unverified' }).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.verifyResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        
        resource.status = 'verified';
        const updatedResource = await resource.save();

        // Use getIO() here
        getIO().emit('resourceVerified', updatedResource);
        getIO().emit('resourceRemovedFromAdminList', { _id: updatedResource._id });

        res.json({ message: 'Resource verified successfully', resource: updatedResource });
    } catch (error) {
        console.error("CRASH in verifyResource:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.dismissResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        
        resource.status = 'dismissed';
        await resource.save();

        // Use getIO() here
        getIO().emit('resourceRemovedFromAdminList', { _id: resource._id });

        res.json({ message: 'Resource report dismissed successfully' });
    } catch (error) {
        console.error("CRASH in dismissResource:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createVerifiedResource = async (req, res) => {
    // ... This function likely doesn't emit, but if it did, you'd use getIO() here too.
    const { resourceType, description, contact, latitude, longitude } = req.body;
    try {
        const resource = await Resource.create({
            resourceType,
            description,
            contact,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            status: 'verified'
        });
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: 'Error creating resource', error: error.message });
    }
};