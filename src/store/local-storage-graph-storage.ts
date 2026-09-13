import type { CustomEdgeDefinition } from '../components/CustomEdge'
import type { CustomNodeDefinition } from '../lib/node'
import { GraphStorage, type GraphData } from './graph-storage'

const STORAGE_KEY = 'sysarch.graph'

export class LocalStorageGraphStorage extends GraphStorage {
  private readonly key: string

  constructor(key: string = STORAGE_KEY) {
    super()
    this.key = key
  }

  load(): GraphData | null {
    const raw = localStorage.getItem(this.key)
    if (raw === null) {
      return null
    }
    try {
      const parsed = JSON.parse(raw) as { nodes?: unknown; edges?: unknown }
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        return {
          nodes: parsed.nodes as CustomNodeDefinition[],
          edges: parsed.edges as CustomEdgeDefinition[],
        }
      }
    } catch {
      return null
    }
    return null
  }

  save(data: GraphData): void {
    localStorage.setItem(this.key, JSON.stringify(data))
  }
}