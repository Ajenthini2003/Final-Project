import mongoose from "mongoose";  // Library to connect with MongoDB database
import bcrypt from "bcryptjs";    // Library to hash passwords (kannukku theriyaatha maathi maatral)

const userSchema = new mongoose.Schema({   //creating structure for user data
  name: {
    type: String,          //text type
    required: true,    // not be empty
    trim: true         //remove extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,       //No two users can have same email
    lowercase: true,      //Converts to lowercase automatically
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'technician'],    //Only these three values are allowed
    default: 'user'         //not give specific field, set as user
  },
  address: {
    type: String,
    default: ''
  },
  subscribedPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'   //Links to Plan collection (like foreign key)
  }],
  // Add subscription field for paymentController
  subscription: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive'
    },
    startDate: Date,
    endDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();   //if password not changed then save withut hashing
  
  try {
    const salt = await bcrypt.genSalt(10);     // do encryption 10 times and create a random string
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {        
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});


//Creates actual model from schema and exports it
const User = mongoose.model('User', userSchema);
export default User;