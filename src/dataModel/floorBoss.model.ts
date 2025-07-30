import mongoose, {Schema, Document} from "mongoose";
import type { ItemsInterface, WeaponInterface, StatusEffectInterface } from "./index.ts";

export interface FloorBoss extends Document {
  name: string;
  health: number;
  weaponSlot: Schema.Types.ObjectId | WeaponInterface;
  inventory: Schema.Types.ObjectId[] | ItemsInterface[];
  mana: number;
  strength: number;
  statusEffect: Schema.Types.ObjectId[] | StatusEffectInterface[];
  createdAt: Date;
  updatedAt: Date;
}

const FloorBossSchema = new Schema<FloorBoss>({
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
}, {timestamps: true});

export default mongoose.model<FloorBoss>("FloorBoss", FloorBossSchema);
