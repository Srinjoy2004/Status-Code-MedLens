const Medicine = require('../models/Medicine');

// Get all medicines (This function is correct)
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines", error });
  }
};

// --- CORRECTED PURCHASE FUNCTION ---
const purchaseMedicine = async (req, res) => {
  // Now expecting 'medicineName' in the request body
  const { medicineName, quantity } = req.body;

  if (!medicineName || !quantity) {
    return res.status(400).json({ message: "medicineName and quantity are required." });
  }
  
  try {
    // Use findOne to look up the medicine by its name
    const medicine = await Medicine.findOne({ name: medicineName });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    // Check if enough quantity is present
    if (medicine.quantity < quantity) {
      return res.status(400).json({ message: `Out of stock. Only ${medicine.quantity} items available.`});
    }

    // Subtract the quantity from the stock
    medicine.quantity -= quantity;
    await medicine.save();
    
    // Calculate the total price
    const totalPrice = medicine.price * quantity;

    res.status(200).json({
      message: "Purchase successful!",
      medicineName: medicine.name,
      quantityPurchased: quantity,
      totalPrice: totalPrice,
      remainingStock: medicine.quantity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during purchase", error: error.message });
  }
};

module.exports = {
  getAllMedicines,
  purchaseMedicine,
};