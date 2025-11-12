const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const InvoiceSchema = new mongoose.Schema(
  {
    InvoiceID: { type: String, required: true, unique: true },
    OrderID: { type: String, required: true, unique: true },
    CustomerID: { type: String },
    InvoiceNo: { type: String },
    Products: { type: Array },
    Status: { type: String },
    SalesChannel: { type: String },
    Address: { type: String },
    Pincode: { type: String },
    TrackingID: { type: Array },
    PaymentID: { type: Array },
    Total: { type: String },
    TaxType : { type: String },
    GST : { type: String },
    Date: {type: String}
  },
  { collection: "all-Invoices" },
  { timestamps: true }
);

mongoose.models = {};
const Invoices = mongoose.model("Invoices", InvoiceSchema);
module.exports = Invoices;