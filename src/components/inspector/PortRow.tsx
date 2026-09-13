import { useFlowStore } from '../../store'
import type { Port } from '../../lib/node'

type PortRowProps = {
  nodeId: string
  port: Port
}

export default function PortRow({ nodeId, port }: PortRowProps) {
  const updatePort = useFlowStore((state) => state.updatePort)
  const removePort = useFlowStore((state) => state.removePort)

  return (
    <li className="rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {port.type}
        </span>
        <button
          onClick={() => removePort(nodeId, port.id)}
          className="rounded px-1.5 text-xs text-zinc-500 hover:bg-red-100 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          Remove
        </button>
      </div>
      <label className="mt-1 block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        Label
      </label>
      <input
        value={port.label}
        onChange={(event) =>
          updatePort(nodeId, port.id, { label: event.target.value })
        }
        className="mt-0.5 w-full border border-zinc-300 px-2 py-1 text-xs text-zinc-800 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <div className="mt-1 flex gap-1.5">
        <label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          X
          <input
            type="number"
            value={port.x}
            onChange={(event) =>
              updatePort(nodeId, port.id, { x: Number(event.target.value) })
            }
            className="mt-0.5 ml-2 w-16 border border-zinc-300 px-1.5 py-0.5 text-xs text-zinc-800 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>
        <label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Y
          <input
            type="number"
            value={port.y}
            onChange={(event) =>
              updatePort(nodeId, port.id, { y: Number(event.target.value) })
            }
            className="mt-0.5 ml-2 w-16 border border-zinc-300 px-1.5 py-0.5 text-xs text-zinc-800 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>
      </div>
    </li>
  )
}
