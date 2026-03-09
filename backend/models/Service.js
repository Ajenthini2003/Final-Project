import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["electrical", "plumbing", "appliance", "ac", "carpentry", "painting", "security", "electronics", "cleaning", "emergency"],
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  bookings: {
    type: Number,
    default: 0,
  },
  emergency: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  features: [String],
  imageUrl: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;