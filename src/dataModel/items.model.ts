import mongoose, { Schema } from "mongoose";
import { type ItemsInterface, ItemType } from "../utility/interface.utility";


const itemSchema = new Schema<ItemsInterface>({
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
}, { timestamps: true });

export default mongoose.model<ItemsInterface>("Item", itemSchema);
