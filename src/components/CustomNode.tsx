import { useEffect } from 'react'
import {
  Handle,
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

export type CustomNodeData = {
  label: string
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

  useEffect(() => {
    updateNodeInternals(id)
  }, [id, data.ports, updateNodeInternals])

  return (
    <div
      className={cn(
        'relative border border-zinc-300 bg-white px-4 py-2 shadow w-50 h-50',
        selected && 'border-violet-500 ring-2 ring-violet-300',
      )}
    >
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
