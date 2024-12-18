import mongoose from 'mongoose';

export const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Terror-attacks');
    console.log('[database] MongoDB successfully connected');
  } catch (err) {
    console.error('[database] Connection error:', err);
  }
};