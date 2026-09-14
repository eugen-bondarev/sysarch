import { describe, expect, it } from 'vitest'
import { createFlowStore } from './flow'
import { INITIAL_EDGES, INITIAL_NODES } from './test-fixtures'
import { MockGraphStorage } from './mock-graph-storage'

const createStore = () =>
  createFlowStore(new MockGraphStorage(INITIAL_NODES, INITIAL_EDGES))

describe('addPort', () => {
  it('places a port at the given position when provided', () => {
    const store = createStore()

    store.getState().addPort('a', 'input', 0, 50)

    const node = store.getState().nodes.find((n) => n.id === 'a')!
    const port = node.data.ports.at(-1)!
    expect(port).toMatchObject({ type: 'input', x: 0, y: 50 })
  })
})

describe('flipPort', () => {
  const port = (store: ReturnType<typeof createStore>, id: string) =>
    store
      .getState()
      .nodes.find((n) => n.id === 'a')!
      .data.ports.find((p) => p.id === id)!

  it('flips an input port to an output port and keeps its position', () => {
    const store = createStore()

    store.getState().flipPort('a', 'a-in')

    expect(port(store, 'a-in')).toMatchObject({ type: 'output', x: 0, y: 20 })
  })

  it('flips an output port to an input port', () => {
    const store = createStore()

    store.getState().flipPort('a', 'a-out')

    expect(port(store, 'a-out')).toMatchObject({ type: 'input' })
  })

  it('removes the edge that uses the flipped port as source', () => {
    const store = createStore()

    store.getState().flipPort('a', 'a-out')

    expect(store.getState().edges).toHaveLength(0)
  })

  it('removes the edge that uses the flipped port as target', () => {
    const store = createStore()

    store.getState().flipPort('b', 'b-in')

    expect(store.getState().edges).toHaveLength(0)
  })

  it('keeps edges that connect to other ports', () => {
    const store = createStore()
    store.getState().onConnect({
      source: 'b',
      sourceHandle: 'b-out',
      target: 'a',
      targetHandle: 'a-in',
    })

    store.getState().flipPort('a', 'a-out')

    const edges = store.getState().edges
    expect(edges.find((e) => e.id === 'a-b')).toBeUndefined()
    expect(edges).toHaveLength(1)
    expect(edges[0]).toMatchObject({
      source: 'b',
      sourceHandle: 'b-out',
      target: 'a',
      targetHandle: 'a-in',
    })
  })
})

describe('portEditMode', () => {
  it('tracks whether the port editing mode is active', () => {
    const store = createStore()

    expect(store.getState().portEditMode).toBe(false)
    store.getState().setPortEditMode(true)
    expect(store.getState().portEditMode).toBe(true)
    store.getState().setPortEditMode(false)
    expect(store.getState().portEditMode).toBe(false)
  })
})
