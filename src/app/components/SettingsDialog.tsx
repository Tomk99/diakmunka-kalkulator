// src/app/components/SettingsDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "@/app/hooks/useWorkLog";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";

interface SettingsDialogProps {
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

export function SettingsDialog({ settings, onSave }: SettingsDialogProps) {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(currentSettings);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSettings((prev) => ({ ...prev, [name]: Number(value) }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Beállítások</DialogTitle>
          <DialogDescription>
            Add meg az alap órabéreket és pótlékokat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hourlyRate" className="text-right">
              Órabér (Ft)
            </Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              value={currentSettings.hourlyRate}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sundayBonusRate" className="text-right">
              Vasárnapi pótlék (Ft/óra)
            </Label>
            <Input
              id="sundayBonusRate"
              name="sundayBonusRate"
              type="number"
              value={currentSettings.sundayBonusRate}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nightBonusRate" className="text-right">
              Éjszakai pótlék (Ft/óra)
            </Label>
            <Input
              id="nightBonusRate"
              name="nightBonusRate"
              type="number"
              value={currentSettings.nightBonusRate}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Mentés</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}