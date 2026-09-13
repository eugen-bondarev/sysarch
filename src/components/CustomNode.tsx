import { useEffect, useState } from 'react'
import {
  Handle,
  NodeResizer,
  Position,
  useUpdateNodeInternals,
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

export function CustomNode({
  id,
  data,
  selected,
}: NodeProps<CustomNodeDefinition>) {
  const updateNodeInternals = useUpdateNodeInternals()
  const [hovered, setHovered] = useState(false)
  const [resizing, setResizing] = useState(false)

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
          position={port.type === 'input' ? Position.Left : Position.Right}
          isConnectableStart={port.type === 'output'}
          style={{
            left: port.x,
            top: port.y,
            transform: `translate(calc(-50% - ${port.type === 'input' ? 0 : 2}px), -50%)`,
          }}
        />
      ))}
    </div>
  )
}
