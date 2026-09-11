import { BezierEdge, type Edge, type EdgeProps } from '@xyflow/react'

export type SparkData = Record<string, never>

export type SparkEdge = Edge<SparkData, 'spark'>

export function Spark(props: EdgeProps<SparkEdge>) {
  return <BezierEdge {...props} style={{ stroke: '#8b5cf6', strokeWidth: 2 }} />
}