import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@Components/ui/Dialog"
import { Button } from "@Components/ui/Button"
import { Input } from "@Components/ui/Input"
import { useDocFlowStore } from "@/store/DocFlowStore"
import type { DocTemplate } from "@Types/types.ts"

interface Props {
  template: DocTemplate | null
  onOpenChange: (open: boolean) => void
}

export function GenerateDocumentDialog({ template, onOpenChange }: Props) {
  return (
    <Dialog open={!!template} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        
        {template && (
          <GenerateDocumentForm
            key={template.id}
            template={template}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface FormProps {
  template: DocTemplate
  onOpenChange: (open: boolean) => void
}

function GenerateDocumentForm({ template, onOpenChange }: FormProps) {
  const generateDocument = useDocFlowStore((s) => s.generateDocument)
  const [values, setValues] = useState<Record<string, string>>({})
  const [step, setStep] = useState<"form" | "preview">("form")

  const title = values[template.fields[0]?.label]
    ? `${template.name} - ${values[template.fields[0].label]}`
    : template.name

  const save = (status: "Draft" | "Final") => {
    generateDocument(template.id, values, status)
    onOpenChange(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{step === "form" ? `Generate: ${template.name}` : "Preview"}</DialogTitle>
      </DialogHeader>

      {step === "form" ? (
        <>
          <div className="flex flex-col gap-3">
            {template.fields.map((f, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                <Input
                  type={f.type === "date" ? "date" : "text"}
                  value={values[f.label] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.label]: e.target.value }))}
                  placeholder={f.type === "date" ? undefined : `Enter ${f.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => setStep("preview")}>Preview document</Button>
          </DialogFooter>
        </>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="mb-2 font-heading text-base font-semibold text-foreground">{title}</div>
            {template.fields.map((f, i) => (
              <div key={i} className="flex justify-between border-b border-border py-1.5 text-sm last:border-b-0">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-medium text-foreground">{values[f.label] || "—"}</span>
              </div>
            ))}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setStep("form")}>Back</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => save("Draft")}>Save as draft</Button>
              <Button onClick={() => save("Final")}>Finalize document</Button>
            </div>
          </DialogFooter>
        </>
      )}
    </>
  )
}

export default GenerateDocumentDialog