import mongoose from "mongoose";

const connectDB = async () => {      //async means takestime 
  try {
    const mongoURI = process.env.MONGO_URI ;   //This is a security best practice - never hardcode database credentials.
    
    console.log("Attempting to connect to MongoDB...");
    console.log(" URI:", mongoURI.replace(/:([^:@]{3,})@/, ':****@')); // Hide password if present
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,             //Better connection monitoring
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if server not found
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`); //Shows which MongoDB server we're connected to
    console.log(` Database: ${conn.connection.name}`); //Shows which database we're using
    
    return conn;
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);         //error handle
    


    //MongoServerSelectionError.. if does not get server
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n MongoDB server selection error. Possible causes:');
      console.log('1. MongoDB is not running');
      console.log('2. MongoDB is running on a different port');
      console.log('3. Network/firewall is blocking the connection');
      console.log('\n Quick fixes:');
      //if local host not working
      console.log('• Start MongoDB: brew services start mongodb-community (macOS)');
      console.log('• Check MongoDB status: brew services list');
      console.log('• Try using 127.0.0.1 instead of localhost in MONGO_URI');
    }
    
    // Don't exit immediately, but we need to handle this
    console.log('\n Failed to connect to MongoDB. Server cannot start without database.');
    process.exit(1);        //exits the Node.js process with an error code (1 means failure
  }
};

export default connectDB;