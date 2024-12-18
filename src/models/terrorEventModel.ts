import { model, Schema } from "mongoose";

export const terrorAttackSchema = new Schema({
  eventid: { type: Number, unique: true },
  iyear: { type: Number, required: true },
  imonth: { type: Number, required: true },
  iday: { type: Number, required: true },
  country_txt: { type: String, required: true },
  region_txt: { type: String, required: true },
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  attacktype1_txt: { type: String },
  targtype1_txt: { type: String },
  target1: { type: String },
  gname: { type: String, required: true },
  weaptype1_txt: { type: String },
  nkill: { type: Number },
  nwound: { type: Number },
  nperps: { type: Number },
  summary: { type: String }
});

export const terrorEventModel = (year: number, region: string) => {
  const collectionName = `Event_${year}_${region.replace(/\s+/g, '_')}`;
  return model(collectionName, terrorAttackSchema);
};