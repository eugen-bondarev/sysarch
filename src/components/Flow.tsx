import { useEffect, useRef } from 'react'
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type XYPosition,
} from '@xyflow/react'
import { CustomNode } from './CustomNode'
import { CUSTOM_NODE_TYPE } from '../lib/node'
import { CUSTOM_EDGE_TYPE, CustomEdge } from './CustomEdge'
import { useFlowStore } from '../store'
import { useThemeStore, type Theme } from '../store/theme'
import { Sidebar } from './inspector/Sidebar'
import { NodeInspector } from './inspector/NodeInspector'
import Button from './ui/button'
import ThemeButton from './ui/theme-button'

const NODE_TYPES = { [CUSTOM_NODE_TYPE]: CustomNode }
const EDGE_TYPES = { [CUSTOM_EDGE_TYPE]: CustomEdge }

const isSystemDark = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false

function FlowCanvas({ theme }: { theme: Theme }) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    registerFlowApi,
    startDeletingNodes,
    finishDeletingNodes,
  } = useFlowStore()

  const { screenToFlowPosition } = useReactFlow()
  const mouseRef = useRef<XYPosition | null>(null)

  useEffect(() => {
    registerFlowApi({
      screenToFlowPosition,
      getCursor: () => mouseRef.current,
    })
  }, [registerFlowApi, screenToFlowPosition])

  return (
    <div
      className="h-screen"
      onMouseMove={(event) => {
        mouseRef.current = { x: event.clientX, y: event.clientY }
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onBeforeDelete={async ({
          nodes: nodesToDelete,
          edges: edgesToDelete,
        }) => {
          if (nodesToDelete.length === 0) {
            return true
          }
          startDeletingNodes(nodesToDelete.map((node) => node.id))
          setTimeout(
            () =>
              finishDeletingNodes(
                nodesToDelete.map((node) => node.id),
                edgesToDelete.map((edge) => edge.id),
              ),
            200,
          )
          return false
        }}
        elevateNodesOnSelect={false}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        colorMode={theme}
      >
        <Background size={2} gap={20} />
      </ReactFlow>
    </div>
  )
}

export function Flow() {
  const { nodes, addNode, save } = useFlowStore()

  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const apply = () => {
      document.documentElement.classList.toggle(
        'dark',
        theme === 'dark' || (theme === 'system' && isSystemDark()),
      )
    }
    apply()
    if (theme !== 'system') {
      return
    }
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mediaQuery) {
      return
    }
    mediaQuery.addEventListener('change', apply)
    return () => mediaQuery.removeEventListener('change', apply)
  }, [theme])

  const selectedNode = nodes.find((node) => node.selected)

  return (
    <>
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <Button onClick={addNode} className="static" hotkey={['Ctrl', 'A']}>
          Add node
        </Button>
        <Button onClick={save} className="static" hotkey={['Ctrl', 'S']}>
          Save
        </Button>
      </div>
      {selectedNode && (
        <Sidebar>
          <NodeInspector node={selectedNode} />
        </Sidebar>
      )}
      <ReactFlowProvider>
        <FlowCanvas theme={theme} />
      </ReactFlowProvider>
      <ThemeButton />
    </>
  )
}
