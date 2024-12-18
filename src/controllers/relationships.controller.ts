import { Request, Response } from 'express';
import { getTopGroups, getGroupsByYear, getIncidentsByGroup, getDeadliestRegions } from '../services/relationships.service';

export const topGroups = async (req: Request, res: Response) => {
  const { region, years } = req.query;
  console.log(`Received request for topGroups with region: ${region} and years: ${years}`);
  const yearList = (years as string).split(',').map(Number);
  try {
    const results = await getTopGroups(region as string, yearList);
    console.log(`Results for topGroups:`, results);
    res.json(results);
  } catch (error) {
    console.error(`Error in topGroups:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const groupsByYear = async (req: Request, res: Response) => {
  const { year, gname } = req.query;
  console.log(`Received request for groupsByYear with year: ${year} and gname: ${gname}`);
  try {
    if (gname) {
      const results = await getIncidentsByGroup(gname as string);
      console.log(`Results for getIncidentsByGroup:`, results);
      res.json(results);
    } else {
      const results = await getGroupsByYear(parseInt(year as string));
      console.log(`Results for getGroupsByYear:`, results);
      res.json(results);
    }
  } catch (error) {
    console.error(`Error in groupsByYear:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deadliestRegions = async (req: Request, res: Response) => {
  const { gname } = req.query;
  console.log(`Received request for deadliestRegions with gname: ${gname}`);
  try {
    const results = await getDeadliestRegions(gname as string);
    console.log(`Results for deadliestRegions:`, results);
    res.json(results);
  } catch (error) {
    console.error(`Error in deadliestRegions:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};