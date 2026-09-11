import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

export type ThingData = {
  label: string
}

export type ThingNode = Node<ThingData, 'thing'>

export function Thing({ data }: NodeProps<ThingNode>) {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white px-4 py-2 shadow">
      <Handle type="target" position={Position.Left} />
      <span className="text-sm font-medium text-zinc-700">{data.label}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}