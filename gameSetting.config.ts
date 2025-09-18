import dotenv from "dotenv"

dotenv.config()

export const config = {
  Game: {
    name: process.env.GAME_NAME || "My RPG",
    backGroundUpdate: parseInt(process.env.BACKGROUND_PROCESS || "0.5", 10),
    frogoundUpdate: parseInt(process.env.FROGROUND_PROCESS || "60", 10)
  },
  render: {
    fps: parseInt(process.env.RENDER_FPS || "60", 10),
    renderDistance: parseInt(process.env.RENDER_DISTANCE || "3", 10),
    chunkSize: parseInt(process.env.CHUNK_SIZE || "10", 10),
  },
  limits: {
    maxEntitiesPerChunk: parseInt(process.env.MAX_ENTITIES_PER_CHUNK || "100", 10),
  },
  combat: {
    baseCritChance: parseFloat(process.env.BASE_CRIT_CHANCE || "0.05"),
    globalDamageMultiplier: parseFloat(process.env.GLOBAL_DAMAGE_MULTIPLIER || "1.0"),
    globalStrDamageMultiplier: parseFloat(process.env.GLOBAL_STR_MULTIPLIER || "0.3"),
    globalSpecialDamageMultiplier: parseFloat(process.env.GLOBAL_SPECIAL_ATTACK_MULTIPLIER || '1.7'),

  },
  player: {
    maxHealth: parseInt(process.env.PLAYER_MAX_HEALTH || "100", 10),
    maxStamina: parseInt(process.env.PLAYER_MAX_STAMINA || "100", 10),
    maxMana: parseInt(process.env.PLAYER_MAX_MANA || "50", 10),
    maxSpeed: parseFloat(process.env.MAX_SPEED || ""),
    maxSprintingSpeed: parseFloat(process.env.MAX_SPRINTING_SPEED || ""),
    baseAccle: parseFloat(process.env.BASE_MOVEMENT_FORCE || ""),
    friction: parseFloat(process.env.FRICTION || ""),
    drag: parseFloat(process.env.DRAG || ""),
  },
  enemy: {
    respawnTime: parseInt(process.env.ENEMY_RESPAWN_TIME || "30", 10),
    aggroRange: parseInt(process.env.AGGRO_RANGE || "5", 10),
  },
  db: {
    mongodbUrl: process.env.MONGODB_URL || "",
  },
  debug: {
    debugMode: process.env.DEBUG_MODE === "true",
    logLevel: process.env.LOG_LEVEL || "info",
  },
  user: {
    accessTokenSecret: process.env.JWT_GENERATE_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_GENERATE_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenSecret: process.env.JWT_GENERATE_REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.JWT_GENERATE_REFRESH_TOKEN_EXPIRES_IN
  }
}

