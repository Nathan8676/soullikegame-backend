import mongoose, {Schema, Document} from "mongoose";

enum StatusEffectType {
  buff = "buff",
  debuff = "debuff"
}

export interface StatusEffect extends Document {
  name: string;
  description: string;
  effect: number;
  type: StatusEffectType;
  duration: number;
  createdAt: any;
  updatedAt: any;
}

const statusEffectSchema = new Schema<StatusEffect>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  effect: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(StatusEffectType)
  }
}, {timestamps: true});

export default mongoose.model<StatusEffect>("StatusEffect", statusEffectSchema);
