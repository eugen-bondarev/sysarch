import { describe, expect, it } from 'vitest'
import { createFlowStore } from '../store/flow'
import { INITIAL_EDGES, INITIAL_NODES } from '../store/test-fixtures'
import { MockGraphStorage } from '../store/mock-graph-storage'
import { CUSTOM_EDGE_TYPE, type CustomEdgeDefinition } from '../components/CustomEdge'
import { type CustomNodeDefinition } from '../lib/node'
import { MarkerType } from '@xyflow/react'

type SavedGraphData = {
  nodes: CustomNodeDefinition[]
  edges: CustomEdgeDefinition[]
}

describe('round-trip', () => {
  it('saves only structural data and adorns visuals on load', () => {
    const storage = new MockGraphStorage(INITIAL_NODES, INITIAL_EDGES)
    const store = createFlowStore(storage)

    store.getState().onConnect({
      source: 'a',
      sourceHandle: 'a-out',
      target: 'b',
      targetHandle: 'b-in',
    })

    expect(store.getState().edges[0].markerEnd).toEqual({
      type: MarkerType.ArrowClosed,
      color: 'context-stroke',
      strokeWidth: 2,
    })

    store.getState().save()
    const raw = storage.load()! as SavedGraphData
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
      color: 'context-stroke',
      strokeWidth: 2,
    })
    expect(store2.getState().edges[0].type).toBe(CUSTOM_EDGE_TYPE)
  })

  it('strips stale markerEnd from previously saved edges', () => {
    const storage = new MockGraphStorage(
      [
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
      ] as unknown as CustomNodeDefinition[],
      [
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
      ] as unknown as CustomEdgeDefinition[],
    )
    const store = createFlowStore(storage)
    store.getState().save()
    const raw = storage.load()! as SavedGraphData
    expect(raw.edges[0].markerEnd).toBeUndefined()
    expect(raw.nodes[0].measured).toBeUndefined()
    expect(raw.nodes[0].width).toBeUndefined()
    expect(raw.edges[0].source).toBe('a')
    expect(raw.edges[0].target).toBe('b')
  })
})