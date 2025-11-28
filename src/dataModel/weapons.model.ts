import mongoose, { Schema } from "mongoose";
import { type WeaponInterface, WeaponType } from "../utility/interface.utility";


const weaponSchema = new Schema<WeaponInterface>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  damage: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  manaCost: {
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
    enum: Object.values(WeaponType)
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
  effect: {
    type: Schema.Types.ObjectId,
    ref: "StatusEffect"
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<WeaponInterface>("Weapon", weaponSchema);
