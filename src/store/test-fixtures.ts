import { CUSTOM_EDGE_TYPE } from '../components/CustomEdge'
import { CUSTOM_NODE_TYPE, NODE_HEIGHT, NODE_WIDTH } from '../lib/node'
import { type StoredEdge, type StoredNode } from './graph-storage'

export const INITIAL_NODES: StoredNode[] = [
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

export const INITIAL_EDGES: StoredEdge[] = [
  {
    id: 'a-b',
    source: 'a',
    sourceHandle: 'a-out',
    target: 'b',
    targetHandle: 'b-in',
    type: CUSTOM_EDGE_TYPE,
  },
]