"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar";
import { LegalAssistant } from "@/components/assistant/legal-assistant";

export default function AssistantPage() {
  return (
    <DashboardLayout>
      <LegalAssistant />
    </DashboardLayout>
  );
}
