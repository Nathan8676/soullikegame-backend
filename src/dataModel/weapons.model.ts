import mongoose, {Schema, Document} from "mongoose";

enum WeaponType {
  shortSword = "shortSword",
  longSword = "longSword",
  dagger = "dagger",
  staff = "staff",
  bow = "bow",
  axe = "axe"
}

export interface Weapon extends Document {
  name: string;
  damage: number;
  manaCost: number;
  staminaCost: number;
  type: WeaponType;
  weight: number;
  image: string;
  effect: Schema.Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const weaponSchema = new Schema<Weapon>({
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
}, {timestamps: true});

export default mongoose.model<Weapon>("Weapon", weaponSchema);
