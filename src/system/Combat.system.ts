import type { WeaponMoveSetInterface } from "../utility/moveSet.utility";
import { assertSoftDefined } from "../utility/assert.utility";
import { ECS } from "../Entites/baseEntity";
import { config } from "../../gameSetting.config";
import type { TileLayoutInterface } from "../dataModel";
import { dotProduct, normalize, distance } from "../physics/physics";
import { getWeaponMoveSet } from "../utility/moveSet.utility";
import type { rigidBody } from "../Entites/PlayerEntity";
import type { AttackState, AttackType } from "../Entites/PlayerEntity";
import { AttackType as AttackTypeValue } from "../Entites/PlayerEntity";
import type { WeaponType, WeaponInterface } from "../dataModel";

export function combatSystem(entities: ECS[], deltaTime: number, chunk: Map<string, TileLayoutInterface[][]>, globalTime: number) {
  const entitiesInCombat = entities.filter((en) => {
    let rb = assertSoftDefined<rigidBody>(en.getComponent<rigidBody>("rigidBody"), `missing rigidBody ${en.id}`)
    let isAlive = assertSoftDefined<boolean>(en.getComponent("isAlive"), `missing isAlive ${en.id}`)
    let attackState = assertSoftDefined(en.getComponent<AttackState>("attackState"), `missing attackState ${en.id}`)
    if (rb === null && isAlive === null && attackState === null) return false
    return attackState?.status !== AttackTypeValue.null
  })

  for (const entity of entitiesInCombat) {
    const weapon = entity.getComponent<WeaponInterface>("weaponSlot")
    if (!weapon) {
      // do basic attack with fist and all 
      // impliment this later 
      return
    }
    const weaponType = weapon.type
    const entityRb = entity.getComponent<rigidBody>("rigidBody")!
    const attackState = entity.getComponent<AttackState>("attackState")!
    const moveSet = assertSoftDefined<WeaponMoveSetInterface>(getWeaponMoveSet(weaponType), `Weapon moveset is missing for entity of ${entity.id}`)
    const targets = getEntitiesInfront(entity, entitiesInCombat, moveSet?.attackRange!)
    const lastAttackTime = globalTime - attackState.lastAttacktime
    let weaponDamage = weapon.damage
    let entityStrangth = assertSoftDefined<number>(entity.getComponent<number>("strength"), `entity is missing Strangth Attibute. Id ${entity.id} `)
    let strDam = entityStrangth ?? 1 * config.combat.globalStrDamageMultiplier
    let baseDamage = weaponDamage + strDam // this is a base damage going to add light or heavy or specail scaler on next step in if blocks
    let finalDamage = 0

    if (moveSet) {
      const result = calDamgAttackStep(baseDamage, moveSet, attackState, lastAttackTime)
      if (result === 'que') continue
      finalDamage = result
    }
    entity.updateComponent<AttackState>("attackState", attackState)
    // apply the final Damage to the targeted entities
    targets.forEach((tr) => {
      // doing trb! like this cause at filter we have check for rb for all entity that are in system but don't know about any thing in it like trb.anyitem cause be null or undefined. how can we do recercively check?
      const trb = assertSoftDefined<rigidBody>(tr.getComponent<rigidBody>("rigidBody"), `rigidBody is missing on ${tr.id}`)!
      const knockBackStr = (moveSet?.attackSteps[attackState.comboStep].knockBack ?? 0) * (finalDamage / 100);
      const knockBackDir = normalize({
        x: trb.position.x - entityRb.position.x,
        y: trb.position.y - entityRb.position.y
      })
      const knockBack = {
        x: knockBackDir.x * knockBackStr,
        y: knockBackDir.y * knockBackStr,
      }
      const health = assertSoftDefined<number>(tr.getComponent<number>("health"), `health is missing on ${tr.id}`)
      const finalHealth = health ?? 0 - finalDamage
      if (finalHealth <= 0) {
        tr.updateComponent<rigidBody>("rigidBody", {
          ...trb,
          acceleration: { x: knockBack.x + trb.acceleration.x, y: knockBack.y + trb.acceleration.y, z: trb.acceleration.z }
        })
        tr.updateComponent<boolean>("isAlive", false)
      } else {
        tr.updateComponent<rigidBody>("rigidBody", {
          ...trb,
          acceleration: { x: knockBack.x + trb.acceleration.x, y: knockBack.y + trb.acceleration.y, z: trb.acceleration.z }
        })
      }
    })
  }
}

function getEntitiesInfront(entity: ECS, entitiesTarget: ECS[], AttackRange: number) {
  const rb = entity.getComponent<rigidBody>("rigidBody")
  if (!rb) return []
  const pos = rb.position
  const facingDir = normalize(rb.direction)

  return entitiesTarget.filter(target => {
    if (target.id === entity.id) return

    const trb = target.getComponent<rigidBody>("rigidBody");
    if (!trb) return false
    const toTarget = normalize({
      x: trb.position.x - pos.x,
      y: trb.position.y - pos.y
    })
    const alignment = dotProduct(facingDir, toTarget)

    if (alignment > 0.7) {
      return distance(pos, trb.position) < AttackRange
    }
    return false
  })
}

function rollCrit(baseDam: number): number {
  const critChance = config.combat.baseCritChance ?? 0.05
  const critMultipler = 2.0
  if (Math.random() < critChance) {
    return baseDam * critMultipler
  }
  return baseDam
}


function calDamgAttackStep(baseDamage: number, moveSet: WeaponMoveSetInterface, attackState: AttackState, lastAttackTime: number) {
  const possibleStep = moveSet.attackSteps.length
  if (possibleStep < attackState.comboStep) {
    attackState.comboStep = 0
    return calDamgAttackStep(baseDamage, moveSet, attackState, lastAttackTime)
  }

  const { maxTime, minTime, damageMultiplier, speedMultiplier } = moveSet.attackSteps[attackState.comboStep]

  const attackSpeedFactor = moveSet.attackSpeed * (speedMultiplier ?? 1)

  const scaledMinTime = attackSpeedFactor / minTime
  const scaledMaxTime = attackSpeedFactor / maxTime

  if (lastAttackTime < scaledMinTime) {
    attackState.queued = true
    return "que"
  }

  if (lastAttackTime > scaledMinTime && lastAttackTime < scaledMaxTime) {
    const finalDamage = baseDamage * damageMultiplier * config.combat.globalDamageMultiplier
    attackState.comboStep = (attackState.comboStep + 1) % possibleStep
    return rollCrit(finalDamage)
  }
  if (lastAttackTime > scaledMaxTime) {
    attackState.comboStep = 0
    return calDamgAttackStep(baseDamage, moveSet, attackState, lastAttackTime)
  }
  return 0
}

