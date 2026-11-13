/**
 * Minimal isometric projector used by the illustration.
 * World units are metres; the screen is a 1000 × 720 canvas.
 */
export const VIEW = { width: 1000, height: 720 } as const

const ORIGIN = { x: 500, y: 300 }
const HORIZONTAL = 86.6 // cos(30°) × 100 px/m
const VERTICAL = 50 // sin(30°) × 100 px/m
const HEIGHT = 100 // px per metre of height

export type Point = [number, number]

export function iso(x: number, y: number, z = 0): Point {
  return [
    ORIGIN.x + (x - y) * HORIZONTAL,
    ORIGIN.y + (x + y) * VERTICAL - z * HEIGHT,
  ]
}

export function poly(points: readonly (readonly number[])[]): string {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

export function screenToPercent([x, y]: Point): { left: string; top: string } {
  return {
    left: `${((x / VIEW.width) * 100).toFixed(2)}%`,
    top: `${((y / VIEW.height) * 100).toFixed(2)}%`,
  }
}

/** Ground point where the character stands at the end of the walk. */
export const PERSON_END = iso(2.3, 3.8)
/** Ground point where the character enters the scene. */
export const PERSON_START = iso(-1.85, 4.7)
/** Centre of the external electrical box on the front wall. */
export const BOX_CENTER = iso(2.35, 3, 1.35)
/** Camera mounted above the box. */
export const CAMERA_POS = iso(2.35, 3, 2.22)
