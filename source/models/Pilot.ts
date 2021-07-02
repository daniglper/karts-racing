import { Document, Schema, model, Model } from "mongoose";

export interface IPilot extends Document {
  _id: string;
  age: number;
  name: string;
  pict: string;
  team: string;
  races: IRace[];
}
export interface IRace {
  name: string;
  laps: ILap[];
}
export interface ILap {
  time: string;
}

// Schema
const PilotSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  team: {
    type: String,
    required: true,
  },
  races: [
    {
      name: String,
      laps: [{ time: String }],
    },
  ],
});

export const Pilot: Model<IPilot> = model("Pilot", PilotSchema);
