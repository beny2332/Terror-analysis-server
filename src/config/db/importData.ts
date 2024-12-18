import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const filePath = path.join(
  __dirname,
  "../../jsonData/globalterrorismdb_0718dist.json"
);

const importData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const MasterModel = mongoose.models.MasterEvent || mongoose.model('MasterEvent', new mongoose.Schema({}, { strict: false }));

    await MasterModel.insertMany(data);
    console.log(`Inserted ${data.length} records into master collection`);
  } catch (error) {
    console.error("Error importing data:", error);
  }
};

export default importData;