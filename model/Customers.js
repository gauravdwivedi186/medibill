const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const CustomerSchema = new mongoose.Schema(
  {
    CustomerID: { type: String, required: true, unique: true },
    CustomerName: { type: String },
    CustomerPhone: { type: String, required: true, unique: true },
    CustomerEmail: { type: String, required: true, unique: true },
  },
  { collection: "all-Customers" },
  { timestamps: true }
);

mongoose.models = {};
const Customers = mongoose.model("Customers", CustomerSchema);
module.exports = Customers;