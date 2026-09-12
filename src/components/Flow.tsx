import { ReactFlow } from '@xyflow/react'
import { CUSTOM_NODE_TYPE, CustomNode } from './CustomNode'
import { CUSTOM_EDGE_TYPE, CustomEdge } from './CustomEdge'
import { useFlowStore } from '../store/flow'
import { Sidebar } from './Sidebar'
import Button from './ui/button'

const NODE_TYPES = { [CUSTOM_NODE_TYPE]: CustomNode }
const EDGE_TYPES = { [CUSTOM_EDGE_TYPE]: CustomEdge }

export function Flow() {
  const {
    nodes,
    edges,
    onNodesChange,
    updateNodeData,
    onEdgesChange,
    onConnect,
    addNode,
  } = useFlowStore()

  const selectedNode = nodes.find((node) => node.selected)

  return (
    <>
      <Button onClick={addNode}>Add node</Button>
      {selectedNode && (
        <Sidebar>
          <h2 className="mb-3 text-sm font-semibold text-zinc-800">
            Node details
          </h2>
          <label className="block text-xs font-medium text-zinc-500">
            Label
          </label>
          <input
            value={selectedNode.data.label}
            onChange={(e) =>
              updateNodeData(selectedNode.id, { label: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-violet-500 focus:outline-none"
          />
        </Sidebar>
      )}
      <div className="h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
        />
      </div>
    </>
  )
}
