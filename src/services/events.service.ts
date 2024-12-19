import mongoose from 'mongoose';
import { terrorEventModel } from '../models/terrorEventModel';

const MasterModel = mongoose.models.MasterEvent || mongoose.model('MasterEvent', new mongoose.Schema({}, { strict: false }));

const updateDerivedCollections = async (eventData: any, oldEventData: any = null) => {
  const { iyear, region_txt, gname, attacktype1_txt, _id } = eventData;

  if (oldEventData) {
    const { iyear: oldIyear, region_txt: oldRegion, gname: oldGname, attacktype1_txt: oldAttackType } = oldEventData;

    // Remove old references
    if (oldIyear !== iyear) {
      const OldYearModel = mongoose.models.Year || mongoose.model('Year', new mongoose.Schema({ year: Number, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
      await OldYearModel.updateOne({ year: oldIyear }, { $pull: { events: _id } });
    }
    if (oldRegion !== region_txt) {
      const OldRegionModel = mongoose.models.Region || mongoose.model('Region', new mongoose.Schema({ region: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
      await OldRegionModel.updateOne({ region: oldRegion }, { $pull: { events: _id } });
    }
    if (oldGname !== gname) {
      const OldGroupModel = mongoose.models.Group || mongoose.model('Group', new mongoose.Schema({ group: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
      await OldGroupModel.updateOne({ group: oldGname }, { $pull: { events: _id } });
    }
    if (oldAttackType !== attacktype1_txt) {
      const OldAttackTypeModel = mongoose.models.AttackType || mongoose.model('AttackType', new mongoose.Schema({ attackType: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
      await OldAttackTypeModel.updateOne({ attackType: oldAttackType }, { $pull: { events: _id } });
    }
  }

  // Update Year Collection
  const YearModel = mongoose.models.Year || mongoose.model('Year', new mongoose.Schema({ year: Number, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await YearModel.updateOne({ year: iyear }, { $addToSet: { events: _id } }, { upsert: true });

  // Update Region Collection
  const RegionModel = mongoose.models.Region || mongoose.model('Region', new mongoose.Schema({ region: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await RegionModel.updateOne({ region: region_txt }, { $addToSet: { events: _id } }, { upsert: true });

  // Update Group Collection
  const GroupModel = mongoose.models.Group || mongoose.model('Group', new mongoose.Schema({ group: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await GroupModel.updateOne({ group: gname }, { $addToSet: { events: _id } }, { upsert: true });

  // Update Attack Type Collection
  const AttackTypeModel = mongoose.models.AttackType || mongoose.model('AttackType', new mongoose.Schema({ attackType: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await AttackTypeModel.updateOne({ attackType: attacktype1_txt }, { $addToSet: { events: _id } }, { upsert: true });
};

const cleanUpEmptyCollections = async () => {
  // Clean up empty Year collections
  const YearModel = mongoose.models.Year || mongoose.model('Year', new mongoose.Schema({ year: Number, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await YearModel.deleteMany({ events: { $size: 0 } });

  // Clean up empty Region collections
  const RegionModel = mongoose.models.Region || mongoose.model('Region', new mongoose.Schema({ region: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await RegionModel.deleteMany({ events: { $size: 0 } });

  // Clean up empty Group collections
  const GroupModel = mongoose.models.Group || mongoose.model('Group', new mongoose.Schema({ group: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await GroupModel.deleteMany({ events: { $size: 0 } });

  // Clean up empty Attack Type collections
  const AttackTypeModel = mongoose.models.AttackType || mongoose.model('AttackType', new mongoose.Schema({ attackType: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
  await AttackTypeModel.deleteMany({ events: { $size: 0 } });
};

export const createEvent = async (eventData: any) => {
  const newEvent = await MasterModel.create(eventData);
  await updateDerivedCollections(newEvent);
  return newEvent;
};

export const getEventById = async (id: string) => {
  const event = await MasterModel.findById(id);
  return event;
};

export const updateEvent = async (id: string, updateData: any) => {
  const oldEvent = await MasterModel.findById(id);
  const updatedEvent = await MasterModel.findByIdAndUpdate(id, updateData, { new: true });
  if (updatedEvent) {
    await updateDerivedCollections(updatedEvent, oldEvent);
  }
  return updatedEvent;
};

export const deleteEvent = async (id: string) => {
  const deletedEvent = await MasterModel.findByIdAndDelete(id);
  if (deletedEvent) {
    const { iyear, region_txt, gname, attacktype1_txt } = deletedEvent;

    // Remove from Year Collection
    const YearModel = mongoose.models.Year || mongoose.model('Year', new mongoose.Schema({ year: Number, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
    await YearModel.updateOne({ year: iyear }, { $pull: { events: id } });

    // Remove from Region Collection
    const RegionModel = mongoose.models.Region || mongoose.model('Region', new mongoose.Schema({ region: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
    await RegionModel.updateOne({ region: region_txt }, { $pull: { events: id } });

    // Remove from Group Collection
    const GroupModel = mongoose.models.Group || mongoose.model('Group', new mongoose.Schema({ group: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
    await GroupModel.updateOne({ group: gname }, { $pull: { events: id } });

    // Remove from Attack Type Collection
    const AttackTypeModel = mongoose.models.AttackType || mongoose.model('AttackType', new mongoose.Schema({ attackType: String, events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
    await AttackTypeModel.updateOne({ attackType: attacktype1_txt }, { $pull: { events: id } });

    // Clean up empty collections
    await cleanUpEmptyCollections();
  }
  return deletedEvent;
};

export const getAllEvents = async () => {
  const events = await MasterModel.find();
  return events;
};