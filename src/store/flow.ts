import { create } from 'zustand'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react'
import { GraphStorage } from './graph-storage'
import { scalePortPosition } from '../lib/connection-path'
import {
  CUSTOM_EDGE_TYPE,
  type CustomEdgeDefinition,
} from '../components/CustomEdge'
import {
  CUSTOM_NODE_TYPE,
  NODE_HEIGHT,
  NODE_WIDTH,
  type CustomNodeData,
  type CustomNodeDefinition,
  type Port,
  type PortType,
} from '../lib/node'

type FlowStore = {
  nodes: CustomNodeDefinition[]
  edges: CustomEdgeDefinition[]
  onNodesChange: (changes: NodeChange<CustomNodeDefinition>[]) => void
  onEdgesChange: (changes: EdgeChange<CustomEdgeDefinition>[]) => void
  onConnect: (connection: Connection) => void
  addNode: () => void
  updateNodeData: (id: string, data: Partial<CustomNodeData>) => void
  updateNodeZIndex: (id: string, zIndex: number) => void
  addPort: (nodeId: string, type: PortType) => void
  updatePort: (nodeId: string, portId: string, patch: Partial<Port>) => void
  removePort: (nodeId: string, portId: string) => void
  save: () => void
}

const INITIAL_NODES: CustomNodeDefinition[] = [
  {
    id: 'a',
    type: CUSTOM_NODE_TYPE,
    data: {
      label: 'Alpha',
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      ports: [
        { id: 'a-in', type: 'input', label: 'In', x: 0, y: 20 },
        { id: 'a-out', type: 'output', label: 'Out', x: NODE_WIDTH, y: 20 },
      ],
    },
    position: { x: 40, y: 140 },
    zIndex: 0,
  },
  {
    id: 'b',
    type: CUSTOM_NODE_TYPE,
    data: {
      label: 'Beta',
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      ports: [
        { id: 'b-in', type: 'input', label: 'In', x: 0, y: 20 },
        { id: 'b-out', type: 'output', label: 'Out', x: NODE_WIDTH, y: 20 },
      ],
    },
    position: { x: 300, y: 140 },
    zIndex: 0,
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
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6', strokeWidth: 2 },
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

export const createFlowStore = (storage: GraphStorage) => {
  const saved = storage.load()

  return create<FlowStore>((set, get) => ({
    nodes: saved?.nodes ?? INITIAL_NODES,
    edges: saved?.edges ?? INITIAL_EDGES,
    onNodesChange: (changes) =>
      set({
        nodes: applyNodeChanges(changes, get().nodes).map((node) => {
          const width = node.width
          const height = node.height
          if (width === undefined || height === undefined) {
            return node
          }
          if (node.data.width === width && node.data.height === height) {
            return node
          }
          const ports = node.data.ports.map((port) => ({
            ...port,
            ...scalePortPosition(
              port.x,
              port.y,
              node.data.width,
              node.data.height,
              width,
              height,
            ),
          }))
          return {
            ...node,
            data: { ...node.data, width, height, ports },
          }
        }),
      }),
    onEdgesChange: (changes) =>
      set({ edges: applyEdgeChanges(changes, get().edges) }),
    onConnect: (connection) =>
      set({
        edges: addEdge(
          {
            ...connection,
            type: CUSTOM_EDGE_TYPE,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#8b5cf6',
              strokeWidth: 2,
            },
          },
          get().edges,
        ),
      }),
    addNode: () =>
      set({
        nodes: [
          ...get().nodes,
          {
            id: `node-${get().nodes.length}`,
            type: CUSTOM_NODE_TYPE,
            data: {
              label: `Node ${get().nodes.length}`,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              ports: [
                {
                  id: crypto.randomUUID(),
                  type: 'input',
                  label: 'In',
                  x: 0,
                  y: 20,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'output',
                  label: 'Out',
                  x: NODE_WIDTH,
                  y: 20,
                },
              ],
            },
            position: { x: 40, y: 60 + get().nodes.length * 90 },
            zIndex: 0,
          },
        ],
      }),
    updateNodeData: (id, data) =>
      set({
        nodes: get().nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
        ),
      }),
    updateNodeZIndex: (id, zIndex) =>
      set({
        nodes: get().nodes.map((node) =>
          node.id === id ? { ...node, zIndex } : node,
        ),
      }),
    addPort: (nodeId, type) =>
      set({
        nodes: updateNodePorts(get().nodes, nodeId, (ports) => {
          const node = get().nodes.find((n) => n.id === nodeId)
          const width = node?.data.width ?? NODE_WIDTH
          const index = ports.filter((port) => port.type === type).length
          return [
            ...ports,
            {
              id: crypto.randomUUID(),
              type,
              label: `${type === 'input' ? 'Input' : 'Output'} ${index + 1}`,
              x: type === 'input' ? 0 : width,
              y: 20 + index * 40,
            },
          ]
        }),
      }),
    updatePort: (nodeId, portId, patch) =>
      set({
        nodes: updateNodePorts(get().nodes, nodeId, (ports) =>
          ports.map((port) =>
            port.id === portId ? { ...port, ...patch } : port,
          ),
        ),
      }),
    removePort: (nodeId, portId) =>
      set({
        nodes: updateNodePorts(get().nodes, nodeId, (ports) =>
          ports.filter((port) => port.id !== portId),
        ),
      }),
    save: () => storage.save({ nodes: get().nodes, edges: get().edges }),
  }))
}
