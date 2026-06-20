"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/sidebar";
import { api, Template } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    api.getTemplates().then(setTemplates).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <h1 className="font-display text-2xl font-bold">Saved Templates</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Card key={t.id}>
              <CardHeader><CardTitle className="text-lg">{t.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.description || t.enhancementMode}</p>
              </CardContent>
            </Card>
          ))}
          {!templates.length && (
            <p className="text-muted-foreground col-span-full text-center py-8">No templates yet. Save a document as a template from the editor.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
