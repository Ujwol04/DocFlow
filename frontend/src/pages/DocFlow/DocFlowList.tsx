import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, ListChecks } from "lucide-react"
import PageHeader from "@Components/common/PageHeader"
import { Button } from "@Components/ui/Button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@Components/ui/Table"
import { useDocFlowRecordStore } from "@/store/DocFlowRecordStore"

export default function DocFlowList() {
  const navigate = useNavigate()
  const records = useDocFlowRecordStore((s) => s.records)
  const deleteRecord = useDocFlowRecordStore((s) => s.deleteRecord)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="DocFlow Records"
        description="Manage your DocFlow entries"
        icon={<ListChecks className="size-5" />}
        action={
          <Button onClick={() => navigate("/DocFlow/create")}>
            <Plus className="size-4" /> New
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-semibold">{r.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.description}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => navigate(`/DocFlow/update/${r.id}`)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => deleteRecord(r.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {records.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No records yet. Click "New" to add one.
          </div>
        )}
      </div>
    </div>
  )
}