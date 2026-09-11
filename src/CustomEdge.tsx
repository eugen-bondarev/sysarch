import { BezierEdge, type Edge, type EdgeProps } from '@xyflow/react'

export type CustomEdgeData = Record<string, never>

export const CUSTOM_EDGE_TYPE = 'CUSTOM_EDGE'

export type CustomEdgeDefinition = Edge<CustomEdgeData, typeof CUSTOM_EDGE_TYPE>

export function CustomEdge(props: EdgeProps<CustomEdgeDefinition>) {
  return <BezierEdge {...props} style={{ stroke: '#8b5cf6', strokeWidth: 2 }} />
}
