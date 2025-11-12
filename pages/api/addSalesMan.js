
import SalesMan from "@/model/SalesMan";
import connectDb from "../../middleware/mongoose";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

// Function to generate SalesMan ID in series
const generateSalesManID = async () => {
  try {
    const highestSalesMan = await SalesMan.findOne({}, { SalesManID: 1 }).sort({ SalesManID: -1 });
    let nextID;
    if (highestSalesMan) {
      const highestIDNumber = parseInt(highestSalesMan.SalesManID.slice(1));
      nextID = `S${(highestIDNumber + 1).toString().padStart(3, "0")}`;
    } else {
      nextID = "S001";
    }
    return nextID;
  } catch (error) {
    throw new Error("Error generating SalesMan ID");
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const cookies = parse(req.headers.cookie || "");
      const token = cookies.admin_access_token;
      let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
      if (!decoded._id === process.env.ADMIN_PASSWORD) {
        return res
          .status(403)
          .json({ success: false, errors: "Unable to Authenticate" });
      }

      console.log(req.body);

      // Generate the next SalesMan ID
      const nextSalesManID = await generateSalesManID();

      const newCard = new SalesMan({
        SalesManID: nextSalesManID,
        SalesManName: req.body.SalesManName,
        SalesManPhone: req.body.SalesManPhone,
        SalesManEmail: req.body.SalesManEmail,
      });

      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: `${nextSalesManID} - SalesMan Added Successfully.` });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error. Contact the Developers." });
    }
  }
};

export default connectDb(handler);
