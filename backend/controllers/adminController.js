import User from "../models/User.js";
import Booking from "../models/Booking.js";    //this is for activate collections from database. models
import Payment from "../models/Payment.js";
import Plan from "../models/Plan.js";
import Service from "../models/Service.js";

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {      //this is a api function
  try {           //error happens. error handling through try and catch
    const [
      totalUsers,
      totalTechnicians,
      totalBookings,
      totalServices,               //here many database queries run at the same time
      totalPlans,
      pendingBookings,
      completedBookings,
      totalRevenue,
    ] = await Promise.all([       //speed increase, run queries parallel
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "technician" }),
      Booking.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Plan.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "completed" }),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      totalUsers,
      totalTechnicians,
      totalBookings,
      totalServices,
      totalPlans,
      pendingBookings,
      completedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/admin/recent-bookings
export const getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
