import { createFlowStore } from './flow'
import { LocalStorageGraphStorage } from './local-storage-graph-storage'

export const useFlowStore = createFlowStore(new LocalStorageGraphStorage())