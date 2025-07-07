const express = require('express');
const router = express.Router();

const {
  getAllResources,
  createResource
} = require('../Controllers/resourceController');


router.get('/', getAllResources);
router.post('/', createResource);

module.exports = router;
