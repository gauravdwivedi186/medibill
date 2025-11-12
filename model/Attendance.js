const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const Attendancechema = new mongoose.Schema(
  {
    cardID: { type: String, required: true },
    Login: { type: Date, required: true },
    Logout: { type: Date},
  },
  { collection: "all-Attendance" },
  { timestamps: true }
);

mongoose.models = {};
const Attendance = mongoose.model("Attendance", Attendancechema);
module.exports = Attendance;