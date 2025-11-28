import mongoose, { Schema } from "mongoose";
import type { FloorEnemyInterface } from "../utility/interface.utility";


const floorEnemySchema = new Schema<FloorEnemyInterface>({
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
  }
}, { timestamps: true });

export default mongoose.model<FloorEnemyInterface>("FloorEnemy", floorEnemySchema);
