const mongoose = require("mongoose");

const LiveDataCacheSchema = new mongoose.Schema(
  {
    chipId: { type: String, required: true, unique: true, index: true },
    moisture: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    soilRaw: { type: Number, required: true },
    rssi: { type: Number },
    freeHeap: { type: Number },
    deviceName: { type: String },
    location: { type: String },
    lastSeen: { type: Date, default: Date.now, index: true },
    status: { type: String, enum: ["online", "offline"], default: "online" },
  },
  {
    collection: "live-data-cache",
    timestamps: true,
  }
);

mongoose.models = {};
const LiveDataCache = mongoose.model("LiveDataCache", LiveDataCacheSchema);
module.exports = LiveDataCache;
