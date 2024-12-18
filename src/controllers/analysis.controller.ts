import { Request, Response } from 'express';
import { getDeadliestAttackTypes, getHighestCasualtyRegions, getIncidentTrends } from '../services/analysis.service';

export const deadliestAttackTypes = async (req: Request, res: Response) => {
  const { attackTypes } = req.query;
  console.log(`Received request for deadliestAttackTypes with attackTypes: ${attackTypes}`);
  try {
    const attackTypeList = (attackTypes as string)?.split(',') || [];
    const results = await getDeadliestAttackTypes(attackTypeList);
    console.log(`Results for deadliestAttackTypes:`, results);
    res.json(results);
  } catch (error) {
    console.error(`Error in deadliestAttackTypes:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const highestCasualtyRegions = async (req: Request, res: Response) => {
  const { region } = req.query;
  console.log(`Received request for highestCasualtyRegions with region: ${region}`);
  try {
    const results = await getHighestCasualtyRegions(region as string);
    console.log(`Results for highestCasualtyRegions:`, results);
    res.json(results);
  } catch (error) {
    console.error(`Error in highestCasualtyRegions:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const incidentTrends = async (req: Request, res: Response) => {
  const { year, month, range, lastYears } = req.query;
  console.log(`Received request for incidentTrends with year: ${year}, month: ${month}, range: ${range}, lastYears: ${lastYears}`);
  try {
    const results = await getIncidentTrends(parseInt(year as string), parseInt(month as string), range as string, parseInt(lastYears as string));
    console.log(`Results for incidentTrends:`, results);
    res.json(results);
  } catch (error) {
    console.error(`Error in incidentTrends:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
