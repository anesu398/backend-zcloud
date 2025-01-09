const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
