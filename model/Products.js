const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const ProductSchema = new mongoose.Schema(
  {
    ProductID: { type: String, required: true, unique: true },
    ProductName: { type: String },
    ProductPrice: { type: String },
    ProductStock: { type: String },
    ProductHSN: { type: String },
    ProductType: { type: String },
  },
  { collection: "all-Products" },
  { timestamps: true }
);

mongoose.models = {};
const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;