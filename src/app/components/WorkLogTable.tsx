// src/app/components/WorkLogTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { WorkEntry } from "@/app/hooks/useWorkLog"; // <-- JAVÍTVA
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkLogTableProps {
  entries: WorkEntry[];
  calculateDailyPay: (entry: WorkEntry) => number;
  deleteEntry: (id: string) => void;
}

export function WorkLogTable({
  entries,
  calculateDailyPay,
  deleteEntry,
}: WorkLogTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: "HUF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Munkanapok</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dátum</TableHead>
              <TableHead className="text-right">Óraszám</TableHead>
              <TableHead className="text-right">Éjszakai óra</TableHead>
              <TableHead className="text-center">Vasárnap?</TableHead>
              <TableHead className="text-right">Hiány</TableHead>
              <TableHead className="text-right">Napi bér</TableHead>
              <TableHead className="text-center">Törlés</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Még nincsenek bejegyzések.
                </TableCell>
              </TableRow>
            ) : (
              entries
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell className="text-right">
                      {entry.hoursWorked} óra
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.nightHours} óra
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.isSunday ? "Igen" : "Nem"}
                    </TableCell>
                    <TableCell className="text-right text-red-500">
                      {formatCurrency(entry.cashDeficit)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(calculateDailyPay(entry))}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}