import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, Pill, Loader2, X, ZoomIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

export default function Prescriptions() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ["prescriptions", user?.user_metadata?.health_id],
    queryFn: async () => {
      const { data: rxData, error: rxError } = await supabase
        .from("prescriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (rxError) throw rxError;

      const userHealthId = user?.user_metadata?.health_id;

      const filteredRx = (rxData || []).filter((rx) => {
        try {
          const meta = JSON.parse(rx.summary || "{}");
          if (userHealthId && meta.patient_health_id) {
            return meta.patient_health_id === userHealthId;
          }
          return true;
        } catch {
          return true;
        }
      });

      const withMeds = await Promise.all(
        filteredRx.map(async (rx) => {
          const { data: meds } = await supabase
            .from("medicines")
            .select("*")
            .eq("prescription_id", rx.id);

          let parsedSummary = rx.summary;
          let status = null;
          let imageData = null;

          try {
            const meta = JSON.parse(rx.summary || "{}");
            parsedSummary = meta.text;
            status = meta.status;
            imageData = meta.image_data;
          } catch { }

          return { ...rx, summary: parsedSummary, status, image_data: imageData, medicines: meds || [] };
        })
      );

      return withMeds;
    },
    enabled: !!user?.user_metadata?.health_id
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">
          {t("rx.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("rx.subtitle")}
        </p>
      </motion.div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {!isLoading && (!prescriptions || prescriptions.length === 0) && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-display font-semibold text-foreground">{t("rx.noRx")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("rx.uploadToStart")}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {prescriptions?.map((rx, i) => (
          <motion.div
            key={rx.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-display">
                        {rx.doctor_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {rx.hospital_name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {rx.id.slice(0, 8)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  {rx.status && (
                    <Badge variant={rx.status === "verified" ? "default" : rx.status === "rejected" ? "destructive" : "secondary"}>
                      {rx.status.toUpperCase()}
                    </Badge>
                  )}
                </div>
                {rx.summary && (
                  <p className="text-sm text-muted-foreground mb-3 p-3 rounded-lg bg-accent/30">
                    {rx.summary}
                  </p>
                )}
                {rx.image_data && (
                  <div
                    className="mb-4 text-center border rounded-lg overflow-hidden bg-muted/5 hover:bg-muted/20 transition-colors cursor-pointer group relative"
                    onClick={() => setSelectedImage(rx.image_data)}
                  >
                    <p className="text-[10px] bg-muted/50 py-1 text-muted-foreground font-semibold flex items-center justify-center gap-1">
                      ORIGINAL IMAGE <ZoomIn className="w-3 h-3 ml-1" />
                    </p>
                    <img src={rx.image_data} alt="Prescription" className="mx-auto h-32 w-auto object-contain py-2 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {rx.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Pill className="h-3.5 w-3.5" />
                    {rx.medicines.length} {t("dash.medicines")}
                  </div>
                </div>

                <div className="space-y-2">
                  {rx.medicines.map((med) => (
                    <div
                      key={med.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {med.medicine_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {med.dosage} · {med.food_instruction}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end shrink-0 self-start sm:self-auto">
                        <Badge variant="secondary" className="text-[10px]">
                          {med.timing}
                        </Badge>
                        {med.duration && med.duration !== "N/A" && (
                          <Badge className="text-[10px] bg-info text-info-foreground">
                            {med.duration}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b bg-muted/30">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Full Prescription View
                </h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-gray-50/50">
                <img
                  src={selectedImage}
                  alt="Enlarged Prescription"
                  className="max-w-full h-auto max-h-[70vh] object-contain rounded-md shadow-sm border"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
