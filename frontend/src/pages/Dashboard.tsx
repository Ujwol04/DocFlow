import { useState } from "react"
import {Copy, FileStack,FileCheck2,Clock3, Flame,
  type LucideIcon,
} from "lucide-react"
import { Card } from "@Components/ui/Card"
import { Badge } from "@Components/ui/Badge"
import { Button } from "@Components/ui/Button"
import { cn } from "@Utils/cn"
import { useDocFlowStore } from "@/store/DocFlowStore"
import GenerateDocumentDialog from "@Components/documents/GenerateDocumentDialog"
import type { DocTemplate } from "@Types/types"

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Final: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Sent: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
}

type Accent = "indigo" | "emerald" | "amber" | "rose"

const ACCENT_STYLES: Record<Accent, { icon: string; ring: string; text: string }> = {
  indigo: { icon: "bg-indigo-500", ring: "before:bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
  emerald: { icon: "bg-emerald-500", ring: "before:bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  amber: { icon: "bg-amber-500", ring: "before:bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  rose: { icon: "bg-rose-500", ring: "before:bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
}

function Metric({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  sub: string
  icon: LucideIcon
  accent: Accent
}) {
  const styles = ACCENT_STYLES[accent]
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-4 pl-5 before:absolute before:inset-y-0 before:left-0 before:w-1",
        styles.ring
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className={cn("flex size-8 items-center justify-center rounded-lg text-white", styles.icon)}>
          <Icon className="size-4" strokeWidth={2} />
        </div>
      </div>
      <div className="truncate text-2xl font-extrabold text-foreground">{value}</div>
      <div className={cn("mt-1.5 text-xs font-semibold", styles.text)}>{sub}</div>
    </Card>
  )
}

const Dashboard = () => {
  const templates = useDocFlowStore((s) => s.templates)
  const documents = useDocFlowStore((s) => s.documents)
  const [genTarget, setGenTarget] = useState<DocTemplate | null>(null)

  const draftCount = documents.filter((d) => d.status === "Draft").length
  const mostUsed = [...templates].sort((a, b) => b.uses - a.uses)[0]
  const recent = documents.slice(0, 5)

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Dashboard</h1>

      <div className="grid grid-cols-4 gap-3">
        <Metric label="Templates" value={templates.length} sub="Active" icon={FileStack} accent="indigo" />
        <Metric label="Documents generated" value={documents.length} sub="All time" icon={FileCheck2} accent="emerald" />
        <Metric label="Drafts pending" value={draftCount} sub="Needs review" icon={Clock3} accent="amber" />
        <Metric
          label="Most used template"
          value={mostUsed?.name ?? "—"}
          sub={mostUsed ? `${mostUsed.uses} uses` : ""}
          icon={Flame}
          accent="rose"
        />
      </div>

      <Card className="p-0">
        <div className="border-b border-border px-4 py-3 text-sm font-bold text-foreground">Recent documents</div>
        {recent.map((doc) => {
          const template = templates.find((t) => t.id === doc.templateId)
          return (
            <div key={doc.id} className="flex items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0">
              <span className="w-20 text-xs text-muted-foreground">{doc.id}</span>
              <span className="flex-1 font-medium text-foreground">{doc.title}</span>
              <span className="w-24 text-xs text-muted-foreground">{doc.date}</span>
              <Badge className={cn("border-0", STATUS_STYLES[doc.status])}>{doc.status}</Badge>
              {template && (
                <Button size="sm" onClick={() => setGenTarget(template)}>
                  <Copy className="size-3" /> Use
                </Button>
              )}
            </div>
          )
        })}
        {recent.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">No documents yet.</div>
        )}
      </Card>

      <GenerateDocumentDialog template={genTarget} onOpenChange={(open) => !open && setGenTarget(null)} />
    </div>
  )
}

export default Dashboard