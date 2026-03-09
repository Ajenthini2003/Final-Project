import Plan from "../models/Plan.js";
import User from "../models/User.js";

// Get all active plans
// Route: GET /api/plans
export const getPlans = async (req, res) => {
  try {
    // Fetch all plans where isActive is true and sort by price
    const plans = await Plan.find({ isActive: true }).sort('price');
    res.status(200).json(plans);
  } catch (error) {
    // Return server error if something goes wrong
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Subscribe to a plan
// Route: POST /api/plans/:id/subscribe
export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already subscribed to the plan
    if (user.subscribedPlans && user.subscribedPlans.includes(planId)) {
      return res.status(400).json({ message: "Already subscribed to this plan" });
    }

    // Add plan to user's subscribedPlans array
    if (!user.subscribedPlans) user.subscribedPlans = [];
    user.subscribedPlans.push(planId);
    
    // Set subscription details with start and end date
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

    // Save changes to the user
    await user.save();

    // Send response with subscription details
    res.status(200).json({ 
      success: true,
      message: "Subscribed successfully",
      plan: plan,
      endDate: endDate
    });
  } catch (error) {
    // Return server error if something goes wrong
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unsubscribe from a plan
// Route: POST /api/plans/:id/unsubscribe
export const unsubscribeFromPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the plan from user's subscribedPlans
    if (user.subscribedPlans) {
      user.subscribedPlans = user.subscribedPlans.filter(id => id.toString() !== planId);
    }
    
    // Update subscription status if this plan is the current subscription
    if (user.subscription && user.subscription.planId?.toString() === planId) {
      user.subscription.status = 'expired';
    }

    // Save changes to the user
    await user.save();

    // Send response confirming unsubscription
    res.status(200).json({ 
      success: true,
      message: "Unsubscribed successfully" 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's subscribed plans
// Route: GET /api/plans/my-plans
export const getMyPlans = async (req, res) => {
  try {
    // Fetch the user and populate the subscribedPlans references
    const user = await User.findById(req.user.id).populate('subscribedPlans');
    res.status(200).json(user.subscribedPlans || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new plan (admin only)
// Route: POST /api/plans
export const createPlan = async (req, res) => {
  try {
    // Create a new plan in the database using request body
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a plan (admin only)
// Route: PUT /api/plans/:id
export const updatePlan = async (req, res) => {
  try {
    // Find plan by ID and update with request body
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a plan (admin only)
// Route: DELETE /api/plans/:id
export const deletePlan = async (req, res) => {
  try {
    // Find plan by ID and delete it
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};