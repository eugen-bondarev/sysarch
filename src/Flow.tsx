import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
} from '@xyflow/react'
import {
  CUSTOM_NODE_TYPE,
  CustomNode,
  type CustomNodeDefinition,
} from './CustomNode'
import {
  CUSTOM_EDGE_TYPE,
  CustomEdge,
  type CustomEdgeDefinition,
} from './CustomEdge'
import Button from './components/ui/button'

const NODE_TYPES = { [CUSTOM_NODE_TYPE]: CustomNode }
const EDGE_TYPES = { [CUSTOM_EDGE_TYPE]: CustomEdge }

const INITIAL_NODES: CustomNodeDefinition[] = [
  {
    id: 'a',
    type: CUSTOM_NODE_TYPE,
    data: { label: 'Alpha' },
    position: { x: 40, y: 140 },
  },
  {
    id: 'b',
    type: CUSTOM_NODE_TYPE,
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
        type: CUSTOM_NODE_TYPE,
        data: { label: `Node ${nodes.length}` },
        position: { x: 40, y: 60 + nodes.length * 90 },
      },
    ])

  return (
    <>
      <Button onClick={addNode}>Add node</Button>
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
        />
      </div>
    </>
  )
}
