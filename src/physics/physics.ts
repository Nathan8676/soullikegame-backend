import { ECS } from "../Entites/baseEntity";
import type { rigidBody, Vec2 } from "../Entites/PlayerEntity";

export function applyForces(entity: ECS, force: { x: number, y: number, z: number }) {
  const rb = entity.getComponent("rigidBody") as rigidBody;
  rb.acceleration.x += force.x / rb.mass;
  rb.acceleration.y += force.y / rb.mass;
  rb.acceleration.z += force.z / rb.mass;
  entity.updateComponent("rigidBody", rb);
}

export function applyFriction(entity: ECS, deltaTime: number) {
  const rb = entity.getComponent("rigidBody") as rigidBody;
  rb.acceleration.x -= rb.velocity.x * rb.friction * deltaTime;
  rb.acceleration.y -= rb.velocity.y * rb.friction * deltaTime;
  rb.acceleration.z -= rb.velocity.z * rb.friction * deltaTime;
  entity.updateComponent("rigidBody", rb);
}

export function applyGravity(entity: ECS, gravity = 9.81) {
  const rb = entity.getComponent("rigidBody") as rigidBody;
  applyForces(entity, { x: 0, y: 0, z: -gravity * rb.mass });
}

export function applyDrag(entity: ECS, deltaTime: number) {
  const rb = entity.getComponent("rigidBody") as rigidBody;
  rb.acceleration.x -= rb.velocity.x * rb.drag * deltaTime;
  rb.acceleration.y -= rb.velocity.y * rb.drag * deltaTime;
  rb.acceleration.z -= rb.velocity.z * rb.drag * deltaTime;
  entity.updateComponent("rigidBody", rb);
}

export function clumpSpeedForWalk(entity: ECS) {
  const rb = entity.getComponent("rigidBody") as rigidBody;
  const speed = Math.hypot(rb.velocity.x, rb.velocity.y);
  if (speed > rb.maxSpeed) {
    rb.velocity.x = rb.velocity.x / speed * rb.maxSpeed;
    rb.velocity.y = rb.velocity.y / speed * rb.maxSpeed;
    rb.velocity.z = rb.velocity.z / speed * rb.maxSpeed;
  }
  entity.updateComponent("rigidBody", rb);
}

export function clumpSpeedForSprint(entity: ECS) {
  const rb = entity.getComponent("rigidBody") as rigidBody;
  const speed = Math.hypot(rb.velocity.x, rb.velocity.y);
  if (speed > rb.maxSprintingSpeed) {
    rb.velocity.x = rb.velocity.x / speed * rb.maxSprintingSpeed;
    rb.velocity.y = rb.velocity.y / speed * rb.maxSprintingSpeed;
    rb.velocity.z = rb.velocity.z / speed * rb.maxSprintingSpeed;
  }
  entity.updateComponent("rigidBody", rb);
}
export function snapToZeroVelocity(entity: ECS, threshold = 0.001) {
  const rb = entity.getComponent("rigidBody") as rigidBody
  if (Math.abs(rb.velocity.x) < threshold) rb.velocity.x = 0;
  if (Math.abs(rb.velocity.y) < threshold) rb.velocity.y = 0;
  if (Math.abs(rb.velocity.z) < threshold) rb.velocity.z = 0;
}
export function integrate(entity: ECS, deltaTime: number) {
  const rb = entity.getComponent("rigidBody") as rigidBody;
  rb.velocity.x += rb.acceleration.x * deltaTime;
  rb.velocity.y += rb.acceleration.y * deltaTime;
  rb.velocity.z += rb.acceleration.z * deltaTime;
  rb.position.x += rb.velocity.x * deltaTime;
  rb.position.y += rb.velocity.y * deltaTime;
  rb.position.z += rb.velocity.z * deltaTime;
  rb.acceleration = { x: 0, y: 0, z: 0 };
  entity.updateComponent("rigidBody", rb);
}

export function inRenderDistance(entityPos: { x: number, y: number }, playerPos: { x: number, y: number }, radius: number) {
  const dx = entityPos.x - playerPos.x
  const dy = entityPos.y - playerPos.y
  return dx * dx + dy * dy <= radius * radius
}

export function distance(a: Vec2, b: Vec2): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y, - b.y) ** 2)
}

export function dotProduct(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}
export function normalize(a: Vec2): Vec2 {
  const mag = Math.sqrt(a.x * a.x + a.y * a.y)
  return mag === 0 ? { x: 0, y: 0 } : { x: a.x / mag, y: a.y / mag }
}
