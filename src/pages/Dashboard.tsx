import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  FileText,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Volume2,
  ChevronRight,
  Plus,
  Image,
  FileUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, mockReminders } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const statIcons = [Pill, FileText, Clock, TrendingUp];

export default function Dashboard() {
  const navigate = useNavigate();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      navigate('/upload', {
        state: {
          objectUrl,
          mimeType: file.type,
          name: file.name
        }
      });
    }
  };

  const { user } = useAuth();
  const { t } = useLanguage();
  const userName = user?.user_metadata?.username || "there";

  const [recentRx, setRecentRx] = useState<any[]>([]);

  useEffect(() => {
    const fetchRx = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        // Filter by user explicitly if needed
        const userHealthId = user?.user_metadata?.health_id;
        const filtered = data.filter((rx) => {
          try {
            const meta = JSON.parse(rx.summary || "{}");
            return meta.patient_health_id === userHealthId;
          } catch {
            return true;
          }
        });

        // Fetch medicines for the top 3
        const top3 = filtered.slice(0, 3);
        const mapped = await Promise.all(top3.map(async (rx) => {
          const { count } = await supabase.from('medicines').select('*', { count: 'exact', head: true }).eq('prescription_id', rx.id);
          return {
            id: rx.id.slice(0, 8),
            doctorName: rx.doctor_name,
            hospitalName: rx.hospital_name,
            date: rx.date,
            medicineCount: count || 0
          };
        }));

        setRecentRx(mapped);
      }
    };
    fetchRx();
  }, [user]);

  const speakReminder = (medicine: string, time: string, instruction: string) => {
    const msg = new SpeechSynthesisUtterance(
      `Hi ${userName}, it's ${time}. Please take ${medicine} ${instruction}.`
    );
    msg.rate = 0.9;
    speechSynthesis.speak(msg);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-primary/5 via-white to-emerald-500/10 min-h-screen -mx-4 -mt-4 p-4 sm:p-8 rounded-b-3xl sm:rounded-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-extrabold text-teal-950 tracking-tight">
            {t("dash.greeting")}, <span className="text-primary">{userName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dash.overview")}
          </p>
        </div>
        {user?.user_metadata?.health_id && (
          <div className="bg-gradient-to-r from-teal-500 to-green-400 text-white p-3 px-5 rounded-xl shadow-lg shrink-0">
            <p className="text-xs font-medium opacity-90">HealthTwin ID</p>
            <h2 className="text-xl font-bold tracking-wider">{user.user_metadata.health_id}</h2>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, i) => {
          const Icon = statIcons[i];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="bg-white/70 backdrop-blur-xl border-primary/20 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    {stat.trend === "up" && (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-xl border-primary/20 shadow-lg shadow-primary/5 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-xl font-display font-bold text-teal-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> {t("dash.todaySchedule")}
              </CardTitle>
              <Link to="/reminders">
                <Button variant="ghost" size="sm" className="text-primary">
                  {t("dash.viewAll")} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockReminders.slice(0, 4).map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {reminder.medicine}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.time} · {reminder.instruction}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={reminder.status === "upcoming" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {reminder.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        speakReminder(
                          reminder.medicine,
                          reminder.time,
                          reminder.instruction
                        )
                      }
                    >
                      <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white/70 backdrop-blur-xl border-primary/20 shadow-lg shadow-primary/5 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-xl font-display font-bold text-teal-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> {t("dash.recentRx")}
              </CardTitle>
              <Link to="/prescriptions">
                <Button variant="ghost" size="sm" className="text-primary">
                  {t("dash.viewAll")} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentRx.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl bg-white border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {rx.doctorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rx.hospitalName}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                      {rx.id}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-muted-foreground">
                      📅 {rx.date}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      💊 {rx.medicineCount} {t("dash.medicines")}
                    </span>
                  </div>
                </div>
              ))}
              {recentRx.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  {t("rx.noRx")}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0 px-4 md:px-6 z-50 pointer-events-none">
        <div className="max-w-[400px] mx-auto relative flex items-end justify-between pointer-events-auto">
          {/* Upload from Gallery */}
          <Button
            variant="outline"
            className="rounded-full shadow-lg mb-2 h-12 px-5 bg-white/90 backdrop-blur-md border-primary/20 text-teal-800 hover:bg-primary/5 hover:text-primary transition-all"
            onClick={() => galleryRef.current?.click()}
          >
            <Image className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2 text-primary" />
            <span className="font-medium text-xs md:text-sm">Gallery</span>
          </Button>

          {/* Hidden inputs */}
          <input type="file" accept="image/*" capture="environment" ref={cameraRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/*" ref={galleryRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept=".pdf,.doc,.docx,.jpg,.png,.jpeg" ref={filesRef} onChange={handleFileChange} className="hidden" />

          {/* Center + Button for Camera */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
            <Button
              size="icon"
              className="h-16 w-16 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)] gradient-primary hover:scale-110 hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transition-all duration-300"
              onClick={() => cameraRef.current?.click()}
            >
              <Plus className="h-8 w-8 text-primary-foreground" />
            </Button>
          </div>

          {/* Upload from Files */}
          <Button
            variant="outline"
            className="rounded-full shadow-lg mb-2 h-12 px-5 bg-white/90 backdrop-blur-md border-primary/20 text-teal-800 hover:bg-primary/5 hover:text-primary transition-all"
            onClick={() => filesRef.current?.click()}
          >
            <FileUp className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2 text-primary" />
            <span className="font-medium text-xs md:text-sm">Files</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
