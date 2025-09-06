const mongoose = require("mongoose");

const savedOutfitSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  img1_filename: { type: String, default: "" },
  img1_description: { type: String, default: "" },
  img2_filename: { type: String, default: "" },
  img2_description: { type: String, default: "" },
  img3_filename: { type: String, default: "" },
  img3_description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const SavedOutfit = mongoose.model("SavedOutfit", savedOutfitSchema);
module.exports = SavedOutfit;
