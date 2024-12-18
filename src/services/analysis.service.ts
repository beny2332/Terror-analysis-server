import mongoose from 'mongoose';

const MasterModel = mongoose.models.MasterEvent || mongoose.model('MasterEvent', new mongoose.Schema({}, { strict: false }));

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
