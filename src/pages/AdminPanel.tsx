import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ShieldPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface Medicine {
  name: string;
  dosage: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  foodInstruction: string;
}

export default function AdminPanel() {
  const { t } = useLanguage();
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", morning: false, afternoon: false, night: false, foodInstruction: "after" },
  ]);

  const addMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { name: "", dosage: "", morning: false, afternoon: false, night: false, foodInstruction: "after" },
    ]);
  };

  const removeMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string | boolean) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Prescription created successfully! (Mock)");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <ShieldPlus className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {t("admin.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.subtitle")}
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-display">
                {t("admin.doctorHospital")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("admin.hospitalName")}</Label>
                <Input placeholder="e.g., Apollo Hospitals" />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.doctorName")}</Label>
                <Input placeholder="e.g., Dr. Priya Sharma" />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.specialization")}</Label>
                <Input placeholder="e.g., General Medicine" />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.contactNumber")}</Label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t("admin.address")}</Label>
                <Input placeholder="Hospital address" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-display">
                {t("admin.medicines")}
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addMedicine}>
                <Plus className="h-4 w-4 mr-1" /> {t("admin.addMedicine")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicines.map((med, i) => (
                <div key={i} className="p-4 rounded-xl border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-display font-semibold text-foreground">
                      {t("common.medicine")} {i + 1}
                    </span>
                    {medicines.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeMedicine(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t("admin.medicineName")}</Label>
                      <Input
                        value={med.name}
                        onChange={(e) => updateMedicine(i, "name", e.target.value)}
                        placeholder="e.g., Paracetamol 500mg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t("admin.dosage")}</Label>
                      <Input
                        value={med.dosage}
                        onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                        placeholder="e.g., 1 tablet"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={med.morning}
                        onCheckedChange={(v) => updateMedicine(i, "morning", !!v)}
                      />
                      <Label className="text-xs">{t("admin.morning")}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={med.afternoon}
                        onCheckedChange={(v) => updateMedicine(i, "afternoon", !!v)}
                      />
                      <Label className="text-xs">{t("admin.afternoon")}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={med.night}
                        onCheckedChange={(v) => updateMedicine(i, "night", !!v)}
                      />
                      <Label className="text-xs">{t("admin.night")}</Label>
                    </div>
                    <Select
                      value={med.foodInstruction}
                      onValueChange={(v) => updateMedicine(i, "foodInstruction", v)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before">{t("admin.beforeFood")}</SelectItem>
                        <SelectItem value="after">{t("admin.afterFood")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground h-12 font-display font-semibold">
          {t("admin.createRx")}
        </Button>
      </form>
    </div>
  );
}
