import {
  BaseEdge,
  Position,
  type Edge,
  type EdgeProps,
} from '@xyflow/react'
import {
  getConnectionPath,
  type EdgePosition,
} from '../lib/connection-path'

export type CustomEdgeData = Record<string, never>

export const CUSTOM_EDGE_TYPE = 'CUSTOM_EDGE'

export type CustomEdgeDefinition = Edge<CustomEdgeData, typeof CUSTOM_EDGE_TYPE>

const toEdgePosition = (position: Position): EdgePosition => {
  switch (position) {
    case Position.Left:
      return 'left'
    case Position.Right:
      return 'right'
    case Position.Top:
      return 'top'
    case Position.Bottom:
      return 'bottom'
  }
}

export function CustomEdge(props: EdgeProps<CustomEdgeDefinition>) {
  const path = getConnectionPath(
    { x: props.sourceX, y: props.sourceY },
    { x: props.targetX, y: props.targetY },
    toEdgePosition(props.sourcePosition),
    toEdgePosition(props.targetPosition),
  )

  return (
    <BaseEdge
      id={props.id}
      path={path}
      label={props.label}
      labelStyle={props.labelStyle}
      labelShowBg={props.labelShowBg}
      labelBgStyle={props.labelBgStyle}
      labelBgPadding={props.labelBgPadding}
      labelBgBorderRadius={props.labelBgBorderRadius}
      markerStart={props.markerStart}
      markerEnd={props.markerEnd}
      interactionWidth={props.interactionWidth}
      style={{ stroke: '#8b5cf6', strokeWidth: 2 }}
    />
  )
}