import mongoose, {Schema, Document} from "mongoose";

interface MapLayout extends Document {
  name: string;
  description: string;
  floorLeveltoScaleEnemy: number;
  floorLeveltoScaleBoss: number;
  floorLevel: number;
  floorBoss: Schema.Types.ObjectId;
  floorEnemy: Schema.Types.ObjectId[];
  floorItem: Schema.Types.ObjectId[];
  layout: [[]];
  createdAt: Date;
  updatedAt: Date;
}

const mapLayoutSchema = new Schema<MapLayout>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  floorLeveltoScaleEnemy: {
    type: Number,
    required: true
  },
  floorLeveltoScaleBoss: {
    type: Number,
    required: true
  },
  floorLevel: {
    type: Number,
    required: true
  },
  floorBoss: {
    type: Schema.Types.ObjectId,
    ref: "FloorBoss"
  },
  floorEnemy: {
    type: [Schema.Types.ObjectId],
    ref: "FloorEnemy"
  },
  floorItem: {
    type: [Schema.Types.ObjectId],
    ref: "Item"
  },
  layout: {
    type: [[Number]],
    required: true
  }
}, {timestamps: true});

export default mongoose.model<MapLayout>("MapLayout", mapLayoutSchema);
