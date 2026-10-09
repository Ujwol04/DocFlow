import { create } from "zustand"
import type { DocFlowRecord } from "@Types/types"

type DocFlowRecordStore = {
  records: DocFlowRecord[]
  addRecord: (r: { name: string; description: string }) => void
  updateRecord: (id: string, patch: Partial<Omit<DocFlowRecord, "id">>) => void
  deleteRecord: (id: string) => void
}

export const useDocFlowRecordStore = create<DocFlowRecordStore>((set) => ({
  records: [],

  addRecord: (r) =>
    set((s) => ({
      records: [
        {
          ...r,
          id: `DocFlow${Date.now()}`,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        },
        ...s.records,
      ],
    })),

  updateRecord: (id, patch) =>
    set((s) => ({
      records: s.records.map((r) =>
        r.id === id
          ? { ...r, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
          : r
      ),
    })),

  deleteRecord: (id) =>
    set((s) => ({ records: s.records.filter((r) => r.id !== id) })),
}))