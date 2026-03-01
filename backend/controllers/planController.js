import Plan from "../models/Plan.js";
import User from "../models/User.js";

// @desc    Get all active plans
// @route   GET /api/plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort('price');
    res.status(200).json(plans);
  } catch (error) {
    console.error("❌ Get plans error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Subscribe to a plan
// @route   POST /api/plans/:id/subscribe
export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already subscribed
    if (user.subscribedPlans && user.subscribedPlans.includes(planId)) {
      return res.status(400).json({ message: "Already subscribed to this plan" });
    }

    // Add plan to user's subscribed plans
    if (!user.subscribedPlans) user.subscribedPlans = [];
    user.subscribedPlans.push(planId);
    
    // Set subscription details
    const plan = await Plan.findById(planId);
    const endDate = new Date();
    if (plan.duration === 'month') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    user.subscription = {
      planId: planId,
      status: 'active',
      startDate: new Date(),
      endDate: endDate
    };

    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Subscribed successfully",
      plan: plan,
      endDate: endDate
    });
  } catch (error) {
    console.error("❌ Subscribe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Unsubscribe from a plan
// @route   POST /api/plans/:id/unsubscribe
export const unsubscribeFromPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove plan from user's subscribed plans
    if (user.subscribedPlans) {
      user.subscribedPlans = user.subscribedPlans.filter(id => id.toString() !== planId);
    }
    
    // Update subscription status
    if (user.subscription && user.subscription.planId?.toString() === planId) {
      user.subscription.status = 'expired';
    }

    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Unsubscribed successfully" 
    });
  } catch (error) {
    console.error("❌ Unsubscribe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user's subscribed plans
// @route   GET /api/plans/my-plans
export const getMyPlans = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('subscribedPlans');
    res.status(200).json(user.subscribedPlans || []);
  } catch (error) {
    console.error("❌ Get my plans error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new plan (admin only)
// @route   POST /api/plans
export const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    console.error("❌ Create plan error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a plan (admin only)
// @route   PUT /api/plans/:id
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    console.error("❌ Update plan error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a plan (admin only)
// @route   DELETE /api/plans/:id
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("❌ Delete plan error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};