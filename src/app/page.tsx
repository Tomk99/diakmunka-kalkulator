// src/app/page.tsx
"use client";

import { WorkEntryForm } from "@/app/components/WorkEntryForm";
import { WorkLogTable } from "@/app/components/WorkLogTable";
import { useWorkLog } from "@/app/hooks/useWorkLog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsDialog } from "@/app/components/SettingsDialog";

export default function Home() {
  const {
    settings,
    setSettings,
    entries,
    addEntry,
    deleteEntry,
    calculateDailyPay,
    summary,
  } = useWorkLog();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: "HUF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Diákmunka Kalkulátor</h1>
        <SettingsDialog settings={settings} onSave={setSettings} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* A komponens neve itt lett javítva: */}
          <WorkLogTable
            entries={entries}
            calculateDailyPay={calculateDailyPay}
            deleteEntry={deleteEntry}
          />
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Összesítés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span>Összes óra:</span>
                <span className="font-semibold">{summary.totalHours} óra</span>
              </div>
              <div className="flex justify-between">
                <span>Várható bruttó bér:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(summary.totalEarnings)}
                </span>
              </div>
            </CardContent>
          </Card>
          <WorkEntryForm addEntry={addEntry} />
        </div>
      </div>
    </main>
  );
}