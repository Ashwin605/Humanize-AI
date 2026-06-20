"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/sidebar";
import { api, Template, Citation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);

  useEffect(() => {
    api.getTemplates().then(setTemplates).catch(() => {});
    api.getCitations().then(setCitations).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Your Library</h1>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Saved Templates ({templates.length})</CardTitle></CardHeader>
            <CardContent>
              {templates.length ? templates.map((t) => (
                <div key={t.id} className="p-3 rounded-lg hover:bg-secondary mb-2">
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.enhancementMode}</p>
                </div>
              )) : <p className="text-sm text-muted-foreground">No templates saved</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Citation Library ({citations.length})</CardTitle></CardHeader>
            <CardContent>
              {citations.length ? citations.map((c) => (
                <div key={c.id} className="p-3 rounded-lg hover:bg-secondary mb-2">
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{c.citation}</p>
                </div>
              )) : <p className="text-sm text-muted-foreground">No citations saved</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
