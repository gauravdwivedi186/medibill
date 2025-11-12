const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const CardSchema = new mongoose.Schema(
  {
    cardID: { type: String, required: true, unique: true },
    name: { type: String },
    class: { type: String },
    contact: { type: String },
  },
  { collection: "all-Cards" },
  { timestamps: true }
);

mongoose.models = {};
const Cards = mongoose.model("Cards", CardSchema);
module.exports = Cards;