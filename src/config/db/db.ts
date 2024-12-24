import mongoose from 'mongoose';

export const connectToMongo = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log('[database] MongoDB successfully connected');
  } catch (err) {
    console.error('[database] Connection error:', err);
  }
};