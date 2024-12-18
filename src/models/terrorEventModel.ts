import { model, Schema } from "mongoose";

export const terrorAttackSchema = new Schema({
  eventid: { type: Number, unique: true },
  iyear: { type: Number },
  imonth: { type: Number },
  iday: { type: Number },
  country_txt: { type: String },
  region_txt: { type: String },
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  attacktype1_txt: { type: String },
  targtype1_txt: { type: String },
  target1: { type: String },
  gname: { type: String },
  weaptype1_txt: { type: String },
  nkill: { type: Number },
  nwound: { type: Number },
  nperps: { type: Number }, /* number of participants in the attack */
  summary: { type: String }
});

export const TerrorEventModel = model("Event", terrorAttackSchema);
