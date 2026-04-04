import { motion } from "framer-motion";
import { Bell, Volume2, Check, Loader2, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";

type ReminderStatus = "upcoming" | "pending" | "done";

interface Reminder {
  id: string;
  time: string;
  medicine: string;
  dosage: string;
  instruction: string;
  status: ReminderStatus;
}

function parseDurationDays(durationStr: string | null): number {
  if (!durationStr || durationStr === "N/A" || durationStr.toLowerCase().includes("sos")) return 30; // Default or SOS 
  const num = parseInt(durationStr);
  if (isNaN(num)) return 30;
  const str = durationStr.toLowerCase();
  let multiplier = 1;
  if (str.includes("week")) multiplier = 7;
  if (str.includes("month")) multiplier = 30;
  if (str.includes("year")) multiplier = 365;
  return num * multiplier;
}

function buildReminders(medicines: { id: string; medicine_name: string; dosage: string; timing: string; food_instruction: string; duration?: string | null }[], createdAt: string): Reminder[] {
  const reminders: Reminder[] = [];
  const timingMap: Record<string, string> = {
    Morning: "8:30 AM",
    Afternoon: "2:00 PM",
    Night: "9:00 PM",
  };

  const today = new Date();
  const createdDate = new Date(createdAt);

  for (const med of medicines) {
    // Duration Logic
    const durationDays = parseDurationDays(med.duration || null);
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // Auto-stop reminders if duration has expired
    if (diffDays > durationDays) {
      continue;
    }

    const timingStr = med.timing.toLowerCase();
    const slots: { key: string; time: string }[] = [];

    if (timingStr.includes("morning")) slots.push({ key: "morning", time: timingMap["Morning"] });
    if (timingStr.includes("afternoon")) slots.push({ key: "afternoon", time: timingMap["Afternoon"] });
    if (timingStr.includes("night")) slots.push({ key: "night", time: timingMap["Night"] });

    if (slots.length === 0) slots.push({ key: "default", time: timingMap["Morning"] });

    for (const slot of slots) {
      reminders.push({
        id: `${med.id}-${slot.key}`,
        time: slot.time,
        medicine: med.medicine_name,
        dosage: med.dosage,
        instruction: med.food_instruction || "N/A",
        status: "pending",
      });
    }
  }

  const timeOrder = ["8:30 AM", "2:00 PM", "9:00 PM"];
  reminders.sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time));

  if (reminders.length > 0) {
    const firstTime = reminders[0].time;
    for (const r of reminders) {
      if (r.time === firstTime) r.status = "upcoming";
    }
  }

  return reminders;
}

export default function Reminders() {
  const { t } = useLanguage();
  const { data: latestPrescription, isLoading } = useQuery({
    queryKey: ["latest-prescription-reminders"],
    queryFn: async () => {
      const { data: rxData, error: rxError } = await supabase
        .from("prescriptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (rxError) throw rxError;
      if (!rxData) return null;

      const { data: meds, error: medError } = await supabase
        .from("medicines")
        .select("*")
        .eq("prescription_id", rxData.id);

      if (medError) throw medError;

      return { ...rxData, medicines: meds || [] };
    },
  });

  const initialReminders = useMemo(() => {
    if (!latestPrescription?.medicines?.length) return [];
    return buildReminders(latestPrescription.medicines, latestPrescription.created_at);
  }, [latestPrescription]);

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const reminders = useMemo(() => {
    return initialReminders.map((r) => ({
      ...r,
      status: completedIds.has(r.id) ? ("done" as ReminderStatus) : r.status,
    }));
  }, [initialReminders, completedIds]);

  const speakReminder = (medicine: string, time: string, instruction: string) => {
    const msg = new SpeechSynthesisUtterance(
      `Hi, it's ${time}. Please take ${medicine} ${instruction}.`
    );
    msg.rate = 0.9;
    speechSynthesis.speak(msg);
  };

  const markDone = (id: string) => {
    setCompletedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">
          {t("rem.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("rem.subtitle")}
        </p>
      </motion.div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {!isLoading && reminders.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center py-16">
            <Pill className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-display font-semibold text-foreground">{t("rem.noReminders")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("rem.saveToGenerate")}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && reminders.length > 0 && (
        <>
          {latestPrescription && (
            <div className="p-4 rounded-xl gradient-accent">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                {t("rem.basedOn")}
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {latestPrescription.doctor_name} · {latestPrescription.hospital_name}
              </p>
              <p className="text-xs text-muted-foreground">{latestPrescription.date}</p>
            </div>
          )}

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-display">{t("rem.todaySchedule")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminders.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border transition-colors ${r.status === "done"
                      ? "bg-success/5 border-success/20 opacity-60"
                      : "hover:bg-accent/30"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${r.status === "done"
                          ? "bg-success/10"
                          : r.status === "upcoming"
                            ? "gradient-primary"
                            : "bg-muted"
                        }`}
                    >
                      {r.status === "done" ? (
                        <Check className="h-5 w-5 text-success" />
                      ) : (
                        <Bell
                          className={`h-4 w-4 ${r.status === "upcoming"
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                            }`}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {r.medicine}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.time} · {r.dosage} · {r.instruction}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={r.status === "upcoming" ? "default" : "secondary"}
                      className={`text-[10px] ${r.status === "done" ? "bg-success text-success-foreground" : ""
                        }`}
                    >
                      {r.status === "done" ? t("rem.taken") : r.status === "upcoming" ? t("common.upcoming") : t("common.pending")}
                    </Badge>
                    {r.status !== "done" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            speakReminder(r.medicine, r.time, r.instruction)
                          }
                        >
                          <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => markDone(r.id)}
                        >
                          {t("rem.markDone")}
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
