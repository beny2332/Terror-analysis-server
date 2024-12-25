import mongoose, { Document, Schema } from 'mongoose';

interface MasterEvent extends Document {
    iyear: number;
    region_txt: string;
    gname: string;
    attacktype1_txt: string;
    nkill?: number;
    nwound?: number;
  }

const MasterModel = mongoose.models.MasterEvent || mongoose.model<MasterEvent>('MasterEvent', new Schema({}, { strict: false }));
