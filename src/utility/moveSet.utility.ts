import type { WeaponType } from "../dataModel"
export interface AttackStep {
  minTime: number
  maxTime: number
  damageMultiplier: number
  knockBack?: number
  speedMultiplier?: number
}
export interface WeaponMoveSetInterface {
  attackSpeed: number,
  attackRange: number
  isAimed?: boolean
  attackSteps: AttackStep[]
}


export const weaponMoveSets: Record<WeaponType, WeaponMoveSetInterface> = {
  shortSword: {
    attackSpeed: 1.0,
    attackRange: 1.5,
    attackSteps: [
      { minTime: 0.2, maxTime: 1.0, damageMultiplier: 1.0, knockBack: 2 },
      { minTime: 0.3, maxTime: 1.2, damageMultiplier: 1.2, knockBack: 3 },
      { minTime: 0.4, maxTime: 1.4, damageMultiplier: 1.4, knockBack: 4 },
    ],
  },

  longSword: {
    attackSpeed: 0.8,
    attackRange: 2.0,
    attackSteps: [
      { minTime: 0.4, maxTime: 1.2, damageMultiplier: 1.2, knockBack: 3 },
      { minTime: 0.5, maxTime: 1.4, damageMultiplier: 1.5, knockBack: 4 },
      { minTime: 0.6, maxTime: 1.6, damageMultiplier: 1.8, knockBack: 5 },
    ],
  },

  dagger: {
    attackSpeed: 1.5,
    attackRange: 1.2,
    attackSteps: [
      { minTime: 0.15, maxTime: 0.8, damageMultiplier: 0.8, knockBack: 1 },
      { minTime: 0.2, maxTime: 0.9, damageMultiplier: 1.0, knockBack: 1 },
      { minTime: 0.25, maxTime: 1.0, damageMultiplier: 1.3, knockBack: 2 },
      { minTime: 0.3, maxTime: 1.2, damageMultiplier: 1.6, knockBack: 2 },
    ],
  },

  staff: {
    attackSpeed: 1.0,
    attackRange: 2.5,
    attackSteps: [
      { minTime: 0.8, maxTime: 1.5, damageMultiplier: 1.0, knockBack: 2 },
    ],
  },

  bow: {
    attackSpeed: 1.2,
    attackRange: 8.0,
    attackSteps: [
      { minTime: 0.7, maxTime: 1.5, damageMultiplier: 1.2, speedMultiplier: 0.9 },
    ],
  },

  axe: {
    attackSpeed: 0.7,
    attackRange: 2.2,
    attackSteps: [
      { minTime: 0.6, maxTime: 1.6, damageMultiplier: 1.5, knockBack: 5 },
      { minTime: 0.8, maxTime: 1.8, damageMultiplier: 2.0, knockBack: 6 },
    ],
  },
};

export function getWeaponMoveSet(type: WeaponType): WeaponMoveSetInterface {
  const moveSet = weaponMoveSets[type]
  return moveSet
}
