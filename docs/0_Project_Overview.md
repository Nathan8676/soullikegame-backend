# 🧩 Project Overview

## 🎮 What This Project Is
This is a **Souls-like 2D isometric game** featuring roughly one hour of demo gameplay.  
It’s built to run directly in the **browser (Web)** and serves as both a learning project and a portfolio piece to demonstrate my coding, architecture, and engine-building skills.

The game engine is built **from scratch**, with a focus on modular design and real-time systems.

---

## 🧠 Tech Stack
**Backend:**
- **TypeScript / Bun** – core logic and engine
- **Express** – REST API
- **Socket.IO** – real-time networking and multiplayer sync
- **MongoDB** – data persistence (player, story, world state)

**Frontend:**
- **React (Vite)** – UI and interface elements
- **Canvas API** – rendering the game world and visual elements
- **Tailwind CSS** – styling

---

## 🎯 Why I Built It This Way
I wanted to challenge myself to create something *beyond* a simple web app —  
a **real-time interactive game engine** that runs entirely in the browser.

- Writing the engine from scratch helped me deeply understand **ECS (Entity Component System)** design, **real-time data flow**, and **network synchronization**.
- TypeScript provides type safety for complex systems like ECS even though it's my first project in TypeScript.
- Bun was chosen for its **fast runtime** and modern module support and just want to make a project with Bun.
- React + Canvas combo allows mixing UI (menus, HUD, inventory) with low-level game rendering.

---

## ⚙️ How It Works (High-Level)
1. **Game Initialization:**  
   - The backend creates a `GameSession` that holds the `ECSManager` instance, Session/Player ids and `Socket` instance.
   - The `SessionManager` tracks all live sessions and help Debug any issue and able to muntain multiplayer within one backend Server.

2. **Entity & System Processing:**  
   - Each entity in the world (player, NPC, object, environment) is handled by the ECS a class that can hold n number of components.
   - Pre-built Class from Entity and that is common like Player, NPC, and Entity that has many components to add at runtime 
   - Systems run on a tick-based loop, updating movement, AI, combat, and physics.

3. **Dirty Component Queues:**  
   - Whenever a component changes (e.g., position, health, animation), it’s marked “dirty” with method `makeDirty(name: string, isHigh: boolean = false)` in base ECS class 
   - These changes are stored in **high** or **low priority** in base ECS Class.
   - Then all dirty Components collected via system make DirtCollecter that give these Components with it's entity id to ECSManger.
   - Then ECSManager Store these in **low** and **high** priority and send it to the network layer and clean it Store Queues then repeat.
   - On each network tick it send data on diff tick base on it's priority, only dirty data is sent to clients for efficient syncing.

4. **Rendering (Frontend):**  
   - The client receives world updates through Socket.IO.
   - The game engine updates the canvas rendering accordingly.
   - React handles UI overlays (HUD, menus, player stats).
   - Work in progress
---

## 🧭 Next Steps
- [ ] Add documentation for `ECSManager` and its event flow.  
- [ ] Add a diagram for the backend session → ECS → socket relationship.  
- [ ] Document frontend state syncing logic after first multiplayer test.  
