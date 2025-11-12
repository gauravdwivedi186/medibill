const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const Trackingchema = new mongoose.Schema(
  {
    OrderID: { type: String, required: true},
    TrackingID: { type: String, required: true, unique: true },
    TrackingNo: { type: String, required: true, unique: true },
    TrackingCost: { type: String },
    trackingUrl: { type: String },
    TrackingStatus: { type: String },
    TrackingCourier: { type: String },
  },
  { collection: "all-Tracking" },
  { timestamps: true }
);

mongoose.models = {};
const Tracking = mongoose.model("Tracking", Trackingchema);
module.exports = Tracking;