import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { terrorEventModel } from '../models/terrorEventModel';

const filePath = path.join(__dirname, '../../src/jsonData/globalterrorismdb_0718dist.json');

mongoose.connect('mongodb://localhost:27017/Terror-attacks');

const importData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const yearRegionMap: { [key: string]: any[] } = {};

    // Group data by year and region
    data.forEach((event: any) => {
      const year = event.iyear;
      const region = event.region_txt;
      const key = `${year}_${region}`;
      if (!yearRegionMap[key]) {
        yearRegionMap[key] = [];
      }
      yearRegionMap[key].push(event);
    });

    // Insert data into respective collections
    for (const key in yearRegionMap) {
      const [year, region] = key.split('_');
      const EventModel = terrorEventModel(parseInt(year), region);

      // Check if data already exists
      const existingCount = await EventModel.countDocuments();
      if (existingCount === 0) {
        await EventModel.insertMany(yearRegionMap[key]);
        console.log(`Data for year ${year} and region ${region} imported successfully`);
      } else {
        // console.log(`Data for year ${year} and region ${region} already exists`);
      }
    }

    console.log('All data processed successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

export default importData;