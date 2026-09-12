import { create } from 'zustand'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react'
import {
  CUSTOM_EDGE_TYPE,
  type CustomEdgeDefinition,
} from '../components/CustomEdge'
import {
  CUSTOM_NODE_TYPE,
  type CustomNodeDefinition,
} from '../components/CustomNode'

type FlowStore = {
  nodes: CustomNodeDefinition[]
  edges: CustomEdgeDefinition[]
  onNodesChange: (changes: NodeChange<CustomNodeDefinition>[]) => void
  onEdgesChange: (changes: EdgeChange<CustomEdgeDefinition>[]) => void
  onConnect: (connection: Connection) => void
  addNode: () => void
}

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

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, type: CUSTOM_EDGE_TYPE }, get().edges) }),
  addNode: () =>
    set({
      nodes: [
        ...get().nodes,
        {
          id: `node-${get().nodes.length}`,
          type: CUSTOM_NODE_TYPE,
          data: { label: `Node ${get().nodes.length}` },
          position: { x: 40, y: 60 + get().nodes.length * 90 },
        },
      ],
    }),
}))