import { Armor, Character, FloorBoss, FloorEnemy, Item, MapLayout, StatusEffect, Weapon, Quest } from "./dataModel/index.ts"
import type { CharacterInterface, ArmorInterface, FloorBossInterface, FloorEnemyInterface, ItemsInterface, MapLayoutInterface, TileLayoutInterface, StatusEffectInterface, WeaponInterface } from "./dataModel/index.ts"
import { StarterCharacter } from "./utility/index.utility.ts"

export enum ClassType {
  Assassin = "Assassin",
  Mage = "Mage",
  Warrior = "Warrior",
  Mercenary = "Mercenary",
  Berserker = "Berserker",
  Knight = "Knight"
}


class GameState {
  public character: CharacterInterface | null = null
  public mapLayout: MapLayoutInterface[] | null = null
  public chunks: Map<string, TileLayoutInterface[][]> = new Map()
  public static newGameState(Name: string, startingCharacter: ClassType) {
    return new GameState().newGameState(Name, startingCharacter)
  }
  public static continueGameState(CharacterId: string) {
    return new GameState().loadGameState(CharacterId)
  }
  async newGameState(Name: string, startingCharacter: ClassType) {
    this.clearGameState()
    const selectedCharacter = await StarterCharacter(startingCharacter)
    selectedCharacter.name = Name
    return Character.create(selectedCharacter)

  }
  async loadGameState(CharacterId: string) {
    if (!this.character) {
      console.log("no character found")
      const character = await Character.findById(CharacterId)
        .populate([
          { path: "armorSlot.headGear", model: Armor },
          { path: "armorSlot.chestArmor", model: Armor },
          { path: "armorSlot.legArmor", model: Armor },
          { path: "armorSlot.handArmor", model: Armor },
          { path: "inventory.item", model: Item },
          { path: "statusEffect", model: StatusEffect },
          { path: "weaponSlot", model: Weapon },
          { path: "Quest.completedQuest", model: Quest },
          { path: "Quest.currentQuest.QuestDetail", model: Quest },
          { path: "Quest.nextQuest", model: Quest },
          { path: "Quest.sideQuest", model: Quest },
        ])
      if (!character) {
        console.log("no character found")
        return false
      }
      this.character = character
      if (this.character.mapLayout) {
        console.log(this.character.mapLayout)
        const AllFloorData = await MapLayout.find({ _id: { $in: this.character.mapLayout } })
          .populate([
            {
              path: "floorBoss.floorBoss", model: FloorBoss, populate: [
                { path: "weaponSlot", model: Weapon },
                { path: "statusEffect", model: StatusEffect },
                { path: "inventory", model: Item },
              ]
            },
            {
              path: "floorEntitiesSpawnPoints.floorEntity", model: FloorEnemy, populate: [
                { path: "weaponSlot", model: Weapon },
                { path: "inventory", model: Item },
                { path: "statusEffect", model: StatusEffect },
              ]
            },
          ])
        if (AllFloorData) {
          this.mapLayout = AllFloorData
          const currentMapLayout = this.mapLayout[0]
          if (currentMapLayout) {
            this.makeChunks(currentMapLayout, 10)
          }
        }
      }
      return this
    }
  }

  makeChunks(map: MapLayoutInterface, chunkSize: number) {
    const mapHeight = map.layout.length;
    const mapWidth = map.layout[0]?.length || 0;

    for (let cY = 0; cY < mapHeight; cY += chunkSize) {
      for (let cX = 0; cX < mapWidth; cX += chunkSize) {
        let chunkData: TileLayoutInterface[][] = [];

        for (let y = 0; y < chunkSize; y++) {
          const rowIndex = cY + y;
          if (!map.layout[rowIndex]) break; // No row, stop

          const rowSlice = map.layout[rowIndex].slice(cX, cX + chunkSize);
          if (rowSlice.length) chunkData.push(rowSlice);
        }

        if (chunkData.length) {
          this.chunks.set(`${cX / chunkSize}-${cY / chunkSize}`, chunkData);
        }
      }
    }
  }
  clearGameState() {
    this.character = null
    this.mapLayout = null
    this.chunks = new Map()
  }
  getGameState() {
    return {
      character: this.character,
      mapLayout: this.mapLayout,
      chunks: this.chunks
    }
  }
}

export default GameState
