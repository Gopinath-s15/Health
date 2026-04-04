import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCircle, Camera, Download, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import { AppLogo } from "@/components/AppLogo";

const DefaultAvatar = ({ gender, className = "" }: { gender: string, className?: string }) => {
  const isFemale = gender?.toLowerCase() === 'female';
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="100%" height="100%">
      {isFemale ? (
        <path d="M13.94 8.31C13.62 7.52 12.85 7 12 7s-1.62.52-1.94 1.31L7 16h3v6h4v-6h3l-3.06-7.69zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
      ) : (
        <path d="M14 7h-4c-1.1 0-2 .9-2 2v6h2v7h4v-7h2V9c0-1.1-.9-2-2-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
      )}
    </svg>
  );
};

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.username || "",
    age: user?.user_metadata?.age || "",
    gender: user?.user_metadata?.gender || "",
    bloodGroup: user?.user_metadata?.blood_group || "",
    contact: user?.user_metadata?.mobile_number || "",
    address: user?.user_metadata?.address || "",
    photo_data: user?.user_metadata?.photo_data || "",
  });

  const healthId = user?.user_metadata?.health_id || "HT-UNKNOWN";

  // Re-sync if user metadata loads later
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.username || prev.name,
        age: user.user_metadata?.age || prev.age,
        gender: user.user_metadata?.gender || prev.gender,
        bloodGroup: user.user_metadata?.blood_group || prev.bloodGroup,
        contact: user.user_metadata?.mobile_number || prev.contact,
        address: user.user_metadata?.address || prev.address,
        photo_data: user.user_metadata?.photo_data || prev.photo_data,
      }));
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, photo_data: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: formData.name,
          age: formData.age,
          gender: formData.gender,
          blood_group: formData.bloodGroup,
          mobile_number: formData.contact,
          address: formData.address,
          photo_data: formData.photo_data
        }
      });
      if (error) throw error;
      toast.success("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await htmlToImage.toCanvas(cardRef.current, {
        width: 400,
        height: 253,
        pixelRatio: window.devicePixelRatio || 2,
        cacheBust: true,
        skipFonts: true,
        backgroundColor: "transparent",
        style: {
          margin: "0",
          transform: "none"
        }
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);

      const link = document.createElement('a');
      link.download = `HealthTwin-ID-${healthId}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("ID Card downloaded successfully!");
    } catch (err) {
      console.error("ID Card Render Error:", err);
      toast.error(err instanceof Error ? "Setup Error: " + err.message : "Failed to generate: " + String(err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-gradient-to-br from-primary/5 via-white to-emerald-500/10 min-h-[calc(100vh-8rem)] -mx-4 -mt-4 p-4 sm:p-8 rounded-b-3xl sm:rounded-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-teal-950 tracking-tight">
            {t("profile.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("profile.subtitle")}</p>
        </div>
        <Button onClick={handleDownload} disabled={downloading} variant="outline" className="hidden sm:flex shadow-sm gap-2">
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download ID
        </Button>
      </motion.div>

      {/* Digital ID Card Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center w-full"
      >
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-teal-950 via-emerald-900 to-teal-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between border-0 shrink-0 group hover:shadow-[0_20px_40px_rgba(20,184,166,0.3)] transition-all duration-500"
          style={{ width: '400px', height: '253px', margin: 0 }}
        >
          {/* Background graphics */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-emerald-400/40 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-teal-400/30 rounded-full blur-[40px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

          {/* Top Header */}
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h2 className="text-xl font-extrabold font-display tracking-wide flex items-center gap-2 whitespace-nowrap text-white drop-shadow-sm">
                <span className="text-emerald-300 font-mono text-xl mr-1 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">✦</span>
                HealthTwin AI
              </h2>
              <p className="text-emerald-200/80 text-[10px] uppercase tracking-widest mt-1 whitespace-nowrap font-medium">Digital Health Identity</p>
            </div>
            <div className="w-10 h-10 shadow-[0_2px_15px_rgba(0,0,0,0.3)] bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full" width="100%" height="100%">
                <path d="M 38 18 H 62 V 38 H 82 V 62 H 62 V 82 H 38 V 62 H 18 V 38 H 38 Z" fill="rgba(34, 197, 94, 0.4)" stroke="rgba(34, 197, 94, 0.9)" strokeWidth="8" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Middle Body - Aadhar Style Layout */}
          <div className="flex gap-4 items-center z-10 relative mt-4">

            {/* Patient Photo (Left Side) */}
            <div className="w-16 h-[5.5rem] bg-white/10 rounded-xl shrink-0 shadow-[0_0_20px_rgba(52,211,153,0.15)] border border-white/20 overflow-hidden flex flex-col items-center justify-center relative backdrop-blur-sm relative z-10">
              {formData.photo_data ? (
                <img src={formData.photo_data} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-teal-950/50 flex items-center justify-center">
                  <DefaultAvatar gender={formData.gender} className="w-10 h-10 text-emerald-200 opacity-80" />
                </div>
              )}
            </div>

            {/* Patient Info */}
            <div className="flex-1 pb-1 min-w-0 relative z-10">
              <p className="text-emerald-300/80 text-[10px] uppercase font-bold tracking-widest mb-0.5 whitespace-nowrap">Patient Name</p>
              <p className="text-lg font-extrabold mb-2 leading-tight uppercase truncate whitespace-nowrap text-white drop-shadow-sm">{formData.name || "UNREGISTERED"}</p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-emerald-200/70 text-[9px] uppercase font-bold tracking-widest whitespace-nowrap">DOB / Age</p>
                  <p className="font-semibold text-xs whitespace-nowrap tracking-wide">{formData.age || "--"} Yrs</p>
                </div>
                <div>
                  <p className="text-emerald-200/70 text-[9px] uppercase font-bold tracking-widest whitespace-nowrap">Gender</p>
                  <p className="font-semibold text-xs capitalize whitespace-nowrap tracking-wide">{formData.gender || "--"}</p>
                </div>
              </div>
            </div>

            {/* QR Code (Right Side) */}
            <div className="bg-white p-1.5 rounded-xl shrink-0 shadow-lg transform -translate-y-1 border border-white/20 relative z-10">
              <QRCodeCanvas value={healthId} size={45} level="M" fgColor="#064e3b" />
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-4 pt-2 border-t border-white/10 flex justify-between items-center z-10 relative">
            <p className="text-emerald-50 text-sm font-mono tracking-widest font-bold drop-shadow-md whitespace-nowrap bg-teal-950/40 px-3 py-1 rounded-md border border-emerald-500/20">
              {healthId}
            </p>
            <p className="text-[10px] text-emerald-300/80 uppercase font-bold tracking-widest whitespace-nowrap">Valid Anywhere</p>
          </div>
        </div>

        <Button onClick={handleDownload} disabled={downloading} className="hidden sm:flex mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-widest uppercase h-12 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all text-xs w-[400px]">
          {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
          Download ID Card
        </Button>
        <Button onClick={handleDownload} disabled={downloading} className="sm:hidden mt-6 w-full max-w-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-widest uppercase h-14 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all text-sm">
          {downloading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Download className="w-5 h-5 mr-3" />}
          Download
        </Button>
      </motion.div>

      {/* Edit Details Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/70 backdrop-blur-xl border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-display text-teal-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> {t("profile.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                />
                <div onClick={() => fileInputRef.current?.click()} className="h-20 w-20 rounded-2xl cursor-pointer gradient-primary flex flex-col items-center justify-center overflow-hidden border">
                  {formData.photo_data ? (
                    <img src={formData.photo_data} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <DefaultAvatar gender={formData.gender} className="w-14 h-14 text-white opacity-90 pb-2" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card border shadow-card flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <p className="font-display font-bold text-foreground text-lg">
                  {formData.name || "Unregistered Patient"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground font-mono bg-accent/50 px-2 py-0.5 rounded-md border">
                    {healthId}
                  </p>
                  {formData.photo_data && (
                    <button
                      onClick={() => setFormData(p => ({ ...p, photo_data: "" }))}
                      className="text-xs text-destructive hover:bg-destructive/10 px-2 py-0.5 rounded transition-colors"
                      type="button"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("profile.fullName")}</Label>
                <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("profile.age")}</Label>
                <Input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("profile.gender")}</Label>
                <Select value={formData.gender.toLowerCase()} onValueChange={v => setFormData(p => ({ ...p, gender: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("profile.male")}</SelectItem>
                    <SelectItem value="female">{t("profile.female")}</SelectItem>
                    <SelectItem value="other">{t("profile.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("profile.bloodGroup")}</Label>
                <Select value={formData.bloodGroup.toLowerCase()} onValueChange={v => setFormData(p => ({ ...p, bloodGroup: v.toUpperCase() }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg.toLowerCase()}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("profile.contact")}</Label>
                <Input value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("profile.address")}</Label>
                <Input value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} />
              </div>
            </div>

            <Button
              className="w-full gradient-primary text-primary-foreground"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t("profile.save")}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
