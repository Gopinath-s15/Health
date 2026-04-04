import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Heart, LogIn, UserPlus, Stethoscope } from "lucide-react";
import { useLanguage, LANGUAGE_OPTIONS } from "@/hooks/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const PROFILE_LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", "Gujarati"];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("English");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");

  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !mobile.trim() || !password.trim()) {
      toast({ title: t("auth.fillAll"), variant: "destructive" });
      return;
    }
    if (mobile.length < 10) {
      toast({ title: t("auth.validMobile"), variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: t("auth.minPassword"), variant: "destructive" });
      return;
    }

    setLoading(true);
    const email = `${mobile}@healthtwin.app`;

    const generateHID = () => {
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `HT-${random}`;
    };

    const health_id = generateHID();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          username, 
          mobile_number: mobile, 
          preferred_language: language,
          age,
          gender,
          health_id
        },
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: t("auth.signupFailed"), description: error.message, variant: "destructive" });
    } else {
      // Save language preference for auto-detection
      localStorage.setItem("healthtwin-profile-lang", language);
      toast({ title: t("auth.accountCreated"), description: t("auth.welcome") });
      navigate("/");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginMobile.trim() || !loginPassword.trim()) {
      toast({ title: t("auth.fillAll"), variant: "destructive" });
      return;
    }

    setLoading(true);
    const email = `${loginMobile}@healthtwin.app`;
    const { error } = await supabase.auth.signInWithPassword({ email, password: loginPassword });
    setLoading(false);

    if (error) {
      toast({ title: t("auth.loginFailed"), description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 p-4 relative overflow-hidden">
      {/* Background Graphic Blend */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-[url('/icu-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      {/* Glow */}
      <div className="absolute w-96 h-96 bg-teal-500 blur-3xl opacity-20 rounded-full pointer-events-none"></div>

      {/* Language switcher in corner */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md shadow-[0_0_30px_rgba(20,184,166,0.15)] relative z-10 border-teal-800/50 bg-card/95 backdrop-blur-md">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">{t("auth.title")}</CardTitle>
          <CardDescription>
            {isLogin ? t("auth.signIn") : t("auth.createAccount")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-mobile">{t("auth.mobile")}</Label>
                <Input
                  id="login-mobile"
                  type="tel"
                  placeholder={t("auth.enterMobile")}
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value)}
                  maxLength={15}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{t("auth.password")}</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder={t("auth.enterPassword")}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? t("auth.signingIn") : t("auth.signInBtn")}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t("auth.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary font-medium hover:underline"
                >
                  {t("auth.createAccountBtn")}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <Input
                  id="username"
                  placeholder={t("auth.enterName")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">{t("auth.mobile")}</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder={t("auth.enterMobile")}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={15}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.createPassword")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.minChars")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{t("auth.preferredLang")}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("auth.selectLang")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="E.g. 30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                    max="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? t("auth.creating") : t("auth.createAccountBtn")}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t("auth.haveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary font-medium hover:underline"
                >
                  {t("auth.signInBtn")}
                </button>
              </p>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-border flex justify-center">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary" onClick={() => navigate('/doctor-auth')}>
              <Stethoscope className="w-4 h-4 mr-2" />
              Doctor Access Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
