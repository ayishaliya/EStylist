const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Tip = require("../models/TipModel");
const SavedTip = require("../models/SavedTipModel");

// capitalize first letter of each word
const toTitleCase = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// capitalize only the first letter of the sentence
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// GET 9 random tips
router.get("/", async (req, res) => {
  try {
    const randomTips = await Tip.aggregate([{ $sample: { size: 9 } }]);
    res.json(randomTips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tips" });
  }
});

// POST a new tip
router.post("/", async (req, res) => {
  try {
    const formattedTitle = toTitleCase(req.body.title.trim());
    const formattedDetail = capitalizeFirstLetter(req.body.detail.trim());

    const newTip = new Tip({
      title: formattedTitle,
      detail: formattedDetail,
    });

    await newTip.save();
    res.status(201).json(newTip);
  } catch (error) {
    res.status(500).json({ error: "Failed to add tip" });
  }
});

// POST: Replace a closed tip with a new random one
router.post("/replace", async (req, res) => {
  try {
    const displayedTipIds = req.body.displayedTips || [];

    const newTip = await Tip.aggregate([
      {
        $match: {
          _id: {
            $nin: displayedTipIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      { $sample: { size: 1 } },
    ]);

    res.json(newTip[0] || null);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch a replacement tip" });
  }
});

// Save a tip
router.post("/save", async (req, res) => {
  const { userId, tipId, title, detail } = req.body;
  try {
    const existingTip = await SavedTip.findOne({ userId, tipId });
    if (existingTip) {
      return res
        .status(400)
        .json({ success: false, message: "Tip already saved" });
    }

    const newSavedTip = new SavedTip({ userId, tipId, title, detail });
    await newSavedTip.save();
    res.status(201).json({ success: true, message: "Tip saved successfully" });
  } catch (error) {
    console.error("Error saving tip:", error);
    res.status(500).json({ error: "Failed to save tip" });
  }
});

// Get saved tips for a user
router.get("/saved/:userId", async (req, res) => {
  try {
    const savedTips = await SavedTip.find({ userId: req.params.userId });
    res.json(savedTips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved tips" });
  }
});

// Remove a saved tip
router.delete("/remove", async (req, res) => {
  const { userId, tipId } = req.body;
  try {
    await SavedTip.deleteOne({ userId, tipId });
    res
      .status(200)
      .json({ success: true, message: "Tip removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove tip" });
  }
});

router.get("/unsaved/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const savedTips = await SavedTip.find({ userId }).select("tipId");
    const savedTipIds = savedTips.map((t) => t.tipId);

    const unsavedTips = await Tip.aggregate([
      { $match: { _id: { $nin: savedTipIds } } },
      { $sample: { size: 9 } },
    ]);

    res.json(unsavedTips);
  } catch (err) {
    console.error("Error fetching unsaved tips:", err);
    res.status(500).json({ error: "Failed to fetch unsaved tips" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const allTips = await Tip.find();
    res.json(allTips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tips" });
  }
});

module.exports = router;
