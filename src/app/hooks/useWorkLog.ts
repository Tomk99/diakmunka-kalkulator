// src/app/hooks/useWorkLog.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { z } from "zod";

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

const defaultSettings: Settings = {
  hourlyRate: 1800,
  sundayBonusRate: 900,
  nightBonusRate: 540,
};

export function useWorkLog() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [entries, setEntries] = useState<WorkEntry[]>([]);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("workSettings");
      if (savedSettings) {
        setSettings(settingsSchema.parse(JSON.parse(savedSettings)));
      }
    } catch (error) {
      console.error("Hiba a beállítások betöltésekor:", error);
    }

    try {
      const savedEntries = localStorage.getItem("workEntries");
      if (savedEntries) {
        setEntries(z.array(workEntrySchema).parse(JSON.parse(savedEntries)));
      }
    } catch (error) {
      console.error("Hiba a bejegyzések betöltésekor:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("workEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<WorkEntry, "id">) => {
    const newEntry = { ...entry, id: new Date().toISOString() };
    setEntries((prev) => [...prev, newEntry]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const calculateDailyPay = (entry: WorkEntry) => {
    const basePay = entry.hoursWorked * settings.hourlyRate;
    const sundayBonus = entry.isSunday
      ? entry.hoursWorked * settings.sundayBonusRate
      : 0;
    const nightBonus = entry.nightHours * settings.nightBonusRate;
    const totalPay = basePay + sundayBonus + nightBonus - entry.cashDeficit;
    return totalPay;
  };

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