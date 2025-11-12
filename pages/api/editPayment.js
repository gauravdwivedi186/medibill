import Cards from "@/model/Cards";
import connectDb from "../../middleware/mongoose";
import { parse } from "cookie";  import jwt from "jsonwebtoken";
import Payments from "@/model/Payments";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const cookies = parse(req.headers.cookie || "");
            const token = cookies.admin_access_token;
            let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
            if (!decoded._id==process.env.ADMIN_PASSWORD) {
              return res
                .status(403)
                .json({ success: false, errors: "Unable to Authenticate" });
            }
            console.log("req.body");
            console.log(req.body);
            // Check if the request body contains the required fields
            if (!req.body.PaymentID || !req.body.PaymentMode || !req.body.PaymentChannel || !req.body.PaymentDate || !req.body.PaymentAmount) {
                return res.status(400).json({ success: false, msg: "Missing required fields in the request body." });
            }

            
            const { PaymentID, PaymentMode, PaymentChannel, PaymentDate, PaymentAmount } = req.body;
            
            // Find the card in the database based on the provided cardid
            const foundCard = await Payments.findOne({ PaymentID: PaymentID });
            
            if (!foundCard) {
                return res.status(404).json({ success: false, msg: "Card not found." });
            }

            // Update the details of the found card
            foundCard.PaymentMode = PaymentMode;
            foundCard.PaymentChannel = PaymentChannel;
            foundCard.PaymentDate = PaymentDate;
            foundCard.PaymentAmount = PaymentAmount;

            // Save the updated card to the database
            await foundCard.save();

            // Return the updated details of the card as a JSON response
            return res.status(200).json({ success: true, card: foundCard, msg: "Details Updated Sucessfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
        }
    }
};

export default connectDb(handler);
