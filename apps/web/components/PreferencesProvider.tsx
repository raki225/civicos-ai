"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "hi" | "te";
export type Theme = "light" | "dark";

const english = {
  "nav.report": "Report an issue",
  "nav.track": "Track",
  "nav.dashboard": "Public dashboard",
  "nav.officer": "Officer",
  "nav.secure": "Secure",
  "nav.menu": "Open menu",
  "nav.close": "Close menu",
  "nav.changeLanguage": "Change language",
  "nav.lightMode": "Use light mode",
  "nav.darkMode": "Use dark mode",
  "nav.listen": "Listen to this page",
  "nav.stop": "Stop reading",
  "footer.tagline": "Accountable infrastructure intelligence",
  "footer.links": "Privacy · Accessibility · Data policy",
  "common.live": "Live",
  "common.loading": "Loading",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.listen": "Listen",
  "common.stop": "Stop",
  "common.all": "All",
  "common.unavailable": "Unavailable",
  "voice.unsupported": "Voice features are not supported in this browser.",
  "voice.permission": "Microphone access was not available. You can continue by typing.",
  "voice.error": "Voice input stopped. Please try again or continue typing.",
  "home.eyebrow": "Public infrastructure, made visible",
  "home.title": "A clearer path from",
  "home.titleAccent": "public voice to public action.",
  "home.description": "Report local infrastructure issues in minutes. CivicOS AI organizes the evidence, explains urgency, and keeps every step visible—from first report to verified repair.",
  "home.report": "Report an issue",
  "home.explore": "Explore public data",
  "home.privacy": "Privacy-first",
  "home.human": "Human-reviewed",
  "home.explainable": "Explainable AI",
  "home.previewEyebrow": "Civic intelligence",
  "home.previewTitle": "What needs attention now",
  "home.previewPriority": "High priority",
  "home.previewIssue": "Road damage near school crossing",
  "home.previewLocation": "Ward 12 · 4 reports connected",
  "home.previewStatus": "Officer review",
  "home.previewReceived": "Evidence received",
  "home.previewVoice": "Voice-ready in 3 languages",
  "home.metricReports": "Reports received",
  "home.metricOpen": "Open incidents",
  "home.metricResolved": "Resolved",
  "home.metricMedian": "Median resolution",
  "home.recordEyebrow": "One shared civic record",
  "home.recordTitle": "From a citizen’s camera to an accountable repair.",
  "home.recordCopy": "Each report becomes structured evidence. Nearby reports can join one incident without losing individual voices, while officers retain the final decision.",
  "home.captureTitle": "Capture",
  "home.captureCopy": "Add a photo, speak or type a description, and capture the location.",
  "home.understandTitle": "Understand",
  "home.understandCopy": "AI estimates urgency and shows the factors that influenced it.",
  "home.resolveTitle": "Resolve",
  "home.resolveCopy": "Departments triage work and publish privacy-safe progress.",
  "home.accessEyebrow": "Designed for every citizen",
  "home.accessTitle": "Inclusive by default. Premium by design.",
  "home.accessCopy": "A calm, high-contrast interface that adapts to your language, device, lighting, and preferred way to communicate.",
  "home.languageTitle": "English, हिन्दी, తెలుగు",
  "home.languageCopy": "Switch the full interface instantly. Your preference stays saved on this device.",
  "home.voiceTitle": "Speak instead of typing",
  "home.voiceCopy": "Dictate a report and listen to any page using built-in browser speech tools.",
  "home.themeTitle": "Light and dark themes",
  "home.themeCopy": "A carefully tuned palette keeps every surface readable day or night.",
  "report.eyebrow": "Citizen reporting",
  "report.title": "Show us what needs attention.",
  "report.intro": "Photo, location, and a short description are enough. Personal details are optional.",
  "report.step1Title": "Add evidence",
  "report.step1Copy": "A clear, nearby photo helps officers assess the issue.",
  "report.upload": "Choose a photo",
  "report.uploadHint": "JPEG, PNG, or WebP · up to 15 MB",
  "report.selected": "Selected",
  "report.step2Title": "Describe the problem",
  "report.step2Copy": "Type or speak in English, हिन्दी, or తెలుగు.",
  "report.category": "Category",
  "report.language": "Report language",
  "report.selectIssue": "Select an issue",
  "report.description": "Description",
  "report.placeholder": "What happened? Mention nearby landmarks and anything that makes this urgent.",
  "report.voiceStart": "Start voice input",
  "report.voiceStop": "Stop voice input",
  "report.voiceListening": "Listening… speak naturally",
  "report.voiceHint": "Voice input stays in your browser and can be edited before submission.",
  "report.step3Title": "Confirm the location",
  "report.step3Copy": "Precise coordinates stay private; the public map uses a rounded location.",
  "report.useLocation": "Use my current location",
  "report.locating": "Finding your location…",
  "report.locationCaptured": "Location captured",
  "report.latitude": "Latitude",
  "report.longitude": "Longitude",
  "report.anonymous": "Show this report anonymously on the public portal",
  "report.submit": "Submit report",
  "report.analyzing": "Analyzing evidence…",
  "report.note": "AI recommendations are advisory and reviewed by authorized officers. This demo is not an official government integration.",
  "report.locationError": "Location permission was not granted. Enter coordinates manually below.",
  "report.submitError": "The report could not be submitted.",
  "report.successEyebrow": "Report received",
  "report.successTitle": "Thank you for speaking up.",
  "report.successCopy": "Your evidence is saved. Keep this tracking ID to follow every update.",
  "report.trackingId": "Tracking ID",
  "report.priority": "priority",
  "report.duplicate": "This report appears related to incident {id}. Your evidence remains preserved as an individual report.",
  "report.track": "Track this report",
  "report.another": "Report another",
  "report.listenSummary": "Listen to summary",
  "track.eyebrow": "Complaint tracking",
  "track.title": "Follow the work, step by step.",
  "track.intro": "Enter the private tracking ID from your submission confirmation.",
  "track.placeholder": "CVR-YYMMDD-XXXXXX",
  "track.button": "Track",
  "track.notFound": "We could not find that tracking ID.",
  "track.unable": "Unable to load the report.",
  "track.category": "Category",
  "track.priority": "Priority",
  "track.reported": "Reported",
  "track.loading": "Loading tracking…",
  "dashboard.eyebrow": "Public transparency portal",
  "dashboard.title": "Infrastructure, in the open.",
  "dashboard.intro": "Privacy-safe, database-backed performance indicators. No personal details or precise home coordinates are published.",
  "dashboard.live": "Live stored data",
  "dashboard.total": "Total reports",
  "dashboard.totalNote": "All citizen submissions",
  "dashboard.open": "Open incidents",
  "dashboard.openNote": "Grouped civic issues",
  "dashboard.resolved": "Resolved",
  "dashboard.resolvedNote": "With documented closure",
  "dashboard.median": "Median resolution",
  "dashboard.medianNote": "Resolved records only",
  "dashboard.mapTitle": "Incident landscape",
  "dashboard.mapCopy": "Approximate locations protect reporter privacy.",
  "dashboard.incidents": "incidents",
  "dashboard.categoryTitle": "Issues by category",
  "dashboard.categoryCopy": "Grouped incidents, not raw reports.",
  "dashboard.unavailableTitle": "Public data is temporarily unavailable",
  "dashboard.unavailableCopy": "The API may still be starting. Please try again shortly.",
  "officer.eyebrow": "Municipal command center · Demo role",
  "officer.title": "Priority queue",
  "officer.intro": "AI-ranked for attention; final triage and every override remain accountable to an officer.",
  "officer.role": "Officer workspace",
  "officer.search": "Search incidents",
  "officer.filter": "Priority filter",
  "officer.count": "incidents",
  "officer.priority": "Priority",
  "officer.incident": "Incident",
  "officer.status": "Status",
  "officer.reports": "Reports",
  "officer.received": "Received",
  "officer.loading": "Loading priority queue…",
  "officer.unavailable": "Officer queue is unavailable.",
  "officer.note": "Demo authentication uses a development-only role header. Production verifies server-side identity and role claims.",
} as const;

type MessageKey = keyof typeof english;

const hindi: Record<MessageKey, string> = {
  "nav.report": "समस्या दर्ज करें", "nav.track": "ट्रैक करें", "nav.dashboard": "सार्वजनिक डैशबोर्ड", "nav.officer": "अधिकारी",
  "nav.secure": "सुरक्षित", "nav.menu": "मेनू खोलें", "nav.close": "मेनू बंद करें", "nav.changeLanguage": "भाषा बदलें",
  "nav.lightMode": "लाइट मोड चुनें", "nav.darkMode": "डार्क मोड चुनें", "nav.listen": "यह पेज सुनें", "nav.stop": "पढ़ना रोकें",
  "footer.tagline": "जवाबदेह बुनियादी ढांचा इंटेलिजेंस", "footer.links": "गोपनीयता · सुलभता · डेटा नीति",
  "common.live": "लाइव", "common.loading": "लोड हो रहा है", "common.copy": "कॉपी करें", "common.copied": "कॉपी हो गया", "common.listen": "सुनें", "common.stop": "रोकें", "common.all": "सभी", "common.unavailable": "उपलब्ध नहीं",
  "voice.unsupported": "इस ब्राउज़र में वॉइस सुविधाएँ उपलब्ध नहीं हैं।", "voice.permission": "माइक्रोफ़ोन की अनुमति नहीं मिली। आप टाइप करके जारी रख सकते हैं।", "voice.error": "वॉइस इनपुट रुक गया। फिर प्रयास करें या टाइप करें।",
  "home.eyebrow": "सार्वजनिक बुनियादी ढांचा, अब सबके सामने", "home.title": "जनता की आवाज़ से", "home.titleAccent": "सार्वजनिक कार्रवाई तक स्पष्ट रास्ता।",
  "home.description": "स्थानीय बुनियादी समस्याएँ मिनटों में दर्ज करें। CivicOS AI प्रमाण व्यवस्थित करता है, तात्कालिकता समझाता है और रिपोर्ट से सत्यापित मरम्मत तक हर कदम दिखाता है।",
  "home.report": "समस्या दर्ज करें", "home.explore": "सार्वजनिक डेटा देखें", "home.privacy": "गोपनीयता पहले", "home.human": "मानव समीक्षा", "home.explainable": "समझाने योग्य AI",
  "home.previewEyebrow": "नागरिक इंटेलिजेंस", "home.previewTitle": "अभी कहाँ ध्यान चाहिए", "home.previewPriority": "उच्च प्राथमिकता", "home.previewIssue": "स्कूल क्रॉसिंग के पास सड़क क्षति", "home.previewLocation": "वार्ड 12 · 4 रिपोर्ट जुड़ीं", "home.previewStatus": "अधिकारी समीक्षा", "home.previewReceived": "प्रमाण प्राप्त", "home.previewVoice": "3 भाषाओं में वॉइस तैयार",
  "home.metricReports": "प्राप्त रिपोर्ट", "home.metricOpen": "खुली घटनाएँ", "home.metricResolved": "समाधान हुआ", "home.metricMedian": "औसत समाधान समय",
  "home.recordEyebrow": "एक साझा नागरिक रिकॉर्ड", "home.recordTitle": "नागरिक के कैमरे से जवाबदेह मरम्मत तक।", "home.recordCopy": "हर रिपोर्ट संरचित प्रमाण बनती है। पास की रिपोर्टें अपनी अलग आवाज़ बनाए रखते हुए एक घटना से जुड़ सकती हैं, और अंतिम निर्णय अधिकारी का रहता है।",
  "home.captureTitle": "दर्ज करें", "home.captureCopy": "फोटो जोड़ें, विवरण बोलें या लिखें और स्थान दर्ज करें।", "home.understandTitle": "समझें", "home.understandCopy": "AI तात्कालिकता का अनुमान और उसके कारण दिखाता है।", "home.resolveTitle": "समाधान", "home.resolveCopy": "विभाग काम को प्राथमिकता देते हैं और गोपनीय प्रगति प्रकाशित करते हैं।",
  "home.accessEyebrow": "हर नागरिक के लिए", "home.accessTitle": "मूल रूप से समावेशी। डिज़ाइन में प्रीमियम।", "home.accessCopy": "एक शांत, स्पष्ट इंटरफ़ेस जो आपकी भाषा, डिवाइस, रोशनी और संवाद के तरीके के अनुसार ढलता है।",
  "home.languageTitle": "English, हिन्दी, తెలుగు", "home.languageCopy": "पूरा इंटरफ़ेस तुरंत बदलें। आपकी पसंद इस डिवाइस पर सुरक्षित रहती है।", "home.voiceTitle": "टाइप करने के बजाय बोलें", "home.voiceCopy": "ब्राउज़र की वॉइस सुविधाओं से रिपोर्ट बोलकर लिखें और कोई भी पेज सुनें।", "home.themeTitle": "लाइट और डार्क थीम", "home.themeCopy": "दिन या रात, हर सतह को पढ़ने योग्य रखने वाला संतुलित रंग-पैलेट।",
  "report.eyebrow": "नागरिक रिपोर्टिंग", "report.title": "बताइए कहाँ ध्यान चाहिए।", "report.intro": "फोटो, स्थान और छोटा विवरण पर्याप्त है। व्यक्तिगत जानकारी वैकल्पिक है।",
  "report.step1Title": "प्रमाण जोड़ें", "report.step1Copy": "पास से ली गई साफ़ फोटो अधिकारी को समस्या समझने में मदद करती है।", "report.upload": "फोटो चुनें", "report.uploadHint": "JPEG, PNG या WebP · अधिकतम 15 MB", "report.selected": "चुना गया",
  "report.step2Title": "समस्या का विवरण दें", "report.step2Copy": "English, हिन्दी या తెలుగు में लिखें या बोलें।", "report.category": "श्रेणी", "report.language": "रिपोर्ट की भाषा", "report.selectIssue": "समस्या चुनें", "report.description": "विवरण", "report.placeholder": "क्या हुआ? पास के स्थान और तात्कालिकता का कारण बताएं।", "report.voiceStart": "वॉइस इनपुट शुरू करें", "report.voiceStop": "वॉइस इनपुट रोकें", "report.voiceListening": "सुन रहे हैं… स्वाभाविक रूप से बोलें", "report.voiceHint": "वॉइस इनपुट आपके ब्राउज़र में रहता है और भेजने से पहले संपादित किया जा सकता है।",
  "report.step3Title": "स्थान की पुष्टि करें", "report.step3Copy": "सटीक निर्देशांक निजी रहते हैं; सार्वजनिक मानचित्र पर निकटतम स्थान दिखता है।", "report.useLocation": "मेरा वर्तमान स्थान लें", "report.locating": "स्थान खोज रहे हैं…", "report.locationCaptured": "स्थान मिल गया", "report.latitude": "अक्षांश", "report.longitude": "देशांतर", "report.anonymous": "सार्वजनिक पोर्टल पर यह रिपोर्ट गुमनाम दिखाएँ", "report.submit": "रिपोर्ट भेजें", "report.analyzing": "प्रमाण का विश्लेषण…", "report.note": "AI सुझाव केवल सलाह हैं और अधिकृत अधिकारी उनकी समीक्षा करते हैं। यह डेमो आधिकारिक सरकारी एकीकरण नहीं है।", "report.locationError": "स्थान की अनुमति नहीं मिली। नीचे निर्देशांक स्वयं दर्ज करें।", "report.submitError": "रिपोर्ट भेजी नहीं जा सकी।",
  "report.successEyebrow": "रिपोर्ट मिल गई", "report.successTitle": "आवाज़ उठाने के लिए धन्यवाद।", "report.successCopy": "आपका प्रमाण सुरक्षित है। हर अपडेट देखने के लिए यह ट्रैकिंग ID रखें।", "report.trackingId": "ट्रैकिंग ID", "report.priority": "प्राथमिकता", "report.duplicate": "यह रिपोर्ट घटना {id} से संबंधित लगती है। आपका प्रमाण अलग रिपोर्ट के रूप में सुरक्षित है।", "report.track": "इस रिपोर्ट को ट्रैक करें", "report.another": "दूसरी रिपोर्ट करें", "report.listenSummary": "सारांश सुनें",
  "track.eyebrow": "शिकायत ट्रैकिंग", "track.title": "काम की प्रगति, हर कदम पर देखें।", "track.intro": "रिपोर्ट पुष्टि में मिली निजी ट्रैकिंग ID दर्ज करें।", "track.placeholder": "CVR-YYMMDD-XXXXXX", "track.button": "ट्रैक करें", "track.notFound": "यह ट्रैकिंग ID नहीं मिली।", "track.unable": "रिपोर्ट लोड नहीं हो सकी।", "track.category": "श्रेणी", "track.priority": "प्राथमिकता", "track.reported": "रिपोर्ट की तारीख", "track.loading": "ट्रैकिंग लोड हो रही है…",
  "dashboard.eyebrow": "सार्वजनिक पारदर्शिता पोर्टल", "dashboard.title": "बुनियादी ढांचा, सबके सामने।", "dashboard.intro": "गोपनीयता-सुरक्षित, डेटाबेस आधारित संकेतक। कोई व्यक्तिगत जानकारी या सटीक घरेलू स्थान प्रकाशित नहीं होता।", "dashboard.live": "लाइव संग्रहित डेटा", "dashboard.total": "कुल रिपोर्ट", "dashboard.totalNote": "सभी नागरिक प्रस्तुतियाँ", "dashboard.open": "खुली घटनाएँ", "dashboard.openNote": "समूहित नागरिक समस्याएँ", "dashboard.resolved": "समाधान हुआ", "dashboard.resolvedNote": "दस्तावेज़ सहित बंद", "dashboard.median": "मध्य समाधान समय", "dashboard.medianNote": "केवल सुलझे रिकॉर्ड", "dashboard.mapTitle": "घटनाओं का मानचित्र", "dashboard.mapCopy": "अनुमानित स्थान रिपोर्टर की गोपनीयता बचाते हैं।", "dashboard.incidents": "घटनाएँ", "dashboard.categoryTitle": "श्रेणी के अनुसार समस्याएँ", "dashboard.categoryCopy": "समूहित घटनाएँ, कच्ची रिपोर्ट नहीं।", "dashboard.unavailableTitle": "सार्वजनिक डेटा अभी उपलब्ध नहीं है", "dashboard.unavailableCopy": "API शुरू हो रही हो सकती है। थोड़ी देर बाद फिर प्रयास करें।",
  "officer.eyebrow": "नगर कमांड सेंटर · डेमो भूमिका", "officer.title": "प्राथमिकता कतार", "officer.intro": "AI ध्यान के लिए क्रम देता है; अंतिम निर्णय और हर बदलाव अधिकारी के प्रति जवाबदेह रहता है।", "officer.role": "अधिकारी कार्यक्षेत्र", "officer.search": "घटनाएँ खोजें", "officer.filter": "प्राथमिकता फ़िल्टर", "officer.count": "घटनाएँ", "officer.priority": "प्राथमिकता", "officer.incident": "घटना", "officer.status": "स्थिति", "officer.reports": "रिपोर्ट", "officer.received": "प्राप्त", "officer.loading": "प्राथमिकता कतार लोड हो रही है…", "officer.unavailable": "अधिकारी कतार उपलब्ध नहीं है।", "officer.note": "डेमो प्रमाणीकरण विकास-केवल भूमिका हेडर उपयोग करता है। प्रोडक्शन में सर्वर-साइड पहचान और भूमिका सत्यापित होती है।",
};

const telugu: Record<MessageKey, string> = {
  "nav.report": "సమస్యను నివేదించండి", "nav.track": "ట్రాక్ చేయండి", "nav.dashboard": "పబ్లిక్ డ్యాష్‌బోర్డ్", "nav.officer": "అధికారి",
  "nav.secure": "సురక్షితం", "nav.menu": "మెనూ తెరవండి", "nav.close": "మెనూ మూసివేయండి", "nav.changeLanguage": "భాష మార్చండి",
  "nav.lightMode": "లైట్ మోడ్ ఉపయోగించండి", "nav.darkMode": "డార్క్ మోడ్ ఉపయోగించండి", "nav.listen": "ఈ పేజీని వినండి", "nav.stop": "చదవడం ఆపండి",
  "footer.tagline": "జవాబుదారీతనంతో కూడిన మౌలిక వసతుల మేధస్సు", "footer.links": "గోప్యత · అందుబాటు · డేటా విధానం",
  "common.live": "లైవ్", "common.loading": "లోడ్ అవుతోంది", "common.copy": "కాపీ", "common.copied": "కాపీ అయింది", "common.listen": "వినండి", "common.stop": "ఆపండి", "common.all": "అన్నీ", "common.unavailable": "అందుబాటులో లేదు",
  "voice.unsupported": "ఈ బ్రౌజర్‌లో వాయిస్ సదుపాయాలు అందుబాటులో లేవు.", "voice.permission": "మైక్రోఫోన్ అనుమతి లభించలేదు. టైప్ చేసి కొనసాగించవచ్చు.", "voice.error": "వాయిస్ ఇన్‌పుట్ ఆగిపోయింది. మళ్లీ ప్రయత్నించండి లేదా టైప్ చేయండి.",
  "home.eyebrow": "ప్రజా మౌలిక వసతులు, అందరికీ కనిపించేలా", "home.title": "ప్రజల స్వరం నుంచి", "home.titleAccent": "ప్రజా చర్య వరకు స్పష్టమైన మార్గం.",
  "home.description": "స్థానిక మౌలిక వసతుల సమస్యలను నిమిషాల్లో నివేదించండి. CivicOS AI ఆధారాలను క్రమబద్ధీకరిస్తుంది, అత్యవసరతను వివరిస్తుంది, మొదటి నివేదిక నుంచి ధృవీకరించిన మరమ్మతు వరకు ప్రతి దశను చూపిస్తుంది.",
  "home.report": "సమస్యను నివేదించండి", "home.explore": "పబ్లిక్ డేటా చూడండి", "home.privacy": "గోప్యతకు ప్రాధాన్యం", "home.human": "మానవ సమీక్ష", "home.explainable": "వివరణాత్మక AI",
  "home.previewEyebrow": "పౌర మేధస్సు", "home.previewTitle": "ఇప్పుడు శ్రద్ధ అవసరమైనవి", "home.previewPriority": "అధిక ప్రాధాన్యం", "home.previewIssue": "పాఠశాల క్రాసింగ్ దగ్గర రహదారి దెబ్బ", "home.previewLocation": "వార్డు 12 · 4 నివేదికలు అనుసంధానం", "home.previewStatus": "అధికారి సమీక్ష", "home.previewReceived": "ఆధారం అందింది", "home.previewVoice": "3 భాషల్లో వాయిస్ సిద్ధం",
  "home.metricReports": "అందిన నివేదికలు", "home.metricOpen": "తెరిచి ఉన్న ఘటనలు", "home.metricResolved": "పరిష్కరించినవి", "home.metricMedian": "మధ్యస్థ పరిష్కార సమయం",
  "home.recordEyebrow": "ఒకే పౌర రికార్డు", "home.recordTitle": "పౌరుడి కెమెరా నుంచి జవాబుదారీ మరమ్మతు వరకు.", "home.recordCopy": "ప్రతి నివేదిక నిర్మిత ఆధారంగా మారుతుంది. సమీప నివేదికలు తమ ప్రత్యేక స్వరాన్ని కోల్పోకుండా ఒక ఘటనకు చేరతాయి; తుది నిర్ణయం అధికారులదే.",
  "home.captureTitle": "నమోదు", "home.captureCopy": "ఫోటో జోడించండి, వివరణను మాట్లాడండి లేదా టైప్ చేయండి, స్థలాన్ని నమోదు చేయండి.", "home.understandTitle": "అర్థం చేసుకోండి", "home.understandCopy": "AI అత్యవసరతను అంచనా వేసి దానికి కారణాలను చూపిస్తుంది.", "home.resolveTitle": "పరిష్కారం", "home.resolveCopy": "విభాగాలు పనిని ప్రాధాన్యపరచి గోప్యతను కాపాడే పురోగతిని ప్రచురిస్తాయి.",
  "home.accessEyebrow": "ప్రతి పౌరుడి కోసం", "home.accessTitle": "మొదటి నుంచే సమగ్రం. రూపకల్పనలో ప్రీమియం.", "home.accessCopy": "మీ భాష, పరికరం, వెలుతురు మరియు సంభాషణ విధానానికి సరిపోయే ప్రశాంతమైన, స్పష్టమైన ఇంటర్‌ఫేస్.",
  "home.languageTitle": "English, हिन्दी, తెలుగు", "home.languageCopy": "పూర్తి ఇంటర్‌ఫేస్‌ను వెంటనే మార్చండి. మీ ఎంపిక ఈ పరికరంలో సేవ్ అవుతుంది.", "home.voiceTitle": "టైప్ బదులుగా మాట్లాడండి", "home.voiceCopy": "బ్రౌజర్ వాయిస్ సాధనాలతో నివేదికను పలికి నమోదు చేయండి, ఏ పేజీ అయినా వినండి.", "home.themeTitle": "లైట్ మరియు డార్క్ థీమ్‌లు", "home.themeCopy": "పగలు లేదా రాత్రి ప్రతి ఉపరితలం చదవడానికి అనువుగా ఉండే రంగుల సమతుల్యం.",
  "report.eyebrow": "పౌర నివేదిక", "report.title": "ఎక్కడ శ్రద్ధ అవసరమో చెప్పండి.", "report.intro": "ఫోటో, స్థలం, చిన్న వివరణ చాలు. వ్యక్తిగత వివరాలు ఐచ్ఛికం.",
  "report.step1Title": "ఆధారం జోడించండి", "report.step1Copy": "స్పష్టమైన సమీప ఫోటో సమస్యను అంచనా వేయడానికి అధికారులకు సహాయపడుతుంది.", "report.upload": "ఫోటో ఎంచుకోండి", "report.uploadHint": "JPEG, PNG లేదా WebP · గరిష్ఠంగా 15 MB", "report.selected": "ఎంచుకున్నది",
  "report.step2Title": "సమస్యను వివరించండి", "report.step2Copy": "English, हिन्दी లేదా తెలుగులో టైప్ చేయండి లేదా మాట్లాడండి.", "report.category": "వర్గం", "report.language": "నివేదిక భాష", "report.selectIssue": "సమస్యను ఎంచుకోండి", "report.description": "వివరణ", "report.placeholder": "ఏం జరిగింది? సమీప గుర్తులు, అత్యవసరతకు కారణం చెప్పండి.", "report.voiceStart": "వాయిస్ ఇన్‌పుట్ ప్రారంభించండి", "report.voiceStop": "వాయిస్ ఇన్‌పుట్ ఆపండి", "report.voiceListening": "వింటున్నాం… సహజంగా మాట్లాడండి", "report.voiceHint": "వాయిస్ ఇన్‌పుట్ మీ బ్రౌజర్‌లోనే ఉంటుంది; పంపే ముందు మార్చవచ్చు.",
  "report.step3Title": "స్థలాన్ని నిర్ధారించండి", "report.step3Copy": "ఖచ్చితమైన కోఆర్డినేట్లు గోప్యంగా ఉంటాయి; పబ్లిక్ మ్యాప్‌లో సుమారు స్థలం మాత్రమే కనిపిస్తుంది.", "report.useLocation": "నా ప్రస్తుత స్థలాన్ని ఉపయోగించండి", "report.locating": "స్థలాన్ని కనుగొంటున్నాం…", "report.locationCaptured": "స్థలం నమోదైంది", "report.latitude": "అక్షాంశం", "report.longitude": "రేఖాంశం", "report.anonymous": "పబ్లిక్ పోర్టల్‌లో ఈ నివేదికను అనామకంగా చూపించండి", "report.submit": "నివేదిక పంపండి", "report.analyzing": "ఆధారాన్ని విశ్లేషిస్తున్నాం…", "report.note": "AI సూచనలు సలహా మాత్రమే; అధికృత అధికారులు సమీక్షిస్తారు. ఈ డెమో అధికారిక ప్రభుత్వ అనుసంధానం కాదు.", "report.locationError": "స్థల అనుమతి లభించలేదు. కింద కోఆర్డినేట్లను నమోదు చేయండి.", "report.submitError": "నివేదిక పంపడం సాధ్యపడలేదు.",
  "report.successEyebrow": "నివేదిక అందింది", "report.successTitle": "మీ స్వరం వినిపించినందుకు ధన్యవాదాలు.", "report.successCopy": "మీ ఆధారం భద్రపరచబడింది. ప్రతి అప్‌డేట్ కోసం ఈ ట్రాకింగ్ ID ఉంచుకోండి.", "report.trackingId": "ట్రాకింగ్ ID", "report.priority": "ప్రాధాన్యం", "report.duplicate": "ఈ నివేదిక {id} ఘటనకు సంబంధించినదిగా కనిపిస్తోంది. మీ ఆధారం ప్రత్యేక నివేదికగా భద్రంగా ఉంటుంది.", "report.track": "ఈ నివేదికను ట్రాక్ చేయండి", "report.another": "మరో నివేదిక", "report.listenSummary": "సారాంశం వినండి",
  "track.eyebrow": "ఫిర్యాదు ట్రాకింగ్", "track.title": "పని పురోగతిని ప్రతి దశలో చూడండి.", "track.intro": "నివేదిక నిర్ధారణలో వచ్చిన ప్రైవేట్ ట్రాకింగ్ ID నమోదు చేయండి.", "track.placeholder": "CVR-YYMMDD-XXXXXX", "track.button": "ట్రాక్", "track.notFound": "ఆ ట్రాకింగ్ ID కనుగొనబడలేదు.", "track.unable": "నివేదికను లోడ్ చేయలేకపోయాం.", "track.category": "వర్గం", "track.priority": "ప్రాధాన్యం", "track.reported": "నివేదించిన తేదీ", "track.loading": "ట్రాకింగ్ లోడ్ అవుతోంది…",
  "dashboard.eyebrow": "పబ్లిక్ పారదర్శకత పోర్టల్", "dashboard.title": "మౌలిక వసతులు, అందరికీ కనిపించేలా.", "dashboard.intro": "గోప్యతను కాపాడే, డేటాబేస్ ఆధారిత సూచికలు. వ్యక్తిగత వివరాలు లేదా ఖచ్చితమైన ఇంటి స్థలాలు ప్రచురించబడవు.", "dashboard.live": "లైవ్ నిల్వ డేటా", "dashboard.total": "మొత్తం నివేదికలు", "dashboard.totalNote": "అన్ని పౌర సమర్పణలు", "dashboard.open": "తెరిచి ఉన్న ఘటనలు", "dashboard.openNote": "సమూహీకరించిన పౌర సమస్యలు", "dashboard.resolved": "పరిష్కరించినవి", "dashboard.resolvedNote": "పత్రబద్ధ ముగింపు", "dashboard.median": "మధ్యస్థ పరిష్కార సమయం", "dashboard.medianNote": "పరిష్కరించిన రికార్డులు మాత్రమే", "dashboard.mapTitle": "ఘటనల దృశ్యం", "dashboard.mapCopy": "సుమారు స్థానాలు నివేదించిన వారి గోప్యతను కాపాడతాయి.", "dashboard.incidents": "ఘటనలు", "dashboard.categoryTitle": "వర్గాల వారీ సమస్యలు", "dashboard.categoryCopy": "సమూహ ఘటనలు, ముడి నివేదికలు కాదు.", "dashboard.unavailableTitle": "పబ్లిక్ డేటా తాత్కాలికంగా అందుబాటులో లేదు", "dashboard.unavailableCopy": "API ఇంకా ప్రారంభమవుతూ ఉండవచ్చు. కొద్దిసేపటికి మళ్లీ ప్రయత్నించండి.",
  "officer.eyebrow": "మునిసిపల్ కమాండ్ సెంటర్ · డెమో పాత్ర", "officer.title": "ప్రాధాన్య క్యూలు", "officer.intro": "AI శ్రద్ధ కోసం క్రమబద్ధీకరిస్తుంది; తుది వర్గీకరణ, ప్రతి మార్పుకు అధికారి బాధ్యత వహిస్తారు.", "officer.role": "అధికారి వర్క్‌స్పేస్", "officer.search": "ఘటనలను వెతకండి", "officer.filter": "ప్రాధాన్య ఫిల్టర్", "officer.count": "ఘటనలు", "officer.priority": "ప్రాధాన్యం", "officer.incident": "ఘటన", "officer.status": "స్థితి", "officer.reports": "నివేదికలు", "officer.received": "అందిన తేదీ", "officer.loading": "ప్రాధాన్య క్యూను లోడ్ చేస్తున్నాం…", "officer.unavailable": "అధికారి క్యూ అందుబాటులో లేదు.", "officer.note": "డెమో ప్రమాణీకరణ అభివృద్ధి-మాత్రమే పాత్ర హెడర్‌ను ఉపయోగిస్తుంది. ప్రొడక్షన్‌లో సర్వర్ గుర్తింపు మరియు పాత్రను ధృవీకరిస్తుంది.",
};

const messages: Record<Language, Record<MessageKey, string>> = { en: english, hi: hindi, te: telugu };

const taxonomy: Record<Language, Record<string, string>> = {
  en: {
    pothole: "Pothole", road_damage: "Road damage", garbage: "Garbage accumulation", water_leakage: "Water leakage", drainage: "Drainage obstruction", streetlight: "Broken streetlight", other: "Other",
    submitted: "Submitted", under_review: "Under review", assigned: "Assigned", in_progress: "In progress", verification_pending: "Verification pending", resolved: "Resolved", rejected: "Rejected", duplicate: "Duplicate", reopened: "Reopened",
    low: "Low", medium: "Medium", high: "High", critical: "Critical",
  },
  hi: {
    pothole: "गड्ढा", road_damage: "सड़क क्षति", garbage: "कचरा जमा", water_leakage: "पानी का रिसाव", drainage: "नाली अवरोध", streetlight: "खराब स्ट्रीटलाइट", other: "अन्य",
    submitted: "जमा", under_review: "समीक्षा में", assigned: "सौंपा गया", in_progress: "काम जारी", verification_pending: "सत्यापन बाकी", resolved: "समाधान हुआ", rejected: "अस्वीकृत", duplicate: "दोहराव", reopened: "फिर खोला गया",
    low: "कम", medium: "मध्यम", high: "उच्च", critical: "अत्यंत जरूरी",
  },
  te: {
    pothole: "గుంత", road_damage: "రహదారి దెబ్బ", garbage: "చెత్త పేరుకుపోవడం", water_leakage: "నీటి లీకేజీ", drainage: "మురుగు కాలువ అడ్డంకి", streetlight: "పాడైన వీధి దీపం", other: "ఇతర",
    submitted: "సమర్పించబడింది", under_review: "సమీక్షలో", assigned: "కేటాయించబడింది", in_progress: "పని జరుగుతోంది", verification_pending: "ధృవీకరణ పెండింగ్", resolved: "పరిష్కరించబడింది", rejected: "తిరస్కరించబడింది", duplicate: "నకలు", reopened: "మళ్లీ తెరవబడింది",
    low: "తక్కువ", medium: "మధ్యస్థ", high: "అధిక", critical: "అత్యవసరం",
  },
};

export const languageOptions: Array<{ code: Language; label: string; shortLabel: string; locale: string; speechLocale: string }> = [
  { code: "en", label: "English", shortLabel: "EN", locale: "en-IN", speechLocale: "en-IN" },
  { code: "hi", label: "हिन्दी", shortLabel: "हि", locale: "hi-IN", speechLocale: "hi-IN" },
  { code: "te", label: "తెలుగు", shortLabel: "తె", locale: "te-IN", speechLocale: "te-IN" },
];

type PreferencesContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: MessageKey, replacements?: Record<string, string | number>) => string;
  labelFor: (value: string) => string;
  locale: string;
  speechLocale: string;
  voiceSupported: boolean;
  isSpeaking: boolean;
  speak: (text: string) => void;
  readPage: () => void;
  stopSpeaking: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function replaceTokens(value: string, replacements?: Record<string, string | number>) {
  if (!replacements) return value;
  return Object.entries(replacements).reduce((result, [key, replacement]) => result.replaceAll(`{${key}}`, String(replacement)), value);
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("civicos-language");
    const nextLanguage: Language = storedLanguage === "hi" || storedLanguage === "te" ? storedLanguage : "en";
    const nextTheme: Theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setLanguageState(nextLanguage);
    setThemeState(nextTheme);
    document.documentElement.lang = languageOptions.find((item) => item.code === nextLanguage)?.locale ?? "en-IN";
    setVoiceSupported("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    if (!voiceNotice) return;
    const timeout = window.setTimeout(() => setVoiceNotice(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [voiceNotice]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("civicos-language", nextLanguage);
    document.documentElement.lang = languageOptions.find((item) => item.code === nextLanguage)?.locale ?? "en-IN";
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const nextTheme: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      window.localStorage.setItem("civicos-theme", nextTheme);
      return nextTheme;
    });
  }, []);

  const option = languageOptions.find((item) => item.code === language) ?? languageOptions[0];
  const t = useCallback((key: MessageKey, replacements?: Record<string, string | number>) => replaceTokens(messages[language][key], replacements), [language]);
  const labelFor = useCallback((value: string) => taxonomy[language][value] ?? value.replaceAll("_", " "), [language]);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceNotice(messages[language]["voice.unsupported"]);
      return;
    }
    const cleanText = text.replace(/\s+/g, " ").trim();
    if (!cleanText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 12000));
    utterance.lang = option.speechLocale;
    utterance.rate = 0.96;
    utterance.pitch = 1;
    const matchingVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(option.speechLocale.slice(0, 2).toLowerCase()));
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [language, option.speechLocale]);

  const readPage = useCallback(() => {
    const main = document.querySelector("main");
    speak(main?.textContent ?? "");
  }, [speak]);

  const value = useMemo<PreferencesContextValue>(() => ({
    language, setLanguage, theme, toggleTheme, t, labelFor, locale: option.locale, speechLocale: option.speechLocale,
    voiceSupported, isSpeaking, speak, readPage, stopSpeaking,
  }), [language, setLanguage, theme, toggleTheme, t, labelFor, option.locale, option.speechLocale, voiceSupported, isSpeaking, speak, readPage, stopSpeaking]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
      <div className={`preference-toast${voiceNotice ? " visible" : ""}`} role="status" aria-live="polite">{voiceNotice}</div>
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside PreferencesProvider");
  return context;
}
