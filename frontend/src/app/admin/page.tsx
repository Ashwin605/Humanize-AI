"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function AdminPage() {
  return (
    <DashboardLayout>
      <AdminPanel />
    </DashboardLayout>
  );
}
