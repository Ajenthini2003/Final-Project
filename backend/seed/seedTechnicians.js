// Run with: node seed/seedTechnicians.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const technicians = [
  {
    name: "Arun Kumar",
    email: "arun@fixmate.lk",
    phone: "0771111001",
    password: "Tech@1234",
    role: "technician",
    address: "Colombo 03",
    specialization: "ac",
    skills: ["AC Repair", "AC Installation", "AC Gas Refill"],
    experience: 7,
    rating: 4.8,
    availability: true,
  },
  {
    name: "Dinesh Silva",
    email: "dinesh@fixmate.lk",
    phone: "0771111002",
    password: "Tech@1234",
    role: "technician",
    address: "Nugegoda",
    specialization: "electrical",
    skills: ["Wiring", "Circuit Repair", "Safety Inspection", "Emergency Electrical"],
    experience: 10,
    rating: 4.9,
    availability: true,
  },
  {
    name: "Priya Nair",
    email: "priya@fixmate.lk",
    phone: "0771111003",
    password: "Tech@1234",
    role: "technician",
    address: "Dehiwala",
    specialization: "plumbing",
    skills: ["Pipe Repair", "Leak Fix", "Bathroom Plumbing", "Emergency Plumbing"],
    experience: 5,
    rating: 4.7,
    availability: true,
  },
  {
    name: "Ravi Perera",
    email: "ravi@fixmate.lk",
    phone: "0771111004",
    password: "Tech@1234",
    role: "technician",
    address: "Kandy",
    specialization: "appliance",
    skills: ["Washing Machine", "Refrigerator", "Oven Repair"],
    experience: 8,
    rating: 4.6,
    availability: false,
  },
  {
    name: "Saman Fernando",
    email: "saman@fixmate.lk",
    phone: "0771111005",
    password: "Tech@1234",
    role: "technician",
    address: "Colombo 07",
    specialization: "carpentry",
    skills: ["Furniture Making", "Door Repair", "Cabinet Work"],
    experience: 12,
    rating: 4.9,
    availability: true,
  },
];

const seedTechnicians = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let created = 0;
    for (const tech of technicians) {
      const exists = await User.findOne({ email: tech.email });
      if (!exists) {
        await User.create(tech);
        console.log(`✅ Created: ${tech.name} (${tech.specialization})`);
        created++;
      } else {
        console.log(`⚠️  Skipped (already exists): ${tech.name}`);
      }
    }

    console.log(`\n🎉 Done! ${created} technician(s) created.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedTechnicians();
