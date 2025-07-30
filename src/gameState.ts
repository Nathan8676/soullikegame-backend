import { Armor, Character, FloorBoss, FloorEnemy, Item , MapLayout, StatusEffect, Weapon, Quest} from "./dataModel/index.ts"
import type { CharacterInterface, ArmorInterface, FloorBossInterface, FloorEntitiesInterface, ItemsInterface, MapLayoutInterface, TileLayoutInterface, StatusEffectInterface, WeaponInterface} from "./dataModel/index.ts"
import { StarterCharacter } from "./Entites/PlayerEntity.ts"

export enum ClassType {
  Assassin = "Assassin",
  Mage = "Mage",
  Warrior = "Warrior",
  Mercenary = "Mercenary",
  Berserker = "Berserker",
  Knight = "Knight"
}

type coordinate = {
  x: number,
  y: number
}

class GameState {
  private character: CharacterInterface | null = null
  private mapLayout: MapLayoutInterface[] | null = null
  private mapSet: Map<string, coordinate[]> = new Map()
  public static newGameState(Name: string, startingCharacter: ClassType){
    return new GameState().newGameState(Name, startingCharacter)
  }
  public static continueGameState(CharacterId: string){
    return new GameState().loadGameState(CharacterId)
  }
  async newGameState(Name: string, startingCharacter: ClassType){
    this.clearGameState()
    const character = await StarterCharacter(startingCharacter)
    character.name = Name
    Character.create(character)
    return character
  }
  async loadGameState(CharacterId: string){
    if(!this.character){
      console.log("no character found")
      const character = await Character.findById(CharacterId)
      .populate([
        {path: "armorSlot.headGear", model: Armor},
        {path: "armorSlot.chestArmor", model: Armor},
        {path: "armorSlot.legArmor", model: Armor},
        {path: "armorSlot.handArmor", model: Armor},
        {path: "inventory.item", model: Item},
        {path: "statusEffect", model: StatusEffect},
        {path: "weaponSlot", model: Weapon},
        {path: "Quest.completedQuest", model: Quest},
        {path: "Quest.currentQuest.QuestDetail", model: Quest},
        {path: "Quest.nextQuest", model: Quest},
        {path: "Quest.sideQuest", model: Quest},
      ])
      if(!character){
        console.log("no character found")
        return false
      }
      console.log("character game/progress loaded", character)
      this.character = character
      if(this.character.mapLayout){
        const AllFloorData = await MapLayout.find({id:{$in: this.character.mapLayout}})
        .populate([
          {path: "floorBoss.boss", model: FloorBoss, populate:[
            {path: "weaponSlot", model: Weapon},
            {path: "statusEffect", model: StatusEffect},
            {path: "inventory", model: Item},
          ]},
          {path: "floorEntitiesSpawnPoints.floorEntities", model: FloorEnemy, populate:[
            {path: "weaponSlot", model: Weapon},
            {path: "inventory", model: Item},
            {path: "statusEffect", model: StatusEffect},
          ]},
        ])
        if(AllFloorData){
          this.mapLayout = AllFloorData
        }
      }
      return {Character:this.character, MapLayout:this.mapLayout}
    }
  }
  clearGameState(){
    this.character = null
    this.mapLayout = null
    this.mapSet = new Map()
  }
  getGameState(){
    return {
      character: this.character,
      mapLayout: this.mapLayout
    }
  }
}

export default GameState
