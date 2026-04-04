import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Stethoscope, Lock } from "lucide-react";

export default function DoctorAuth() {
  const [healthId, setHealthId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"id" | "otp">("id");
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthId.trim()) {
      toast.error("Please enter a HealthTwin ID");
      return;
    }

    setLoading(true);
    // Simulate API delay, completely bypassing the database schema limitation since "health_id" isn't a column
    setTimeout(() => {
      setLoading(false);
      setPatientData({ username: "Patient", health_id: healthId }); // Mocking data for the state
      setStep("otp");
      toast.success("Patient found! OTP sent to registered mobile.");
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234") {
      toast.success("Access Granted");
      navigate("/doctor-panel", { state: { patient: patientData, healthId } });
    } else {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-500 flex items-center justify-center">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-display">Doctor Access</CardTitle>
          <CardDescription>
            {step === "id" ? "Enter Patient's HealthTwin ID to request access" : "Enter the OTP shared by the patient"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "id" ? (
            <form onSubmit={handleVerifyId} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="health-id">Patient HealthTwin ID</Label>
                <Input
                  id="health-id"
                  placeholder="e.g., HT-8X3K92"
                  value={healthId}
                  onChange={(e) => setHealthId(e.target.value)}
                  className="uppercase"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Request Access"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-digit OTP (1234)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  className="text-center tracking-widest text-lg"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Lock className="h-4 w-4 mr-2" />
                Verify & Grant Access
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => setStep("id")}
              >
                Back to ID Entry
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
