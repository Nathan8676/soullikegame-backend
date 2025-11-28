import mongoose, { Schema, } from "mongoose";
import { type TileLayoutInterface, type MapLayoutInterface, type SpawnPoints, type EntitySpawnType, SpawnType } from "../utility/interface.utility";


const TileLayoutSchema = new Schema<TileLayoutInterface>({
  id: {
    type: Number,
    required: true
  },
  type: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  offset_x: { type: Number, required: true, default: 0 },
  offset_y: { type: Number, required: true, default: 0 },
  parallax_x: { type: Number, required: true, default: 0 },
  parallax_y: { type: Number, required: true, default: 0 },
  data: {
    type: [[Number]],
    required: true,
    // TODO: make a validate with validator and message to make sure that 2d arr follow mesurement height(col, y), width(row, x) 
  },
  property: {
    // TODO: find a way to add custom data 
  },

}, { _id: false })

const mapLayoutSchema = new Schema<MapLayoutInterface>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  objectLayer: {
    type: new Schema({
      drawOrder: { type: String, required: true },
      opacity: { type: Number, required: true, default: 1 },
      x: { type: Number, required: true, default: 0 },
      y: { type: Number, required: true, default: 0 },
      offset_x: { type: Number, required: true, default: 0 },
      offsety: { type: Number, required: true, default: 0 },
      parallax_x: { type: Number, required: true, default: 0 },
      parallax_y: { type: Number, required: true, default: 0 },
      floorBoss: {
        type: new Schema({
          spawnPoint: {
            y: Number,
            x: Number
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
            quantity: {
              type: Number,
              required: true,
              min: 1
            },
            // TODO: find if there is any other data needs in spawnPoints
            spawnPoints: {
              type: [{
                id: { type: Number, required: true },
                type: { type: String, enum: Object.values(SpawnType), required: true },
                y: { type: Number, required: true },
                x: { type: Number, required: true }
              }],
              required: true,
              validate: {
                validator: function(spawnPoints: SpawnPoints[]) {
                  const parent = this as EntitySpawnType;
                  return spawnPoints.length === parent.quantity;
                },
                message: (props: any) => {
                  const parent = props.instance;
                  return `Spawn points length (${props.value.length}) must match quantity (${parent.quantity})`;
                }
              }
            },
            floorEntity: {
              type: Schema.Types.ObjectId,
              ref: "FloorEnemy"
            }
          }, { _id: false }),
        ],
        default: [],
      },

      floorItem: {
        type: [Schema.Types.ObjectId],
        ref: "Item"
      }

    }, { _id: false })
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
  layout: {
    type: [TileLayoutSchema],
    required: true
  }
}, { timestamps: true });


export default mongoose.model<MapLayoutInterface>("MapLayout", mapLayoutSchema);
