import Products from "@/model/Products";
import connectDb from "../../middleware/mongoose";
import Invoices from "@/model/Invoices";
import Orders from "@/model/Orders";
import { parse } from "cookie"; import jwt from "jsonwebtoken";
import Tracking from "@/model/Tracking";
const mongoose = require("mongoose");

const LastTrackingNumber = mongoose.model('LastTrackingNumber', {
    value: { type: Number, default: 0 }
});

// 2. Function to generate the next tracking ID in the series
const generateTrackingID = async () => {
    const lastTrackingNumberDoc = await LastTrackingNumber.findOneAndUpdate({}, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `TRC${String(lastTrackingNumberDoc.value).padStart(3, '0')}`;
};


const handler = async (req, res) => {
    if (req.method == "POST") {
        try {
            const cookies = parse(req.headers.cookie || "");
            const token = cookies.admin_access_token;
            let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
            if (!decoded._id == process.env.ADMIN_PASSWORD) {
                return res
                    .status(403)
                    .json({ success: false, errors: "Unable to Authenticate" });
            }
            console.log(req.body);

            const existingCard = await Tracking.findOne({ TrackingID: req.body.TrackingID });
            const checkCustomer = await Orders.findOne({ OrderID: req.body.OrderID });

            if (existingCard) {
                // If cardID already exists, return an error response
                return res.status(400).json({ success: false, msg: "Tracking ID already exists." });
            }
            const nextTrackingID = await generateTrackingID();
            const newCard = new Tracking({
                TrackingID: nextTrackingID,
                TrackingNo: req.body.TrackingNo,
                TrackingCost: req.body.cost,
                trackingUrl: req.body.trackingUrl,
                TrackingStatus: req.body.TrackingStatus,
                TrackingCourier: req.body.courierName,
                OrderID: req.body.OrderID
            });

            await newCard.save();
            console.log("okay");
            console.log(newCard);
            console.log("okay");
            return res.status(200).json({ success: true, msg: `${newCard.TrackingID} Tracking Added Successfuly`, TrackingID : newCard.TrackingID });
        } catch (err) {
            console.error(err);
            res
                .status(500)
                .json({ success: false, msg: "Server error..Contact the Developers." });
        }
    } else if (req.method === "GET") {
        try {
            const cookies = parse(req.headers.cookie || "");
            const token = cookies.admin_access_token;
            let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
            if (!decoded._id == process.env.ADMIN_PASSWORD) {
                return res
                    .status(403)
                    .json({ success: false, errors: "Unable to Authenticate" });
            }
            // Find all cards in the database
            const allCards = await Tracking.find({});

            // Return the found cards as a JSON response
            return res.status(200).json({ success: true, trackings: allCards });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
        }
    }

};

export default connectDb(handler);
