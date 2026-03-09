import User from "../models/User.js";

// GET /api/technicians
export const getTechnicians = async (req, res) => {
  try {
    const filter = { role: "technician" };

    // Optional filters from query params
    if (req.query.specialization) filter.specialization = req.query.specialization;
    if (req.query.availability !== undefined) filter.availability = req.query.availability === "true";

    const technicians = await User.find(filter).select("-password");
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/technicians/:id
export const getTechnicianById = async (req, res) => {
  try {
    const tech = await User.findOne({ _id: req.params.id, role: "technician" }).select("-password");
    if (!tech) return res.status(404).json({ message: "Technician not found" });
    res.json(tech);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/technicians  (admin only)
export const createTechnician = async (req, res) => {
  try {
    const { name, email, phone, password, address, specialization, skills, experience } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const tech = await User.create({
      name, email, phone, password,
      address: address || "",
      role: "technician",
      specialization: specialization || "",
      skills: skills || [],
      experience: experience || 0,
      availability: true,
      rating: 0,
    });

    const { password: _, ...techData } = tech.toObject();
    res.status(201).json(techData);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/technicians/:id  (admin only)
export const updateTechnician = async (req, res) => {
  try {
    const tech = await User.findOneAndUpdate(
      { _id: req.params.id, role: "technician" },
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!tech) return res.status(404).json({ message: "Technician not found" });
    res.json(tech);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/technicians/:id/availability
export const updateAvailability = async (req, res) => {
  try {
    const tech = await User.findOneAndUpdate(
      { _id: req.params.id, role: "technician" },
      { $set: { availability: req.body.availability } },
      { new: true }
    ).select("-password");

    if (!tech) return res.status(404).json({ message: "Technician not found" });
    res.json(tech);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/technicians/:id  (admin only)
export const deleteTechnician = async (req, res) => {
  try {
    const tech = await User.findOneAndDelete({ _id: req.params.id, role: "technician" });
    if (!tech) return res.status(404).json({ message: "Technician not found" });
    res.json({ message: "Technician deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
