import { describe, expect, it, beforeAll } from 'vitest'
import { createFlowStore } from './flow'
import { LocalStorageGraphStorage } from './local-storage-graph-storage'

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

describe('addPort', () => {
  it('places a port at the given position when provided', () => {
    localStorage.clear()
    const store = createFlowStore(
      new LocalStorageGraphStorage('sysarch.graph.test'),
    )

    store.getState().addPort('a', 'input', 0, 50)

    const node = store.getState().nodes.find((n) => n.id === 'a')!
    const port = node.data.ports.at(-1)!
    expect(port).toMatchObject({ type: 'input', x: 0, y: 50 })
  })

  it('uses the default placement when no position is provided', () => {
    localStorage.clear()
    const store = createFlowStore(
      new LocalStorageGraphStorage('sysarch.graph.test'),
    )

    store.getState().addPort('a', 'output')

    const node = store.getState().nodes.find((n) => n.id === 'a')!
    const port = node.data.ports.at(-1)!
    expect(port).toMatchObject({ type: 'output', x: node.data.width, y: 60 })
  })
})

describe('flipPort', () => {
  const createStore = () =>
    createFlowStore(new LocalStorageGraphStorage('sysarch.graph.test'))

  const port = (store: ReturnType<typeof createStore>, id: string) =>
    store
      .getState()
      .nodes.find((n) => n.id === 'a')!
      .data.ports.find((p) => p.id === id)!

  it('flips an input port to an output port and keeps its position', () => {
    localStorage.clear()
    const store = createStore()

    store.getState().flipPort('a', 'a-in')

    expect(port(store, 'a-in')).toMatchObject({ type: 'output', x: 0, y: 20 })
  })

  it('flips an output port to an input port', () => {
    localStorage.clear()
    const store = createStore()

    store.getState().flipPort('a', 'a-out')

    expect(port(store, 'a-out')).toMatchObject({ type: 'input' })
  })

  it('removes the edge that uses the flipped port as source', () => {
    localStorage.clear()
    const store = createStore()

    store.getState().flipPort('a', 'a-out')

    expect(store.getState().edges).toHaveLength(0)
  })

  it('removes the edge that uses the flipped port as target', () => {
    localStorage.clear()
    const store = createStore()

    store.getState().flipPort('b', 'b-in')

    expect(store.getState().edges).toHaveLength(0)
  })

  it('keeps edges that connect to other ports', () => {
    localStorage.clear()
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
    localStorage.clear()
    const store = createFlowStore(
      new LocalStorageGraphStorage('sysarch.graph.test'),
    )

    expect(store.getState().portEditMode).toBe(false)
    store.getState().setPortEditMode(true)
    expect(store.getState().portEditMode).toBe(true)
    store.getState().setPortEditMode(false)
    expect(store.getState().portEditMode).toBe(false)
  })
})
