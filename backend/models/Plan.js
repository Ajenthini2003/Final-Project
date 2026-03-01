import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: String, 
    enum: ['month', 'year'], 
    default: 'month' 
  },
  features: [{ 
    type: String 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  popular: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// ✅ This line is crucial - it must be exactly like this
const Plan = mongoose.model('Plan', planSchema);
export default Plan;