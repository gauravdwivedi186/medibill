import Products from "@/model/Products";
import connectDb from "../../middleware/mongoose";
import { parse } from "cookie";  import jwt from "jsonwebtoken";
import Invoices from "@/model/Invoices";


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
      // Check if the request body contains the 'cardid' field
      if (!req.body.invoiceid) {
        return res.status(400).json({ success: false, msg: "Missing 'Invoice ID' in the request body." });
      }
  
      const invoiceid = req.body.invoiceid;
  
      // Find the card in the database based on the provided cardid
      const foundProduct = await Invoices.findOne({ InvoiceID: invoiceid });
  
      if (!foundProduct) {
        return res.status(404).json({ success: false, msg: "Product not found." });
      }
  
      // Return the details of the found card as a JSON response
      return res.status(200).json({ success: true, Invoice: foundProduct });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
    }
  } else if (req.method === "GET") {
    try {
      // Find all cards in the database
      const allCards = await Invoices.find({});
  
      // Return the found cards as a JSON response
      return res.status(200).json({ success: true, invoices: allCards });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
    }
  }
  
};

export default connectDb(handler);
