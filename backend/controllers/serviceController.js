import Service from "../models/Service.js";

// @desc    Get all services
// @route   GET /api/services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
export const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    Object.assign(service, req.body);
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.deleteOne();
    res.json({ message: "Service removed" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get services by category
// @route   GET /api/services/category/:category
export const getServicesByCategory = async (req, res) => {
  try {
    const services = await Service.find({ 
      category: req.params.category,
      isActive: true 
    });
    res.json(services);
  } catch (error) {
    console.error("Error fetching services by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get featured services
// @route   GET /api/services/featured
export const getFeaturedServices = async (req, res) => {
  try {
    const services = await Service.find({ 
      popular: true,
      isActive: true 
    }).limit(6);
    res.json(services);
  } catch (error) {
    console.error("Error fetching featured services:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};