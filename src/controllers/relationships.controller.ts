import { Request, Response } from 'express';
import { getTopGroups, getGroupsByYear, getIncidentsByGroup, getDeadliestRegions, getFullDocumentsByYear, getFullDocumentsByRegion, getFullDocumentsByGroup, getGroupSuggestions } from '../services/relationships.service';

export const topGroups = async (req: Request, res: Response) => {
  const { region, years } = req.query;
  const yearList = (years as string).split(',').map(Number);
  try {
    const results = await getTopGroups(region as string, yearList);
    res.json(results);
  } catch (error) {
    console.error(`Error in topGroups:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const groupsByYear = async (req: Request, res: Response) => {
  const { year, gname } = req.query;
  try {
    if (gname) {
      const results = await getIncidentsByGroup(gname as string);
      res.json(results);
    } else {
      const results = await getGroupsByYear(parseInt(year as string));
      res.json(results);
    }
  } catch (error) {
    console.error(`Error in groupsByYear:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deadliestRegions = async (req: Request, res: Response) => {
  const { gname } = req.query;
  try {
    const results = await getDeadliestRegions(gname as string);
    res.json(results);
  } catch (error) {
    console.error(`Error in deadliestRegions:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fullDocumentsByYear = async (req: Request, res: Response) => {
  const { year } = req.query;
  try {
    const results = await getFullDocumentsByYear(parseInt(year as string));
    res.json(results);
  } catch (error) {
    console.error(`Error in fullDocumentsByYear:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fullDocumentsByRegion = async (req: Request, res: Response) => {
  const { region } = req.query;
  try {
    const results = await getFullDocumentsByRegion(region as string);
    res.json(results);
  } catch (error) {
    console.error(`Error in fullDocumentsByRegion:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fullDocumentsByGroup = async (req: Request, res: Response) => {
  const { group } = req.query;
  try {
    const results = await getFullDocumentsByGroup(group as string);
    res.json(results);
  } catch (error) {
    console.error(`Error in fullDocumentsByGroup:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchGroups = async (req: Request, res: Response) => {
  const { term } = req.query;
  try {
    const results = await getGroupSuggestions(term as string);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};