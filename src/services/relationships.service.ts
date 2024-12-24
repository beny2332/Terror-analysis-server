import mongoose, { Document, Schema } from 'mongoose';

interface MasterEvent extends Document {
  iyear: number;
  region_txt: string;
  gname: string;
  attacktype1_txt: string;
  nkill?: number;
  nwound?: number;
}

interface Year extends Document {
  year: number;
  events: mongoose.Types.ObjectId[];
}

interface Region extends Document {
  region: string;
  events: mongoose.Types.ObjectId[];
}

interface Group extends Document {
  group: string;
  events: mongoose.Types.ObjectId[];
}

const MasterModel = mongoose.models.MasterEvent || mongoose.model<MasterEvent>('MasterEvent', new Schema({}, { strict: false }));
const YearModel = mongoose.models.Year || mongoose.model<Year>('Year', new Schema({ year: Number, events: [{ type: Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
const RegionModel = mongoose.models.Region || mongoose.model<Region>('Region', new Schema({ region: String, events: [{ type: Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));
const GroupModel = mongoose.models.Group || mongoose.model<Group>('Group', new Schema({ group: String, events: [{ type: Schema.Types.ObjectId, ref: 'MasterEvent' }] }, { strict: false }));

export const getTopGroups = async (region: string, years: number[]): Promise<{ _id: string; count: number }[]> => {
  const results: { _id: string; count: number }[] = [];

  for (const year of years) {
    const yearDoc = await YearModel.findOne({ year }).populate('events');
    if (!yearDoc) continue;

    const events = (yearDoc.events as MasterEvent[]).filter(event => event.region_txt === region);
    const groupedEvents = events.reduce((acc: { [key: string]: number }, event) => {
      acc[event.gname] = (acc[event.gname] || 0) + 1;
      return acc;
    }, {});

    const sortedGroups = Object.entries(groupedEvents)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([gname, count]) => ({ _id: gname, count }));

    results.push(...sortedGroups);
  }

  return results;
};

export const getGroupsByYear = async (year: number): Promise<{ _id: string; count: number }[]> => {
  const yearDoc = await YearModel.findOne({ year }).populate('events');
  if (!yearDoc) return [];

  const groupedEvents = (yearDoc.events as MasterEvent[]).reduce((acc: { [key: string]: number }, event) => {
    acc[event.gname] = (acc[event.gname] || 0) + 1;
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedEvents)
    .sort(([, a], [, b]) => b - a)
    .map(([gname, count]) => ({ _id: gname, count }));

  return sortedGroups;
};

export const getIncidentsByGroup = async (gname: string): Promise<{ _id: number; count: number }[]> => {
  const groupDoc = await GroupModel.findOne({ group: gname }).populate('events');
  if (!groupDoc) return [];

  const groupedEvents = (groupDoc.events as MasterEvent[]).reduce((acc: { [key: number]: number }, event) => {
    acc[event.iyear] = (acc[event.iyear] || 0) + 1;
    return acc;
  }, {});

  const sortedYears = Object.entries(groupedEvents)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, count]) => ({ _id: Number(year), count }));

  return sortedYears;
};

export const getDeadliestRegions = async (gname: string): Promise<{ _id: string; totalCasualties: number }[]> => {
  const groupDoc = await GroupModel.findOne({ group: gname }).populate('events');
  if (!groupDoc) return [];

  const groupedEvents = (groupDoc.events as MasterEvent[]).reduce((acc: { [key: string]: number }, event) => {
    const casualties = (event.nkill || 0) + (event.nwound || 0);
    acc[event.region_txt] = (acc[event.region_txt] || 0) + casualties;
    return acc;
  }, {});

  const sortedRegions = Object.entries(groupedEvents)
    .sort(([, a], [, b]) => b - a)
    .map(([region, totalCasualties]) => ({ _id: region, totalCasualties }));

  return sortedRegions;
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

export const getGroupSuggestions = async (searchTerm: string) => {
  return await GroupModel.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: searchTerm,
          path: "group"
        }
      }
    },
    {
      $project: {
        group: 1,
        _id: 0
      }
    },
    {
      $limit: 10
    }
  ]);
};
