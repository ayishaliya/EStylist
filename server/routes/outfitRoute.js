const express = require("express");
const router = express.Router();
const SavedOutfit = require("../models/SavedOutfit");

router.post("/save-outfit", async (req, res) => {
  const {
    userid,
    img1_filename,
    img1_description,
    img2_filename,
    img2_description,
    img3_filename,
    img3_description,
  } = req.body;

  const outfit = new SavedOutfit({
    userid,
    img1_filename,
    img1_description,
    img2_filename,
    img2_description,
    img3_filename,
    img3_description,
  });

  try {
    await outfit.save();
    res.status(201).send("Outfit saved successfully.");
  } catch (error) {
    console.error("Error saving outfit:", error);
    res.status(500).send("Failed to save outfit.");
  }
});

router.get("/get-saved-outfits/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const outfits = await SavedOutfit.find({ userid }).sort({ createdAt: -1 });
    res.json(outfits);
  } catch (error) {
    console.error("Error fetching saved outfits:", error);
    res.status(500).send("Failed to fetch saved outfits.");
  }
});

router.delete("/delete-outfit/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await SavedOutfit.findByIdAndDelete(id);
    res.status(200).send("Outfit deleted successfully.");
  } catch (error) {
    console.error("Error deleting outfit:", error);
    res.status(500).send("Failed to delete outfit.");
  }
});

module.exports = router;
