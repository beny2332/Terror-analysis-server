import express from 'express';
import cors from 'cors';
import "dotenv/config";
import bodyParser from 'body-parser';
import relationshipsRouter from './routes/relationships.route';
import analysisRouter from './routes/analysis.route';
import eventsRouter from './routes/events.route';
import searchRouter from './routes/search.route';
import { connectToMongo } from './config/db/db';
import importData from './config/db/importData';
import createUniqueCollectionsWithRefs from './config/db/createUniqueCollectionsWithRefs';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectToMongo();

  // Check if master data already exists
  const MasterModel = mongoose.models.MasterEvent || mongoose.model('MasterEvent', new mongoose.Schema({}, { strict: false }));
  const existingCount = await MasterModel.countDocuments();
  if (existingCount === 0) {
    await importData(); // Import data into master collection
    await createUniqueCollectionsWithRefs(); // Create collections for unique values with references
  } else {
    console.log('Master data already exists in the database');
  }

  app.use(cors());
  app.use(bodyParser.json()); // Use body-parser middleware to parse JSON requests

  app.use('/api/relationships', relationshipsRouter);
  app.use('/api/analysis', analysisRouter);
  app.use('/api/events', eventsRouter)
  app.use('/api/search', searchRouter)

  app.listen(port, () => {
    console.log(`[server] I'm up on port ${port}`);
  });
};

startServer();