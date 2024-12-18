import express from 'express';
import cors from 'cors';
import relationshipsRouter from './routes/relationships.route';
import analysisRouter from './routes/analysis.route';
import { connectToMongo } from './config/db';
import importData from './config/importData';

const app = express();
const port = process.env.PORT || 3030;

const startServer = async () => {
  await connectToMongo();
  await importData(); // Ensure data is imported if it doesn't already exist

  app.use(cors());
  app.use(express.json());

  app.use('/api/relationships', relationshipsRouter);
  app.use('/api/analysis', analysisRouter);

  app.listen(port, () => {
    console.log(`[server] I'm up on port ${port}`);
  });
};

startServer();