const mongoose = require("mongoose");

const SavedTipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tipId: { type: mongoose.Schema.Types.ObjectId, ref: "Tip", required: true },
  title: { type: String, required: true },
  detail: { type: String, required: true },
});

const SavedTip = mongoose.model("SavedTip", SavedTipSchema);
module.exports = SavedTip;
