require('dotenv').config();
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Medicine = require('./models/Medicine');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const connectDB = require('./config/db');

// --- Configuration ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

// --- Helper function for delay ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Main Seeder Function ---
const importData = async () => {
  try {
    // --- CHANGE 1: Updated goal to 100 ---
    const totalToGenerate = 100;
    const batchSize = 10;
    let generatedCount = 0;

    console.log(`Starting AI seeder. Goal: ${totalToGenerate} unique medicines.`);
    
    await Medicine.deleteMany();
    console.log("Cleared existing medicine data.");

    while (generatedCount < totalToGenerate) {
      console.log(`\nGenerating a batch of ${batchSize} names...`);
      
      // --- CHANGE 2: Fine-tuned prompt for more unique names ---
      const prompt = `Generate a list of ${batchSize} unique and varied product names commonly found in a pharmacy.

The list must include a diverse mix of items, such as:
1.  **Prescription Medications**: (e.g., Atorvastatin, Amoxicillin)
2.  **Over-the-Counter Drugs**: (e.g., Ibuprofen, Paracetamol)
3.  **Topical Products**: Ointments, creams, and lotions (e.g., Boroline, Neosporin, Hydrocortisone Cream).
4.  **Medical Supplies**: Band-aids, adhesive paste pads, antiseptic wipes, and gauze.
5.  **Personal Care Items**: Medicated shampoos, toothpaste, and other common drugstore products.

Return the list as a single, valid JSON array of strings. Ensure no duplicates.

For example: ["Sertraline", "Ibuprofen 200mg", "Boroline Antiseptic Cream", "Band-Aid Waterproof Strips", "Cetaphil Gentle Cleanser"]`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text().trim();
      
      responseText = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
      
      const medicineNames = JSON.parse(responseText);

      for (const name of medicineNames) {
        if (generatedCount >= totalToGenerate) break;

        const existingMedicine = await Medicine.findOne({ name });

        if (existingMedicine) {
          console.log(`-> 🟡 Skipping duplicate: "${name}"`);
          continue;
        }

        await Medicine.create({
          medicineId: nanoid(10),
          name: name,
          price: parseFloat((Math.random() * (50 - 2) + 2).toFixed(2)),
          quantity: Math.floor(Math.random() * 300) + 10,
        });

        generatedCount++;
        console.log(`-> ✅ Success! "${name}" inserted. (${generatedCount}/${totalToGenerate})`);
      }
      
      if (generatedCount < totalToGenerate) {
        console.log("\nWaiting for 5 seconds before next batch...");
        await delay(5000);
      }
    }

    console.log(`\n🎉 Seeding complete! ${generatedCount} unique medicines were added to the database.`);
    process.exit();

  } catch (error) {
    console.warn("An error occurred during the seeding process:", error);
    process.exit(1);
  }
};

// --- Script Execution ---
const runSeeder = async () => {
  await connectDB();
  await importData();
};

runSeeder();