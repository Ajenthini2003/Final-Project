import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Plan from "../models/Plan.js";

// GET /api/payments  (admin=all, user=own)
export const getPayments = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user.id };
    const payments = await Payment.find(filter)
      .populate("bookingId", "serviceName date status")
      .populate("planId", "name price")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/payments/my
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate("bookingId", "serviceName date status")
      .populate("planId", "name price")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/payments/subscribe/:planId  (pay for a plan)
export const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { paymentMethod } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check already subscribed
    if (user.subscribedPlans?.some(id => id.toString() === planId)) {
      return res.status(400).json({ message: "Already subscribed to this plan" });
    }

    // Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      planId,
      amount: plan.price,
      method: paymentMethod || "card",
      status: "paid",
      description: `Subscription: ${plan.name}`,
      transactionId: `TXN-${Date.now()}`,
    });

    // Update user subscription
    const endDate = new Date();
    if (plan.duration === "month") endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    user.subscribedPlans = user.subscribedPlans || [];
    user.subscribedPlans.push(planId);
    user.subscription = {
      planId,
      status: "active",
      startDate: new Date(),
      endDate,
    };
    await user.save();

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      payment,
      plan,
      subscription: user.subscription,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/payments/unsubscribe/:planId
export const unsubscribeFromPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.subscribedPlans = (user.subscribedPlans || []).filter(
      id => id.toString() !== planId
    );
    if (user.subscription?.planId?.toString() === planId) {
      user.subscription.status = "expired";
    }
    await user.save();

    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
