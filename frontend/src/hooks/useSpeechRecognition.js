'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechRecognition(initialLang = 'hi-IN') {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState(initialLang);
  const [isSupported, setIsSupported] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);
  // Stores the stable "committed" text (final results only).
  const committedRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let newFinals = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinals += (newFinals ? ' ' : '') + text.trim();
        } else {
          interim += text;
        }
      }

      if (newFinals) {
        committedRef.current = committedRef.current
          ? committedRef.current + ' ' + newFinals
          : newFinals;
      }

      const display = interim
        ? (committedRef.current ? committedRef.current + ' ' + interim : interim)
        : committedRef.current;

      setTranscript(display);
      setSpeechError(null);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Normal silence timeout; don't disrupt if user just paused
        return;
      }
      let errMsg = 'Speech recognition error';
      if (event.error === 'not-allowed') {
        errMsg = 'Microphone access was denied. Please allow microphone permission in your browser.';
      } else if (event.error === 'network') {
        errMsg = 'Network error during voice recognition. Check your internet connection.';
      } else if (event.error === 'audio-capture') {
        errMsg = 'No microphone found or audio capture device failed.';
      } else {
        errMsg = `Speech recognition notice: ${event.error}`;
      }
      setSpeechError(errMsg);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch (_) {}
    };
  }, [language]);

  const updateTranscript = useCallback((text) => {
    committedRef.current = text;
    setTranscript(text);
  }, []);

  const startRecording = useCallback(() => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      if (!isSupported) {
        setSpeechError('Speech recognition is not supported in this browser. Please use Chrome/Edge or type directly.');
      }
      return;
    }
    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.warn('Recognition start exception:', e);
      // Already running or permission issue
      if (e.name !== 'InvalidStateError') {
        setSpeechError(`Could not start microphone: ${e.message || e}`);
      }
    }
  }, [language, isSupported]);

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
    setSpeechError(null);
  }, []);

  return {
    isRecording,
    transcript,
    setTranscript: updateTranscript,
    language,
    setLanguage,
    isSupported,
    speechError,
    setSpeechError,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
  };
}
