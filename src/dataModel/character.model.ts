import mongoose, { Schema, Document } from "mongoose";
import type { ItemsInterface, WeaponInterface, StatusEffectInterface, ArmorInterface, MapLayoutInterface, QuestInterfate } from "./index.ts";

export interface Character extends Document {
  name: string;
  mana: number;
  health: number;
  stamina: number;
  strength: number;
  characterPosition: {
    Floor: number,
    row: number,
    col: number
  }
  weaponSlot?: Schema.Types.ObjectId | string | null | WeaponInterface;
  armorSlot?: {
    headGear?: Schema.Types.ObjectId | ArmorInterface | null,
    chestArmor?: Schema.Types.ObjectId | ArmorInterface | null,
    handArmor?: Schema.Types.ObjectId | ArmorInterface | null,
    legArmor?: Schema.Types.ObjectId | ArmorInterface | null
  };
  inventory: {
    item: Schema.Types.ObjectId | string | ItemsInterface,
    quantity: number
  }[]
  Quest: {
    completedQuest: Schema.Types.ObjectId[] | null | QuestInterfate[]
    currentQuest: {
      QuestState: string
      isComplete: boolean
      currentTaskIndex: number
      QuestDetail: Schema.Types.ObjectId | null | QuestInterfate
    }
    nextQuest: Schema.Types.ObjectId[] | null | QuestInterfate[]
    sideQuest: Schema.Types.ObjectId[] | null | QuestInterfate[]
  }
  statusEffect: Schema.Types.ObjectId[] | StatusEffectInterface[] | null;
  level: number;
  mapLayout?: Schema.Types.ObjectId[] | MapLayoutInterface[] | null;
  gold: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

const charaterSchema = new Schema<Character>({
  name: {
    type: String,
    required: true,
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
  characterPosition: {
    type: new Schema({
      Floor: {
        type: Number,
        required: true
      },
      row: {
        type: Number,
        required: true
      },
      col: {
        type: Number,
        required: true
      }
    }, { _id: false }),
    default: { row: 0, col: 0, Floor: 0 }
  },
  weaponSlot: {
    type: Schema.Types.ObjectId,
    ref: "Weapon"
  },
  mapLayout: {
    type: [Schema.Types.ObjectId],
    ref: "MapLayout"
  },
  gold: {
    type: Number,
    required: true,
    default: 0
  },
  armorSlot: {
    type: new Schema({
      headGear: {
        type: Schema.Types.ObjectId,
        ref: "Armor"
      },
      chestArmor: {
        type: Schema.Types.ObjectId,
        ref: "Armor"
      },
      legArmor: {
        type: Schema.Types.ObjectId,
        ref: "Armor"
      },
      handArmor: {
        type: Schema.Types.ObjectId,
        ref: "Armor"
      },
      default: {}
    }, { _id: false })
  },
  strength: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  inventory: {
    type: [new Schema({
      item: {
        type: Schema.Types.ObjectId,
        ref: "Item"
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
      }
    }, { _id: false })],
    validate: [arrayLimit, "Inventory cannot have more than 15 items"],
    default: []
  },
  Quest: {
    type: new Schema({
      completedQuest: { type: [Schema.Types.ObjectId], ref: "Quest" },
      currentQuest: {
        type: new Schema({
          isComplete: { type: Boolean, default: false, required: true },
          QuestDetail: { type: Schema.Types.ObjectId, ref: "Quest" },
          currentTaskIndex: { type: Number, default: 0, required: true }
        }, { _id: false }),
        default: {
          isComplete: false,
          QuestDetail: null,
          currentTaskIndex: 0
        }
      },
      nextQuest: { type: [Schema.Types.ObjectId], ref: "Quest" },
      sideQuest: { type: [Schema.Types.ObjectId], ref: "Quest" }
    }, { _id: false }),
    default: {}
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
function arrayLimit(value: any[]) {
  return value.length <= 15
}

export default mongoose.model<Character>("Character", charaterSchema)
