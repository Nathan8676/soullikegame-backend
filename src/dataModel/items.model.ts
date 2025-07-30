import mongoose , {Schema, Document} from "mongoose";

enum ItemType {
  consumable = "consumable",
  nonConsumable = "nonConsumable"
}

export interface Item extends Document {
  name: string;
  type: ItemType;
  weight: number;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<Item>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(ItemType)
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
  },
}, {timestamps: true});

export default mongoose.model<Item>("Item", itemSchema);
