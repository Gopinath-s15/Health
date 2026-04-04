export const mockPatient = {
  id: "PT-2026-00142",
  name: "Chandry Mohan",
  age: 34,
  gender: "Male" as const,
  bloodGroup: "O+",
  address: "42 Green Park, Sector 18, New Delhi",
  contactNumber: "+91 98765 43210",
  photo: null,
};

export const mockPrescriptions = [
  {
    id: "RX-2026-0087",
    patientId: "PT-2026-00142",
    doctorName: "Dr. Priya Sharma",
    hospitalName: "Apollo Hospitals",
    date: "2026-03-15",
    medicines: [
      {
        id: "M001",
        name: "Paracetamol 500mg",
        dosage: "1 tablet",
        timing: { morning: true, afternoon: false, night: true },
        foodInstruction: "after" as const,
      },
      {
        id: "M002",
        name: "Amoxicillin 250mg",
        dosage: "1 capsule",
        timing: { morning: true, afternoon: true, night: true },
        foodInstruction: "after" as const,
      },
      {
        id: "M003",
        name: "Cetirizine 10mg",
        dosage: "1 tablet",
        timing: { morning: false, afternoon: false, night: true },
        foodInstruction: "before" as const,
      },
    ],
  },
  {
    id: "RX-2026-0062",
    patientId: "PT-2026-00142",
    doctorName: "Dr. Rajesh Kumar",
    hospitalName: "Fortis Healthcare",
    date: "2026-02-28",
    medicines: [
      {
        id: "M004",
        name: "Metformin 500mg",
        dosage: "1 tablet",
        timing: { morning: true, afternoon: false, night: true },
        foodInstruction: "after" as const,
      },
      {
        id: "M005",
        name: "Vitamin D3 60000 IU",
        dosage: "1 sachet",
        timing: { morning: false, afternoon: false, night: false },
        foodInstruction: "after" as const,
      },
    ],
  },
];

export const mockReminders = [
  { id: 1, time: "8:30 AM", medicine: "Paracetamol 500mg", instruction: "after food", status: "upcoming" as const },
  { id: 2, time: "8:30 AM", medicine: "Amoxicillin 250mg", instruction: "after food", status: "upcoming" as const },
  { id: 3, time: "2:00 PM", medicine: "Amoxicillin 250mg", instruction: "after food", status: "pending" as const },
  { id: 4, time: "9:00 PM", medicine: "Paracetamol 500mg", instruction: "after food", status: "pending" as const },
  { id: 5, time: "9:00 PM", medicine: "Amoxicillin 250mg", instruction: "after food", status: "pending" as const },
  { id: 6, time: "9:30 PM", medicine: "Cetirizine 10mg", instruction: "before food", status: "pending" as const },
];

export const dashboardStats = [
  { label: "Active Medicines", value: "5", change: "+2 this week", trend: "up" as const },
  { label: "Prescriptions", value: "2", change: "Latest: Mar 15", trend: "neutral" as const },
  { label: "Today's Doses", value: "6", change: "2 completed", trend: "up" as const },
  { label: "Adherence Rate", value: "94%", change: "+3% vs last month", trend: "up" as const },
];
