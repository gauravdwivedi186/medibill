
import Customers from "@/model/Customers";
import connectDb from "../../middleware/mongoose";
import Orders from "@/model/Orders";
import Invoices from "@/model/Invoices";
import { parse } from "cookie";
import jwt from "jsonwebtoken";


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

      const existingCard = await Orders.findOne({ OrderID: req.body.OrderID });
    
    
      if (!existingCard) {
        // If cardID already exists, return an error response
        return res.status(400).json({ success: false, msg: "Order ID Not found" });
      }
 
    
        // Check if the generated ID already exists in the database
        const existingInvoice = await Invoices.findOne({ InvoiceID: req.body.OrderID+"inv" });
    
        // If no existing invoice found, mark it as unique
        if (existingInvoice) {
        return res.status(200).json({ success: false, msg: "Invoice Already Generated" });
        }
 
    
      // Now, use the unique random ID to create the new invoice
      const newCard = new Invoices({
        InvoiceID: req.body.OrderID+"inv",
        OrderID: req.body.OrderID,
        InvoiceNo: req.body.InvoiceNo,
        CustomerID: existingCard.CustomerID,
        Products: existingCard.Products,
        Status: existingCard.Status,
        SalesChannel: existingCard.SalesChannel,
        Address: existingCard.Address,
        Pincode: existingCard.Pincode,
        TrackingID: existingCard.TrackingID,
        PaymentID: existingCard.PaymentID ,
        Total:existingCard.Total,
        TaxType : existingCard.TaxType,
        GST : existingCard.GST,
        Date: req.body.InvoiceDate,
      });
    
      // Save the new invoice to the database
      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "Invoice Added Successfuly.." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error..Contact the Developers." });
    }
  }
};

export default connectDb(handler);