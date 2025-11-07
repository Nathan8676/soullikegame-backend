import mongoose, { Schema, Document } from "mongoose";
import type { ItemsInterface, FloorEnemyInterface, FloorBossInterface } from "./index.ts";

export interface TileLayout {
  tileId: number;
  property?: {
    mainTileTextureRef: string | null,
    mainTileOffsetX: number | null,
    mainTileOffsetY: number | null,
    tileType: string | null,
    LayerTile?: [
      {
        textureRef: string | null,
        offsetX: number | null,
        offsetY: number | null,
        tileType: string | null
      }
    ]
    anchor?: boolean
  };
  effect: string | null;
}

export interface MapLayout extends Document {
  name: string;
  description: string;
  floorLeveltoScaleEnemy: number;
  floorLeveltoScaleBoss: number;
  floorLevel: number;
  floorBoss: {
    spawnPoint: {
      row: number,
      col: number
    },
    floorBoss: Schema.Types.ObjectId | FloorBossInterface,
    [key: string]: any
  }
  floorEntitiesSpawnPoints: [{
    quantity: number,
    spawnPoint: {
      row: number,
      col: number
    },
    floorEntity: Schema.Types.ObjectId | FloorEnemyInterface,
    [key: string]: any
  }],
  floorItem: Schema.Types.ObjectId[] | ItemsInterface[];
  layout: TileLayout[][];
  createdAt: Date;
  updatedAt: Date;
}

const TileLayoutSchema = new Schema<TileLayout>({
  tileId: {
    type: Number,
    required: true
  },
  property: {
    anchor: { type: Boolean },
    mainTileTextureRef: { type: String, required: true },
    mainTileOffsetX: { type: Number, required: true, default: 0 },
    mainTileOffsetY: { type: Number, required: true, default: 0 },
    tileType: { type: String, required: true },
    LayerTile: {
      type: [
        {
          textureRef: { type: String, required: true },
          offsetX: { type: Number, required: true, default: 0 },
          offsetY: { type: Number, required: true, default: 0 },
          tileType: { type: String, required: true }
        }
      ]
    }
  },
  effect: { type: String }
}, { _id: false })

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
    type: new Schema({
      spawnPoint: {
        row: Number,
        col: Number
      },
      floorBoss: {
        type: Schema.Types.ObjectId,
        ref: "FloorBoss"
      }
    }, { _id: false }),
    default: {}
  },
  floorEntitiesSpawnPoints: {
    type: [
      new Schema({
        quantity: Number,
        spawnPoint: {
          row: Number,
          col: Number
        },
        floorEntity: {
          type: Schema.Types.ObjectId,
          ref: "FloorEnemy"
        }
      }, { _id: false }),
    ],
    default: []
  },
  floorItem: {
    type: [Schema.Types.ObjectId],
    ref: "Item"
  },
  layout: {
    type: [[TileLayoutSchema]],
    required: true
  }
}, { timestamps: true });


export default mongoose.model<MapLayout>("MapLayout", mapLayoutSchema);

