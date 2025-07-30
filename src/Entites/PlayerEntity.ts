import { Schema } from "mongoose";
import type {WeaponInterface, ArmorInterface, StatusEffectInterface, MapLayoutInterface, ItemsInterface, QuestInterfate, CharacterInterface} from "../dataModel/index.ts"
import {Weapon, Armor, Item} from "../dataModel/index.ts"
import { ECS } from "./baseEntity.ts";

enum ArmorType {
  headGear = "headGear",
  chestArmor = "chestArmor",
  handArmor = "handArmor",
  legArmor = "legArmor"
}


interface characterData {
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
  weaponSlot?:  Schema.Types.ObjectId | null | WeaponInterface;
  armorSlot?:  {
    headGear?: Schema.Types.ObjectId | ArmorInterface | null,
    chestArmor?: Schema.Types.ObjectId | ArmorInterface | null,
    handArmor?: Schema.Types.ObjectId | ArmorInterface | null,
    legArmor?: Schema.Types.ObjectId | ArmorInterface | null
  };
  inventory: {
    item: Schema.Types.ObjectId | ItemsInterface | WeaponInterface,
    quantity: number
  }[]
  statusEffect: Schema.Types.ObjectId[] | StatusEffectInterface[] | null;
  level: number;
  mapLayout?: Schema.Types.ObjectId[] | MapLayoutInterface[] | null;
  gold: number;
  experience: number;
}

const mageAllPossibleItemsId = {
  ItemId: {
    arcaneElixir: "Arcane Elixir",
    vitality: "Elixir of Vitality",
    phantom: "Phantom Essence",
    stalwart: "Stalwart Draught"
  },
  weaponId: {
    celestialStaff: "Celestial Staff",
    arcaneScepter: "Arcane Scepter",
    runebladeDagger: "Runeblade Dagger"
  },
  armorId: {
    headGear: "Mage's Veil Hood",
    chestArmor: "Mage's Ethereal Robe",
    handArmor: "Mage's Silk Gloves",
    legArmor: "Mage's Woven Legwraps"
  }
};

const berserkerAllPossibleItemsId = {
  ItemId: {
    rage: "Elixir of Rage",
    vitality: "Elixir of Vitality",
    phantom: "Phantom Essence",
    stalwart: "Stalwart Draught"
  },
  weaponId: {
    skullcrusher: "Skullcrusher",
    boneblade: "Boneblade Axe"
  },
  armorId: {
    headGear: "Berserker’s Horned Helm",
    chestArmor: "Berserker’s Warhide",
    handArmor: "Berserker’s Clawguards",
    legArmor: "Berserker’s Ragelegs"
  }
};

const mercenaryAllPossibleItemsId = {
  ItemId: {
    lockpick: "Silent Lockpick",
    vitality: "Elixir of Vitality",
    phantom: "Phantom Essence",
    stalwart: "Stalwart Draught"
  },
  weaponId: {
    twinfang: "Twinfang Daggers",
    crossbow: "Repeater Crossbow"
  },
  armorId: {
    headGear: "Mercenary’s Visor",
    chestArmor: "Mercenary’s Reinforced Vest",
    handArmor: "Mercenary’s Bracers",
    legArmor: "Mercenary’s Leather Trousers"
  }
};

const knightAllPossibleItemsId = {
  ItemId: {
    vitality: "Elixir of Vitality",
    phantom: "Phantom Essence",
    stalwart: "Stalwart Draught"
  },
  weaponId: {
    dragonsBane: "Dragon’s Bane"
  },
  armorId: {
    headGear: "Knight's Iron Helm",
    chestArmor: "Knight's Oathplate",
    handArmor: "Knight’s Gauntlets",
    legArmor: "Knight’s Greaves"
  }
};

const warriorAllPossibleItemsId = {
  ItemId: {
    vitality: "Elixir of Vitality",
    phantom: "Phantom Essence",
    stalwart: "Stalwart Draught"
  },
  weaponId: {
    axe: "Bloodreaver Axe",
    dagger: "Runeblade Dagger"
  },
  armorId: {
    headGear: "Warrior’s Crest Helm",
    chestArmor: "Warrior’s Battleplate",
    handArmor: "Warrior’s Grips",
    legArmor: "Warrior’s Warboots"
  }
};

const assassinAllPossibleItemsId = {
  ItemId: {
    lockpick: "Silent Lockpick",
    vitality: "Elixir of Vitality",
    phantom: "Phantom Essence",
    stalwart: "Stalwart Draught"
  },
  weaponId: {
    shadowEdge: "Shadow’s Edge",
    nightstalker: "Nightstalker Bow"
  },
  armorId: {
    headGear: "Mercenary’s Visor",
    chestArmor: "Mercenary’s Reinforced Vest",
    handArmor: "Mercenary’s Bracers",
    legArmor: "Mercenary’s Leather Trousers"
  }
};
async function populateItemsByClass(character: characterData, WhichPossibleItems: {ItemId: Record<string, string>, weaponId: Record<string, string>, armorId: Record<string, string>}): Promise<void> {
  const { ItemId, weaponId, armorId } = WhichPossibleItems;
  const Items = await Item.find({ name: { $in: Object.values(ItemId)}}).select({ _id: 1 });
  const Weapons = await Weapon.find({ name: { $in: Object.values(weaponId) }}).select({ _id: 1 });
  const Armors = await Armor.find({ setsName: { $in: Object.values(armorId)}}).select({ _id: 1, type: 1 });
  Items.forEach((item) => {
    character.inventory.push({
      item: item._id as Schema.Types.ObjectId,
      quantity: 1,
    });
  })
  Weapons.forEach((item) => {
    character.inventory.push({
      item: item._id as Schema.Types.ObjectId,
      quantity: 1
    })
  })
  character.weaponSlot = Weapons[0]
  Armors.forEach((item) => {
    if(character.armorSlot){
      if(item.type === ArmorType.headGear){
        character.armorSlot.headGear = item._id as Schema.Types.ObjectId
      }
      if(item.type === ArmorType.chestArmor){
        character.armorSlot.chestArmor = item._id as Schema.Types.ObjectId
      }
      if(item.type === ArmorType.handArmor){
        character.armorSlot.handArmor = item._id as Schema.Types.ObjectId
      }
      if(item.type === ArmorType.legArmor){
        character.armorSlot.legArmor = item._id as Schema.Types.ObjectId
      }
    }
  })
}

export const StarterCharacter = async (Name: string): Promise<characterData> => {
  const classes: Record<string, characterData> = {
    Assassin: {
      name: "Assassin",
      level: 1,
      health: 90,
      mana: 80,
      stamina: 150,
      strength: 10,
      characterPosition: { Floor: 1, row: 1, col: 1 },
      weaponSlot: null,
      armorSlot: { headGear: null, chestArmor: null, legArmor: null, handArmor: null },
      inventory: [],
      statusEffect: null,
      mapLayout: [],
      gold: 0,
      experience: 0,
    },
    Mage: {
      name: "Mage",
      level: 1,
      health: 80,
      mana: 200,
      stamina: 60,
      strength: 5,
      characterPosition: { Floor: 1, row: 1, col: 1 },
      weaponSlot: null,
      armorSlot: { headGear: null, chestArmor: null, legArmor: null, handArmor: null },
      inventory: [],
      statusEffect: null,
      mapLayout: [],
      gold: 0,
      experience: 0,
    },
    Warrior: {
      name: "Warrior",
      level: 1,
      health: 130,
      mana: 80,
      stamina: 100,
      strength: 18,
      characterPosition: { Floor: 1, row: 1, col: 1 },
      weaponSlot: null,
      armorSlot: { headGear: null, chestArmor: null, legArmor: null, handArmor: null },
      inventory: [],
      statusEffect: null,
      mapLayout: [],
      gold: 0,
      experience: 0,
    },
    Mercenary: {
      name: "Mercenary",
      level: 1,
      health: 110,
      mana: 70,
      stamina: 90,
      strength: 15,
      characterPosition: { Floor: 1, row: 1, col: 1 },
      weaponSlot: null,
      armorSlot: { headGear: null, chestArmor: null, legArmor: null, handArmor: null },
      inventory: [],
      statusEffect: null,
      mapLayout: [],
      gold: 0,
      experience: 0,
    },
    Berserker: {
      name: "Berserker",
      level: 1,
      health: 100,
      mana: 30,
      stamina: 40,
      strength: 25,
      characterPosition: { Floor: 1, row: 1, col: 1 },
      weaponSlot: null,
      armorSlot: { headGear: null, chestArmor: null, legArmor: null, handArmor: null },
      inventory: [],
      statusEffect: null,
      mapLayout: [],
      gold: 0,
      experience: 0,
    },
    Knight: {
      name: "Knight",
      level: 1,
      health: 150,
      mana: 40,
      stamina: 100,
      strength: 20,
      characterPosition: { Floor: 1, row: 1, col: 1 },
      weaponSlot: null,
      armorSlot: { headGear: null, chestArmor: null, legArmor: null, handArmor: null },
      inventory: [],
      statusEffect: null,
      mapLayout: [],
      gold: 0,
      experience: 0,
    }
  };

  switch (Name) {
    case "Assassin":{
      const character = classes[Name];
      await populateItemsByClass(character, assassinAllPossibleItemsId);
      return character;
    }
    case "Mage":{
      const character = classes[Name];
      await populateItemsByClass(character, mageAllPossibleItemsId);
      return character;
    }

    case "Warrior":{
      const character = classes[Name];
      await populateItemsByClass(character, warriorAllPossibleItemsId);
      return character;
    }

    case "Mercenary":{
      const character = classes[Name];
      await populateItemsByClass(character, mercenaryAllPossibleItemsId);
      return character;
    }

    case "Berserker":{
      const character = classes[Name];
      await populateItemsByClass(character, berserkerAllPossibleItemsId);
      return character;
    }

    case "Knight":{
      const character = classes[Name];
      await populateItemsByClass(character, knightAllPossibleItemsId);
      return character;
    }
    default:{
      const character = classes["Knight"];
      await populateItemsByClass(character, knightAllPossibleItemsId);
      return character;
    }
  }
}

enum AttackStatus {
  lightAttack = "lightAttack",
  heavyAttack = "heavyAttack",
  specialAttack = "specialAttack",
  null = "null"
}

export interface PlayerEntityInterface{
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
  Attack: {
    status: AttackStatus,
    time: number
  }
  armorSlot?:  {
    head?: Schema.Types.ObjectId | ArmorInterface | null,
    chestPiece: Schema.Types.ObjectId | ArmorInterface | null,
    legs: Schema.Types.ObjectId | ArmorInterface | null,
    arms: Schema.Types.ObjectId | ArmorInterface | null
  };
  inventory: [{
    item: Schema.Types.ObjectId | ItemsInterface,
    quantity: number
  }] | null
  Quest:{
    completedQuest: Schema.Types.ObjectId[] | null | QuestInterfate[]
    currentQuest:{
      isComplete: boolean
      currentTaskIndex: number
      QuestDetail: Schema.Types.ObjectId | null | QuestInterfate
    }
    nextQuest:Schema.Types.ObjectId[] | null | QuestInterfate[]
    sideQuest:Schema.Types.ObjectId[] | null | QuestInterfate[]
  }
  statusEffect: Schema.Types.ObjectId[] | StatusEffectInterface[] | null;
  level: number;
  mapLayout?: Schema.Types.ObjectId[] | MapLayoutInterface[] | null;
  gold: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface rigidBody{
  position:{x:number, y:number, z:number}
  velocity:{x:number, y:number, z:number}
  acceleration:{x:number, y:number, z:number}
  direction:{x:number, y:number, z:number}
  maxSpeed:number
  maxSprintingSpeed:number
  mass:number
  friction:number
  drag:number
}
export interface axeMoveSet{
  attackSpeed: number,
  attackRange: number,
  attackDamage: number,
  attackKnockback: number
  secondAttackTime: number
  thirdAttackTime: number
  fourthAttackTime: number
}

export interface swordMoveSet{
  attackSpeed: number,
  attackRange: number,
  attackDamage: number,
  attackKnockback: number
  secondAttackTime: number
  thirdAttackTime: number
  fourthAttackTime: number
}

export interface bowMoveSet{
  attackSpeed: number,
  attackRange: number,
  attackDamage: number,
  isAimed: boolean
  attackKnockback: number
  secondAttackTime: number
  thirdAttackTime: number
  fourthAttackTime: number
}
export interface AttackState{
  status: AttackStatus
  lastAttacktime: number
  moveSet: {
    axeMoveSet: axeMoveSet,
    swordMoveSet: swordMoveSet,
    bowMoveSet: bowMoveSet
  }
}
const mapToComponents = {
  name: "name",
  mana: "mana",
  health: "health",
  stamina: "stamina",
  strength: "strength",
  weaponSlot: "weaponSlot",
  characterPosition: "characterPosition",
  Attack: "Attack",
  armorSlot: "armorSlot",
  inventory: "inventory",
  Quest: "Quest",
  statusEffect: "statusEffect",
  level: "level",
  mapLayout: "mapLayout",
  gold: "gold",
  experience: "experience",
}

export class PlayerEntity extends ECS {
  constructor(data: CharacterInterface) {
    super()
    for(const [key, componentName] of Object.entries(mapToComponents)){
      this.addComponent(componentName, data[key as keyof CharacterInterface])
    }
    this.addComponent("rigidBody", {
      position: {x: data.characterPosition.col, y: data.characterPosition.row, z: 0},
      velocity: {x: 0, y: 0, z: 0},
      acceleration: {x: 4, y: 0, z: 0},
      direction: {x: 0, y: 0, z: 0},
      mass: 1,
      friction: 30,
      drag: 2,
      maxSpeed: 5,
      maxSprintingSpeed: 7
    }as rigidBody)
    this.addComponent("attack", {
      status: AttackStatus.null,
      lastAttacktime: 0,
      moveSet: {
        axeMoveSet: {
          attackSpeed: 0.5,
          attackRange: 1,
          attackDamage: 1,
          attackKnockback: 0,
          secondAttackTime: 0,
          thirdAttackTime: 0,
          fourthAttackTime: 0
        },
        swordMoveSet: {
          attackSpeed: 0.5,
          attackRange: 1,
          attackDamage: 1,
          attackKnockback: 0,
          secondAttackTime: 1, // if press attack after 1 seconds then that's seconds combo
          thirdAttackTime: 1, // same
          fourthAttackTime: 1 // same
        },
        bowMoveSet: {
          attackSpeed: 0.5,
          attackRange: 1,
          attackDamage: 1,
          attackKnockback: 0,
          secondAttackTime: 0,
          thirdAttackTime: 0,
          fourthAttackTime: 0
        }
      }
    }as AttackState)
    this.addComponent("isJumping", false)
    this.addComponent("isAttacking", false)
    this.addComponent("isSprinting", true)
    this.addComponent("isMoving", true)
    this.addComponent("isWalking", false)
    this.addComponent("tag", "Player")
  }
}



