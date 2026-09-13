import type { CustomEdgeDefinition } from '../components/CustomEdge'
import type { CustomNodeDefinition } from '../components/CustomNode'

export type GraphData = {
  nodes: CustomNodeDefinition[]
  edges: CustomEdgeDefinition[]
}

export abstract class GraphStorage {
  abstract load(): GraphData | null
  abstract save(data: GraphData): void
}