import type { WeaponInterface, WeaponType, ArmorInterface, StatusEffectInterface, MapLayoutInterface, ItemsInterface, QuestInterfate, CharacterInterface } from "../dataModel/index.ts"
import { Weapon, Armor, Item } from "../dataModel/index.ts"
import { Schema } from "mongoose";

type minCharacterSelector = Omit<characterData, "gold" | "characterPosition" | "statusEffect" | "mapLayout" | "experience">

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const clone = { ...obj }
  for (const key of keys) {
    delete clone[key];
  }
  return clone
}

enum ArmorType {
  headGear = "headGear",
  chestArmor = "chestArmor",
  handArmor = "handArmor",
  legArmor = "legArmor"
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
  weaponSlot?: Schema.Types.ObjectId | null | WeaponInterface;
  armorSlot?: {
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

async function populateItemsByClass(character: characterData, WhichPossibleItems: { ItemId: Record<string, string>, weaponId: Record<string, string>, armorId: Record<string, string> }): Promise<void> {
  const { ItemId, weaponId, armorId } = WhichPossibleItems;
  const Items = await Item.find({ name: { $in: Object.values(ItemId) } }).select({ _id: 1 });
  const Weapons = await Weapon.find({ name: { $in: Object.values(weaponId) } }).select({ _id: 1 });
  const Armors = await Armor.find({ setsName: { $in: Object.values(armorId) } }).select({ _id: 1, type: 1 });
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
    if (character.armorSlot) {
      if (item.type === ArmorType.headGear) {
        character.armorSlot.headGear = item._id as Schema.Types.ObjectId
      }
      if (item.type === ArmorType.chestArmor) {
        character.armorSlot.chestArmor = item._id as Schema.Types.ObjectId
      }
      if (item.type === ArmorType.handArmor) {
        character.armorSlot.handArmor = item._id as Schema.Types.ObjectId
      }
      if (item.type === ArmorType.legArmor) {
        character.armorSlot.legArmor = item._id as Schema.Types.ObjectId
      }
    }
  })
}
export const StarterCharacter = async (Name?: string, isMinState?: boolean): Promise<characterData | Record<string, minCharacterSelector>> => {
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
  if (isMinState) {
    const lookUpTable = {
      Assassin: assassinAllPossibleItemsId,
      Mage: mageAllPossibleItemsId,
      Warrior: warriorAllPossibleItemsId,
      Mercenary: mercenaryAllPossibleItemsId,
      Berserker: berserkerAllPossibleItemsId,
      Knight: knightAllPossibleItemsId
    }
    const finishObject: Record<string, minCharacterSelector> = {}
    for (const className in classes) {
      const key = className as keyof typeof lookUpTable
      const classData = { ...classes[className] }
      await populateItemsByClass(classData as characterData, lookUpTable[key])
      const striped = omit(classData, ["gold", "characterPosition", "statusEffect", "mapLayout", "experience"])
      finishObject[className] = striped
    }
    return finishObject
  }

  switch (Name) {
    case "Assassin": {
      const character = classes[Name];
      await populateItemsByClass(character, assassinAllPossibleItemsId);
      return character;
    }
    case "Mage": {
      const character = classes[Name];
      await populateItemsByClass(character, mageAllPossibleItemsId);
      return character;
    }

    case "Warrior": {
      const character = classes[Name];
      await populateItemsByClass(character, warriorAllPossibleItemsId);
      return character;
    }

    case "Mercenary": {
      const character = classes[Name];
      await populateItemsByClass(character, mercenaryAllPossibleItemsId);
      return character;
    }

    case "Berserker": {
      const character = classes[Name];
      await populateItemsByClass(character, berserkerAllPossibleItemsId);
      return character;
    }

    case "Knight": {
      const character = classes[Name];
      await populateItemsByClass(character, knightAllPossibleItemsId);
      return character;
    }
    default: {
      const character = classes["Knight"];
      await populateItemsByClass(character, knightAllPossibleItemsId);
      return character;
    }
  }
}
