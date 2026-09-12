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
  type CustomNodeData,
  type CustomNodeDefinition,
  type Port,
  type PortType,
} from '../components/CustomNode'

type FlowStore = {
  nodes: CustomNodeDefinition[]
  edges: CustomEdgeDefinition[]
  onNodesChange: (changes: NodeChange<CustomNodeDefinition>[]) => void
  onEdgesChange: (changes: EdgeChange<CustomEdgeDefinition>[]) => void
  onConnect: (connection: Connection) => void
  addNode: () => void
  updateNodeData: (id: string, data: Partial<CustomNodeData>) => void
  addPort: (nodeId: string, type: PortType) => void
  updatePort: (nodeId: string, portId: string, patch: Partial<Port>) => void
  removePort: (nodeId: string, portId: string) => void
}

const NODE_WIDTH = 200

const INITIAL_NODES: CustomNodeDefinition[] = [
  {
    id: 'a',
    type: CUSTOM_NODE_TYPE,
    data: {
      label: 'Alpha',
      ports: [
        { id: 'a-in', type: 'input', label: 'In', x: 0, y: 20 },
        { id: 'a-out', type: 'output', label: 'Out', x: NODE_WIDTH, y: 20 },
      ],
    },
    position: { x: 40, y: 140 },
  },
  {
    id: 'b',
    type: CUSTOM_NODE_TYPE,
    data: {
      label: 'Beta',
      ports: [
        { id: 'b-in', type: 'input', label: 'In', x: 0, y: 20 },
        { id: 'b-out', type: 'output', label: 'Out', x: NODE_WIDTH, y: 20 },
      ],
    },
    position: { x: 300, y: 140 },
  },
]

const INITIAL_EDGES: CustomEdgeDefinition[] = [
  {
    id: 'a-b',
    source: 'a',
    sourceHandle: 'a-out',
    target: 'b',
    targetHandle: 'b-in',
    type: CUSTOM_EDGE_TYPE,
  },
]

const updateNodePorts = (
  nodes: CustomNodeDefinition[],
  nodeId: string,
  update: (ports: Port[]) => Port[],
): CustomNodeDefinition[] =>
  nodes.map((node) =>
    node.id === nodeId
      ? { ...node, data: { ...node.data, ports: update(node.data.ports) } }
      : node,
  )

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
          data: {
            label: `Node ${get().nodes.length}`,
            ports: [
              { id: crypto.randomUUID(), type: 'input', label: 'In', x: 0, y: 20 },
              { id: crypto.randomUUID(), type: 'output', label: 'Out', x: NODE_WIDTH, y: 20 },
            ],
          },
          position: { x: 40, y: 60 + get().nodes.length * 90 },
        },
      ],
    }),
  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    }),
  addPort: (nodeId, type) =>
    set({
      nodes: updateNodePorts(get().nodes, nodeId, (ports) => {
        const index = ports.filter((port) => port.type === type).length
        return [
          ...ports,
          {
            id: crypto.randomUUID(),
            type,
            label: `${type === 'input' ? 'Input' : 'Output'} ${index + 1}`,
            x: type === 'input' ? 0 : NODE_WIDTH,
            y: 20 + index * 40,
          },
        ]
      }),
    }),
  updatePort: (nodeId, portId, patch) =>
    set({
      nodes: updateNodePorts(get().nodes, nodeId, (ports) =>
        ports.map((port) => (port.id === portId ? { ...port, ...patch } : port)),
      ),
    }),
  removePort: (nodeId, portId) =>
    set({
      nodes: updateNodePorts(get().nodes, nodeId, (ports) =>
        ports.filter((port) => port.id !== portId),
      ),
    }),
}))