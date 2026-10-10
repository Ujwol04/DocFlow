import { create } from "zustand"
import type { DocTemplate, GeneratedDocument, DocumentStatus } from "@Types/types"

const initialTemplates: DocTemplate[] = [
  {
    id: "t1",
    name: "Freelance Invoice",
    category: "Invoice",
    description: "Standard invoice template for freelance clients",
    uses: 24,
    updatedAt: "2026-08-02",
    content: "INVOICE\n\nFrom: {{your_name}}\nDate: {{invoice_date}}\n\nBill To:\n{{client_name}}\n\nAmount Due: ${{amount_due}}\n\nPayment is due within 14 days.",
    fields: [
      { key: "your_name", label: "Your name", type: "text" },
      { key: "invoice_date", label: "Invoice date", type: "date" },
      { key: "client_name", label: "Client name", type: "text" },
      { key: "amount_due", label: "Amount due", type: "text" },
    ],
  },
  {
    id: "t2",
    name: "Welcome Email",
    category: "Letter",
    description: "Onboarding email for new customers",
    uses: 11,
    updatedAt: "2026-07-28",
    content: "Hi {{recipient_name}},\n\nWelcome aboard! Your account starts on {{start_date}}.",
    fields: [
      { key: "recipient_name", label: "Recipient name", type: "text" },
      { key: "start_date", label: "Start date", type: "date" },
    ],
  },
  {
    id: "t3",
    name: "Meeting Notes",
    category: "Report",
    description: "Structured meeting notes template",
    uses: 8,
    updatedAt: "2026-08-09",
    content: "Meeting Notes\n\nDate: {{meeting_date}}\nAttendees: {{attendees}}\n\nSummary:\n{{summary}}",
    fields: [
      { key: "meeting_date", label: "Meeting date", type: "date" },
      { key: "attendees", label: "Attendees", type: "text" },
      { key: "summary", label: "Summary", type: "text" },
    ],
  },
]

const initialDocuments: GeneratedDocument[] = [
  { id: "DOC-0031", title: "Invoice - Meridian Co.", templateId: "t1", status: "Final", date: "2026-08-11", values: {} },
  { id: "DOC-0030", title: "Follow-up - J. Alvarez", templateId: "t2", status: "Sent", date: "2026-08-10", values: {} },
  { id: "DOC-0029", title: "Invoice - Barrow Textiles", templateId: "t1", status: "Draft", date: "2026-08-09", values: {} },
]

type DocFlowStore = {
  templates: DocTemplate[]
  documents: GeneratedDocument[]
  addTemplate: (t: Omit<DocTemplate, "id" | "uses" | "updatedAt">) => void
  updateTemplate: (id: string, patch: Partial<Omit<DocTemplate, "id">>) => void
  duplicateTemplate: (id: string) => void
  deleteTemplate: (id: string) => void
  generateDocument: (
    templateId: string,
    values: Record<string, string>,
    status: DocumentStatus
  ) => void
  deleteDocument: (id: string) => void
}

export const useDocFlowStore = create<DocFlowStore>((set, get) => ({
  templates: initialTemplates,
  documents: initialDocuments,

  addTemplate: (t) =>
    set((s) => ({
      templates: [
        { ...t, id: `t${Date.now()}`, uses: 0, updatedAt: new Date().toISOString().slice(0, 10) },
        ...s.templates,
      ],
    })),

  updateTemplate: (id, patch) =>
    set((s) => ({
      templates: s.templates.map((t) =>
        t.id === id
          ? { ...t, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
          : t
      ),
    })),

  duplicateTemplate: (id) =>
    set((s) => {
      const source = s.templates.find((t) => t.id === id)
      if (!source) return s
      return {
        templates: [
          { ...source, id: `t${Date.now()}`, name: `${source.name} (copy)`, uses: 0 },
          ...s.templates,
        ],
      }
    }),

  deleteTemplate: (id) =>
    set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

  generateDocument: (templateId, values, status) => {
    const { templates, documents } = get()
    const template = templates.find((t) => t.id === templateId)
    if (!template) return
    const firstField = template.fields[0]?.label
    const title = firstField && values[firstField]
      ? `${template.name} - ${values[firstField]}`
      : template.name
    const id = `DOC-${String(documents.length + 32).padStart(4, "0")}`
    set({
      documents: [
        { id, title, templateId, status, date: new Date().toISOString().slice(0, 10), values },
        ...documents,
      ],
      templates: templates.map((t) => (t.id === templateId ? { ...t, uses: t.uses + 1 } : t)),
    })
  },

  deleteDocument: (id) =>
    set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
}))
