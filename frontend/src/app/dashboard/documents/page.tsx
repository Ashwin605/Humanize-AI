"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/sidebar";
import { api, Document } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDocuments()
      .then(setDocuments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await api.deleteDocument(id);
    setDocuments((docs) => docs.filter((d) => d.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Documents</h1>
          <Link href="/dashboard/documents/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Document</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />)}
          </div>
        ) : documents.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="group relative hover:border-gold-500/30">
                <CardContent className="pt-6">
                  <Link href={`/dashboard/documents/${doc.id}`}>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-gold-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate group-hover:text-gold-500 transition-colors">{doc.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{doc.wordCount} words · {formatDate(doc.updatedAt)}</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                          doc.status === "ENHANCED" ? "bg-green-500/10 text-green-600" : "bg-secondary"
                        }`}>{doc.status}</span>
                      </div>
                    </div>
                  </Link>
                  <Button variant="ghost" size="icon" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No documents yet</p>
            <Link href="/dashboard/documents/new"><Button>Create Document</Button></Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
