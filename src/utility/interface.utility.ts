import { Schema, Document } from "mongoose";
import * as z from "zod"
// ====================   MapLayout Types ====================

export interface MapLayoutInterface extends Document {
  name: string;
  height: number;
  width: number;
  description: string;
  floorLeveltoScaleEnemy: number;
  floorLeveltoScaleBoss: number;
  floorLevel: number;
  objectLayer: {
    // TODO: also add Npc spawnPoints, and other object like startPoint End Point and also Quests Point as well
    opacity: number,
    drawOrder: string;
    parallax_y: number,
    parallax_x: number,
    offset_x: number,
    offset_y: number,
    floorBoss: {
      spawnPoints: SpawnPoints;
      floorBoss: Schema.Types.ObjectId | FloorBossInterface,
      [key: string]: any
    }
    floorEntitiesSpawnPoints: EntitySpawnType[],
    floorItem: Schema.Types.ObjectId[] | ItemsInterface[];
    x: number;
    y: number;
  }
  layout: TileLayoutInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TileLayoutInterface {
  id: number;
  name: string;
  type: string;
  width: number;
  height: number;
  offset_x: number;
  offset_y: number;
  parallax_x: number;
  parallax_y: number;
  x: number;
  y: number;
  data: number[][]
  property?: any;
}

// ==================== Subset of MapLayout Spawn Types ====================

export enum SpawnType {
  Rectangle = "rectangle",
  Polygon = "polygon",
  Point = "point",
  Circle = "circle",
}

interface SpawnPointBase {
  id: number
  type: SpawnType
}


export interface PointSpawn extends SpawnPointBase {
  type: SpawnType.Point
  x: number
  y: number
}

export interface CircleSpawn extends SpawnPointBase {
  type: SpawnType.Circle
  x: number
  y: number
  radius: number
}

export interface RectangleSpawn extends SpawnPointBase {
  type: SpawnType.Rectangle
  x: number
  y: number
  width: number
  height: number
}

export interface PolygonSpawn extends SpawnPointBase {
  type: SpawnType.Polygon
  points: { x: number; y: number }[]
}

export type SpawnPoints =
  | PointSpawn
  | CircleSpawn
  | RectangleSpawn
  | PolygonSpawn;

export interface EntitySpawnType {
  quantity: number;
  spawnPoints: SpawnPoints[];
  floorEntity: Schema.Types.ObjectId | FloorEnemyInterface
}


// ==================== FloorEnemy  ====================

export interface FloorEnemyInterface extends Document {
  name: string;
  health: number;
  weaponSlot: Schema.Types.ObjectId;
  inventory: Schema.Types.ObjectId[];
  mana: number;
  strength: number;
  statusEffect: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

// ==================== FloorBoss ====================

export interface FloorBossInterface extends Document {
  name: string;
  health: number;
  weaponSlot: Schema.Types.ObjectId | WeaponInterface;
  inventory: Schema.Types.ObjectId[] | ItemsInterface[];
  mana: number;
  strength: number;
  statusEffect: Schema.Types.ObjectId[] | StatusEffectInterface[];
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Weapon ====================

export enum WeaponType {
  shortSword = "shortSword",
  longSword = "longSword",
  dagger = "dagger",
  staff = "staff",
  bow = "bow",
  axe = "axe"
}

export interface WeaponInterface extends Document {
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

// ==================== Item ====================

export enum ItemType {
  consumable = "consumable",
  nonConsumable = "nonConsumable"
}

export interface ItemsInterface extends Document {
  name: string;
  type: ItemType;
  weight: number;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum StatusEffectType {
  buff = "buff",
  debuff = "debuff"
}

// ==================== StatusEffect ====================

export interface StatusEffectInterface extends Document {
  name: string;
  description: string;
  effect: number;
  type: StatusEffectType;
  duration: number;
  createdAt: any;
  updatedAt: any;
}

// ==================== Armor ====================

export enum ArmorType {
  headGear = "headGear",
  chestArmor = "chestArmor",
  handArmor = "handArmor",
  legArmor = "legArmor"
}



export interface ArmorInterface extends Document {
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

// ==================== Character ====================

export interface CharacterInterface extends Document {
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
    completedQuest: Schema.Types.ObjectId[] | null | QuestInterface[]
    currentQuest: {
      QuestState: string
      isComplete: boolean
      currentTaskIndex: number
      QuestDetail: Schema.Types.ObjectId | null | QuestInterface
    }
    nextQuest: Schema.Types.ObjectId[] | null | QuestInterface[]
    sideQuest: Schema.Types.ObjectId[] | null | QuestInterface[]
  }
  statusEffect: Schema.Types.ObjectId[] | StatusEffectInterface[] | null;
  level: number;
  mapLayout?: Schema.Types.ObjectId[] | MapLayoutInterface[] | null;
  gold: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Quest ====================

enum taskTypeEnum {
  kill = "kill",
  collect = "collect",
  openChest = "openChest",
  openDoor = "openDoor",
  TalkToNPC = "TalkToNPC",
}

export interface QuestInterface extends Document {
  name: string;
  description: string;
  tasks: {
    description: string;
    taskType: taskTypeEnum;
    requiredAmount: number;
    tragetId: Schema.Types.ObjectId | null | string;
    taskReward: {
      RewardId: Schema.Types.ObjectId | null | string
      RewardModelName: string
    }[];
    completed: boolean;
  }[]
  reward: {
    gold: number | null;
    experience: number | null;
    items: Schema.Types.ObjectId[] | null;
  };
  createdAt: Date;
  updatedAt: Date;
  // previous thing needs to do before completed to unlock this quest
  previous: {
    quest: Schema.Types.ObjectId[] | null
    [key: string]: any
  },
  [key: string]: any
}

// ==================== User ====================

export const zUserSchema = z.object({
  userName: z.string(),
  password: z.string(),
  characterIds: z.array(z.instanceof(Schema.Types.ObjectId)),
  refreshToken: z.string(), // TODO: make sure that refresh Token won't act wired if is undefined so add a defualt
})
export type Zuser = z.infer<typeof zUserSchema>
export const pubUserSchema = zUserSchema.omit({
  password: true,
  refreshToken: true
})
export type PubUser = z.infer<typeof pubUserSchema>
export interface UserInterface extends Zuser, Document {
  generateRefreshToken(): string
  generateAccessToken(): string
  comparePassword(password: string): Promise<boolean>

}

