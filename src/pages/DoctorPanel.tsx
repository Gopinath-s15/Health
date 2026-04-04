import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Stethoscope, AlertTriangle } from "lucide-react";

export default function DoctorPanel() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const patient = state?.patient;
  const healthId = state?.healthId;

  useEffect(() => {
    if (!healthId) {
      navigate("/doctor-auth");
      return;
    }

    fetchPendingPrescriptions();
  }, [healthId, navigate]);

  const fetchPendingPrescriptions = async () => {
    setLoading(true);
    const { data: rxData, error } = await (supabase as any)
      .from("prescriptions")
      .select(`
        *,
        medicines (*)
      `);

    if (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to load pending prescriptions");
    } else {
      const pending = (rxData || []).filter((rx: any) => {
        try {
          const meta = JSON.parse(rx.summary || "{}");
          return meta.patient_health_id === healthId && meta.status === "pending";
        } catch {
          return false;
        }
      }).map((rx: any) => {
        try {
          const meta = JSON.parse(rx.summary || "{}");
          return { ...rx, summary: meta.text, confidence: meta.confidence, patient_name: meta.patient_name };
        } catch {
          return rx;
        }
      });
      setPrescriptions(pending);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    const rx = prescriptions.find(p => p.id === id);
    if (!rx) return;
    const newSummary = JSON.stringify({
      text: rx.summary || "",
      status: "verified",
      confidence: rx.confidence || 1.0,
      patient_health_id: healthId,
      patient_name: rx.patient_name,
      image_data: rx.image_data
    });

    const { error } = await (supabase as any)
      .from("prescriptions")
      .update({ summary: newSummary })
      .eq("id", id);

    if (error) {
      toast.error("Failed to approve prescription");
    } else {
      toast.success("Prescription approved and verified!");
      setPrescriptions(prescriptions.filter(p => p.id !== id));
    }
  };

  const handleReject = async (id: string) => {
    const rx = prescriptions.find(p => p.id === id);
    if (!rx) return;
    const newSummary = JSON.stringify({
      text: rx.summary || "",
      status: "rejected",
      confidence: rx.confidence || 0.0,
      patient_health_id: healthId,
      patient_name: rx.patient_name,
      image_data: rx.image_data
    });

    const { error } = await (supabase as any)
      .from("prescriptions")
      .update({ summary: newSummary })
      .eq("id", id);

    if (error) {
      toast.error("Failed to reject prescription");
    } else {
      toast.info("Prescription rejected");
      setPrescriptions(prescriptions.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Doctor Verification Panel</h1>
            <p className="text-gray-500">Accessing records for Patient: <span className="font-semibold text-gray-900">{patient?.username || healthId}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm py-1">
              Active Session
            </Badge>
            <Button variant="outline" onClick={() => navigate("/doctor-auth")}>End Session</Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Pending Verifications ({prescriptions.length})
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
            <p className="text-gray-500">No pending prescriptions for this patient.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {prescriptions.map((p) => (
              <Card key={p.id} className="shadow-md border-orange-100 overflow-hidden">
                <div className="bg-orange-50 border-b border-orange-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold text-orange-800">AI Extracted - Needs Verification</span>
                  </div>
                  <div className="text-sm font-medium text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    Confidence: {(p.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Dr. {p.doctor_name}</CardTitle>
                      <CardDescription>{p.hospital_name} • {p.date}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {p.summary && (
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <strong>AI Summary:</strong> {p.summary}
                    </div>
                  )}

                  {p.image_data && (
                    <div className="mt-4 border rounded-xl overflow-hidden shadow-sm bg-muted/30 p-2 text-center">
                       <p className="text-xs font-semibold text-muted-foreground border-b pb-2 mb-2 text-left">Original Uploaded Prescription</p>
                       <img src={p.image_data} alt="Uploaded Prescription" className="mx-auto rounded w-full h-auto object-contain max-h-96" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Extracted Medicines</h4>
                    <div className="grid gap-2">
                      {p.medicines && p.medicines.length > 0 ? (
                        p.medicines.map((med: any, idx: number) => (
                          <div key={med.id || idx} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                            <div>
                              <p className="font-bold text-gray-900">{med.medicine_name}</p>
                              <p className="text-sm text-gray-500">{med.dosage} • {med.timing} • {med.food_instruction}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">Edit</Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No medicines extracted.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t mt-6">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(p.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Verify
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(p.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject (Needs Manual Entry)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
