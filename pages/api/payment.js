import Products from "@/model/Products";
import { parse } from "cookie";  import jwt from "jsonwebtoken";
import connectDb from "../../middleware/mongoose";
import Invoices from "@/model/Invoices";
import Orders from "@/model/Orders";
import Payments from "@/model/Payments";
const mongoose = require("mongoose");

const LastPaymentNumber = mongoose.model('LastPaymentNumber', {
    value: { type: Number, default: 0 }
});

// 2. Function to generate the next Payment ID in the series
const generatePaymentID = async () => {
    const lastPaymentNumberDoc = await LastPaymentNumber.findOneAndUpdate({}, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `PAY${String(lastPaymentNumberDoc.value).padStart(3, '0')}`;
};



const handler = async (req, res) => {
    if (req.method == "POST") {
        try {
            const cookies = parse(req.headers.cookie || "");
            const token = cookies.admin_access_token;
            let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
            if (!decoded._id==process.env.ADMIN_PASSWORD) {
              return res
                .status(403)
                .json({ success: false, errors: "Unable to Authenticate" });
            }
            console.log(req.body);

            const existingCard = await Payments.findOne({ PaymentID: req.body.PaymentID });
            const checkCustomer = await Orders.findOne({ OrderID: req.body.OrderID });

       
            const nextPaymentID = await generatePaymentID();
            const newCard = new Payments({
                PaymentID: nextPaymentID,
                PaymentNo: req.body.PaymentNo,
                OrderID: req.body.OrderID,
                PaymentMode: req.body.PaymentMode,
                PaymentStatus: req.body.PaymentStatus,
                PaymentChannel: req.body.PaymentChannel,
                PaymentDate: req.body.PaymentDate,
                PaymentAmount: req.body.PaymentAmount
            });

            await newCard.save();
            console.log("okay");
            return res.status(200).json({ success: true, msg: `${newCard.PaymentID} Payments Added Successfuly` ,PaymentID : newCard.PaymentID });
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
            if (!decoded._id==process.env.ADMIN_PASSWORD) {
              return res
                .status(403)
                .json({ success: false, errors: "Unable to Authenticate" });
            }
            // Find all cards in the database
            const allCards = await Payments.find({});

            // Return the found cards as a JSON response
            return res.status(200).json({ success: true, payments: allCards });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
        }
    }

};

export default connectDb(handler);
