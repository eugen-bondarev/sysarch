export type Point = {
  x: number
  y: number
}

export type EdgePosition = 'left' | 'right' | 'top' | 'bottom'

export type ConnectionPathOptions = {
  offset?: number
}

export function clampToPerimeter(
  x: number,
  y: number,
  width: number,
  height: number,
): Point {
  const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max))
  const cx = clamp(x, width)
  const cy = clamp(y, height)
  const candidates = [
    { point: { x: cx, y: 0 }, dx: cx - x, dy: y },
    { point: { x: cx, y: height }, dx: cx - x, dy: height - y },
    { point: { x: 0, y: cy }, dx: x, dy: cy - y },
    { point: { x: width, y: cy }, dx: width - x, dy: cy - y },
  ]
  return candidates
    .map(({ point, dx, dy }) => ({ point, d: dx * dx + dy * dy }))
    .sort((a, b) => a.d - b.d)[0].point
}

export function scalePortPosition(
  x: number,
  y: number,
  oldWidth: number,
  oldHeight: number,
  newWidth: number,
  newHeight: number,
): Point {
  const side = getPortPosition(x, y, oldWidth, oldHeight)
  switch (side) {
    case 'left':
      return { x: 0, y: (y / oldHeight) * newHeight }
    case 'right':
      return { x: newWidth, y: (y / oldHeight) * newHeight }
    case 'top':
      return { x: (x / oldWidth) * newWidth, y: 0 }
    case 'bottom':
      return { x: (x / oldWidth) * newWidth, y: newHeight }
  }
}

const DIRECTION: Record<EdgePosition, Point> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
}

export function getPortPosition(
  x: number,
  y: number,
  width: number,
  height: number,
): EdgePosition {
  const edges: [EdgePosition, number][] = [
    ['left', x],
    ['right', width - x],
    ['top', y],
    ['bottom', height - y],
  ]
  edges.sort((a, b) => a[1] - b[1])
  return edges[0][0]
}

export function getConnectionPath(
  source: Point,
  target: Point,
  sourcePosition: EdgePosition,
  targetPosition: EdgePosition,
  options: ConnectionPathOptions = {},
): string {
  const offset = options.offset ?? 20
  const sourceDir = DIRECTION[sourcePosition]
  const targetDir = DIRECTION[targetPosition]
  const control1 = {
    x: source.x + sourceDir.x * offset,
    y: source.y + sourceDir.y * offset,
  }
  const control2 = {
    x: target.x + targetDir.x * offset,
    y: target.y + targetDir.y * offset,
  }
  return `M${source.x},${source.y} C${control1.x},${control1.y} ${control2.x},${control2.y} ${target.x},${target.y}`
}