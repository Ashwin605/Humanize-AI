"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar";
import { DocumentEditor } from "@/components/editor/document-editor";

export default function DocumentPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <DocumentEditor documentId={params.id} />
    </DashboardLayout>
  );
}
