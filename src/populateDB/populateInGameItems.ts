import type {Request, Response, NextFunction} from "express"
import {Item, Weapon, Armor} from "../dataModel/index.ts"
export async function populateBaseItems(req: Request, res: Response, next: NextFunction) {
  console.log("populating items")
  const items = [
    {
      "name": "Elixir of Vitality",
      "type": "consumable",
      "weight": 0.5,
      "image": "elixir_vitality.png",
      "description": "A mystical potion brewed from rare herbs in the sacred groves of Lyrandel, capable of restoring a knight's health in the midst of battle.",
    },
    {
      "name": "Phantom Essence",
      "type": "consumable",
      "weight": 0.3,
      "image": "phantom_essence.png",
      "description": "A shimmering elixir that replenishes a mage's magical energy, crafted from enchanted water and rare crystals.",
    },
    {
      "name": "Stalwart Draught",
      "type": "consumable",
      "weight": 0.4,
      "image": "stalwart_draught.png",
      "description": "A robust brew that revives the body’s endurance, allowing warriors and mercenaries to press on through the fiercest battles.",
    },
    {
      "name": "Silent Lockpick",
      "type": "nonConsumable",
      "weight": 0.1,
      "image": "silent_lockpick.png",
      "description": "A finely crafted tool that enables the assassin to unlock hidden doors and bypass security without a sound, essential for covert operations.",
    },
    {
      "name": "Arcane Elixir",
      "type": "consumable",
      "weight": 0.3,
      "image": "arcane_elixir.png",
      "description": "A potent magical potion that restores a mage’s mana. Brewed from rare, enchanted flora, it is a treasured resource for spellcasters in the heat of battle.",
    },
    {
      "name": "Berserker’s Ragebrew",
      "type": "consumable",
      "weight": 0.6,
      "image": "berserker_ragebrew.png",
      "description": "A fiery concoction said to awaken ancient fury, boosting the Berserker’s strength and reducing incoming damage for a short time.",
    },
    {
      "name": "Mercenary Toolkit",
      "type": "nonConsumable",
      "weight": 0.8,
      "image": "mercenary_toolkit.png",
      "description": "A rugged set of survival tools, including grappling wire, smoke pellets, and spare arrows—ideal for any mercenary navigating unknown territories.",
    },
    {
      "name": "Warrior’s Grit",
      "type": "consumable",
      "weight": 0.5,
      "image": "warrior_grit.png",
      "description": "A hardened ration soaked in battle-honey and root extracts. Grants a temporary boost to defense and stamina recovery.",
    },
    {
      "name": "Battle Bandage",
      "type": "consumable",
      "weight": 0.2,
      "image": "battle_bandage.png",
      "description": "Quickly applied to seal wounds mid-combat, this tightly wound cloth is soaked in healing balm and stitched with elven thread.",
    }
  ]

  const BaseWeapon = [
    {
      "name": "Shadow’s Edge",
      "damage": 15,
      "manaCost": 0,
      "staminaCost": 5,
      "type": "dagger",
      "weight": 1,
      "image": "shadows_edge.png",
      "effect": null,
      "description": "A swift, razor-sharp dagger that gleams with an eerie light—a favorite among assassins for silent and deadly strikes.",
    },
    {
      "name": "Nightstalker Bow",
      "damage": 12,
      "manaCost": 0,
      "staminaCost": 8,
      "type": "bow",
      "weight": 2,
      "image": "nightstalker_bow.png",
      "effect": null,
      "description": "A compact, precise bow that allows the assassin to strike from a distance, its design optimized for stealth and rapid draw.",
    },
    {
      "name": "Dragon’s Bane",
      "damage": 25,
      "manaCost": 0,
      "staminaCost": 15,
      "type": "longSword",
      "weight": 5,
      "image": "dragons_bane.png",
      "effect": null,
      "description": "A massive greatsword forged in the ancient fires, renowned for its ability to cleave through armor and inspire fear in foes. A symbol of a knight’s might and honor.",
    },
    {
      "name": "Celestial Staff",
      "damage": 18,
      "manaCost": 10,
      "staminaCost": 5,
      "type": "staff",
      "weight": 3,
      "image": "celestial_staff.png",
      "effect": null,
      "description": "A majestic staff imbued with celestial energy, channeling powerful long-range spells that strike enemies with the force of starlight.",
    },
    {
      "name": "Arcane Scepter",
      "damage": 14,
      "manaCost": 8,
      "staminaCost": 4,
      "type": "staff",
      "weight": 2.5,
      "image": "arcane_scepter.png",
      "effect": null,
      "description": "A refined scepter that channels focused bursts of arcane energy at a moderate range, allowing for precise magical strikes.",
    },
    {
      "name": "Runeblade Dagger",
      "damage": 10,
      "manaCost": 5,
      "staminaCost": 3,
      "type": "dagger",
      "weight": 1,
      "image": "runeblade_dagger.png",
      "effect": null,
      "description": "A small, enchanted dagger inscribed with ancient runes, used for close-quarters magic strikes when spells must be delivered swiftly.",
    },
    {
      "name": "Bloodreaver Axe",
      "damage": 22,
      "manaCost": 0,
      "staminaCost": 12,
      "type": "axe",
      "weight": 4.5,
      "image": "bloodreaver_axe.png",
      "effect": null,
      "description": "Favored by Berserkers, this brutal axe feasts on the chaos of battle, each kill igniting its blood-red runes with ancient fury.",
    },
    {
      "name": "Crossblade Saber",
      "damage": 17,
      "manaCost": 0,
      "staminaCost": 10,
      "type": "longSword",
      "weight": 3,
      "image": "crossblade_saber.png",
      "effect": null,
      "description": "A dual-edged saber tailored for fast, adaptable strikes. Used by mercenaries who must be ready for anything.",
    },
    {
      "name": "Oathkeeper Blade",
      "damage": 20,
      "manaCost": 0,
      "staminaCost": 13,
      "type": "longSword",
      "weight": 4,
      "image": "oathkeeper_blade.png",
      "effect": null,
      "description": "A heavy blade that balances power and precision. Trusted by warriors who live by their word and fight with honor.",
    }
  ]
  const armor = [
    {
      "setsName": "Mage's Veil Hood",
      "type": "headGear",
      "durability": 40,
      "physicalDefense": 5,
      "fireDefense": 15,
      "poisonDefense": 10,
      "staminaCost": 3,
      "weight": 1.2,
      "image": "mage_veil_hood.png",
      "description": "A mystical hood woven from moonthread, offering magical protection and clarity to the minds of spellcasters."
    },
    {
      "setsName": "Knight's Iron Helm",
      "type": "headGear",
      "durability": 80,
      "physicalDefense": 20,
      "fireDefense": 5,
      "poisonDefense": 5,
      "staminaCost": 6,
      "weight": 3.5,
      "image": "knight_iron_helm.png",
      "description": "A sturdy iron helm once worn by royal guards, known for its endurance in long sieges."
    },
    {
      "setsName": "Warrior’s Crest Helm",
      "type": "headGear",
      "durability": 70,
      "physicalDefense": 18,
      "fireDefense": 7,
      "poisonDefense": 6,
      "staminaCost": 5,
      "weight": 3.2,
      "image": "warrior_crest_helm.png",
      "description": "Forged for frontline warriors, this helm bears the sigil of a long-forgotten champion."
    },
    {
      "setsName": "Mercenary’s Visor",
      "type": "headGear",
      "durability": 50,
      "physicalDefense": 12,
      "fireDefense": 5,
      "poisonDefense": 8,
      "staminaCost": 4,
      "weight": 2.5,
      "image": "mercenary_visor.png",
      "description": "Lightweight and sleek, this visor is favored by bounty hunters for its balance of defense and agility."
    },
    {
      "setsName": "Berserker’s Horned Helm",
      "type": "headGear",
      "durability": 75,
      "physicalDefense": 16,
      "fireDefense": 10,
      "poisonDefense": 4,
      "staminaCost": 6,
      "weight": 3.8,
      "image": "berserker_horned_helm.png",
      "description": "Topped with ceremonial horns, this helm inspires fear and fury on the battlefield."
    },
    {
      "setsName": "Mage's Ethereal Robe",
      "type": "chestArmor",
      "durability": 60,
      "physicalDefense": 6,
      "fireDefense": 20,
      "poisonDefense": 12,
      "staminaCost": 4,
      "weight": 2.0,
      "image": "mage_ethereal_robe.png",
      "description": "Infused with arcane runes, this robe enhances spellcasting and resists flame."
    },
    {
      "setsName": "Knight's Oathplate",
      "type": "chestArmor",
      "durability": 120,
      "physicalDefense": 35,
      "fireDefense": 10,
      "poisonDefense": 8,
      "staminaCost": 8,
      "weight": 6.5,
      "image": "knight_oathplate.png",
      "description": "A gleaming breastplate passed down through knightly orders, forged with sacred steel."
    },
    {
      "setsName": "Warrior’s Battleplate",
      "type": "chestArmor",
      "durability": 100,
      "physicalDefense": 30,
      "fireDefense": 12,
      "poisonDefense": 9,
      "staminaCost": 7,
      "weight": 5.8,
      "image": "warrior_battleplate.png",
      "description": "Built for brute force, this armor provides resilience in long melee engagements."
    },
    {
      "setsName": "Mercenary’s Reinforced Vest",
      "type": "chestArmor",
      "durability": 80,
      "physicalDefense": 22,
      "fireDefense": 8,
      "poisonDefense": 12,
      "staminaCost": 5,
      "weight": 4.2,
      "image": "mercenary_vest.png",
      "description": "A layered vest with hidden compartments and steel lining, ideal for skirmishes."
    },
    {
      "setsName": "Berserker’s Warhide",
      "type": "chestArmor",
      "durability": 90,
      "physicalDefense": 25,
      "fireDefense": 14,
      "poisonDefense": 6,
      "staminaCost": 6,
      "weight": 5.0,
      "image": "berserker_warhide.png",
      "description": "Made from beast-hide and bone plates, this armor sacrifices grace for brutal protection."
    },
    {
      "setsName": "Mage's Silk Gloves",
      "type": "handArmor",
      "durability": 30,
      "physicalDefense": 3,
      "fireDefense": 10,
      "poisonDefense": 8,
      "staminaCost": 2,
      "weight": 0.8,
      "image": "mage_silk_gloves.png",
      "description": "Delicate gloves enchanted to channel energy smoothly, ideal for spell weaving."
    },
    {
      "setsName": "Knight’s Gauntlets",
      "type": "handArmor",
      "durability": 60,
      "physicalDefense": 14,
      "fireDefense": 4,
      "poisonDefense": 4,
      "staminaCost": 4,
      "weight": 2.0,
      "image": "knight_gauntlets.png",
      "description": "Heavy-duty gauntlets that guard against crushing blows in close combat."
    },
    {
      "setsName": "Warrior’s Grips",
      "type": "handArmor",
      "durability": 55,
      "physicalDefense": 12,
      "fireDefense": 5,
      "poisonDefense": 5,
      "staminaCost": 3,
      "weight": 1.8,
      "image": "warrior_grips.png",
      "description": "Worn by shieldbreakers and duelists, these gloves allow a firm weapon hold."
    },
    {
      "setsName": "Mercenary’s Bracers",
      "type": "handArmor",
      "durability": 50,
      "physicalDefense": 10,
      "fireDefense": 3,
      "poisonDefense": 6,
      "staminaCost": 2,
      "weight": 1.5,
      "image": "mercenary_bracers.png",
      "description": "Light bracers lined with chainmail, offering flexibility and modest defense."
    },
    {
      "setsName": "Berserker’s Clawguards",
      "type": "handArmor",
      "durability": 60,
      "physicalDefense": 13,
      "fireDefense": 6,
      "poisonDefense": 3,
      "staminaCost": 3,
      "weight": 2.2,
      "image": "berserker_clawguards.png",
      "description": "These savage gauntlets end in sharpened edges for brawling fury."
    },
    {
      "setsName": "Mage's Woven Legwraps",
      "type": "legArmor",
      "durability": 35,
      "physicalDefense": 4,
      "fireDefense": 12,
      "poisonDefense": 10,
      "staminaCost": 3,
      "weight": 1.0,
      "image": "mage_legwraps.png",
      "description": "Soft, enchanted fabric that glows with ambient mana, designed for fluid movement."
    },
    {
      "setsName": "Knight’s Greaves",
      "type": "legArmor",
      "durability": 90,
      "physicalDefense": 22,
      "fireDefense": 6,
      "poisonDefense": 6,
      "staminaCost": 5,
      "weight": 3.5,
      "image": "knight_greaves.png",
      "description": "Immovable leg armor reinforced for shield walls and defensive formations."
    },
    {
      "setsName": "Warrior’s Warboots",
      "type": "legArmor",
      "durability": 85,
      "physicalDefense": 20,
      "fireDefense": 8,
      "poisonDefense": 7,
      "staminaCost": 4,
      "weight": 3.0,
      "image": "warrior_warboots.png",
      "description": "Solid boots that keep warriors grounded during heavy strikes and charges."
    },
    {
      "setsName": "Mercenary’s Leather Trousers",
      "type": "legArmor",
      "durability": 70,
      "physicalDefense": 16,
      "fireDefense": 5,
      "poisonDefense": 9,
      "staminaCost": 3,
      "weight": 2.5,
      "image": "mercenary_trousers.png",
      "description": "Comfortable and durable, these trousers are favored for mobility and stealth."
    },
    {
      "setsName": "Berserker’s Ragelegs",
      "type": "legArmor",
      "durability": 80,
      "physicalDefense": 18,
      "fireDefense": 10,
      "poisonDefense": 4,
      "staminaCost": 4,
      "weight": 3.2,
      "image": "berserker_ragelegs.png",
      "description": "Built for aggression, these leggings amplify bloodlust while offering solid protection."
    }
  ];

  const existingItems = (await Item.find({}, "name")).map(item => item.name.trim().toLowerCase())
  const existingBaseWeapon = (await Weapon.find({}, "name")).map(item => item.name.trim().toLowerCase())
  const existingBaseArmor = (await Armor.find({}, "setsName")).map(item => item.setsName.trim().toLowerCase())

  const newAddArmor = armor.filter(item => !existingBaseArmor.includes(item.setsName.trim().toLowerCase()))
  const newAddItems = items.filter(item => !existingItems.includes(item.name.trim().toLowerCase()))
  const newAddWeapon = BaseWeapon.filter(item => !existingBaseWeapon.includes(item.name.trim().toLowerCase()))

  if(newAddArmor.length > 0){
    try{
      const insertedArmor = await Armor.insertMany(newAddArmor, {ordered: false})
      console.log("Successfully inserted armor:", insertedArmor.map(item => item.setsName))
    }catch(e){
      console.log("Failed to insert armor", newAddArmor.map(item => item.setsName),e)
      return res.status(400).json({message: "Error in inserting armor", error: e, success: false})
    }
  }

  if(newAddItems.length > 0){
    try{
      const insertedItems = await Item.insertMany(newAddItems, {ordered: false})
      console.log("Successfully inserted items:", insertedItems.map(item => item.name))
    }catch(e){
      console.log("Failed to insert items", newAddItems.map(item => item.name),e)
      return res.status(400).json({message: "Error in inserting items", error: e, success: false})
    }
  }

  if(newAddWeapon.length > 0){
    try{
      const insertedWeapons = await Weapon.insertMany(newAddWeapon, { ordered: false })
      console.log("Successfully inserted weapons:", insertedWeapons.map(w => w.name))
    }catch(e){
      console.log("Failed to insert weapon", newAddWeapon.map(item => item.name),e)
      return res.status(400).json({message: "Error in inserting Weapon", error: e, success: false})
    }
  }
  if(newAddItems.length === 0 && newAddWeapon.length === 0 && newAddArmor.length === 0){
    console.log("No new items to insert")
  }

  return res.status(200).json({
    message: "Items inserted successfully",
    insertedArmor: newAddArmor.length,
    insertedItems: newAddItems.length,
    insertedBaseWeapon: newAddWeapon.length,
    success: true,
  })
}

