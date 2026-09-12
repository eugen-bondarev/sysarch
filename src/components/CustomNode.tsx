import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

export type CustomNodeData = {
  label: string
}

export const CUSTOM_NODE_TYPE = 'CUSTOM_NODE'

export type CustomNodeDefinition = Node<CustomNodeData, typeof CUSTOM_NODE_TYPE>

export function CustomNode({ data }: NodeProps<CustomNodeDefinition>) {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white px-4 py-2 shadow w-50 h-50">
      <Handle type="target" position={Position.Left} />
      <span className="text-sm font-medium text-zinc-700">{data.label}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
