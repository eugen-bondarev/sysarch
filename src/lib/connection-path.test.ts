import { describe, expect, test } from 'vitest'
import {
  clampToPerimeter,
  getConnectionPath,
  getPortPosition,
  resolvePortPlacement,
  scalePortPosition,
  snapToStep,
} from './connection-path'

type Point = { x: number; y: number }
type Cubic = { p0: Point; p1: Point; p2: Point; p3: Point }

function parseCubic(d: string): Cubic {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number)
  return {
    p0: { x: nums[0], y: nums[1] },
    p1: { x: nums[2], y: nums[3] },
    p2: { x: nums[4], y: nums[5] },
    p3: { x: nums[6], y: nums[7] },
  }
}

const isHorizontal = (v: Point) => Math.abs(v.y) < 0.001 && v.x !== 0
const isVertical = (v: Point) => Math.abs(v.x) < 0.001 && v.y !== 0

describe('getConnectionPath', () => {
  test('exits and enters at 90 degrees when nodes are side by side', () => {
    const path = getConnectionPath(
      { x: 242, y: 161 },
      { x: 298, y: 161 },
      'right',
      'left',
    )

    const { p0, p1, p2, p3 } = parseCubic(path)
    expect(isHorizontal({ x: p1.x - p0.x, y: p1.y - p0.y })).toBe(true)
    expect(isHorizontal({ x: p3.x - p2.x, y: p3.y - p2.y })).toBe(true)
  })

  test('stays a straight horizontal line when nodes are side by side', () => {
    const path = getConnectionPath(
      { x: 242, y: 161 },
      { x: 298, y: 161 },
      'right',
      'left',
    )

    const { p0, p1, p2, p3 } = parseCubic(path)
    expect([p0, p1, p2, p3].every((p) => Math.abs(p.y - 161) < 0.001)).toBe(true)
  })

  test('exits and enters at 90 degrees when nodes are stacked', () => {
    const path = getConnectionPath(
      { x: 140, y: 340 },
      { x: 220, y: 380 },
      'bottom',
      'top',
    )

    const { p0, p1, p2, p3 } = parseCubic(path)
    expect(isVertical({ x: p1.x - p0.x, y: p1.y - p0.y })).toBe(true)
    expect(isVertical({ x: p3.x - p2.x, y: p3.y - p2.y })).toBe(true)
  })

  test('keeps the stacked connection curved', () => {
    const path = getConnectionPath(
      { x: 140, y: 340 },
      { x: 220, y: 380 },
      'bottom',
      'top',
    )

    const { p0, p1, p2, p3 } = parseCubic(path)
    expect(p1.y).not.toBe(p0.y)
    expect(p2.y).not.toBe(p3.y)
  })

  test('stays within the gap between stacked nodes', () => {
    const path = getConnectionPath(
      { x: 140, y: 340 },
      { x: 220, y: 380 },
      'bottom',
      'top',
    )

    const { p0, p1, p2, p3 } = parseCubic(path)
    for (const p of [p0, p1, p2, p3]) {
      expect(p.y).toBeGreaterThanOrEqual(340)
      expect(p.y).toBeLessThanOrEqual(380)
      expect(p.x).toBeGreaterThanOrEqual(140)
      expect(p.x).toBeLessThanOrEqual(220)
    }
  })
})

describe('getPortPosition', () => {
  test('detects a port on the left edge', () => {
    expect(getPortPosition(0, 20, 200, 200)).toBe('left')
  })

  test('detects a port on the right edge', () => {
    expect(getPortPosition(200, 20, 200, 200)).toBe('right')
  })

  test('detects a port on the bottom edge', () => {
    expect(getPortPosition(100, 98, 200, 100)).toBe('bottom')
  })

  test('detects a port on the top edge', () => {
    expect(getPortPosition(100, 0, 200, 100)).toBe('top')
  })

  test('detects a bottom port even when it is off-center', () => {
    expect(getPortPosition(120, 98, 200, 100)).toBe('bottom')
  })

  test('does not flip when the port is exactly on the edge', () => {
    expect(getPortPosition(420, 20, 420, 260)).toBe('right')
  })
})

describe('clampToPerimeter', () => {
  test('clamps a point inside to the nearest side', () => {
    expect(clampToPerimeter(90, 20, 200, 200)).toEqual({ x: 90, y: 0 })
  })

  test('clamps a point inside near the left to the left edge', () => {
    expect(clampToPerimeter(5, 100, 200, 200)).toEqual({ x: 0, y: 100 })
  })

  test('clamps a point outside to the right to the right edge', () => {
    expect(clampToPerimeter(250, 30, 200, 200)).toEqual({ x: 200, y: 30 })
  })

  test('clamps a point outside below to the bottom edge', () => {
    expect(clampToPerimeter(50, 250, 200, 200)).toEqual({ x: 50, y: 200 })
  })

  test('clamps a point outside past the corner to the corner', () => {
    expect(clampToPerimeter(250, 250, 200, 200)).toEqual({ x: 200, y: 200 })
  })

  test('keeps an already-on-border point in place', () => {
    expect(clampToPerimeter(0, 40, 200, 200)).toEqual({ x: 0, y: 40 })
  })
})

describe('scalePortPosition', () => {
  test('scales a port on the right edge along the height', () => {
    expect(scalePortPosition(200, 100, 200, 200, 300, 400)).toEqual({
      x: 300,
      y: 200,
    })
  })

  test('keeps a port on the left edge pinned to the left', () => {
    expect(scalePortPosition(0, 50, 200, 200, 300, 400)).toEqual({
      x: 0,
      y: 100,
    })
  })

  test('scales a port on the top edge along the width', () => {
    expect(scalePortPosition(100, 0, 200, 200, 300, 400)).toEqual({
      x: 150,
      y: 0,
    })
  })

  test('keeps a port on the bottom edge pinned to the bottom', () => {
    expect(scalePortPosition(50, 200, 200, 200, 300, 400)).toEqual({
      x: 75,
      y: 400,
    })
  })
})

describe('snapToStep', () => {
  test('rounds a value down to the nearest step', () => {
    expect(snapToStep(123, 10)).toBe(120)
  })

  test('rounds a value up to the nearest step', () => {
    expect(snapToStep(127, 10)).toBe(130)
  })

  test('keeps an exact multiple unchanged', () => {
    expect(snapToStep(120, 10)).toBe(120)
  })

  test('rounds a halfway value up', () => {
    expect(snapToStep(125, 10)).toBe(130)
  })

  test('snaps to zero when below half a step', () => {
    expect(snapToStep(4, 10)).toBe(0)
  })
})

describe('resolvePortPlacement', () => {
  test('places a double-click on the left edge as an input port', () => {
    expect(resolvePortPlacement(0, 123, 200, 200)).toEqual({
      x: 0,
      y: 120,
      type: 'input',
    })
  })

  test('places a double-click near the top edge as an input port', () => {
    expect(resolvePortPlacement(153, 2, 200, 200)).toEqual({
      x: 150,
      y: 0,
      type: 'input',
    })
  })

  test('places a double-click on the right edge as an output port', () => {
    expect(resolvePortPlacement(200, 47, 200, 200)).toEqual({
      x: 200,
      y: 50,
      type: 'output',
    })
  })

  test('places a double-click on the bottom edge as an output port', () => {
    expect(resolvePortPlacement(85, 200, 200, 200)).toEqual({
      x: 90,
      y: 200,
      type: 'output',
    })
  })

  test('clamps an interior double-click to the nearest side', () => {
    expect(resolvePortPlacement(190, 100, 200, 200)).toEqual({
      x: 200,
      y: 100,
      type: 'output',
    })
  })
})