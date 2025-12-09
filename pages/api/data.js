import connectDb from "@/middleware/mongoose";
import SensorData from "@/model/Sensor";
import LiveDataCache from "@/model/LiveDataCache";

const lastSaveTime = {};
const SAVE_INTERVAL = 60000; // 1 minute
const OFFLINE_THRESHOLD = 30000; // 30 seconds

const handler = async (req, res) => {
  
  // POST: ESP8266 sends data
  if (req.method == "POST") {
    try {
      const { moisture, temperature, humidity, soilRaw, chipId, rssi, freeHeap } = req.body;

      if (!moisture || !temperature || !humidity || !soilRaw || !chipId) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const currentTime = Date.now();
      const deviceLastSave = lastSaveTime[chipId] || 0;
      const timeSinceLastSave = currentTime - deviceLastSave;

      // Always update live cache
      await LiveDataCache.findOneAndUpdate(
        { chipId },
        { moisture, temperature, humidity, soilRaw, rssi, freeHeap, lastSeen: new Date(), status: "online" },
        { upsert: true, new: true }
      );

      // Save to DB only once per minute
      let savedToDb = false;
      if (timeSinceLastSave >= SAVE_INTERVAL) {
        const sensorData = new SensorData({ moisture, temperature, humidity, soilRaw, chipId, rssi, freeHeap });
        await sensorData.save();
        lastSaveTime[chipId] = currentTime;
        savedToDb = true;
      }

      return res.status(200).json({ success: true, savedToDatabase: savedToDb, liveCacheUpdated: true });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET: Live data for all devices
  if (req.method === "GET") {
    try {
      const { chipId } = req.query;
      const currentTime = new Date();

      let query = chipId ? { chipId } : {};
      const liveData = await LiveDataCache.find(query).sort({ lastSeen: -1 });

      const enrichedData = liveData.map(device => {
        const timeSinceLastSeen = currentTime - new Date(device.lastSeen);
        const isOnline = timeSinceLastSeen < OFFLINE_THRESHOLD;
        return {
          ...device._doc,
          status: isOnline ? "online" : "offline",
          timeSinceLastSeen: Math.round(timeSinceLastSeen / 1000)
        };
      });

      return res.json({ success: true, data: enrichedData });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
};

export default connectDb(handler);
