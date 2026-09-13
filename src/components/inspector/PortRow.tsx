import { useFlowStore } from '../../store'
import type { Port } from '../CustomNode'

type PortRowProps = {
  nodeId: string
  port: Port
}

export default function PortRow({ nodeId, port }: PortRowProps) {
  const updatePort = useFlowStore((state) => state.updatePort)
  const removePort = useFlowStore((state) => state.removePort)

  return (
    <li className="rounded-md border border-zinc-200 bg-zinc-50 p-2">
      <div className="flex items-center justify-between">
        <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-600">
          {port.type}
        </span>
        <button
          onClick={() => removePort(nodeId, port.id)}
          className="rounded px-1.5 text-xs text-zinc-500 hover:bg-red-100 hover:text-red-600"
        >
          Remove
        </button>
      </div>
      <label className="mt-1 block text-[11px] font-medium text-zinc-500">
        Label
      </label>
      <input
        value={port.label}
        onChange={(event) =>
          updatePort(nodeId, port.id, { label: event.target.value })
        }
        className="mt-0.5 w-full rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-800 focus:border-violet-500 focus:outline-none"
      />
      <div className="mt-1 flex gap-1.5">
        <label className="text-[11px] font-medium text-zinc-500">
          X
          <input
            type="number"
            value={port.x}
            onChange={(event) =>
              updatePort(nodeId, port.id, { x: Number(event.target.value) })
            }
            className="mt-0.5 w-16 rounded-md border border-zinc-300 px-1.5 py-0.5 text-xs text-zinc-800 focus:border-violet-500 focus:outline-none"
          />
        </label>
        <label className="text-[11px] font-medium text-zinc-500">
          Y
          <input
            type="number"
            value={port.y}
            onChange={(event) =>
              updatePort(nodeId, port.id, { y: Number(event.target.value) })
            }
            className="mt-0.5 w-16 rounded-md border border-zinc-300 px-1.5 py-0.5 text-xs text-zinc-800 focus:border-violet-500 focus:outline-none"
          />
        </label>
      </div>
    </li>
  )
}
