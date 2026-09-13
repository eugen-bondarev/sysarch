import { useEffect, useState } from 'react'
import {
  Handle,
  NodeResizer,
  Position,
  useNodeConnections,
  useStore,
  useUpdateNodeInternals,
  type InternalNode,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import { cn } from '../lib/class'

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

function facingPosition(
  other: InternalNode | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
): Position | undefined {
  if (!other) {
    return undefined
  }
  const position = other.internals.positionAbsolute
  const otherWidth = other.measured.width ?? other.width ?? 0
  const otherHeight = other.measured.height ?? other.height ?? 0
  const dx = position.x + otherWidth / 2 - (x + width / 2)
  const dy = position.y + otherHeight / 2 - (y + height / 2)
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Position.Right : Position.Left
  }
  return dy > 0 ? Position.Bottom : Position.Top
}

export function CustomNode({
  id,
  data,
  selected,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps<CustomNodeDefinition>) {
  const updateNodeInternals = useUpdateNodeInternals()
  const [hovered, setHovered] = useState(false)
  const [resizing, setResizing] = useState(false)

  const connections = useNodeConnections({ id })
  const outputPort = data.ports.find((port) => port.type === 'output')
  const inputPort = data.ports.find((port) => port.type === 'input')
  const outputConnection = connections.find(
    (connection) =>
      connection.source === id && connection.sourceHandle === outputPort?.id,
  )
  const inputConnection = connections.find(
    (connection) =>
      connection.target === id && connection.targetHandle === inputPort?.id,
  )
  const outputTarget = useStore(
    (state) =>
      outputConnection ? state.nodeLookup.get(outputConnection.target) : undefined,
  )
  const inputSource = useStore(
    (state) =>
      inputConnection ? state.nodeLookup.get(inputConnection.source) : undefined,
  )

  const outputPosition =
    facingPosition(
      outputTarget,
      positionAbsoluteX,
      positionAbsoluteY,
      data.width,
      data.height,
    ) ?? Position.Right
  const inputPosition =
    facingPosition(
      inputSource,
      positionAbsoluteX,
      positionAbsoluteY,
      data.width,
      data.height,
    ) ?? Position.Left

  useEffect(() => {
    updateNodeInternals(id)
  }, [id, data.ports, data.width, data.height, updateNodeInternals])

  return (
    <div
      className={cn(
        'relative border border-zinc-300 bg-white px-4 py-2 shadow',
        selected && 'border-violet-500 ring-2 ring-violet-300',
      )}
      style={{ width: data.width, height: data.height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NodeResizer
        isVisible={selected || hovered || resizing}
        minWidth={80}
        minHeight={60}
        color="#8b5cf6"
        onResizeStart={() => setResizing(true)}
        onResizeEnd={() => setResizing(false)}
      />
      <span className="text-sm font-medium text-zinc-700">{data.label}</span>
      {data.ports.map((port) => (
        <Handle
          key={port.id}
          id={port.id}
          type={port.type === 'input' ? 'target' : 'source'}
          position={port.type === 'output' ? outputPosition : inputPosition}
          isConnectableStart={port.type === 'output'}
        />
      ))}
    </div>
  )
}