import { describe, expect, it, beforeAll } from 'vitest'
import { createFlowStore } from '../store/flow'
import { LocalStorageGraphStorage } from '../store/local-storage-graph-storage'
import { CUSTOM_EDGE_TYPE } from '../components/CustomEdge'
import { MarkerType } from '@xyflow/react'

beforeAll(() => {
  const store = new Map<string, string>()
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size
    },
  }
})

const cleanup = () => {
  localStorage.clear()
}

describe('round-trip', () => {
  it('saves only structural data and adorns visuals on load', () => {
    cleanup()
    const storage = new LocalStorageGraphStorage('sysarch.graph.test')
    const store = createFlowStore(storage)

    store.getState().onConnect({
      source: 'a',
      sourceHandle: 'a-out',
      target: 'b',
      targetHandle: 'b-in',
    })

    expect(store.getState().edges[0].markerEnd).toEqual({
      type: MarkerType.ArrowClosed,
      color: 'var(--color-primary)',
      strokeWidth: 2,
    })

    store.getState().save()
    const raw = JSON.parse(localStorage.getItem('sysarch.graph.test')!)
    expect(raw.edges[0].markerEnd).toBeUndefined()
    expect(raw.nodes[0].measured).toBeUndefined()
    expect(raw.nodes[0].selected).toBeUndefined()
    expect(raw.nodes[0].dragging).toBeUndefined()
    expect(raw.nodes[0].resizing).toBeUndefined()
    expect(raw.nodes[0].width).toBeUndefined()
    expect(raw.nodes[0].height).toBeUndefined()
    expect(raw.nodes[0].position).toBeDefined()
    expect(raw.nodes[0].data.label).toBeDefined()

    const store2 = createFlowStore(storage)
    expect(store2.getState().edges[0].markerEnd).toEqual({
      type: MarkerType.ArrowClosed,
      color: 'var(--color-primary)',
      strokeWidth: 2,
    })
    expect(store2.getState().edges[0].type).toBe(CUSTOM_EDGE_TYPE)
  })

  it('strips stale markerEnd from previously saved edges', () => {
    cleanup()
    localStorage.setItem(
      'sysarch.graph.test',
      JSON.stringify({
        nodes: [
          {
            id: 'n',
            type: CUSTOM_EDGE_TYPE,
            data: { label: 'x', width: 100, height: 100, ports: [] },
            position: { x: 0, y: 0 },
            zIndex: 0,
            measured: { width: 100, height: 100 },
            selected: false,
            dragging: false,
            resizing: false,
            width: 100,
            height: 100,
          },
        ],
        edges: [
          {
            id: 'e',
            source: 'a',
            target: 'b',
            type: CUSTOM_EDGE_TYPE,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#ff7f00',
              strokeWidth: 2,
            },
          },
        ],
      }),
    )
    const storage = new LocalStorageGraphStorage('sysarch.graph.test')
    const store = createFlowStore(storage)
    store.getState().save()
    const raw = JSON.parse(localStorage.getItem('sysarch.graph.test')!)
    expect(raw.edges[0].markerEnd).toBeUndefined()
    expect(raw.nodes[0].measured).toBeUndefined()
    expect(raw.nodes[0].width).toBeUndefined()
    expect(raw.edges[0].source).toBe('a')
    expect(raw.edges[0].target).toBe('b')
    cleanup()
  })
})
