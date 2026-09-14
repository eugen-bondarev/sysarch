import { GraphStorage, type GraphData, type StoredEdge, type StoredNode } from './graph-storage'

export class MockGraphStorage extends GraphStorage {
  private data: GraphData

  constructor(nodes: StoredNode[], edges: StoredEdge[]) {
    super()
    this.data = { nodes, edges }
  }

  load(): GraphData | null {
    return this.data
  }

  save(data: GraphData): void {
    this.data = data
  }
}