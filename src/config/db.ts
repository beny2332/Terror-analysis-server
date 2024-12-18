import mongoose, { connect } from 'mongoose';
import { TerrorEventModel } from '../models/terrorEventModel';
import { importData } from './importData';

export const connectToMongo = async () => {
  try {
    await connect('mongodb://localhost:27017/terrorAnalysisDB');
    console.log('[database] MongoDB successfully connected');

    const eventsCount = await TerrorEventModel.countDocuments();
    if (eventsCount === 0) {
      await importData();
      console.log('[database] Data imported successfully');
    } else {
      console.log('[database] Data already exists');
    }
  } catch (err) {
    console.error('[database] Connection error:', err);
  }
};