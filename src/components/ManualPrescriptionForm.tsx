import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Loader2, CheckCircle2, PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface MedicineRow {
  name: string;
  dosage: string;
  timing: string;
  food: string;
}

const emptyMedicine = (): MedicineRow => ({
  name: "",
  dosage: "",
  timing: "OD",
  food: "After Food",
});

export default function ManualPrescriptionForm() {
  const { t } = useLanguage();
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState("");
  const [medicines, setMedicines] = useState<MedicineRow[]>([emptyMedicine()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateMedicine = (index: number, field: keyof MedicineRow, value: string) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const addMedicine = () => setMedicines((prev) => [...prev, emptyMedicine()]);

  const removeMedicine = (index: number) => {
    if (medicines.length <= 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!doctorName.trim() || !hospitalName.trim()) {
      toast.error(t("upload.fillRequired"));
      return;
    }
    const validMeds = medicines.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      toast.error(t("upload.addOneMed"));
      return;
    }

    setSaving(true);
    try {
      const { data: rxData, error: rxError } = await supabase
        .from("prescriptions")
        .insert({
          doctor_name: doctorName,
          hospital_name: hospitalName,
          date,
          summary: summary || null,
        })
        .select("id")
        .single();

      if (rxError) throw rxError;

      const medsToInsert = validMeds.map((med) => ({
        prescription_id: rxData.id,
        medicine_name: med.name,
        dosage: med.dosage || "As directed",
        timing: med.timing,
        food_instruction: med.food,
      }));

      const { error: medError } = await supabase.from("medicines").insert(medsToInsert);
      if (medError) throw medError;

      setSaved(true);
      toast.success(t("upload.saveSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="shadow-card border-accent/30">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
            <PenLine className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-display">
              {t("upload.manualEntry")}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("upload.manualSubtitle")}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Doctor & Hospital Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("upload.doctor")} *
              </label>
              <Input
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder={t("admin.doctorName")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("upload.hospital")} *
              </label>
              <Input
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder={t("admin.hospitalName")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("upload.date")}
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("upload.aiSummary")}
              </label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={t("upload.summaryPlaceholder")}
                className="min-h-[40px] resize-none"
                rows={1}
              />
            </div>
          </div>

          {/* Medicines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-foreground text-sm">
                {t("upload.extractedMeds")}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedicine}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {t("upload.addMedicine")}
              </Button>
            </div>
            <div className="space-y-3">
              {medicines.map((med, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-end gap-2 p-3 rounded-xl border bg-muted/20"
                >
                  <div className="flex-1 min-w-[140px] space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {t("admin.medicineName")} *
                    </label>
                    <Input
                      value={med.name}
                      onChange={(e) => updateMedicine(i, "name", e.target.value)}
                      placeholder="e.g. Paracetamol"
                      className="h-9"
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {t("admin.dosage")}
                    </label>
                    <Input
                      value={med.dosage}
                      onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                      placeholder="500mg"
                      className="h-9"
                    />
                  </div>
                  <div className="w-28 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Timing
                    </label>
                    <Select
                      value={med.timing}
                      onValueChange={(v) => updateMedicine(i, "timing", v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OD">OD</SelectItem>
                        <SelectItem value="BD">BD</SelectItem>
                        <SelectItem value="TDS">TDS</SelectItem>
                        <SelectItem value="QID">QID</SelectItem>
                        <SelectItem value="SOS">SOS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Food
                    </label>
                    <Select
                      value={med.food}
                      onValueChange={(v) => updateMedicine(i, "food", v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Before Food">{t("admin.beforeFood")}</SelectItem>
                        <SelectItem value="After Food">{t("admin.afterFood")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {medicines.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => removeMedicine(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            className="w-full gradient-primary text-primary-foreground"
            disabled={saving || saved}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                {t("upload.saved")}
              </>
            ) : saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                {t("upload.saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                {t("upload.save")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
