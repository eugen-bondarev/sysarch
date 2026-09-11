import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
} from '@xyflow/react'
import { CustomNode, type ThingNode } from './CustomNode'
import {
  CUSTOM_EDGE_TYPE,
  CustomEdge,
  type CustomEdgeDefinition,
} from './CustomEdge'

const NODE_TYPES = { thing: CustomNode }
const EDGE_TYPES = { [CUSTOM_EDGE_TYPE]: CustomEdge }

const INITIAL_NODES: ThingNode[] = [
  {
    id: 'a',
    type: 'thing',
    data: { label: 'Alpha' },
    position: { x: 40, y: 140 },
  },
  {
    id: 'b',
    type: 'thing',
    data: { label: 'Beta' },
    position: { x: 300, y: 140 },
  },
]

const INITIAL_EDGES: CustomEdgeDefinition[] = [
  { id: 'a-b', source: 'a', target: 'b', type: CUSTOM_EDGE_TYPE },
]

export function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES)

  const onConnect = (edge: Connection) => {
    setEdges((edges) => addEdge({ ...edge, type: CUSTOM_EDGE_TYPE }, edges))
  }

  const addNode = () =>
    setNodes((nodes) => [
      ...nodes,
      {
        id: `node-${nodes.length}`,
        type: 'thing',
        data: { label: `Node ${nodes.length}` },
        position: { x: 40, y: 60 + nodes.length * 90 },
      },
    ])

  return (
    <div className="fixed inset-0 flex flex-col">
      <button
        onClick={addNode}
        className="absolute left-4 top-4 z-10 rounded-md bg-zinc-900 px-3 py-1 text-sm text-white"
      >
        Add node
      </button>
      <div className="h-screen w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </div>
    </div>
  )
}
