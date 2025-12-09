
import Customers from "@/model/Customers";
import connectDb from "../../middleware/mongoose";
import Orders from "@/model/Orders";
import { parse } from "cookie"; import jwt from "jsonwebtoken";
import Products from "@/model/Products";

const updateProductStocks = async (productsToUpdate) => {
  try {
    for (let item of productsToUpdate) {
      const { productId, quantity } = item;

      // Find the product by ProductID
      let product = await Products.findOne({ ProductID: productId });
      if (product) {
        // Check if the product is of type 'Product' (i.e., not a service)
        if (product.ProductType === 'Product') {
          // Update the ProductStock only if it's a physical product, not a service
          product.ProductStock = (parseInt(product.ProductStock) - parseInt(quantity)).toString();
          await product.save();
        } else {
          console.log(`Skipping stock update for service product with ID ${productId}`);
        }
      } else {
        console.log(`Product with ID ${productId} not found`);
      }
    }
    return { status: 'success', message: 'Products updated successfully' };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Server error' };
  }
};


const generateOrderID = async () => {
  try {
    // Find the highest existing order ID
    const highestOrder = await Orders.findOne({}, { OrderID: 1 }).sort({ OrderID: -1 });

    let nextID;

    if (highestOrder && highestOrder.OrderID) {
      // Extract the numeric part of the OrderID
      const highestIDNumber = parseInt(highestOrder.OrderID.slice(2));

      // Generate the next OrderID by incrementing the number
      nextID = `OR${(highestIDNumber + 1).toString().padStart(3, "0")}`;
    } else {
      // If no orders exist, start with the first order ID
      nextID = "OR001";
    }

    return nextID;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating Order ID");
  }
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

      const checkCustomer = await Customers.findOne({ CustomerID: req.body.CustomerID });

      if (!checkCustomer) {
        // If cardID already exists, return an error response
        return res.status(400).json({ success: false, msg: "Customer was not found, Create a Customer" });
      }

      // Basic input checks
      const { CustomerID, Products, Total } = req.body;

      // Check if products exist and contain at least one item
      if (!Products || !Array.isArray(Products) || Products.length === 0) {
        return res.status(400).json({ success: false, msg: "At least one product must be added to the order." });
      }

      // Check if total is provided and a valid number
      if (!Total || isNaN(Total) || Number(Total) <= 0) {
        return res.status(400).json({ success: false, msg: "Total amount must be provided and greater than zero." });
      }

      // Check if customer exists
      if (!CustomerID || !checkCustomer) {
        return res.status(400).json({ success: false, msg: "Customer was not found. Please create or select a customer." });
      }

      updateProductStocks(req.body.Products);

      const newCard = new Orders({
        OrderID: await generateOrderID(),
        CustomerID: req.body.CustomerID,
        Status: req.body.TrackingStatus,
        Products: req.body.Products,
        SalesChannel: req.body.SalesChannel,
        Address: req.body.Address,
        Pincode: req.body.Pincode,
        TrackingID: req.body.TrackingID,
        PaymentID: req.body.PaymentID,
        TaxType: req.body.TaxType,
        GST: req.body.GST,
        Total: req.body.Total,
      });

      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "Order Added Successfuly.." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: `ER: ${err}` });
    }
  }
};

export default connectDb(handler);