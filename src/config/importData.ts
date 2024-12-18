import fs from 'fs';
import path from 'path';
import { TerrorEventModel } from '../models/terrorEventModel';

const filePath = path.join(__dirname, '../../globalterrorismdb_0718dist.json');

export const importData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await TerrorEventModel.insertMany(data);
    console.log('Data Imported Successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};