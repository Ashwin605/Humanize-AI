"use client";

import { DocumentEditor } from "@/components/editor/document-editor";
import { DashboardLayout } from "@/components/dashboard/sidebar";

export default function HomePage() {
  return (
    <DashboardLayout>
      <DocumentEditor />
    </DashboardLayout>
  );
}
