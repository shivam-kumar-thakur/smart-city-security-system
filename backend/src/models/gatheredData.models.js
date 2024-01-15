import mongoose from "mongoose";

const gatheredDataSchema = new mongoose.Schema({
  animal: { type: Number, default: 0 },
  auto: { type: Number, default: 0 },
  bike: { type: Number, default: 0 },
  bus: { type: Number, default: 0 },
  car: { type: Number, default: 0 },
  carrier_vehicle: { type: Number, default: 0 },
  cycle: { type: Number, default: 0 },
  driver: { type: Number, default: 0 },
  electric_pole: { type: Number, default: 0 },
  electric_poll: { type: Number, default: 0 },
  num_plate: { type: Number, default: 0 },
  passenger: { type: Number, default: 0 },
  pedestrain: { type: Number, default: 0 },
  person: { type: Number, default: 0 },
  scooty: { type: Number, default: 0 },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  // Add any other necessary details here
},{timestamps:true});

export const GatheredData = mongoose.model("GatheredData", gatheredDataSchema);

