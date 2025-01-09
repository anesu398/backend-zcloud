const Order = require("../models/order");

exports.getStats = async (req, res, next) => {
  try {
    const activeUsers = await User.countDocuments({ status: "active" });
    const totalOrders = await Order.countDocuments();
    const totalIncome = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    res.status(200).json({
      activeUsers,
      totalOrders,
      totalIncome: totalIncome[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecentOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
