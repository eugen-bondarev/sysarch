import { ReactFlow } from '@xyflow/react'
import { CUSTOM_NODE_TYPE, CustomNode } from './CustomNode'
import { CUSTOM_EDGE_TYPE, CustomEdge } from './CustomEdge'
import { useFlowStore } from '../store/flow'
import { Sidebar } from './inspector/Sidebar'
import { NodeInspector } from './inspector/NodeInspector'
import Button from './ui/button'

const NODE_TYPES = { [CUSTOM_NODE_TYPE]: CustomNode }
const EDGE_TYPES = { [CUSTOM_EDGE_TYPE]: CustomEdge }

export function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useFlowStore()

  const selectedNode = nodes.find((node) => node.selected)

  return (
    <>
      <Button onClick={addNode}>Add node</Button>
      {selectedNode && (
        <Sidebar>
          <NodeInspector node={selectedNode} />
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
          elevateNodesOnSelect={false}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
        />
      </div>
    </>
  )
}
