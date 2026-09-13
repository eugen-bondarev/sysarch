import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import {
  Handle,
  NodeResizer,
  useUpdateNodeInternals,
  type NodeProps,
} from '@xyflow/react'
import { clampToPerimeter, getPortPosition } from '../lib/connection-path'
import {
  PORT_POSITION,
  type CustomNodeDefinition,
} from '../lib/node'
import { useFlowStore } from '../store'
import { cn } from '../lib/class'

export function CustomNode({
  id,
  data,
  selected,
}: NodeProps<CustomNodeDefinition>) {
  const updateNodeInternals = useUpdateNodeInternals()
  const updatePort = useFlowStore((state) => state.updatePort)
  const [hovered, setHovered] = useState(false)
  const [resizing, setResizing] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const [draggingPortId, setDraggingPortId] = useState<string | null>(null)

  useEffect(() => {
    updateNodeInternals(id)
  }, [id, data.ports, data.width, data.height, updateNodeInternals])

  const onMouseDownCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!event.shiftKey || event.button !== 0) {
      return
    }
    const handleElement = (event.target as Element).closest('[data-handleid]')
    if (!handleElement || !nodeRef.current) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const portId = handleElement.getAttribute('data-handleid')
    if (!portId) {
      return
    }
    const rect = nodeRef.current.getBoundingClientRect()
    const zoom = rect.width / data.width

    const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const x = (moveEvent.clientX - rect.left) / zoom
      const y = (moveEvent.clientY - rect.top) / zoom
      const { x: portX, y: portY } = clampToPerimeter(
        x,
        y,
        data.width,
        data.height,
      )
      updatePort(id, portId, {
        x: Math.round(portX),
        y: Math.round(portY),
      })
    }
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      setDraggingPortId(null)
    }
    setDraggingPortId(portId)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={nodeRef}
      className={cn(
        'relative border border-zinc-300 bg-white px-4 py-2 shadow',
        selected && 'border-violet-500 ring-2 ring-violet-300',
      )}
      style={{ width: data.width, height: data.height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDownCapture={onMouseDownCapture}
    >
      <NodeResizer
        isVisible={selected || hovered || resizing}
        minWidth={80}
        minHeight={60}
        color="#8b5cf6"
        onResizeStart={() => setResizing(true)}
        onResizeEnd={() => setResizing(false)}
      />
      <span className="text-sm font-medium text-zinc-700">{data.label}</span>
      {data.ports.map((port) => (
        <Handle
          key={port.id}
          id={port.id}
          type={port.type === 'input' ? 'target' : 'source'}
          position={PORT_POSITION[getPortPosition(port.x, port.y, data.width, data.height)]}
          isConnectableStart={port.type === 'output'}
          className={cn('nokey', draggingPortId === port.id && 'cursor-move')}
          style={{
            left: port.x,
            top: port.y,
            pointerEvents: 'all',
            transform: `translate(calc(-50% - ${port.type === 'input' ? 0 : 2}px), -50%)`,
          }}
        />
      ))}
    </div>
  )
}