// src/app/hooks/useWorkLog.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { z } from "zod";

// Adatstruktúrák definiálása Zod sémákkal
export const settingsSchema = z.object({
  hourlyRate: z.number().min(0),
  sundayBonusRate: z.number().min(0),
  nightBonusRate: z.number().min(0),
});

export const workEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  hoursWorked: z.number().min(0),
  isSunday: z.boolean(),
  nightHours: z.number().min(0),
  cashDeficit: z.number().min(0),
});

export type Settings = z.infer<typeof settingsSchema>;
export type WorkEntry = z.infer<typeof workEntrySchema>;

const isBrowser = typeof window !== "undefined";

export function useWorkLog() {
  // Beállítások kezelése
  const [settings, setSettings] = useState<Settings>(() => {
    if (!isBrowser)
      return { hourlyRate: 1800, sundayBonusRate: 900, nightBonusRate: 540 };
    const savedSettings = localStorage.getItem("workSettings");
    return savedSettings
      ? settingsSchema.parse(JSON.parse(savedSettings))
      : { hourlyRate: 1800, sundayBonusRate: 900, nightBonusRate: 540 };
  });

  // Munkanapok bejegyzéseinek kezelése
  const [entries, setEntries] = useState<WorkEntry[]>(() => {
    if (!isBrowser) return [];
    const savedEntries = localStorage.getItem("workEntries");
    return savedEntries
      ? z.array(workEntrySchema).parse(JSON.parse(savedEntries))
      : [];
  });

  // Beállítások mentése localStorage-be, ha változnak
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem("workSettings", JSON.stringify(settings));
    }
  }, [settings]);

  // Bejegyzések mentése localStorage-be, ha változnak
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem("workEntries", JSON.stringify(entries));
    }
  }, [entries]);

  // Új bejegyzés hozzáadása
  const addEntry = (entry: Omit<WorkEntry, "id">) => {
    const newEntry = { ...entry, id: new Date().toISOString() };
    setEntries((prev) => [...prev, newEntry]);
  };

  // Bejegyzés törlése
  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Napi fizetés kiszámítása
  const calculateDailyPay = (entry: WorkEntry) => {
    const basePay = entry.hoursWorked * settings.hourlyRate;
    const sundayBonus = entry.isSunday
      ? entry.hoursWorked * settings.sundayBonusRate
      : 0;
    const nightBonus = entry.nightHours * settings.nightBonusRate;
    const totalPay = basePay + sundayBonus + nightBonus - entry.cashDeficit;
    return totalPay;
  };

  // Összesített adatok kiszámítása useMemo-val a hatékonyságért
  const summary = useMemo(() => {
    const totalHours = entries.reduce(
      (sum, entry) => sum + entry.hoursWorked,
      0,
    );
    const totalEarnings = entries.reduce(
      (sum, entry) => sum + calculateDailyPay(entry),
      0,
    );
    return { totalHours, totalEarnings };
  }, [entries, settings]);

  return {
    settings,
    setSettings,
    entries,
    addEntry,
    deleteEntry,
    calculateDailyPay,
    summary,
  };
}