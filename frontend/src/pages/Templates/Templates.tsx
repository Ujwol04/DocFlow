import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Plus, Search, Zap, Pencil, Copy, Trash2 } from "lucide-react"
import PageHeader from "@Components/common/PageHeader"
import { Button } from "@Components/ui/Button"
import { Badge } from "@Components/ui/Badge"
import { Input } from "@Components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Components/ui/Select"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@Components/ui/Table"
import { useDocFlowStore } from "@/store/DocFlowStore"
import GenerateDocumentDialog from "@Components/documents/GenerateDocumentDialog"
import type { DocTemplate, TemplateCategory } from "@Types/types"

const CATEGORIES: TemplateCategory[] = ["Invoice", "Letter", "Report", "Other"]

export default function Templates() {
  const navigate = useNavigate()
  const templates = useDocFlowStore((s) => s.templates)
  const duplicateTemplate = useDocFlowStore((s) => s.duplicateTemplate)
  const deleteTemplate = useDocFlowStore((s) => s.deleteTemplate)

  const [genTarget, setGenTarget] = useState<DocTemplate | null>(null)
  const [category, setCategory] = useState<string>("all")
  const [query, setQuery] = useState("")

  const filtered = templates.filter(
    (t) =>
      (category === "all" || t.category === category) &&
      (!query ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Template Library"
        description="Reusable documents with dynamic fields"
        icon={<FileText className="size-5" />}
        iconClassName="rounded-xl bg-foreground text-background border-0 shadow-none p-2.5"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/documents")}
              className="h-11 rounded-xl px-5 font-semibold dark:border-blue-500/60 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              <Copy className="size-4" />
              Generated
            </Button>

            <Button
              onClick={() => navigate("/templates/new")}
              className="h-11 rounded-xl bg-[#181818] px-6 font-semibold text-white hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Plus className="size-4" />
              New Template
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search template"
          />
        </div>
        {(category !== "all" || query) && (
          <Button variant="outline" size="sm" onClick={() => { setCategory("all"); setQuery("") }}>
            Clear
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">S.N</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Dynamic fields</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t, i) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell>
                  <button
                    className="font-semibold text-foreground hover:underline"
                    onClick={() => setGenTarget(t)}
                  >
                    {t.name}
                  </button>
                </TableCell>
                <TableCell className="text-muted-foreground">{t.description}</TableCell>
                <TableCell><Badge variant="secondary">{t.category.toUpperCase()}</Badge></TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Zap className="size-3" /> {t.fields.length} fields</span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" onClick={() => setGenTarget(t)}><Copy className="size-3" /> Use</Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => navigate(`/templates/${t.id}/edit`)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="outline" onClick={() => duplicateTemplate(t.id)}><Copy className="size-3.5" /></Button>
                    <Button size="icon-sm" variant="destructive" onClick={() => deleteTemplate(t.id)}><Trash2 className="size-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No templates match your filters.</div>
        )}
      </div>
      <GenerateDocumentDialog template={genTarget} onOpenChange={(open) => !open && setGenTarget(null)} />
    </div>
  )
}