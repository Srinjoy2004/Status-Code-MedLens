const express = require('express');
const router = express.Router();
const {
  getAllMedicines,
  purchaseMedicine,
} = require('../controllers/medicineController');

// Define the routes
router.get('/medicines', getAllMedicines);
router.post('/purchase', purchaseMedicine);

module.exports = router;