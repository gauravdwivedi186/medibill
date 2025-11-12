import Invoices from "@/model/Invoices";
import connectDb from "../../middleware/mongoose";
import Orders from "@/model/Orders";
import { parse } from "cookie";  import jwt from "jsonwebtoken";
import Products from "@/model/Products";
import Customers from "@/model/Customers";


const handler = async (req, res) => {
 if (req.method === "GET") {
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
      const allOrders = await Orders.find({});
      const allInvoices = await Invoices.find({});
      const allProducts = await Products.find({});
      const allCustomers = await Customers.find({});
      
      // Return the total number of orders as a JSON response
      return res.status(200).json({ success: true, Orders: allOrders.length , Invoices: allInvoices.length, Products: allProducts.length, Customers: allCustomers.length});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
    }
  }
  
};

export default connectDb(handler);
