const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const Paymentschema = new mongoose.Schema(
  {
    PaymentID: { type: String, required: true, unique: true },
    PaymentNo: { type: String, required: true, unique: true },
    OrderID: { type: String },
    PaymentMode: { type: String },
    PaymentStatus: { type: String },
    PaymentChannel: { type: String },
    PaymentDate: { type: String },
    PaymentAmount: { type: String },

  },
  { collection: "all-Payments" },
  { timestamps: true }
);

mongoose.models = {};
const Payments = mongoose.model("Payments", Paymentschema);
module.exports = Payments;