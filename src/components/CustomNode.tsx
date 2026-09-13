import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import {
  Handle,
  NodeResizer,
  useUpdateNodeInternals,
  type NodeProps,
} from '@xyflow/react'
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  clampToPerimeter,
  getPortPosition,
  PORT_SNAP_STEP,
  resolvePortPlacement,
  snapToStep,
} from '../lib/connection-path'
import { PORT_POSITION, type CustomNodeDefinition } from '../lib/node'
import { useFlowStore } from '../store'
import { cn } from '../lib/class'

export function CustomNode({
  id,
  data,
  selected,
}: NodeProps<CustomNodeDefinition>) {
  const updateNodeInternals = useUpdateNodeInternals()
  const updatePort = useFlowStore((state) => state.updatePort)
  const addPort = useFlowStore((state) => state.addPort)
  const removePort = useFlowStore((state) => state.removePort)
  const flipPort = useFlowStore((state) => state.flipPort)
  const portEditMode = useFlowStore((state) => state.portEditMode)
  const deleting = useFlowStore((state) => state.deletingNodeIds.includes(id))
  const pop = useFlowStore((state) => state.newNodeIds.includes(id))
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
        x: snapToStep(portX, PORT_SNAP_STEP),
        y: snapToStep(portY, PORT_SNAP_STEP),
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

  const onDoubleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (portEditMode) {
      return
    }
    const target = event.target as Element
    if (target.closest('[data-handleid]') || !nodeRef.current) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const rect = nodeRef.current.getBoundingClientRect()
    const zoom = rect.width / data.width
    const x = (event.clientX - rect.left) / zoom
    const y = (event.clientY - rect.top) / zoom
    const {
      x: portX,
      y: portY,
      type,
    } = resolvePortPlacement(x, y, data.width, data.height)
    addPort(id, type, portX, portY)
  }

  return (
    <div
      ref={nodeRef}
      className={cn(
        'relative border border-zinc-300 bg-white px-4 py-2 dark:border-zinc-600 dark:bg-zinc-900',
        selected && 'border-primary ring-2 ring-primary/30',
        deleting
          ? 'animate-[node-out_180ms_ease-in_forwards]'
          : pop && 'animate-[node-pop_200ms_ease-out]',
      )}
      style={{ width: data.width, height: data.height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDownCapture={onMouseDownCapture}
      onDoubleClick={onDoubleClick}
      onAnimationEnd={(event) => {
        if (event.animationName === 'node-pop') {
          updateNodeInternals(id)
        }
      }}
    >
      <NodeResizer
        isVisible={selected || hovered || resizing}
        minWidth={80}
        minHeight={60}
        color="var(--color-primary)"
        onResizeStart={() => setResizing(true)}
        onResizeEnd={() => setResizing(false)}
      />
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {data.label}
      </span>
      {data.ports.map((port) => {
        const side = getPortPosition(port.x, port.y, data.width, data.height)
        const offset = {
          left: { x: 16, y: 0 },
          right: { x: -16, y: 0 },
          top: { x: 0, y: 16 },
          bottom: { x: 0, y: -16 },
        }[side]
        const flexDirection = {
          left: 'column',
          right: 'column',
          top: 'row',
          bottom: 'row',
        }[side]
        return (
          <Fragment key={port.id}>
            <Handle
              id={port.id}
              type={port.type === 'input' ? 'target' : 'source'}
              position={PORT_POSITION[side]}
              isConnectableStart={port.type === 'output'}
              className={cn(
                'nokey',
                draggingPortId === port.id && 'cursor-move',
              )}
              style={{
                left: port.x,
                top: port.y,
                pointerEvents: portEditMode ? 'none' : 'all',
                transform: `translate(calc(-50% - 1.5px), -50%)`,
              }}
            />
            {portEditMode && (
              <div
                className="absolute z-10 flex gap-0.5"
                style={{
                  left: port.x,
                  top: port.y,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                  flexDirection: flexDirection as 'row' | 'column',
                }}
              >
                <button
                  title="Remove port"
                  onClick={(event) => {
                    event.stopPropagation()
                    removePort(id, port.id)
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  className="flex h-4 w-4 items-center justify-center bg-red-600 text-white shadow hover:bg-red-700"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
                <button
                  title="Flip port type"
                  onClick={(event) => {
                    event.stopPropagation()
                    flipPort(id, port.id)
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  className="flex h-4 w-4 items-center justify-center bg-slate-500 text-white shadow hover:bg-slate-600"
                >
                  <ArrowPathIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
