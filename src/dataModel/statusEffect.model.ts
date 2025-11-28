import mongoose, { Schema } from "mongoose";
import { type StatusEffectInterface, StatusEffectType } from "../utility/interface.utility";


const statusEffectSchema = new Schema<StatusEffectInterface>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  effect: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(StatusEffectType)
  }
}, { timestamps: true });

export default mongoose.model<StatusEffectInterface>("StatusEffect", statusEffectSchema);
