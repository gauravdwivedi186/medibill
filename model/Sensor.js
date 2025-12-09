const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema(
  {
    // Sensor readings
    moisture: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100,
      description: "Soil moisture percentage (0-100%)"
    },
    
    temperature: { 
      type: Number, 
      required: true,
      description: "Temperature in Celsius from DHT11"
    },
    
    humidity: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100,
      description: "Air humidity percentage from DHT11"
    },
    
    soilRaw: { 
      type: Number, 
      required: true,
      description: "Raw analog reading from soil sensor (0-1023)"
    },
    
    // ESP8266 device information
    chipId: { 
      type: String, 
      required: true,
      index: true,
      description: "Unique ESP8266 chip ID"
    },
    
    rssi: { 
      type: Number,
      description: "WiFi signal strength in dBm"
    },
    
    freeHeap: { 
      type: Number,
      description: "Free heap memory in bytes"
    },
    
    // Optional metadata
    deviceName: { 
      type: String,
      default: "ESP8266-Soil-Monitor",
      description: "Custom device name"
    },
    
    location: { 
      type: String,
      description: "Physical location of the device"
    },
    
    // Data quality flags
    isValid: { 
      type: Boolean, 
      default: true,
      description: "Flag to mark if data reading is valid"
    },
    
    errorMessage: { 
      type: String,
      description: "Error message if any sensor fails"
    }
  },
  { 
    collection: "sensor-data",
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false // Removes __v field
  }
);

// Create indexes for better query performance
SensorDataSchema.index({ chipId: 1, createdAt: -1 });
SensorDataSchema.index({ createdAt: -1 });
SensorDataSchema.index({ deviceName: 1, createdAt: -1 });

// Add a TTL index to automatically delete old data after 90 days (optional)
// SensorDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Virtual field for calculating moisture status
SensorDataSchema.virtual('moistureStatus').get(function() {
  if (this.moisture < 30) return 'Dry';
  if (this.moisture < 60) return 'Moderate';
  return 'Wet';
});

// Virtual field for temperature in Fahrenheit
SensorDataSchema.virtual('temperatureFahrenheit').get(function() {
  return (this.temperature * 9/5) + 32;
});

// Instance method to check if readings are within normal range
SensorDataSchema.methods.isWithinNormalRange = function() {
  return (
    this.moisture >= 0 && this.moisture <= 100 &&
    this.temperature >= -10 && this.temperature <= 60 &&
    this.humidity >= 0 && this.humidity <= 100 &&
    this.soilRaw >= 0 && this.soilRaw <= 1023
  );
};

// Static method to get latest readings for a specific device
SensorDataSchema.statics.getLatestByChipId = function(chipId, limit = 10) {
  return this.find({ chipId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

// Static method to get average readings for a time period
SensorDataSchema.statics.getAverageReadings = function(chipId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        chipId: chipId,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        avgMoisture: { $avg: "$moisture" },
        avgTemperature: { $avg: "$temperature" },
        avgHumidity: { $avg: "$humidity" },
        minMoisture: { $min: "$moisture" },
        maxMoisture: { $max: "$moisture" },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Pre-save middleware to validate data
SensorDataSchema.pre('save', function(next) {
  // Mark as invalid if sensor readings are out of range
  if (!this.isWithinNormalRange()) {
    this.isValid = false;
    this.errorMessage = "Sensor readings out of normal range";
  }
  next();
});

mongoose.models = {};
const SensorData = mongoose.model("SensorData", SensorDataSchema);

module.exports = SensorData;
