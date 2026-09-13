import { ReactFlow } from '@xyflow/react'
import { CustomNode } from './CustomNode'
import { CUSTOM_NODE_TYPE } from '../lib/node'
import { CUSTOM_EDGE_TYPE, CustomEdge } from './CustomEdge'
import { useFlowStore } from '../store'
import { Sidebar } from './inspector/Sidebar'
import { NodeInspector } from './inspector/NodeInspector'
import Button from './ui/button'

const NODE_TYPES = { [CUSTOM_NODE_TYPE]: CustomNode }
const EDGE_TYPES = { [CUSTOM_EDGE_TYPE]: CustomEdge }

export function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, save } =
    useFlowStore()

  const selectedNode = nodes.find((node) => node.selected)

  return (
    <>
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <Button onClick={addNode} className="static">
          Add node
        </Button>
        <Button onClick={save} className="static">
          Save
        </Button>
      </div>
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
