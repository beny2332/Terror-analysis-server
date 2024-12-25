import { Request, Response } from 'express';
import { getEventSearchResults } from '../services/relationships.service'

export const searchEvents = async (req: Request, res: Response) => {
    const { term } = req.query;
    try {
      const results = await getEventSearchResults(term as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  