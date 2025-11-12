import Invoices from "@/model/Invoices";
import connectDb from "../../middleware/mongoose";
import Orders from "@/model/Orders";
import Products from "@/model/Products";
import Customers from "@/model/Customers";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import Payments from "@/model/Payments";
import Tracking from "@/model/Tracking";
import SalesMan from "@/model/SalesMan";

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

            const delType = req.body.deltype;
            if (delType === 'customers') {
                const result = await Customers.deleteOne({ CustomerID: req.body.id });
                if (result.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ success: false, msg: "Customer not found." });
                }
                return res.json({ success: true, msg: "Customer deleted successfully." });
            }
            else if (delType === 'products') {
                const result = await Products.deleteOne({ ProductID: req.body.id });
                if (result.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ success: false, msg: "ProductID not found." });
                }
                return res.json({ success: true, msg: "ProductID deleted successfully." });
            }
            else if (delType === 'salesman') {
                const result = await SalesMan.deleteOne({ SalesManID: req.body.id });
                if (result.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ success: false, msg: "SalesMan not found." });
                }
                return res.json({ success: true, msg: "SalesMan deleted successfully." });
            }
            else if (delType === 'orders') {
                const result = await Orders.deleteOne({ OrderID: req.body.id });
                if (result.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ success: false, msg: "OrderID not found." });
                }
                return res.json({ success: true, msg: "OrderID deleted successfully." });
            }
            else if (delType === 'payments') {
                const result = await Payments.deleteOne({ PaymentID: req.body.id });
                if (result.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ success: false, msg: "PAyment not found." });
                }
                return res.json({ success: true, msg: "PAyment ID deleted successfully." });
            }
            else if (delType === 'tracking') {
                const result = await Tracking.deleteOne({ PaymentID: req.body.id });
                if (result.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ success: false, msg: "PAyment not found." });
                }
                return res.json({ success: true, msg: "PAyment ID deleted successfully." });
            }
            else if (delType === 'invoice') {
                const result = await Invoices.deleteOne({ OrderID: req.body.id });
                if (result.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ success: false, msg: "InvoiceID not found." });
                }
                return res.json({ success: true, msg: "InvoiceID deleted successfully." });
            }
            else {
                return res.status(500).json({ success: false, msg: "not found the details" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: "Server error. Contact the Developers." });
        }
    }
};

export default connectDb(handler);
