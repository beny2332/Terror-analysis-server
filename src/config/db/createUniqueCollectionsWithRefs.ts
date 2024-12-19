import mongoose from 'mongoose';
import { terrorEventModel } from '../../models/terrorEventModel';

const createUniqueCollectionsWithRefs = async () => {
  const MasterModel = mongoose.models.MasterEvent || mongoose.model('MasterEvent', new mongoose.Schema({}, { strict: false }));

  // Create collection for unique years with references
  const years = await MasterModel.distinct('iyear');
  const YearModel = mongoose.models.Year || mongoose.model('Year', new mongoose.Schema({ year: Number, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await YearModel.deleteMany({});
  for (const year of years) {
    const events = await MasterModel.find({ iyear: year }).lean();
    await YearModel.create({ year, events: events.map(event => event._id) });

    // Create a derived collection for the year
    const YearEventModel = terrorEventModel(year, 'all');
    await YearEventModel.deleteMany({});
    await YearEventModel.insertMany(events);
  }
  console.log(`Created collection for unique years with references`);

  // Create collection for unique regions with references
  const regions = await MasterModel.distinct('region_txt');
  const RegionModel = mongoose.models.Region || mongoose.model('Region', new mongoose.Schema({ region: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await RegionModel.deleteMany({});
  for (const region of regions) {
    const events = await MasterModel.find({ region_txt: region }).lean();
    await RegionModel.create({ region, events: events.map(event => event._id) });

    // Create a derived collection for the region
    const RegionEventModel = terrorEventModel(-1, region.replace(/\s+/g, '_'));
    await RegionEventModel.deleteMany({});
    await RegionEventModel.insertMany(events);
  }
  console.log(`Created collection for unique regions with references`);

  // Create collection for unique groups with references
  const groups = await MasterModel.distinct('gname');
  const GroupModel = mongoose.models.Group || mongoose.model('Group', new mongoose.Schema({ group: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await GroupModel.deleteMany({});
  for (const group of groups) {
    const events = await MasterModel.find({ gname: group }).lean();
    await GroupModel.create({ group, events: events.map(event => event._id) });

    // Create a derived collection for the group
    const GroupEventModel = terrorEventModel(0, group.replace(/\s+/g, '_'));
    await GroupEventModel.deleteMany({});
    await GroupEventModel.insertMany(events);
  }
  console.log(`Created collection for unique groups with references`);

  // Create collection for unique attack types with references
  const attackTypes = await MasterModel.distinct('attacktype1_txt');
  const AttackTypeModel = mongoose.models.AttackType || mongoose.model('AttackType', new mongoose.Schema({ attackType: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await AttackTypeModel.deleteMany({});
  for (const attackType of attackTypes) {
    const events = await MasterModel.find({ attacktype1_txt: attackType }).lean();
    await AttackTypeModel.create({ attackType, events: events.map(event => event._id) });

    // Create a derived collection for the attack type
    const AttackTypeEventModel = terrorEventModel(0, attackType.replace(/\s+/g, '_'));
    await AttackTypeEventModel.deleteMany({});
    await AttackTypeEventModel.insertMany(events);
  }
  console.log(`Created collection for unique attack types with references`);
};

export default createUniqueCollectionsWithRefs;