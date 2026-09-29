'use client';

import { useState, useEffect, useRef } from 'react';

export function useSpeechRecognition(initialLang = 'hi-IN') {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState(initialLang);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [language]);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
    } catch (e) {
      console.warn('Recognition stop exception:', e);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return {
    isRecording,
    transcript,
    setTranscript,
    language,
    setLanguage,
    isSupported,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
  };
}
