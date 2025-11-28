import mongoose, { Schema } from "mongoose";
import type { FloorBossInterface } from "../utility/interface.utility";


const FloorBossSchema = new Schema<FloorBossInterface>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  health: {
    type: Number,
    required: true,
    default: 100,
    min: 0
  },
  mana: {
    type: Number,
    required: true,
    default: 50,
    min: 0
  },
  strength: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  statusEffect: {
    type: [Schema.Types.ObjectId],
    ref: "StatusEffect"
  },
  weaponSlot: {
    type: Schema.Types.ObjectId,
    ref: "Weapon"
  },
  inventory: {
    type: [Schema.Types.ObjectId],
    ref: "Item"
  },
}, { timestamps: true });

export default mongoose.model<FloorBossInterface>("FloorBoss", FloorBossSchema);
