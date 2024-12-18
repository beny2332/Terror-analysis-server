import express from 'express';
import { connectToMongo } from './config/db';
import cors from 'cors';


const app = express();

connectToMongo();

app.use(cors());
app.use(express.json());

app.listen(3030, () => {
    console.log("[server] I'm up on port 3030");
  });