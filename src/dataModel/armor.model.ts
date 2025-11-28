import mongoose, { Schema } from "mongoose";
import { type ArmorInterface, ArmorType } from "../utility/interface.utility";


const armorSchema = new Schema<ArmorInterface>({
  setsName: {
    type: String,
    required: true,
    unique: true
  },
  durability: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  physicalDefense: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  fireDefense: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  poisonDefense: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  staminaCost: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(ArmorType)
  },
  weight: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<ArmorInterface>("Armor", armorSchema);
