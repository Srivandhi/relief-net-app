// server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();

// Ensure all controller functions are correctly imported by name
const {
  getUnverifiedIncidents,
  verifyIncident,
  dismissIncident,
  getUnverifiedResources,
  verifyResource,
  dismissResource,
  createVerifiedResource
} = require('../Controllers/adminController'); // Note: Your path might be '../controllers/...'

// Import the protection middleware
const { protect } = require('../middleware/authMiddleware');


// --- Incident Routes ---
router.route('/incidents/unverified').get(protect, getUnverifiedIncidents);
router.route('/incidents/:id/verify').put(protect, verifyIncident);
router.route('/incidents/:id/dismiss').put(protect, dismissIncident);

// --- Resource Routes ---
router.route('/resources/unverified').get(protect, getUnverifiedResources);
router.route('/resources/:id/verify').put(protect, verifyResource);
router.route('/resources/:id/dismiss').put(protect, dismissResource); // Ensures this uses PUT
router.route('/resources').post(protect, createVerifiedResource); // For admin to create verified resources

module.exports = router;