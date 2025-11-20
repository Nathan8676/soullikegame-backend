# 🎮 Soul-Like 2D Browser Game

> A browser-based, souls-inspired 2D action RPG built from scratch with a custom Entity Component System (ECS) architecture.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.2-black.svg)](https://bun.sh/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.10-green.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-white.svg)](https://socket.io/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Game Systems](#game-systems)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)

---

## 🎯 Overview

This project is a **real-time multiplayer 2D action RPG** inspired by souls-like gameplay mechanics, built entirely for the browser. The game features a custom-built game engine with ECS architecture, real-time combat, and a tile-based world system.

### Vision

Create a technically sophisticated, browser-native game that demonstrates:
- ✅ Deep understanding of game engine architecture
- ✅ Real-time multiplayer networking
- ✅ Complex state management across client-server boundaries
- ✅ Performance optimization for web-based games

### Current Status

🚧 **Active Development** - Core systems implemented, content creation in progress

- ✅ Backend engine (ECS, Physics, Combat)
- ✅ Authentication & Session Management
- ✅ Database Schema & Population Scripts
- 🚧 Frontend Renderer (separate repo)
- 🚧 Map Design Pipeline (Tiled integration)

---

## ✨ Key Features

### Game Engine
- **Custom ECS Architecture** - High-performance entity-component system with dirty state tracking
- **Physics System** - Force-based movement with friction, drag, and collision detection
- **Combat System** - Weapon-specific movesets with combo timing, critical hits, and knockback
- **Real-time Networking** - Optimized state synchronization using priority queues

### Gameplay
- **6 Character Classes** - Assassin, Mage, Warrior, Mercenary, Berserker, Knight
- **Weapon Variety** - 9 weapon types with unique movesets and attack patterns
- **Souls-like Combat** - Timing-based attacks, stamina management, challenging encounters
- **Tile-based World** - Layered map system with metadata support

### Technical Highlights
- **Dirty Component Tracking** - Only changed data is transmitted over network
- **Session Management** - Isolated game loops per player with background processing
- **Chunk-based Rendering** - Efficient map loading and rendering distance optimization
- **JWT Authentication** - Secure token-based auth with refresh token rotation

---

## 🏗️ Architecture

### High-Level Design

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│                 │ ◄─────────────────────────► │                 │
│  React Client   │                             │  Backend Server │
│  (Canvas/UI)    │     State Updates           │   (Game Loop)   │
│                 │ ◄───────────────────────────│                 │
└─────────────────┘                             └─────────────────┘
                                                         │
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   ECS Manager   │
                                                │   - Entities    │
                                                │   - Systems     │
                                                │   - Dirty Queue │
                                                └─────────────────┘
                                                         │
                        ┌────────────────────────────────┼────────────────────────────────┐
                        │                                │                                │
                        ▼                                ▼                                ▼
                ┌───────────────┐              ┌───────────────┐              ┌───────────────┐
                │Movement System│              │Combat System  │              │   AI System   │
                └───────────────┘              └───────────────┘              └───────────────┘
```

### ECS Flow

```typescript
// 1. Entity Creation
const player = new PlayerEntity(characterData);
ecsManager.addEntity(player);

// 2. System Processing (60 FPS)
movementSystem(entities, deltaTime, ecsManager);
combatSystem(entities, deltaTime, ecsManager);

// 3. Dirty Component Collection
const { lowPriority, highPriority } = entity.getDirtyComponents();
ecsManager.addDirtyComponentsForQueues(entityId, highPriority, 'high');

// 4. Network Transmission
socket.emit("World:updateHigh", highPriorityData);
socket.emit("World:updateLow", lowPriorityData);
```

### Data Flow

1. **Input** → Client sends player action via Socket.IO
2. **Processing** → Backend ECS processes action through relevant systems
3. **State Change** → Components marked as "dirty"
4. **Sync** → Only dirty components sent to clients
5. **Render** → Client updates canvas based on received state

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime with built-in TypeScript support
- **Framework**: Express.js - HTTP server and REST API
- **Real-time**: Socket.IO - WebSocket communication
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (jsonwebtoken + bcrypt)

### Frontend (Separate Repo)
- **Framework**: React + Vite
- **Rendering**: HTML5 Canvas API
- **Styling**: Tailwind CSS
- **State**: Socket.IO Client

### Development Tools
- **Language**: TypeScript
- **Map Editor**: Tiled Map Editor
- **Art**: LibreSprite (pixel art)
- **Validation**: Zod schemas

---

## 🚀 Getting Started

### Prerequisites

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# MongoDB running locally or connection string
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/soullikegame-backend.git
cd soullikegame-backend

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secrets
```

### Environment Variables

```env
# Database
MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=soulLikeGame

# JWT Secrets
JWT_GENERATE_ACCESS_TOKEN_SECRET=your-secret-here
JWT_GENERATE_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_GENERATE_REFRESH_TOKEN_SECRET=your-refresh-secret-here
JWT_GENERATE_REFRESH_TOKEN_EXPIRES_IN=7d

# Game Configuration
RENDER_FPS=60
RENDER_DISTANCE=3
CHUNK_SIZE=10
MAX_ENTITIES_PER_CHUNK=100

# Player Stats
PLAYER_MAX_HEALTH=100
PLAYER_MAX_STAMINA=100
PLAYER_MAX_MANA=50

# Combat
BASE_CRIT_CHANCE=0.05
GLOBAL_DAMAGE_MULTIPLIER=1.0
```

### Running the Server

```bash
# Development mode with hot reload
bun run dev

# Production mode
bun run index.ts
```

### Database Population


```bash
# Populate base items (weapons, armor, consumables)
curl http://localhost:8080/population/test

# Populate floor enemies
curl http://localhost:8080/population/floor-enemy

# Populate floor bosses
curl http://localhost:8080/population/floor-boss

# Populate map data
curl http://localhost:8080/population/mapdata
```

To Add data or make changes naviget to  populateDB/ dir and add/change any Data for emeny, item, boss, map (for map tiled pipline will be add later )
 

---

## 🎮 Game Systems

### 1. Entity Component System (ECS)

The core of the game engine. Every game object (player, enemy, item) is an entity with components.

```typescript
// Component Examples
rigidBody: { position, velocity, acceleration, mass }
health: number
attackState: { status, lastAttackTime, comboStep }
inventory: Array<{ item, quantity }>
```

**Systems Process Components:**
- `movementSystem` - Handles physics and movement
- `combatSystem` - Processes attacks and damage
- `enemyAISystem` - Enemy behavior and pathfinding
- `dirtyCollectorSystem` - Tracks changes for network sync

### 2. Combat System

Souls-inspired combat with timing and positioning:

```typescript
// Weapon Movesets
{
  attackSpeed: 1.0,        // Base attack speed multiplier
  attackRange: 1.5,        // Range in tiles
  attackSteps: [           // Combo chain
    {
      minTime: 0.2,        // Minimum time for combo window
      maxTime: 1.0,        // Maximum time before reset
      damageMultiplier: 1.0,
      knockBack: 2
    },
    // ... more combo steps
  ]
}
```

**Features:**
- Combo timing windows
- Critical hit system (5% base chance)
- Knockback physics
- Stamina management
- Weapon-specific movesets

### 3. Physics System

Force-based movement with realistic physics:

```typescript
// Physics Loop
applyForces(entity, inputForce);
applyFriction(entity, deltaTime);
applyDrag(entity, deltaTime);
clampSpeed(entity, maxSpeed);
integrate(entity, deltaTime);  // Update position
```

**Components:**
- Friction - Ground resistance
- Drag - Air resistance
- Max Speed - Walk/Sprint limits
- Acceleration - Applied forces

### 4. Network Optimization

**Dirty Component Tracking:**
```typescript
// Only changed components are sent
entity.makeDirty('health', isHigh: true);  // High priority
entity.makeDirty('inventory', isHigh: false);  // Low priority

// Network sends:
{
  highUpdate: [{ entityId, components: { health: 85 } }],
  lowUpdate: [{ entityId, components: { inventory: [...] } }]
}
```

**Priority System:**
- **High Priority** - Health, position, combat state (every frame)
- **Low Priority** - Inventory, stats, UI data (throttled)

### 5. Session Management

Each player gets isolated game loop:

```typescript
class GameSession {
  private setupLoop() {
    setInterval(() => {
      const deltaTime = now - lastTime;
      
      // Main loop (60 FPS)
      this.ECSManagerInstance.update(deltaTime);
      
      // Background loop (30 FPS) for distant entities
      if (backgroundAccumulator >= backgroundStep) {
        this.ECSManagerInstance.updateInBackground(accumulator);
      }
      
      this.collectAndEmit();  // Send updates to client
    }, 1000 / 60);
  }
}
```

---

## 📁 Project Structure

```
soullikegame-backend/
├── src/
│   ├── app.ts                  # Express + Socket.IO server
│   ├── index.ts                # Entry point
│   ├── gameSetting.config.ts   # Global game configuration
│   │
│   ├── Entites/                # ECS Entities
│   │   ├── baseEntity.ts       # Base ECS class
│   │   ├── PlayerEntity.ts     # Player entity with components
│   │   └── EnemyEntity.ts      # Enemy entity
│   │
│   ├── EntityManager.ts        # ECS Manager (orchestrates systems)
│   │
│   ├── system/                 # ECS Systems
│   │   ├── movement.system.ts
│   │   ├── Combat.system.ts
│   │   └── dirtyCollector.system.ts
│   │
│   ├── physics/                # Physics utilities
│   │   └── physics.ts
│   │
│   ├── dataModel/              # Mongoose schemas
│   │   ├── character.model.ts
│   │   ├── weapons.model.ts
│   │   ├── mapLayout.model.ts
│   │   └── ...
│   │
│   ├── session/                # Session management
│   │   ├── GameSession.ts
│   │   └── sessionManager.ts
│   │
│   ├── input/                  # Input handling
│   │   ├── socket.ts           # Socket.IO setup
│   │   └── inputs.ts           # Input event handlers
│   │
│   ├── Controller/             # API controllers
│   │   └── user.controller.ts
│   │
│   ├── routes/                 # Express routes
│   │   ├── user.route.ts
│   │   └── population.route.ts
│   │
│   ├── populateDB/             # Database seeding
│   │   ├── loadFileData.ts     # Hash-based change detection
│   │   ├── populateInGameItems.ts
│   │   └── mapLayout/          # Map JSON files
│   │
│   └── utility/                # Helper functions
│       ├── apiError.utility.ts
│       ├── auth.utility.ts
│       └── moveSet.utility.ts
│
├── docs/                       # Documentation
│   └── 0_Project_Overview.md
│
├── gameSetting.config.ts       # Game balance config
├── tsconfig.json
└── package.json
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Core Engine (Completed)
- [x] ECS architecture
- [x] Physics system
- [x] Combat system
- [x] Network layer
- [x] Authentication
- [x] Database models

### 🚧 Phase 2: Content & Integration (In Progress)
- [x] Character classes (6)
- [x] Weapons & armor system
- [ ] Map design pipeline (Tiled integration)
- [ ] Enemy AI behaviors
- [ ] Frontend renderer

### 📅 Phase 3: Polish & Features (Planned)
- [ ] Quest system implementation
- [ ] Inventory UI
- [ ] Death/respawn mechanics
- [ ] Boss encounters
- [ ] Sound effects & music

### 🎯 Phase 4: Multiplayer & Deployment (Future)
- [ ] PvP combat
- [ ] Cooperative gameplay
- [ ] Cloud deployment
- [ ] Performance optimization

---

## 🤝 Contributing

This is a portfolio/learning project, but suggestions and feedback are welcome!

### Development Guidelines

1. **Code Style**: Follow existing TypeScript patterns
2. **Systems**: New systems should extend ECS pattern
3. **Components**: Keep components data-only (no logic)
4. **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`)

### Adding a New System

```typescript
// src/system/myNewSystem.ts
import { ECS } from "../Entites/baseEntity";
import type { ECSManager } from "../EntityManager";

export function myNewSystem(
  entities: ECS[], 
  deltaTime: number, 
  ECSInstance: ECSManager
) {
  entities.forEach(entity => {
    // Get components
    const component = entity.getComponent<Type>('componentName');
    
    // Process logic
    
    // Mark changes
    entity.makeDirty('componentName', isHighPriority);
  });
}

// Register in GameSession or main loop
ecsManager.addSystem(myNewSystem);
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Tiled Map Editor** - Level design tool
- **LibreSprite** - Pixel art creation
- **Dark Souls Series** - Gameplay inspiration
- **Bun Team** - Amazing JavaScript runtime

---

## 📧 Contact

**Developer**: [Piyush Gupta]  
**LinkedIn**: [www.linkedin.com/in/piyush-gupta-04b585384]  
**Email**: []

---

<div align="center">

**Built with ❤️ and lots of ☕**

*A technical showcase of game engine development for the web*

</div>
