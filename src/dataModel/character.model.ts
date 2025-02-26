import mongoose, { Schema, Document } from "mongoose";

interface Character extends Document {
  name: string;
  mana: number;
  health: number;
  stamina: number;
  strength: number;
  weaponSlot?:  Schema.Types.ObjectId;
  armorSlot?:  {head?: Schema.Types.ObjectId | null, chestPiece: Schema.Types.ObjectId | null, legs: Schema.Types.ObjectId | null, arms: Schema.Types.ObjectId | null};
  inventory:  Schema.Types.ObjectId[] | null;
  statusEffect: Schema.Types.ObjectId[] | null;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

const charaterSchema = new Schema<Character>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  mana: {
    type: Number,
    required: true,
    default: 50
  },
  health: {
    type: Number,
    required: true,
    default: 100
  },
  stamina: {
    type: Number,
    required: true,
    default: 50
  },
  weaponSlot: {
    type: Schema.Types.ObjectId,
    ref: "Weapon"
  },
  armorSlot: {
    head: {
      type: Schema.Types.ObjectId,
      ref: "Armor"
    },
    chestPiece: {
      type: Schema.Types.ObjectId,
      ref: "Armor"
    },
    legs: {
      type: Schema.Types.ObjectId,
      ref: "Armor"
    },
    arms: {
      type: Schema.Types.ObjectId,
      ref: "Armor"
    }
  },
  strength: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  inventory: {
    type: [Schema.Types.ObjectId],
    ref: "Item"
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  experience: {
    type: Number,
    required: true,
    default: 0
  },
  statusEffect: {
    type: [Schema.Types.ObjectId],
    ref: "StatusEffect"
  }

}, { timestamps: true })

export const CharacterModel = mongoose.model<Character>("Character", charaterSchema)

