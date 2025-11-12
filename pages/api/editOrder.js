import Cards from "@/model/Cards";
import connectDb from "../../middleware/mongoose";
import { parse } from "cookie"; import jwt from "jsonwebtoken";
import Payments from "@/model/Payments";
import Tracking from "@/model/Tracking";
import Orders from "@/model/Orders";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const cookies = parse(req.headers.cookie || "");
            const token = cookies.admin_access_token;
            let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
            if (!decoded._id == process.env.ADMIN_PASSWORD) {
                return res
                    .status(403)
                    .json({ success: false, errors: "Unable to Authenticate" });
            }
            console.log("req.body");
            console.log(req.body);

            const { OrderID, CustomerID, Products, SalesChannel, Address, Pincode, PaymentID, TrackingID, TrackingStatus, TaxType, GST, Total, } = req.body;

            // Find the card in the database based on the provided cardid
            const foundCard = await Orders.findOne({ OrderID: OrderID });

            if (!foundCard) {
                return res.status(404).json({ success: false, msg: "Card not found." });
            }
                  
            foundCard.CustomerID = CustomerID;
            foundCard.Products = Products;
            foundCard.SalesChannel = SalesChannel;
            foundCard.Address = Address;
            foundCard.Pincode = Pincode;
            foundCard.PaymentID = PaymentID;
            foundCard.TrackingID = TrackingID;
            foundCard.Status = TrackingStatus;
            foundCard.TaxType = TaxType;
            foundCard.GST = GST;
            foundCard.Total = Total;

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
