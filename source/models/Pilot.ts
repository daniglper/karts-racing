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
    type: String
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
      _id: String,
      name: String,
      laps: [
        {
          _id: String,
          time: String,
        },
      ],
    },
  ],
});

export const Pilot: Model<IPilot> = model("Pilot", PilotSchema);
