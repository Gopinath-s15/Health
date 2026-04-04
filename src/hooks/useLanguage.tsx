import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ta" | "hi" | "te";

export const LANGUAGE_OPTIONS: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
];

// Translation keys organized by section
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    "auth.title": "Health Twin AI",
    "auth.signIn": "Sign in to your account",
    "auth.createAccount": "Create your account",
    "auth.mobile": "Mobile Number",
    "auth.enterMobile": "Enter mobile number",
    "auth.password": "Password",
    "auth.enterPassword": "Enter password",
    "auth.signInBtn": "Sign In",
    "auth.signingIn": "Signing in…",
    "auth.username": "Username",
    "auth.enterName": "Enter your name",
    "auth.createPassword": "Create Password",
    "auth.minChars": "Min 6 characters",
    "auth.preferredLang": "Preferred Language",
    "auth.selectLang": "Select language",
    "auth.createAccountBtn": "Create Account",
    "auth.creating": "Creating…",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.fillAll": "Please fill all fields",
    "auth.validMobile": "Enter a valid mobile number",
    "auth.minPassword": "Password must be at least 6 characters",
    "auth.signupFailed": "Signup failed",
    "auth.accountCreated": "Account created!",
    "auth.welcome": "Welcome to Health Twin AI",
    "auth.loginFailed": "Login failed",

    // Sidebar
    "nav.main": "Main",
    "nav.management": "Management",
    "nav.dashboard": "Dashboard",
    "nav.uploadRx": "Upload Rx",
    "nav.prescriptions": "Prescriptions",
    "nav.reminders": "Reminders",
    "nav.adminPanel": "Admin Panel",
    "nav.profile": "Profile",
    "nav.patientId": "Patient ID",
    "nav.signOut": "Sign Out",
    "nav.aiPoweredCare": "AI-Powered Care",

    // Dashboard
    "dash.greeting": "Good Morning",
    "dash.overview": "Here's your health overview for today",
    "dash.todaySchedule": "Today's Schedule",
    "dash.viewAll": "View All",
    "dash.recentRx": "Recent Prescriptions",
    "dash.medicines": "medicines",

    // Upload
    "upload.title": "Upload Prescription",
    "upload.subtitle": "Upload a prescription image and our AI will extract the details",
    "upload.drop": "Drop your prescription here",
    "upload.browse": "or click to browse",
    "upload.analyzing": "Analyzing Prescription with AI...",
    "upload.extracting": "Extracting text and structuring data",
    "upload.failed": "Analysis Failed",
    "upload.complete": "AI Extraction Complete",
    "upload.poweredBy": "Powered by AI",
    "upload.aiSummary": "AI Summary",
    "upload.date": "Date",
    "upload.hospital": "Hospital",
    "upload.doctor": "Doctor",
    "upload.extractedMeds": "Extracted Medicines",
    "upload.save": "Save Prescription",
    "upload.saving": "Saving...",
    "upload.saved": "✓ Saved",
    "upload.saveSuccess": "Prescription saved successfully!",
    "upload.analyzeSuccess": "Prescription analyzed successfully!",
    "upload.manualEntry": "Enter Prescription Manually",
    "upload.manualSubtitle": "Fill in the prescription details by hand",
    "upload.addMedicine": "Add Medicine",
    "upload.removeMedicine": "Remove",
    "upload.creditError": "AI Credits Exhausted",
    "upload.creditErrorDesc": "Your AI usage limit has been reached. You can enter prescription details manually below.",
    "upload.rateLimitError": "Too Many Requests",
    "upload.rateLimitDesc": "Please wait a moment and try again, or enter details manually below.",
    "upload.fillRequired": "Please fill doctor name and hospital name",
    "upload.addOneMed": "Please add at least one medicine",
    "upload.summaryPlaceholder": "Optional notes or summary",

    // Prescriptions
    "rx.title": "Prescription History",
    "rx.subtitle": "All your prescriptions in one place",
    "rx.noRx": "No prescriptions yet",
    "rx.uploadToStart": "Upload a prescription to get started",

    // Reminders
    "rem.title": "Medicine Reminders 🔔",
    "rem.subtitle": "Stay on track with your medication schedule",
    "rem.noReminders": "No reminders yet",
    "rem.saveToGenerate": "Save a prescription to generate reminders",
    "rem.basedOn": "Based on latest prescription",
    "rem.todaySchedule": "Today's Schedule",
    "rem.taken": "taken",
    "rem.markDone": "Mark Done",

    // Admin
    "admin.title": "Admin Panel",
    "admin.subtitle": "Create prescriptions manually",
    "admin.doctorHospital": "Doctor & Hospital Details",
    "admin.hospitalName": "Hospital Name",
    "admin.doctorName": "Doctor Name",
    "admin.specialization": "Specialization",
    "admin.contactNumber": "Contact Number",
    "admin.address": "Address",
    "admin.medicines": "Medicines",
    "admin.addMedicine": "Add Medicine",
    "admin.medicineName": "Medicine Name",
    "admin.dosage": "Dosage",
    "admin.morning": "Morning",
    "admin.afternoon": "Afternoon",
    "admin.night": "Night",
    "admin.beforeFood": "Before Food",
    "admin.afterFood": "After Food",
    "admin.createRx": "Create Prescription",

    // Profile
    "profile.title": "Patient Profile",
    "profile.subtitle": "Manage your personal details",
    "profile.personalInfo": "Personal Information",
    "profile.fullName": "Full Name",
    "profile.age": "Age",
    "profile.gender": "Gender",
    "profile.male": "Male",
    "profile.female": "Female",
    "profile.other": "Other",
    "profile.bloodGroup": "Blood Group",
    "profile.contact": "Contact Number",
    "profile.address": "Address",
    "profile.save": "Save Changes",

    // Patient ID
    "pid.title": "Patient ID Card",
    "pid.subtitle": "Your digital health identity",
    "pid.digitalCard": "Digital Health Card",
    "pid.scanDetails": "Scan for full details",
    "pid.opensProfile": "Opens patient profile & prescriptions",
    "pid.download": "Download ID Card",

    // Common
    "common.medicine": "Medicine",
    "common.upcoming": "upcoming",
    "common.pending": "pending",
  },

  ta: {
    // Auth
    "auth.title": "ஹெல்த் ட்வின் AI",
    "auth.signIn": "உங்கள் கணக்கில் உள்நுழையுங்கள்",
    "auth.createAccount": "உங்கள் கணக்கை உருவாக்குங்கள்",
    "auth.mobile": "மொபைல் எண்",
    "auth.enterMobile": "மொபைல் எண்ணை உள்ளிடுங்கள்",
    "auth.password": "கடவுச்சொல்",
    "auth.enterPassword": "கடவுச்சொல்லை உள்ளிடுங்கள்",
    "auth.signInBtn": "உள்நுழையுங்கள்",
    "auth.signingIn": "உள்நுழைகிறது…",
    "auth.username": "பயனர்பெயர்",
    "auth.enterName": "உங்கள் பெயரை உள்ளிடுங்கள்",
    "auth.createPassword": "கடவுச்சொல் உருவாக்கு",
    "auth.minChars": "குறைந்தது 6 எழுத்துகள்",
    "auth.preferredLang": "விருப்பமான மொழி",
    "auth.selectLang": "மொழியைத் தேர்ந்தெடுக்கவும்",
    "auth.createAccountBtn": "கணக்கை உருவாக்கு",
    "auth.creating": "உருவாக்குகிறது…",
    "auth.noAccount": "கணக்கு இல்லையா?",
    "auth.haveAccount": "ஏற்கனவே கணக்கு உள்ளதா?",
    "auth.fillAll": "அனைத்து புலங்களையும் நிரப்பவும்",
    "auth.validMobile": "சரியான மொபைல் எண்ணை உள்ளிடுங்கள்",
    "auth.minPassword": "கடவுச்சொல் குறைந்தது 6 எழுத்துகளாக இருக்க வேண்டும்",
    "auth.signupFailed": "பதிவு தோல்வியடைந்தது",
    "auth.accountCreated": "கணக்கு உருவாக்கப்பட்டது!",
    "auth.welcome": "ஹெல்த் ட்வின் AI க்கு வரவேற்கிறோம்",
    "auth.loginFailed": "உள்நுழைவு தோல்வியடைந்தது",

    // Sidebar
    "nav.main": "முக்கிய",
    "nav.management": "மேலாண்மை",
    "nav.dashboard": "டாஷ்போர்ட்",
    "nav.uploadRx": "மருந்துச்சீட்டு பதிவேற்று",
    "nav.prescriptions": "மருந்துச்சீட்டுகள்",
    "nav.reminders": "நினைவூட்டல்கள்",
    "nav.adminPanel": "நிர்வாக குழு",
    "nav.profile": "சுயவிவரம்",
    "nav.patientId": "நோயாளி அடையாளம்",
    "nav.signOut": "வெளியேறு",
    "nav.aiPoweredCare": "AI இயங்கும் பராமரிப்பு",

    // Dashboard
    "dash.greeting": "காலை வணக்கம்",
    "dash.overview": "இன்றைய உங்கள் சுகாதார மேலோட்டம்",
    "dash.todaySchedule": "இன்றைய அட்டவணை",
    "dash.viewAll": "அனைத்தையும் காண்க",
    "dash.recentRx": "சமீபத்திய மருந்துச்சீட்டுகள்",
    "dash.medicines": "மருந்துகள்",

    // Upload
    "upload.title": "மருந்துச்சீட்டு பதிவேற்று",
    "upload.subtitle": "மருந்துச்சீட்டு படத்தை பதிவேற்றவும், எங்கள் AI விவரங்களை பிரித்தெடுக்கும்",
    "upload.drop": "உங்கள் மருந்துச்சீட்டை இங்கே விடுங்கள்",
    "upload.browse": "அல்லது உலாவ கிளிக் செய்யவும்",
    "upload.analyzing": "AI மூலம் மருந்துச்சீட்டை பகுப்பாய்வு செய்கிறது...",
    "upload.extracting": "உரையைப் பிரித்தெடுத்து தரவை கட்டமைக்கிறது",
    "upload.failed": "பகுப்பாய்வு தோல்வியடைந்தது",
    "upload.complete": "AI பிரித்தெடுத்தல் முடிந்தது",
    "upload.poweredBy": "AI இயக்கத்தில்",
    "upload.aiSummary": "AI சுருக்கம்",
    "upload.date": "தேதி",
    "upload.hospital": "மருத்துவமனை",
    "upload.doctor": "மருத்துவர்",
    "upload.extractedMeds": "பிரித்தெடுக்கப்பட்ட மருந்துகள்",
    "upload.save": "மருந்துச்சீட்டை சேமி",
    "upload.saving": "சேமிக்கிறது...",
    "upload.saved": "✓ சேமிக்கப்பட்டது",
    "upload.saveSuccess": "மருந்துச்சீட்டு வெற்றிகரமாக சேமிக்கப்பட்டது!",
    "upload.analyzeSuccess": "மருந்துச்சீட்டு வெற்றிகரமாக பகுப்பாய்வு செய்யப்பட்டது!",
    "upload.manualEntry": "மருந்துச்சீட்டை கைமுறையாக உள்ளிடுங்கள்",
    "upload.manualSubtitle": "மருந்துச்சீட்டு விவரங்களை கையால் நிரப்பவும்",
    "upload.addMedicine": "மருந்து சேர்",
    "upload.removeMedicine": "நீக்கு",
    "upload.creditError": "AI கிரெடிட்கள் தீர்ந்துவிட்டன",
    "upload.creditErrorDesc": "உங்கள் AI பயன்பாட்டு வரம்பை அடைந்துவிட்டீர்கள். கீழே மருந்துச்சீட்டு விவரங்களை கைமுறையாக உள்ளிடலாம்.",
    "upload.rateLimitError": "அதிகமான கோரிக்கைகள்",
    "upload.rateLimitDesc": "சிறிது நேரம் காத்திருந்து மீண்டும் முயற்சிக்கவும், அல்லது கீழே கைமுறையாக உள்ளிடவும்.",
    "upload.fillRequired": "மருத்துவர் பெயர் மற்றும் மருத்துவமனை பெயரை நிரப்பவும்",
    "upload.addOneMed": "குறைந்தது ஒரு மருந்தையாவது சேர்க்கவும்",
    "upload.summaryPlaceholder": "விருப்பமான குறிப்புகள்",

    // Prescriptions
    "rx.title": "மருந்துச்சீட்டு வரலாறு",
    "rx.subtitle": "உங்கள் அனைத்து மருந்துச்சீட்டுகளும் ஒரே இடத்தில்",
    "rx.noRx": "இன்னும் மருந்துச்சீட்டுகள் இல்லை",
    "rx.uploadToStart": "தொடங்க ஒரு மருந்துச்சீட்டை பதிவேற்றவும்",

    // Reminders
    "rem.title": "மருந்து நினைவூட்டல்கள் 🔔",
    "rem.subtitle": "உங்கள் மருந்து அட்டவணையில் தொடருங்கள்",
    "rem.noReminders": "இன்னும் நினைவூட்டல்கள் இல்லை",
    "rem.saveToGenerate": "நினைவூட்டல்களை உருவாக்க ஒரு மருந்துச்சீட்டை சேமிக்கவும்",
    "rem.basedOn": "சமீபத்திய மருந்துச்சீட்டின் அடிப்படையில்",
    "rem.todaySchedule": "இன்றைய அட்டவணை",
    "rem.taken": "எடுத்துக்கொண்டது",
    "rem.markDone": "முடிந்தது",

    // Admin
    "admin.title": "நிர்வாக குழு",
    "admin.subtitle": "மருந்துச்சீட்டுகளை கைமுறையாக உருவாக்கவும்",
    "admin.doctorHospital": "மருத்துவர் & மருத்துவமனை விவரங்கள்",
    "admin.hospitalName": "மருத்துவமனை பெயர்",
    "admin.doctorName": "மருத்துவர் பெயர்",
    "admin.specialization": "நிபுணத்துவம்",
    "admin.contactNumber": "தொடர்பு எண்",
    "admin.address": "முகவரி",
    "admin.medicines": "மருந்துகள்",
    "admin.addMedicine": "மருந்து சேர்",
    "admin.medicineName": "மருந்தின் பெயர்",
    "admin.dosage": "அளவு",
    "admin.morning": "காலை",
    "admin.afternoon": "மதியம்",
    "admin.night": "இரவு",
    "admin.beforeFood": "உணவுக்கு முன்",
    "admin.afterFood": "உணவுக்குப் பின்",
    "admin.createRx": "மருந்துச்சீட்டை உருவாக்கு",

    // Profile
    "profile.title": "நோயாளி சுயவிவரம்",
    "profile.subtitle": "உங்கள் தனிப்பட்ட விவரங்களை நிர்வகிக்கவும்",
    "profile.personalInfo": "தனிப்பட்ட தகவல்",
    "profile.fullName": "முழு பெயர்",
    "profile.age": "வயது",
    "profile.gender": "பாலினம்",
    "profile.male": "ஆண்",
    "profile.female": "பெண்",
    "profile.other": "பிற",
    "profile.bloodGroup": "இரத்த வகை",
    "profile.contact": "தொடர்பு எண்",
    "profile.address": "முகவரி",
    "profile.save": "மாற்றங்களைச் சேமி",

    // Patient ID
    "pid.title": "நோயாளி அடையாள அட்டை",
    "pid.subtitle": "உங்கள் டிஜிட்டல் சுகாதார அடையாளம்",
    "pid.digitalCard": "டிஜிட்டல் சுகாதார அட்டை",
    "pid.scanDetails": "முழு விவரங்களுக்கு ஸ்கேன் செய்யவும்",
    "pid.opensProfile": "நோயாளி சுயவிவரம் & மருந்துச்சீட்டுகளைத் திறக்கும்",
    "pid.download": "அடையாள அட்டையை பதிவிறக்கு",

    // Common
    "common.medicine": "மருந்து",
    "common.upcoming": "வரவிருக்கும்",
    "common.pending": "நிலுவையில்",
  },

  hi: {
    // Auth
    "auth.title": "हेल्थ ट्विन AI",
    "auth.signIn": "अपने खाते में साइन इन करें",
    "auth.createAccount": "अपना खाता बनाएं",
    "auth.mobile": "मोबाइल नंबर",
    "auth.enterMobile": "मोबाइल नंबर दर्ज करें",
    "auth.password": "पासवर्ड",
    "auth.enterPassword": "पासवर्ड दर्ज करें",
    "auth.signInBtn": "साइन इन करें",
    "auth.signingIn": "साइन इन हो रहा है…",
    "auth.username": "उपयोगकर्ता नाम",
    "auth.enterName": "अपना नाम दर्ज करें",
    "auth.createPassword": "पासवर्ड बनाएं",
    "auth.minChars": "कम से कम 6 अक्षर",
    "auth.preferredLang": "पसंदीदा भाषा",
    "auth.selectLang": "भाषा चुनें",
    "auth.createAccountBtn": "खाता बनाएं",
    "auth.creating": "बना रहा है…",
    "auth.noAccount": "खाता नहीं है?",
    "auth.haveAccount": "पहले से खाता है?",
    "auth.fillAll": "कृपया सभी फ़ील्ड भरें",
    "auth.validMobile": "वैध मोबाइल नंबर दर्ज करें",
    "auth.minPassword": "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
    "auth.signupFailed": "साइन अप विफल",
    "auth.accountCreated": "खाता बनाया गया!",
    "auth.welcome": "हेल्थ ट्विन AI में आपका स्वागत है",
    "auth.loginFailed": "लॉगिन विफल",

    // Sidebar
    "nav.main": "मुख्य",
    "nav.management": "प्रबंधन",
    "nav.dashboard": "डैशबोर्ड",
    "nav.uploadRx": "पर्चा अपलोड करें",
    "nav.prescriptions": "पर्चे",
    "nav.reminders": "रिमाइंडर",
    "nav.adminPanel": "एडमिन पैनल",
    "nav.profile": "प्रोफ़ाइल",
    "nav.patientId": "रोगी पहचान",
    "nav.signOut": "साइन आउट",
    "nav.aiPoweredCare": "AI-संचालित देखभाल",

    // Dashboard
    "dash.greeting": "सुप्रभात",
    "dash.overview": "आज का आपका स्वास्थ्य अवलोकन",
    "dash.todaySchedule": "आज का कार्यक्रम",
    "dash.viewAll": "सभी देखें",
    "dash.recentRx": "हालिया पर्चे",
    "dash.medicines": "दवाइयां",

    // Upload
    "upload.title": "पर्चा अपलोड करें",
    "upload.subtitle": "एक पर्चे की छवि अपलोड करें और हमारा AI विवरण निकालेगा",
    "upload.drop": "अपना पर्चा यहाँ छोड़ें",
    "upload.browse": "या ब्राउज़ करने के लिए क्लिक करें",
    "upload.analyzing": "AI से पर्चे का विश्लेषण हो रहा है...",
    "upload.extracting": "टेक्स्ट निकालकर डेटा व्यवस्थित कर रहे हैं",
    "upload.failed": "विश्लेषण विफल",
    "upload.complete": "AI निष्कर्षण पूर्ण",
    "upload.poweredBy": "AI द्वारा संचालित",
    "upload.aiSummary": "AI सारांश",
    "upload.date": "तारीख",
    "upload.hospital": "अस्पताल",
    "upload.doctor": "डॉक्टर",
    "upload.extractedMeds": "निकाली गई दवाइयां",
    "upload.save": "पर्चा सहेजें",
    "upload.saving": "सहेज रहे हैं...",
    "upload.saved": "✓ सहेजा गया",
    "upload.saveSuccess": "पर्चा सफलतापूर्वक सहेजा गया!",
    "upload.analyzeSuccess": "पर्चे का विश्लेषण सफलतापूर्वक हुआ!",
    "upload.manualEntry": "पर्चा मैन्युअल रूप से दर्ज करें",
    "upload.manualSubtitle": "पर्चे का विवरण हाथ से भरें",
    "upload.addMedicine": "दवा जोड़ें",
    "upload.removeMedicine": "हटाएं",
    "upload.creditError": "AI क्रेडिट समाप्त",
    "upload.creditErrorDesc": "आपकी AI उपयोग सीमा पूरी हो गई है। नीचे पर्चे का विवरण मैन्युअल रूप से दर्ज कर सकते हैं।",
    "upload.rateLimitError": "बहुत अधिक अनुरोध",
    "upload.rateLimitDesc": "कृपया थोड़ी देर प्रतीक्षा करें और पुनः प्रयास करें, या नीचे मैन्युअल रूप से दर्ज करें।",
    "upload.fillRequired": "कृपया डॉक्टर का नाम और अस्पताल का नाम भरें",
    "upload.addOneMed": "कृपया कम से कम एक दवा जोड़ें",
    "upload.summaryPlaceholder": "वैकल्पिक नोट्स या सारांश",

    // Prescriptions
    "rx.title": "पर्चे का इतिहास",
    "rx.subtitle": "आपके सभी पर्चे एक जगह",
    "rx.noRx": "अभी तक कोई पर्चा नहीं",
    "rx.uploadToStart": "शुरू करने के लिए एक पर्चा अपलोड करें",

    // Reminders
    "rem.title": "दवा रिमाइंडर 🔔",
    "rem.subtitle": "अपनी दवा के कार्यक्रम पर बने रहें",
    "rem.noReminders": "अभी तक कोई रिमाइंडर नहीं",
    "rem.saveToGenerate": "रिमाइंडर बनाने के लिए एक पर्चा सहेजें",
    "rem.basedOn": "नवीनतम पर्चे के आधार पर",
    "rem.todaySchedule": "आज का कार्यक्रम",
    "rem.taken": "ले लिया",
    "rem.markDone": "पूरा करें",

    // Admin
    "admin.title": "एडमिन पैनल",
    "admin.subtitle": "मैन्युअल रूप से पर्चे बनाएं",
    "admin.doctorHospital": "डॉक्टर और अस्पताल विवरण",
    "admin.hospitalName": "अस्पताल का नाम",
    "admin.doctorName": "डॉक्टर का नाम",
    "admin.specialization": "विशेषज्ञता",
    "admin.contactNumber": "संपर्क नंबर",
    "admin.address": "पता",
    "admin.medicines": "दवाइयां",
    "admin.addMedicine": "दवा जोड़ें",
    "admin.medicineName": "दवा का नाम",
    "admin.dosage": "खुराक",
    "admin.morning": "सुबह",
    "admin.afternoon": "दोपहर",
    "admin.night": "रात",
    "admin.beforeFood": "खाने से पहले",
    "admin.afterFood": "खाने के बाद",
    "admin.createRx": "पर्चा बनाएं",

    // Profile
    "profile.title": "रोगी प्रोफ़ाइल",
    "profile.subtitle": "अपने व्यक्तिगत विवरण प्रबंधित करें",
    "profile.personalInfo": "व्यक्तिगत जानकारी",
    "profile.fullName": "पूरा नाम",
    "profile.age": "उम्र",
    "profile.gender": "लिंग",
    "profile.male": "पुरुष",
    "profile.female": "महिला",
    "profile.other": "अन्य",
    "profile.bloodGroup": "रक्त समूह",
    "profile.contact": "संपर्क नंबर",
    "profile.address": "पता",
    "profile.save": "बदलाव सहेजें",

    // Patient ID
    "pid.title": "रोगी पहचान पत्र",
    "pid.subtitle": "आपकी डिजिटल स्वास्थ्य पहचान",
    "pid.digitalCard": "डिजिटल स्वास्थ्य कार्ड",
    "pid.scanDetails": "पूरी जानकारी के लिए स्कैन करें",
    "pid.opensProfile": "रोगी प्रोफ़ाइल और पर्चे खोलता है",
    "pid.download": "पहचान पत्र डाउनलोड करें",

    // Common
    "common.medicine": "दवा",
    "common.upcoming": "आगामी",
    "common.pending": "लंबित",
  },

  te: {
    // Auth
    "auth.title": "హెల్త్ ట్విన్ AI",
    "auth.signIn": "మీ ఖాతాలోకి సైన్ ఇన్ చేయండి",
    "auth.createAccount": "మీ ఖాతాను సృష్టించండి",
    "auth.mobile": "మొబైల్ నంబర్",
    "auth.enterMobile": "మొబైల్ నంబర్ నమోదు చేయండి",
    "auth.password": "పాస్‌వర్డ్",
    "auth.enterPassword": "పాస్‌వర్డ్ నమోదు చేయండి",
    "auth.signInBtn": "సైన్ ఇన్",
    "auth.signingIn": "సైన్ ఇన్ అవుతోంది…",
    "auth.username": "వినియోగదారు పేరు",
    "auth.enterName": "మీ పేరు నమోదు చేయండి",
    "auth.createPassword": "పాస్‌వర్డ్ సృష్టించండి",
    "auth.minChars": "కనీసం 6 అక్షరాలు",
    "auth.preferredLang": "ఇష్టమైన భాష",
    "auth.selectLang": "భాషను ఎంచుకోండి",
    "auth.createAccountBtn": "ఖాతా సృష్టించు",
    "auth.creating": "సృష్టిస్తోంది…",
    "auth.noAccount": "ఖాతా లేదా?",
    "auth.haveAccount": "ఇప్పటికే ఖాతా ఉందా?",
    "auth.fillAll": "దయచేసి అన్ని ఫీల్డ్‌లను నింపండి",
    "auth.validMobile": "చెల్లుబాటు అయ్యే మొబైల్ నంబర్ నమోదు చేయండి",
    "auth.minPassword": "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి",
    "auth.signupFailed": "సైన్ అప్ విఫలమైంది",
    "auth.accountCreated": "ఖాతా సృష్టించబడింది!",
    "auth.welcome": "హెల్త్ ట్విన్ AI కి స్వాగతం",
    "auth.loginFailed": "లాగిన్ విఫలమైంది",

    // Sidebar
    "nav.main": "ప్రధాన",
    "nav.management": "నిర్వహణ",
    "nav.dashboard": "డాష్‌బోర్డ్",
    "nav.uploadRx": "ప్రిస్క్రిప్షన్ అప్‌లోడ్",
    "nav.prescriptions": "ప్రిస్క్రిప్షన్లు",
    "nav.reminders": "రిమైండర్లు",
    "nav.adminPanel": "అడ్మిన్ ప్యానెల్",
    "nav.profile": "ప్రొఫైల్",
    "nav.patientId": "రోగి గుర్తింపు",
    "nav.signOut": "సైన్ అవుట్",
    "nav.aiPoweredCare": "AI-ఆధారిత సంరక్షణ",

    // Dashboard
    "dash.greeting": "శుభోదయం",
    "dash.overview": "ఈ రోజు మీ ఆరోగ్య అవలోకనం",
    "dash.todaySchedule": "ఈ రోజు షెడ్యూల్",
    "dash.viewAll": "అన్నీ చూడండి",
    "dash.recentRx": "ఇటీవలి ప్రిస్క్రిప్షన్లు",
    "dash.medicines": "మందులు",

    // Upload
    "upload.title": "ప్రిస్క్రిప్షన్ అప్‌లోడ్",
    "upload.subtitle": "ప్రిస్క్రిప్షన్ చిత్రాన్ని అప్‌లోడ్ చేయండి, మా AI వివరాలను సంగ్రహిస్తుంది",
    "upload.drop": "మీ ప్రిస్క్రిప్షన్‌ను ఇక్కడ వదలండి",
    "upload.browse": "లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి",
    "upload.analyzing": "AI తో ప్రిస్క్రిప్షన్ విశ్లేషిస్తోంది...",
    "upload.extracting": "టెక్స్ట్ సంగ్రహించి డేటాను నిర్మాణం చేస్తోంది",
    "upload.failed": "విశ్లేషణ విఫలమైంది",
    "upload.complete": "AI సంగ్రహణ పూర్తయింది",
    "upload.poweredBy": "AI ద్వారా",
    "upload.aiSummary": "AI సారాంశం",
    "upload.date": "తేదీ",
    "upload.hospital": "ఆసుపత్రి",
    "upload.doctor": "డాక్టర్",
    "upload.extractedMeds": "సంగ్రహించిన మందులు",
    "upload.save": "ప్రిస్క్రిప్షన్ సేవ్ చేయండి",
    "upload.saving": "సేవ్ అవుతోంది...",
    "upload.saved": "✓ సేవ్ అయింది",
    "upload.saveSuccess": "ప్రిస్క్రిప్షన్ విజయవంతంగా సేవ్ అయింది!",
    "upload.analyzeSuccess": "ప్రిస్క్రిప్షన్ విజయవంతంగా విశ్లేషించబడింది!",
    "upload.manualEntry": "ప్రిస్క్రిప్షన్ మాన్యువల్‌గా నమోదు చేయండి",
    "upload.manualSubtitle": "ప్రిస్క్రిప్షన్ వివరాలను చేతితో నింపండి",
    "upload.addMedicine": "మందు జోడించు",
    "upload.removeMedicine": "తొలగించు",
    "upload.creditError": "AI క్రెడిట్లు అయిపోయాయి",
    "upload.creditErrorDesc": "మీ AI వాడకం పరిమితి చేరుకుంది. క్రింద ప్రిస్క్రిప్షన్ వివరాలను మాన్యువల్‌గా నమోదు చేయవచ్చు.",
    "upload.rateLimitError": "చాలా ఎక్కువ అభ్యర్థనలు",
    "upload.rateLimitDesc": "దయచేసి కొంచెం ఆగి మళ్లీ ప్రయత్నించండి, లేదా క్రింద మాన్యువల్‌గా నమోదు చేయండి.",
    "upload.fillRequired": "దయచేసి డాక్టర్ పేరు మరియు ఆసుపత్రి పేరు నింపండి",
    "upload.addOneMed": "దయచేసి కనీసం ఒక మందును జోడించండి",
    "upload.summaryPlaceholder": "ఐచ్ఛిక నోట్స్ లేదా సారాంశం",

    // Prescriptions
    "rx.title": "ప్రిస్క్రిప్షన్ చరిత్ర",
    "rx.subtitle": "మీ అన్ని ప్రిస్క్రిప్షన్లు ఒకే చోట",
    "rx.noRx": "ఇంకా ప్రిస్క్రిప్షన్లు లేవు",
    "rx.uploadToStart": "ప్రారంభించడానికి ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి",

    // Reminders
    "rem.title": "మందుల రిమైండర్లు 🔔",
    "rem.subtitle": "మీ మందుల షెడ్యూల్‌లో ట్రాక్‌లో ఉండండి",
    "rem.noReminders": "ఇంకా రిమైండర్లు లేవు",
    "rem.saveToGenerate": "రిమైండర్లు రూపొందించడానికి ప్రిస్క్రిప్షన్ సేవ్ చేయండి",
    "rem.basedOn": "తాజా ప్రిస్క్రిప్షన్ ఆధారంగా",
    "rem.todaySchedule": "ఈ రోజు షెడ్యూల్",
    "rem.taken": "తీసుకున్నారు",
    "rem.markDone": "పూర్తయింది",

    // Admin
    "admin.title": "అడ్మిన్ ప్యానెల్",
    "admin.subtitle": "మాన్యువల్‌గా ప్రిస్క్రిప్షన్లు సృష్టించండి",
    "admin.doctorHospital": "డాక్టర్ & ఆసుపత్రి వివరాలు",
    "admin.hospitalName": "ఆసుపత్రి పేరు",
    "admin.doctorName": "డాక్టర్ పేరు",
    "admin.specialization": "ప్రత్యేకత",
    "admin.contactNumber": "సంప్రదింపు నంబర్",
    "admin.address": "చిరునామా",
    "admin.medicines": "మందులు",
    "admin.addMedicine": "మందు జోడించు",
    "admin.medicineName": "మందు పేరు",
    "admin.dosage": "మోతాదు",
    "admin.morning": "ఉదయం",
    "admin.afternoon": "మధ్యాహ్నం",
    "admin.night": "రాత్రి",
    "admin.beforeFood": "భోజనానికి ముందు",
    "admin.afterFood": "భోజనం తర్వాత",
    "admin.createRx": "ప్రిస్క్రిప్షన్ సృష్టించు",

    // Profile
    "profile.title": "రోగి ప్రొఫైల్",
    "profile.subtitle": "మీ వ్యక్తిగత వివరాలను నిర్వహించండి",
    "profile.personalInfo": "వ్యక్తిగత సమాచారం",
    "profile.fullName": "పూర్తి పేరు",
    "profile.age": "వయస్సు",
    "profile.gender": "లింగం",
    "profile.male": "పురుషుడు",
    "profile.female": "స్త్రీ",
    "profile.other": "ఇతర",
    "profile.bloodGroup": "రక్త వర్గం",
    "profile.contact": "సంప్రదింపు నంబర్",
    "profile.address": "చిరునామా",
    "profile.save": "మార్పులు సేవ్ చేయండి",

    // Patient ID
    "pid.title": "రోగి గుర్తింపు కార్డు",
    "pid.subtitle": "మీ డిజిటల్ ఆరోగ్య గుర్తింపు",
    "pid.digitalCard": "డిజిటల్ ఆరోగ్య కార్డు",
    "pid.scanDetails": "పూర్తి వివరాల కోసం స్కాన్ చేయండి",
    "pid.opensProfile": "రోగి ప్రొఫైల్ & ప్రిస్క్రిప్షన్లు తెరుస్తుంది",
    "pid.download": "ID కార్డు డౌన్‌లోడ్",

    // Common
    "common.medicine": "మందు",
    "common.upcoming": "రాబోయే",
    "common.pending": "పెండింగ్",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => { },
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("healthtwin-lang");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("healthtwin-lang", lang);
  };

  // Also sync from user profile preferred_language on mount
  useEffect(() => {
    const saved = localStorage.getItem("healthtwin-lang");
    if (!saved) {
      // Try to get from user metadata
      const metaLang = localStorage.getItem("healthtwin-profile-lang");
      if (metaLang) {
        const langMap: Record<string, Language> = {
          "English": "en", "Tamil": "ta", "Hindi": "hi", "Telugu": "te",
        };
        if (langMap[metaLang]) setLanguage(langMap[metaLang]);
      }
    }
  }, []);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
