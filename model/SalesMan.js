const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const SalesManSchema = new mongoose.Schema(
  {
    SalesManID: { type: String, required: true, unique: true },
    SalesManName: { type: String },
    SalesManPhone: { type: String, required: true, unique: true },
    SalesManEmail: { type: String, required: true, unique: true },
  },
  { collection: "all-SalesMans" },
  { timestamps: true }
);

mongoose.models = {};
const SalesMan = mongoose.model("SalesMans", SalesManSchema);
module.exports = SalesMan;