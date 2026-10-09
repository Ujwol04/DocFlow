import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@Components/common/PageHeader"
import { Button } from "@Components/ui/Button"
import { Input } from "@Components/ui/Input"
import { Pencil } from "lucide-react"
import { useDocFlowRecordStore } from "@/store/DocFlowRecordStore"

export default function UpdateDocFlow() {
  const navigate = useNavigate()
  const { id } = useParams()
  const records = useDocFlowRecordStore((s) => s.records)
  const updateRecord = useDocFlowRecordStore((s) => s.updateRecord)

  const original = records.find((r) => r.id === id)
  const [name, setName] = useState(original?.name ?? "")
  const [description, setDescription] = useState(original?.description ?? "")

  if (!original) {
    return <div className="p-6 text-sm text-muted-foreground">Record not found.</div>
  }

  const handleUpdate = () => {
    if (!name.trim()) return
    updateRecord(id!, { name, description })
    navigate("/DocFlow")
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Update"
        description={`Editing record ${id ?? ""}`}
        icon={<Pencil className="size-5" />}
      />

      <div className="flex max-w-md flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/DocFlow")}>Cancel</Button>
          <Button onClick={handleUpdate}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}