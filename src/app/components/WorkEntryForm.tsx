// src/app/components/WorkEntryForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkEntry } from "@/app/hooks/useWorkLog";
import { toast } from "sonner";

const formSchema = z.object({
  date: z.string().min(1, { message: "A dátum megadása kötelező." }),
  hoursWorked: z.coerce
    .number()
    .min(0.1, { message: "Legalább 0.1 órát adj meg." }),
  isSunday: z.boolean(),
  nightHours: z.coerce.number().min(0),
  cashDeficit: z.coerce.number().min(0),
});

interface WorkEntryFormProps {
  addEntry: (entry: Omit<WorkEntry, "id">) => void;
}

export function WorkEntryForm({ addEntry }: WorkEntryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      hoursWorked: 8,
      isSunday: false,
      nightHours: 0,
      cashDeficit: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addEntry(values);
    toast.success("Sikeres mentés!", {
      description: `A(z) ${values.date} napi bejegyzés hozzáadva.`,
    });
    form.reset({
      ...form.getValues(),
      date: new Date().toISOString().split("T")[0],
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Új munkanap rögzítése</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dátum</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hoursWorked"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ledolgozott órák</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nightHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Éjszakai órák (18:00-06:00)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cashDeficit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kasszahiány (Ft)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSunday"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ez a nap vasárnapra esett?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Bejegyzés mentése</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}