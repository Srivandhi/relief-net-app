const express = require('express');
const router = express.Router();

const { 
  getAllVerifiedIncidents, 
  createIncident 
} = require('../Controllers/incidentController');

router.get('/', getAllVerifiedIncidents);

router.post('/', createIncident);

module.exports = router;
