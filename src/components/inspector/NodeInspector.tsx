import { useFlowStore } from '../../store'
import type { CustomNodeDefinition } from '../CustomNode'
import PortRow from './PortRow'

type NodeInspectorProps = {
  node: CustomNodeDefinition
}

export function NodeInspector({ node }: NodeInspectorProps) {
  const updateNodeData = useFlowStore((state) => state.updateNodeData)
  const updateNodeZIndex = useFlowStore((state) => state.updateNodeZIndex)
  const addPort = useFlowStore((state) => state.addPort)

  return (
    <>
      <h2 className="mb-3 text-sm font-semibold text-zinc-800">Node details</h2>
      <label className="block text-xs font-medium text-zinc-500">Label</label>
      <input
        value={node.data.label}
        onChange={(event) =>
          updateNodeData(node.id, { label: event.target.value })
        }
        className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-violet-500 focus:outline-none"
      />
      <label className="mt-3 block text-xs font-medium text-zinc-500">Z-index</label>
      <input
        type="number"
        value={node.zIndex ?? 0}
        onChange={(event) =>
          updateNodeZIndex(node.id, Number(event.target.value))
        }
        className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-violet-500 focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-500">Ports</h3>
        <div className="flex gap-1">
          <button
            onClick={() => addPort(node.id, 'input')}
            className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
          >
            + Input
          </button>
          <button
            onClick={() => addPort(node.id, 'output')}
            className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
          >
            + Output
          </button>
        </div>
      </div>
      <ul className="mt-1 space-y-2">
        {node.data.ports.map((port) => (
          <PortRow key={port.id} nodeId={node.id} port={port} />
        ))}
      </ul>
    </>
  )
}
