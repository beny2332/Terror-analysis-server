import mongoose from 'mongoose';

export const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb+srv://binyamin:beny@cluster0.ssafa.mongodb.net/terror-attacks');
    console.log('[database] MongoDB successfully connected');
  } catch (err) {
    console.error('[database] Connection error:', err);
  }
};