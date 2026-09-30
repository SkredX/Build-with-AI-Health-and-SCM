'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechRecognition(initialLang = 'hi-IN') {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState(initialLang);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  // Stores the stable "committed" text (final results only).
  // Interim results are layered on top but never saved into this ref.
  const committedRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    // Reduce silence-detection aggressiveness on mobile Chrome
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let newFinals = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Append a space between sentences
          newFinals += (newFinals ? ' ' : '') + text.trim();
        } else {
          interim += text;
        }
      }

      // Commit any new final results
      if (newFinals) {
        committedRef.current = committedRef.current
          ? committedRef.current + ' ' + newFinals
          : newFinals;
      }

      // Display = committed finals + live interim preview
      const display = interim
        ? (committedRef.current ? committedRef.current + ' ' + interim : interim)
        : committedRef.current;

      setTranscript(display);
    };

    recognition.onerror = (event) => {
      // 'no-speech' is normal; ignore it so the session keeps running
      if (event.error !== 'no-speech') {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch (_) {}
    };
  }, [language]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }, [language]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
    } catch (e) {
      console.warn('Recognition stop exception:', e);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording(); else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  const clearTranscript = useCallback(() => {
    committedRef.current = '';
    setTranscript('');
  }, []);

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
