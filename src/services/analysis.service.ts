import mongoose from 'mongoose';

const MasterModel = mongoose.models.MasterEvent || mongoose.model('MasterEvent', new mongoose.Schema({}, { strict: false }));
const YearModel = mongoose.models.Year || mongoose.model('Year', new mongoose.Schema({ year: Number, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
const RegionModel = mongoose.models.Region || mongoose.model('Region', new mongoose.Schema({ region: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
const GroupModel = mongoose.models.Group || mongoose.model('Group', new mongoose.Schema({ group: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
const AttackTypeModel = mongoose.models.AttackType || mongoose.model('AttackType', new mongoose.Schema({ attackType: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));

export const getDeadliestAttackTypes = async (attackTypes: string[]) => {
  const matchStage = attackTypes.length > 0 ? { attacktype1_txt: { $in: attackTypes } } : {};
  const results = await MasterModel.aggregate([
    { $match: matchStage },
    { $group: { _id: '$attacktype1_txt', totalCasualties: { $sum: { $add: ['$nkill', '$nwound'] } } } },
    { $sort: { totalCasualties: -1 } }
  ]);
  return results;
};

export const getHighestCasualtyRegions = async (region?: string) => {
  const matchStage = region ? { region_txt: region } : {};
  const results = await MasterModel.aggregate([
    { $match: matchStage },
    { $group: { _id: '$region_txt', avgCasualties: { $avg: { $add: ['$nkill', '$nwound'] } } } },
    { $sort: { avgCasualties: -1 } }
  ]);
  return results;
};

export const getIncidentTrends = async (year?: number, month?: number, range?: string, lastYears?: number) => {
  let matchStage: any = {};
  if (year) matchStage.iyear = year;
  if (month) matchStage.imonth = month;

  if (range) {
    const [startYear, endYear] = range.split('-').map(Number);
    matchStage.iyear = { $gte: startYear, $lte: endYear };
  }

  if (lastYears) {
    const currentYear = new Date().getFullYear();
    matchStage.iyear = { $gte: currentYear - lastYears + 1, $lte: currentYear };
  }

  const results = await MasterModel.aggregate([
    { $match: matchStage },
    { $group: { _id: { year: '$iyear', month: '$imonth' }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  return results;
};

export const getFullDocumentsByYear = async (year: number) => {
  const yearDoc = await YearModel.findOne({ year }).populate('events');
  if (!yearDoc) return [];

  return yearDoc.events;
};

export const getFullDocumentsByRegion = async (region: string) => {
  const regionDoc = await RegionModel.findOne({ region }).populate('events');
  if (!regionDoc) return [];

  return regionDoc.events;
};

export const getFullDocumentsByGroup = async (group: string) => {
  const groupDoc = await GroupModel.findOne({ group }).populate('events');
  if (!groupDoc) return [];

  return groupDoc.events;
};

export const getFullDocumentsByAttackType = async (attackType: string) => {
  const attackTypeDoc = await AttackTypeModel.findOne({ attackType }).populate('events');
  if (!attackTypeDoc) return [];

  return attackTypeDoc.events;
};