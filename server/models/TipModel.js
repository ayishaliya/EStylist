const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true },
});

const Tip = mongoose.model("Tip", TipSchema);
module.exports = Tip;
