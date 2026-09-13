import type { CustomNodeDefinition } from '../lib/node'
import type { CustomEdgeDefinition } from '../components/CustomEdge'

export type StoredNode = Omit<
  CustomNodeDefinition,
  'measured' | 'selected' | 'dragging' | 'resizing' | 'width' | 'height'
>

export type StoredEdge = Omit<
  CustomEdgeDefinition,
  'markerStart' | 'markerEnd' | 'selected' | 'style' | 'className'
>

export type GraphData = {
  nodes: StoredNode[]
  edges: StoredEdge[]
}

export abstract class GraphStorage {
  abstract load(): GraphData | null
  abstract save(data: GraphData): void
}