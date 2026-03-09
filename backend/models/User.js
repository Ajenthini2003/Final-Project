import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "technician"],
    default: "user",
  },
  address: { type: String, default: "" },

  // ── User subscription ──────────────────────────────────────────
  subscribedPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plan" }],
  subscription: {
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    status: { type: String, enum: ["active", "inactive", "expired"], default: "inactive" },
    startDate: Date,
    endDate: Date,
  },

  // ── Technician-specific fields ─────────────────────────────────
  specialization: { type: String, default: "" },   // "ac", "electrical", etc.
  skills: [{ type: String }],
  experience: { type: Number, default: 0 },         // years
  rating: { type: Number, default: 0, min: 0, max: 5 },
  availability: { type: Boolean, default: true },
  currentLoad: { type: Number, default: 0 },        // active jobs count

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

// Strip password from JSON output
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
