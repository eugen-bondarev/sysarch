import { create } from 'zustand'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react'
import { GraphStorage, type StoredEdge, type StoredNode } from './graph-storage'
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

type FlowApi = {
  screenToFlowPosition: (position: XYPosition) => XYPosition
  getCursor: () => XYPosition | null
}

type FlowStore = {
  nodes: CustomNodeDefinition[]
  edges: CustomEdgeDefinition[]
  flowApi: FlowApi | null
  deletingNodeIds: string[]
  newNodeIds: string[]
  portEditMode: boolean
  onNodesChange: (changes: NodeChange<CustomNodeDefinition>[]) => void
  onEdgesChange: (changes: EdgeChange<CustomEdgeDefinition>[]) => void
  onConnect: (connection: Connection) => void
  registerFlowApi: (api: FlowApi) => void
  startDeletingNodes: (ids: string[]) => void
  finishDeletingNodes: (nodeIds: string[], edgeIds: string[]) => void
  setPortEditMode: (on: boolean) => void
  addNode: (position?: XYPosition) => void
  updateNodeData: (id: string, data: Partial<CustomNodeData>) => void
  updateNodeZIndex: (id: string, zIndex: number) => void
  addPort: (nodeId: string, type: PortType, x?: number, y?: number) => void
  updatePort: (nodeId: string, portId: string, patch: Partial<Port>) => void
  removePort: (nodeId: string, portId: string) => void
  flipPort: (nodeId: string, portId: string) => void
  save: () => void
}

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

const EDGE_MARKER = {
  type: MarkerType.ArrowClosed,
  color: 'context-stroke',
  strokeWidth: 2,
}

const adornEdge = (edge: StoredEdge): CustomEdgeDefinition => ({
  ...edge,
  markerEnd: { ...EDGE_MARKER },
})

const sanitizeEdge = ({
  markerStart,
  markerEnd,
  selected,
  style,
  className,
  ...rest
}: CustomEdgeDefinition): StoredEdge => rest

const sanitizeNode = ({
  measured,
  selected,
  dragging,
  resizing,
  width,
  height,
  ...rest
}: CustomNodeDefinition): StoredNode => rest

const resolveCursorPosition = (
  get: () => FlowStore,
): XYPosition | undefined => {
  const { flowApi } = get()
  if (!flowApi) {
    return undefined
  }
  const cursor = flowApi.getCursor() ?? {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }
  return flowApi.screenToFlowPosition(cursor)
}

export const createFlowStore = (storage: GraphStorage) => {
  const saved = storage.load()
  const edges = (saved?.edges ?? []).map(adornEdge)

  return create<FlowStore>((set, get) => ({
    nodes: saved?.nodes ?? [],
    edges,
    flowApi: null,
    deletingNodeIds: [],
    newNodeIds: [],
    portEditMode: false,
    onNodesChange: (changes) =>
      set({
        nodes: applyNodeChanges(changes, get().nodes).map((node) => {
          const width = node.width!
          const height = node.height!
          if (width === undefined || height === undefined) {
            return node
          }
          // if (node.data.width === width && node.data.height === height) {
          //   return node
          // }
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
            markerEnd: { ...EDGE_MARKER },
          },
          get().edges,
        ),
      }),
    registerFlowApi: (api) => set({ flowApi: api }),
    startDeletingNodes: (ids) =>
      set({ deletingNodeIds: [...get().deletingNodeIds, ...ids] }),
    finishDeletingNodes: (nodeIds, edgeIds) => {
      const nodeSet = new Set(nodeIds)
      const edgeSet = new Set(edgeIds)
      set({
        nodes: get().nodes.filter((node) => !nodeSet.has(node.id)),
        edges: get().edges.filter((edge) => !edgeSet.has(edge.id)),
        deletingNodeIds: get().deletingNodeIds.filter((id) => !nodeSet.has(id)),
      })
    },
    addNode: (position) => {
      const id = crypto.randomUUID()
      set({
        nodes: [
          ...get().nodes,
          {
            id,
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
            position: position ??
              resolveCursorPosition(get) ?? {
                x: 40,
                y: 60 + get().nodes.length * 90,
              },
            selected: true,
            zIndex: 0,
          },
        ],
        newNodeIds: [...get().newNodeIds, id],
      })
    },
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
    addPort: (nodeId, type, x, y) =>
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
              x: x ?? (type === 'input' ? 0 : width),
              y: y ?? 20 + index * 40,
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
    flipPort: (nodeId, portId) =>
      set({
        nodes: updateNodePorts(get().nodes, nodeId, (ports) =>
          ports.map((port) =>
            port.id === portId
              ? {
                  ...port,
                  type: port.type === 'input' ? 'output' : 'input',
                }
              : port,
          ),
        ),
        edges: get().edges.filter(
          (edge) =>
            !(
              (edge.source === nodeId && edge.sourceHandle === portId) ||
              (edge.target === nodeId && edge.targetHandle === portId)
            ),
        ),
      }),
    setPortEditMode: (on) => set({ portEditMode: on }),
    save: () =>
      storage.save({
        nodes: get().nodes.map(sanitizeNode),
        edges: get().edges.map(sanitizeEdge),
      }),
  }))
}
