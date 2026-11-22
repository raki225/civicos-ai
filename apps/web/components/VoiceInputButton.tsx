"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { usePreferences } from "@/components/PreferencesProvider";

type RecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type RecognitionErrorLike = { error?: string };

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: RecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
};

type RecognitionConstructor = new () => RecognitionLike;

export function VoiceInputButton({ onTranscript }: { onTranscript: (transcript: string) => void }) {
  const { t, speechLocale } = usePreferences();
  const recognition = useRef<RecognitionLike | null>(null);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const browserWindow = window as typeof window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    setSupported(Boolean(browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition));
    return () => recognition.current?.abort();
  }, []);

  function toggle() {
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }

    const browserWindow = window as typeof window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const Recognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setSupported(false);
      setMessage(t("voice.unsupported"));
      return;
    }

    const instance = new Recognition();
    recognition.current = instance;
    instance.lang = speechLocale;
    instance.continuous = false;
    instance.interimResults = true;
    instance.onresult = (event) => {
      let finalTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        if (event.results[index].isFinal) finalTranscript += event.results[index][0].transcript;
      }
      if (finalTranscript.trim()) onTranscript(finalTranscript.trim());
    };
    instance.onerror = (event) => {
      setListening(false);
      setMessage(event.error === "not-allowed" || event.error === "service-not-allowed" ? t("voice.permission") : t("voice.error"));
    };
    instance.onend = () => setListening(false);

    try {
      instance.start();
      setMessage("");
      setListening(true);
    } catch {
      setMessage(t("voice.error"));
      setListening(false);
    }
  }

  return (
    <div className="voice-input-wrap">
      <button
        type="button"
        className={`voice-input-button${listening ? " listening" : ""}`}
        onClick={toggle}
        disabled={!supported}
        aria-pressed={listening}
        title={supported ? (listening ? t("report.voiceStop") : t("report.voiceStart")) : t("voice.unsupported")}
      >
        {listening ? <MicOff size={17} /> : <Mic size={17} />}
        <span>{listening ? t("common.stop") : t("common.listen")}</span>
        {listening && <i aria-hidden="true" />}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{listening ? t("report.voiceListening") : message}</span>
    </div>
  );
}
