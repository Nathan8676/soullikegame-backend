import mongoose, {Schema, Document} from "mongoose";

enum ArmorType {
  headGear = "headGear",
  chestArmor = "chestArmor",
  handArmor = "handArmor",
  legArmor = "legArmor"
}



export interface Armor extends Document {
  setsName: string;
  durability: number;
  physicalDefense: number;
  fireDefense: number;
  poisonDefense: number;
  staminaCost: number;
  type: ArmorType;
  weight: number;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}


const armorSchema = new Schema<Armor>({
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
}, {timestamps: true});

export default mongoose.model<Armor>("Armor", armorSchema);
