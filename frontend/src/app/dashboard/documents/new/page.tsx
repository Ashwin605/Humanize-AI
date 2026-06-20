"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar";
import { DocumentEditor } from "@/components/editor/document-editor";

export default function NewDocumentPage() {
  return (
    <DashboardLayout>
      <DocumentEditor />
    </DashboardLayout>
  );
}
