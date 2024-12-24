import { Request, Response } from 'express';
import { getDeadliestAttackTypes, getHighestCasualtyRegions, getIncidentTrends } from '../services/analysis.service';

export const deadliestAttackTypes = async (req: Request, res: Response) => {
  const { attackTypes } = req.query;
  try {
    const attackTypeList = (attackTypes as string)?.split(',') || [];
    const results = await getDeadliestAttackTypes(attackTypeList);
    res.json(results);
  } catch (error) {
    console.error(`Error in deadliestAttackTypes:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const highestCasualtyRegions = async (req: Request, res: Response) => {
  const { region } = req.query;
  try {
    const results = await getHighestCasualtyRegions(region as string);
    res.json(results);
  } catch (error) {
    console.error(`Error in highestCasualtyRegions:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const incidentTrends = async (req: Request, res: Response) => {
  const { year, month, range, lastYears } = req.query;
  try {
    const results = await getIncidentTrends(parseInt(year as string), parseInt(month as string), range as string, parseInt(lastYears as string));
    res.json(results);
  } catch (error) {
    console.error(`Error in incidentTrends:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
