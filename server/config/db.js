import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js SRV DNS lookup issues on Windows networks for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS set fails
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      family: 4 // Use IPv4 for fast connection
    });
    console.log(`=================================================`);
    console.log(`🍃 [MongoDB Atlas] Connected Successfully: ${conn.connection.host}`);
    console.log(`=================================================`);
  } catch (error) {
    console.warn(`[MongoDB Connection Warning] ${error.message}`);
    console.log(`[MongoDB] Operating with fallback handling.`);
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};
