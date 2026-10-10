import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageHeader from "@Components/common/PageHeader"
import { Button } from "@Components/ui/Button"
import { Input } from "@Components/ui/Input"
import { FilePlus } from "lucide-react"
import { useDocFlowRecordStore } from "@/store/DocFlowRecordStore"

export default function CreateDocFlow() {
  const navigate = useNavigate()
  const addRecord = useDocFlowRecordStore((s) => s.addRecord)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = () => {
    if (!name.trim()) return
    addRecord({ name, description })
    navigate("/DocFlow")
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Create DocFlow"
        description="Add a new DocFlow record"
        icon={<FilePlus className="size-5" />}
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
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>
    </div>
  )
}