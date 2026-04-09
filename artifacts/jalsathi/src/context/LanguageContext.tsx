import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mw';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboardTitle: { en: 'Authority Dashboard', hi: 'अधिकारी डैशबोर्ड', mw: 'अधिकारी डैशबोर्ड' },
  reportTitle: { en: 'Report Water Issue', hi: 'जल समस्या रिपोर्ट करें', mw: 'पाणी री समस्या बतावो' },
  
  // Dashboard Metrics & Cards
  listView: { en: 'List', hi: 'सूची', mw: 'सूची' },
  mapView: { en: 'Map', hi: 'नक्शा', mw: 'नकशो' },
  topContributors: { en: 'Top Contributors', hi: 'शीर्ष योगदानकर्ता', mw: 'मोटा कामणगारा' },
  priorityScore: { en: 'Priority Score', hi: 'प्राथमिकता स्कोर', mw: 'प्राथमिकता स्कोर' },
  peopleAffected: { en: 'People Affected', hi: 'प्रभावित लोग', mw: 'लोग' },
  reports: { en: 'Reports', hi: 'रिपोर्ट', mw: 'रिपोर्ट' },
  days: { en: 'Days Active', hi: 'सक्रिय दिन', mw: 'दिण' },
  crisisCluster: { en: 'Crisis Cluster', hi: 'संकट क्लस्टर', mw: 'संकट क्लस्टर' },
  criticalVillages: { en: 'Critical Villages', hi: 'गंभीर गाँव', mw: 'ज़्यादा ओखा गांव' },
  activeIssues: { en: 'Total Active Issues', hi: 'कुल सक्रिय समस्याएँ', mw: 'चालू समस्या' },
  village: { en: 'Village', hi: 'गाँव', mw: 'गांव' },
  intensity: { en: 'Intensity', hi: 'तीव्रता', mw: 'तीव्रता' },
  systemStatus: { en: 'System Status', hi: 'सिस्टम की स्थिति', mw: 'सिस्टम रो हाल' },
  currentState: { en: 'Current State', hi: 'वर्तमान स्थिति', mw: 'अब को हाल' },
  recommendedAction: { en: 'Recommended Action', hi: 'अनुशंसित कार्रवाई', mw: 'सलाह' },
  totalReports: { en: 'Total Reports', hi: 'कुल रिपोर्ट', mw: 'सगळी रिपोर्ट' },
  activeReports: { en: 'Active Reports', hi: 'सक्रिय रिपोर्ट', mw: 'चालू रिपोर्ट' },
  dashboardDesc: { en: 'Monitor and manage rural water complaints across Rajasthan, Haryana, and Delhi NCR.', hi: 'राजस्थान, हरियाणा और दिल्ली एनसीआर में ग्रामीण जल शिकायतों की निगरानी और प्रबंधन करें।', mw: 'राजस्थान और हरियाणा रे गांव री समस्यावां री देखरेख करो।' },
  pendingAssigned: { en: 'Pending + Assigned', hi: 'लंबित + सौंपा गया', mw: 'रुकी और दी थकी' },
  criticalZone: { en: 'Critical Zone', hi: 'गंभीर क्षेत्र', mw: 'ज़्यादा ओखी जगा' },
  activeCluster: { en: 'Active Cluster', hi: 'सक्रिय क्लस्टर', mw: 'चालू क्लस्टर' },
  resolvedCluster: { en: 'Resolved Cluster', hi: 'सुलझाया गया क्लस्टर', mw: 'ठीक व्है ग्यो' },
  reportsHigh: { en: '6 Reports · High Urgency', hi: '6 रिपोर्ट · उच्च प्राथमिकता', mw: '6 रिपोर्ट · घणी ओखी' },
  reportsMed: { en: '3 Reports · Medium Urgency', hi: '3 रिपोर्ट · मध्यम प्राथमिकता', mw: '3 रिपोर्ट · बीच री' },
  reportsLow: { en: '2 Reports · Low Urgency', hi: '2 रिपोर्ट · कम प्राथमिकता', mw: '2 रिपोर्ट · थोड़ी' },
  nangalCluster: { en: 'Nangal Cluster', hi: 'नंगल क्लस्टर', mw: 'नंगल क्लस्टर' },
  bhusawarArea: { en: 'Bhusawar Area', hi: 'भुसावर क्षेत्र', mw: 'भुसावर जगा' },
  jaipurZone: { en: 'Jaipur Zone', hi: 'जयपुर क्षेत्र', mw: 'जयपुर जगा' },
  peopleAffectedText: { en: 'people affected', hi: 'लोग प्रभावित', mw: 'लोग ओखा है' },
  nangalRegion: { en: 'Nangal Region', hi: 'नंगल क्षेत्र', mw: 'नंगल जगा' },
  nangalDesc: { en: 'Localized drought conditions detected. 980+ people currently without access to clean water.', hi: 'स्थानीय सूखे की स्थिति का पता चला। राजस्थान के 980+ लोग वर्तमान में स्वच्छ पानी के बिना हैं।', mw: 'अठे काळ पड्यो है। राजस्थान रा 980 सू ज़्यादा लोग पाणी वास्ते तरस रया है।' },
  accurateVerified: { en: 'highly accurate, verified reports', hi: 'अत्यधिक सटीक, सत्यापित रिपोर्ट', mw: 'एकदम सांची और खरी रिपोर्ट' },
  honestReporting: { en: 'Honest Reporting', hi: 'ईमानदार रिपोर्टिंग', mw: 'सांची खबर' },
  standard: { en: 'Standard', hi: 'मानक', mw: 'मामूली' },
  filterByStatus: { en: 'Filter by Status:', hi: 'स्थिति के अनुसार फ़िल्टर:', mw: 'हाल रे हिसाब सू देखो:' },
  allStatuses: { en: 'All Statuses', hi: 'सभी स्थितियाँ', mw: 'सगळो हाल' },
  sortPriority: { en: 'Priority: Critical First', hi: 'प्राथमिकता: पहले गंभीर', mw: 'पेली ओखा' },
  sortDefault: { en: 'Sort by Priority', hi: 'प्राथमिकता के अनुसार क्रमबद्ध करें', mw: 'प्राथमिकता सू देखो' },
  acrossActive: { en: 'Across active issues', hi: 'सक्रिय समस्याओं में', mw: 'समस्यावां रे मांय' },
  needImmediate: { en: 'Need immediate action', hi: 'तत्काल कार्रवाई की आवश्यकता', mw: 'जल्दी काम करणो है' },
  sidebarDesc: { en: 'Recognizing local volunteers who consistently supply highly accurate, verified reports.', hi: 'उन स्थानीय स्वयंसेवकों को पहचानना जो लगातार अत्यधिक सटीक, सत्यापित रिपोर्ट प्रदान करते हैं।', mw: 'गांव रा वे लोग जो सांची और खरी खबर देवे है।' },
  noIssuesFound: { en: 'No issues found', hi: 'कोई समस्या नहीं मिली', mw: 'कोई समस्या कोनी मिली' },
  noFilterMatches: { en: 'No reports match your current filters.', hi: 'आपकी वर्तमान फ़िल्टर के अनुसार कोई रिपोर्ट नहीं मिली।', mw: 'कोई खबर कोनी मिली।' },

  // Report Form Details
  reportDesc: { en: 'Please provide details about the water issue in your village.', hi: 'कृपया अपने गाँव में जल समस्या के बारे में विवरण प्रदान करें।', mw: 'थारे गांव री समस्या बताओ।' },
  villagePlaceholder: { en: 'Enter village name', hi: 'गाँव का नाम दर्ज करें', mw: 'गांव रो नाम लिखो' },
  gpsPlaceholder: { en: 'Auto-detecting...', hi: 'ऑटो-डिटेक्टिंग...', mw: 'अपने आप जगा देख रयो है...' },
  selectCategory: { en: 'Select category...', hi: 'श्रेणी का चयन करें...', mw: 'समस्या री जात चुणो...' },
  detailsPlaceholder: { en: 'Describe location details (e.g., Behind the school)...', hi: 'स्थान का विवरण दें (जैसे स्कूल के पीछे)...', mw: 'जगा बताओ (जैसे स्कूल रे लारे)...' },
  problemPlaceholder: { en: 'Describe the problem (e.g., Pipe is leaking or water is muddy)...', hi: 'समस्या का वर्णन करें (जैसे पाइप लीक हो रहा है या पानी गंदा है)...', mw: 'समस्या बताओ (जैसे पाइप फूट ग्यो है)...' },
  clickToUpload: { en: 'Click to upload photo', hi: 'फोटो अपलोड करने के लिए क्लिक करें', mw: 'फोटो लगावा रे वास्ते दबाओ' },
  removePhoto: { en: 'Remove Photo', hi: 'फोटो हटाएँ', mw: 'फोटो हटावो' },
  submitting: { en: 'Submitting...', hi: 'जमा किया जा रहा है...', mw: 'भेज रया हां...' },
  emergencyTitle: { en: 'Emergency Reporting', hi: 'आपातकालीन रिपोर्टिंग', mw: 'आपातकालीन रिपोर्टिंग' },
  emergencyDesc: { en: 'Issues marked as Critical or High require Phone Verification / Aadhaar OTP to prevent spam.', hi: 'स्पैम को रोकने के लिए गंभीर या उच्च चिह्नित समस्याओं के लिए फ़ोन सत्यापन की आवश्यकता होती है।', mw: 'ओखी खबर वास्ते फोन ओ.टी.पी जरूरी है ताकि कोई गलत खबर नी भेज सके।' },
  fillDemo: { en: 'Fill Demo Data', hi: 'डेमो डेटा भरें', mw: 'डेमो डेटा भरो' },
  recordVoice: { en: 'Record your problem', hi: 'अपनी समस्या रिकॉर्ड करें', mw: 'बोल कर बताओ' },
  tapToSpeak: { en: 'Tap the microphone to speak natively in your local language instead of typing.', hi: 'टाइप करने के बजाय अपनी स्थानीय भाषा में बोलने के लिए माइक्रोफ़ोन पर टैप करें।', mw: 'टाइप करवा रे जगा बोल कर अपनी बात बताओ।' },
  recording: { en: 'Recording...', hi: 'रिकॉर्डिंग...', mw: 'रिकॉर्डिंग व्है री है...' },
  speakClearly: { en: 'Speak clearly into your microphone.', hi: 'अपने माइक्रोफ़ोन में साफ़ बोलें।', mw: 'माइक्रोफ़ोन में सुथरो बोलो।' },
  textPhotoReport: { en: 'Text & Photo Report', hi: 'टेक्स्ट और फोटो रिपोर्ट', mw: 'लिख कर और फोटो' },
  voiceRecording: { en: 'Voice Recording', hi: 'वॉयस रिकॉर्डिंग', mw: 'बोल कर रिकॉर्डिंग' },

  // Categories
  'Handpump Broken': { en: 'Handpump Broken', hi: 'हैंडपंप खराब', mw: 'हैंडपंप खराब' },
  'Borewell Failure': { en: 'Borewell Failure', hi: 'बोरवेल फेल', mw: 'बोरवेल कोनी चाले' },
  'No Water Supply': { en: 'No Water Supply', hi: 'पानी की आपूर्ति नहीं', mw: 'पाणी कोनी आवे' },
  'Tanker Required': { en: 'Tanker Required', hi: 'टैंकर की आवश्यकता', mw: 'टैंकर चाये' },
  'Other': { en: 'Other', hi: 'अन्य', mw: 'दूजी' },
  
  // OTP Modal
  verifyIdentity: { en: 'Verify Identity', hi: 'पहचान सत्यापित करें', mw: 'सत्यापन' },
  otpDesc: { en: 'High urgency reports require phone or Aadhaar verification to prevent spam.', hi: 'स्पैम को रोकने के लिए उच्च प्राथमिकता वाली रिपोर्टों के लिए फ़ोन या आधार सत्यापन की आवश्यकता होती है।', mw: 'ओखी खबर वास्ते फोन ओ.टी.पी जरूरी है।' },
  phoneNumber: { en: 'Phone Number', hi: 'फ़ोन नंबर', mw: 'फोन नंबर' },
  phonePlaceholder: { en: '10-digit number', hi: '10 अंकों का नंबर', mw: '10 दिगां रो नंबर' },
  sendOtp: { en: 'Send OTP', hi: 'ओटीपी भेजें', mw: 'ओटीपी भेजो' },
  enterOtp: { en: 'Enter OTP', hi: 'ओटीपी दर्ज करें', mw: 'ओटीपी लिखो' },
  verifySubmit: { en: 'Verify & Submit Report', hi: 'सत्यापित करें और रिपोर्ट जमा करें', mw: 'सत्यापन और भेजो' },
  changePhone: { en: 'Change Phone Number', hi: 'फ़ोन नंबर बदलें', mw: 'नंबर बदलो' },

  // Report Form Labels
  villageName: { en: 'Village Name', hi: 'गाँव का नाम', mw: 'गांव रो नाम' },
  gpsLocation: { en: 'GPS Location', hi: 'जीपीएस स्थान', mw: 'जीपीएस जगा' },
  howSevere: { en: "How severe is it?", hi: 'यह कितना गंभीर है?', mw: 'आ कित्ती ओखी है?' },
  tellUsHappening: { en: "Tell us what's happening", hi: "हमें बताएं कि क्या हो रहा है", mw: "म्हाने बताओ काईं व्है रयो है" },
  otherWriteIt: { en: 'Other (write it)', hi: 'अन्य (लिखें)', mw: 'दूजी (लिखो)' },
  attachPhoto: { en: 'Attach Photo', hi: 'फोटो जोड़ें', mw: 'फोटो लगावो' },
  additionalDetails: { en: 'Additional Details', hi: 'अतिरिक्त विवरण', mw: 'अतिरिक्त जानकारी' },
  submitReport: { en: 'Submit Report', hi: 'रिपोर्ट जमा करें', mw: 'रिपोर्ट भेजो' },
  
  // Urgency Levels
  'Low': { en: 'Low', hi: 'कम', mw: 'थोड़ी' },
  'Medium': { en: 'Medium', hi: 'मध्यम', mw: 'बीच री' },
  'High': { en: 'High', hi: 'उच्च', mw: 'घणी' },
  'Critical': { en: 'Critical', hi: 'गंभीर', mw: 'ज़्यादा' },

  // Zones
  'Drought-Prone Zone': { en: 'Drought-Prone Zone', hi: 'सूखा प्रवृत्त क्षेत्र', mw: 'काल पड़ने वाली जगा' },
  'High Groundwater Usage': { en: 'High Groundwater Usage', hi: 'उच्च भूजल उपयोग', mw: 'ज़मीनी पाणी रो घणो इस्तेमाल' },
  'Urban Water Stress': { en: 'Urban Water Stress', hi: 'शहरी जल तनाव', mw: 'शेर में पाणी री कमी' },

  // Actions
  'Deploy water tanker immediately': { en: 'Deploy water tanker immediately', hi: 'तुरंत पानी का टैंकर भेजें', mw: 'जल्दी पाणी रो टैंकर भेजो' },
  'Repair within 24 hours': { en: 'Repair within 24 hours', hi: '24 घंटे के भीतर मरम्मत करें', mw: '24 घन्टा रे मांय ठीक करो' },
  'Schedule inspection this week': { en: 'Schedule inspection this week', hi: 'इस सप्ताह निरीक्षण निर्धारित करें', mw: 'इण हफ्ता जांच करो' },
  'Monitor situation': { en: 'Monitor situation', hi: 'स्थिति की निगरानी करें', mw: 'हाल देखो' },

  // Status
  'Pending': { en: 'Pending', hi: 'लंबित', mw: 'रुकी थकी' },
  'Assigned': { en: 'Assigned', hi: 'सौंपा गया', mw: 'दे दियो' },
  'Resolved': { en: 'Resolved', hi: 'सुलझा लिया', mw: 'ठीक व्है ग्यो' },
  'PendingSelect': { en: 'Pending', hi: 'लंबित', mw: 'रुकी थकी' },
  'AssignedSelect': { en: 'Assigned', hi: 'सौंपा गया', mw: 'दे दियो' },
  'ResolvedSelect': { en: 'Resolved', hi: 'सुलझा लिया', mw: 'ठीक व्है ग्यो' },
  analytics: { en: 'Analytics', hi: 'विश्लेषण', mw: 'जांच' },
  pts: { en: 'pts', hi: 'अंक', mw: 'अंक' },
  govId: { en: 'Aadhaar Card', hi: 'आधार कार्ड', mw: 'आधार कार्ड' },
  govIdOptional: { en: 'Aadhaar Card (Optional)', hi: 'आधार कार्ड (वैकल्पिक)', mw: 'आधार कार्ड (मर्जी है)' },
  uploadId: { en: 'Upload Aadhaar', hi: 'आधार अपलोड करें', mw: 'आधार डालो' },
  
  // Regions
  'Rajasthan': { en: 'Rajasthan', hi: 'राजस्थान', mw: 'राजस्थान' },
  'Haryana': { en: 'Haryana', hi: 'हरियाणा', mw: 'हरियाणा' },
  'Delhi NCR': { en: 'Delhi NCR', hi: 'दिल्ली एनसीआर', mw: 'दिल्ली एनसीआर' },

  // Villages
  'Ramgarh': { en: 'Ramgarh', hi: 'रामगढ़', mw: 'रामगढ़' },
  'Nangal': { en: 'Nangal', hi: 'नंगल', mw: 'नंगल' },
  'Mandawar': { en: 'Mandawar', hi: 'मंडावर', mw: 'मंडावर' },
  'Pataudi': { en: 'Pataudi', hi: 'पटौदी', mw: 'पटौदी' },
  'Lalsot': { en: 'Lalsot', hi: 'लालसोट', mw: 'लालसोट' },
  'Khekra': { en: 'Khekra', hi: 'खेखड़ा', mw: 'खेखड़ा' },
  'Rewari': { en: 'Rewari', hi: 'रेवाड़ी', mw: 'रेवाड़ी' },

  // Mock Details
  'The main handpump near the panchayat building is completely dry.': { 
    en: 'The main handpump near the panchayat building is completely dry.', 
    hi: 'पंचायत भवन के पास मुख्य हैंडपंप पूरी तरह से सूखा है।', 
    mw: 'पंचायत री बिलडिंग रे कोणे वालो हैंडपंप एकदम सूख ग्यो है।' 
  },
  'Entire village has not received piped water for 4 days.': { 
    en: 'Entire village has not received piped water for 4 days.', 
    hi: 'पूरे गांव में 4 दिनों से पाइप से पानी नहीं मिला है।', 
    mw: 'सगळे गांव में ४ दिणां सू पाणी कोनी आयो।' 
  },
  'Motor seems burnt out. Needs urgent replacement.': { 
    en: 'Motor seems burnt out. Needs urgent replacement.', 
    hi: 'मोटर जल गई लगती है। तत्काल बदलने की आवश्यकता है।', 
    mw: 'मोटर बल गयी है। जल्दी बदलनी पड़सी।' 
  },
  'Summer shortage, need weekly tanker delivery for the outer wards.': { 
    en: 'Summer shortage, need weekly tanker delivery for the outer wards.', 
    hi: 'गर्मियों की कमी, बाहरी वार्डों के लिए साप्ताहिक टैंकर वितरण की आवश्यकता है।', 
    mw: 'ऊनाळे में पाणी री कमी है, बाहरे वार्ड वास्ते टैंकर चाये।' 
  },
  'Pipeline broke during road construction.': { 
    en: 'Pipeline broke during road construction.', 
    hi: 'सड़क निर्माण के दौरान पाइपलाइन टूट गई।', 
    mw: 'सडक बणती टेम पाइप टूट ग्यो।' 
  },
  'Handle is loose, needs minor repair.': { 
    en: 'Handle is loose, needs minor repair.', 
    hi: 'हैंडल ढीला है, मामूली मरम्मत की जरूरत है।', 
    mw: 'हैंडल ढीलो है, थोड़ो सो ठीक करणों पड़सी।' 
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getNumberLocale: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const getNumberLocale = () => {
    switch (language) {
      case 'hi': return 'hi-IN';
      case 'mw': return 'hi-IN';
      default: return 'en-IN';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getNumberLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
