import { Position, type Node } from '@xyflow/react'

export type PortType = 'input' | 'output'

export type Port = {
  id: string
  type: PortType
  label: string
  x: number
  y: number
}

export const NODE_WIDTH = 200
export const NODE_HEIGHT = 200

export type CustomNodeData = {
  label: string
  width: number
  height: number
  ports: Port[]
}

export const CUSTOM_NODE_TYPE = 'CUSTOM_NODE'

export type CustomNodeDefinition = Node<CustomNodeData, typeof CUSTOM_NODE_TYPE>

export const PORT_POSITION: Record<string, Position> = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
}