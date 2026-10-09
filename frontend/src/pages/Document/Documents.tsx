import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  FileText,
  Search,
  Eye,
  Download,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@Components/ui/Button";
import { Badge } from "@Components/ui/Badge";
import { Input } from "@Components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Components/index";
import { useDocFlowStore } from "@/store/DocFlowStore";
import ViewDocumentDialog from "@Components/documents/ViewDocumentDialog";
import type { GeneratedDocument } from "@Types/types";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import jsPDF from "jspdf";

const CATEGORY_LABEL: Record<string, string> = {
  Invoice: "Finance",
  Letter: "Email",
  Report: "Notes",
  Other: "Other",
};

const LETTERHEAD = {
  name: "DocFlow",
  tagline: "Reusable documents with dynamic fields",
  address: "Kathmandu, Nepal",
};

export default function Documents() {
  const navigate = useNavigate();
  const documents = useDocFlowStore((s) => s.documents);
  const templates = useDocFlowStore((s) => s.templates);
  const deleteDocument = useDocFlowStore((s) => s.deleteDocument);
  const [query, setQuery] = useState("");
  const [viewTarget, setViewTarget] = useState<GeneratedDocument | null>(null);

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.id.toLowerCase().includes(query.toLowerCase()),
  );

  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = async (doc: GeneratedDocument) => {
    const entries = Object.entries(doc.values).filter(([, v]) => v);

    const docx = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: LETTERHEAD.name, bold: true, size: 32 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: LETTERHEAD.tagline,
                  size: 20,
                  color: "666666",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: LETTERHEAD.address,
                  size: 20,
                  color: "666666",
                }),
              ],
            }),
            new Paragraph({
              border: {
                bottom: { color: "999999", space: 4, style: "single", size: 6 },
              },
              children: [new TextRun({ text: "" })],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: doc.title,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Status: ${doc.status}`, break: 1 }),
                new TextRun({ text: `Date: ${doc.date}`, break: 1 }),
              ],
            }),
            new Paragraph({ text: "" }),
            ...entries.map(
              ([label, value]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${label}: `, bold: true }),
                    new TextRun({ text: value }),
                  ],
                }),
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(docx);
    saveBlob(blob, `${doc.title.replace(/[^a-z0-9]+/gi, "-")}.docx`);
  };

  const handleDownloadPdf = (doc: GeneratedDocument) => {
    const entries = Object.entries(doc.values).filter(([, v]) => v);
    const pdf = new jsPDF();

    let y = 20;
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(20);
    pdf.text(LETTERHEAD.name, 14, y);
    y += 7;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(110);
    pdf.text(LETTERHEAD.tagline, 14, y);
    y += 5;
    pdf.text(LETTERHEAD.address, 14, y);
    y += 6;

    pdf.setDrawColor(180);
    pdf.line(14, y, 196, y);
    y += 12;

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(20);
    pdf.text(doc.title, 14, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120);
    pdf.text(`Status: ${doc.status}   Date: ${doc.date}`, 14, y);
    y += 12;

    pdf.setTextColor(20);
    entries.forEach(([label, value]) => {
      pdf.setFont("helvetica", "bold");
      pdf.text(`${label}:`, 14, y);
      pdf.setFont("helvetica", "normal");
      pdf.text(value, 14, y + 6);
      y += 14;
    });

    if (entries.length === 0) {
      pdf.text("No fields filled in", 14, y);
    }

    pdf.save(`${doc.title.replace(/[^a-z0-9]+/gi, "-")}.pdf`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this document? This can't be undone.")) {
      deleteDocument(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
            <Copy className="size-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Generated documents
            </h1>
            <p className="text-sm text-muted-foreground">
              Documents you've filled in and saved
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="dark:border-blue-500/60 dark:text-blue-400 dark:hover:bg-blue-500/10"
          onClick={() => navigate("/templates")}
        >
          <FileText className="size-4" /> Browse templates
        </Button>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search generated documents..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => {
          const template = templates.find((t) => t.id === doc.templateId);
          const entries = Object.entries(doc.values).filter(([, v]) => v);
          return (
            <div
              key={doc.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <FileText className="size-4 text-muted-foreground" />
                </div>
                {template && (
                  <Badge variant="secondary" className="font-medium">
                    {CATEGORY_LABEL[template.category] ?? template.category}
                  </Badge>
                )}
              </div>

              <div className="font-semibold text-foreground">{doc.title}</div>
              {template && (
                <div className="mt-0.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  From: {template.name}
                </div>
              )}

              <div className="mt-3 flex flex-col gap-1 text-sm">
                {entries.slice(0, 3).map(([label, value]) => (
                  <div key={label} className="truncate text-muted-foreground">
                    {label}: <span className="text-foreground">{value}</span>
                  </div>
                ))}
                {entries.length === 0 && (
                  <div className="text-muted-foreground">
                    No fields filled in
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-500"
                  onClick={() => setViewTarget(doc)}
                >
                  <Eye className="size-3.5" /> View
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 dark:border-blue-500/60 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      <Download className="size-3.5" /> Download{" "}
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDownloadDocx(doc)}>
                      Download as .docx
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadPdf(doc)}>
                      Download as .pdf
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="icon-sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive dark:border-destructive/40 dark:text-red-400 dark:hover:bg-destructive/10"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No generated documents yet.
        </div>
      )}

      <ViewDocumentDialog
        document={viewTarget}
        template={templates.find((t) => t.id === viewTarget?.templateId)}
        onOpenChange={(open) => !open && setViewTarget(null)}
      />
    </div>
  );
}
