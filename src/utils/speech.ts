// Accessibility Audio Assistant & Speech Engine for VIVA+
import { useState, useEffect } from 'react';

export interface AudioSettingsState {
  volume: number; // 0 to 100
  isMuted: boolean;
  isSpeaking: boolean;
  currentText: string;
}

const STORAGE_KEY = 'viva_audio_settings';

// Load initial audio settings from localStorage
function loadSavedSettings(): { volume: number; isMuted: boolean } {
  if (typeof window === 'undefined') {
    return { volume: 100, isMuted: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(100, parsed.volume)) : 100,
        isMuted: Boolean(parsed.isMuted),
      };
    }
  } catch {}
  return { volume: 100, isMuted: false };
}

function saveAudioSettings(vol: number, muted: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: vol, isMuted: muted }));
  } catch {}
}

const initialSaved = loadSavedSettings();
let currentVolume = initialSaved.volume;
let currentMuted = initialSaved.isMuted;
let isSpeakingActive = false;
let currentlySpokenText = '';

type AudioListener = (state: AudioSettingsState) => void;
const listeners = new Set<AudioListener>();

function notifyListeners() {
  const state = getAudioSettings();
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch (e) {
      console.warn('Erro em listener de áudio:', e);
    }
  });
}

export function getAudioSettings(): AudioSettingsState {
  return {
    volume: currentVolume,
    isMuted: currentMuted,
    isSpeaking: isSpeakingActive,
    currentText: currentlySpokenText,
  };
}

export function setAudioVolume(vol: number): void {
  const clamped = Math.max(0, Math.min(100, Math.round(vol)));
  currentVolume = clamped;
  if (currentMuted && clamped > 0) {
    currentMuted = false;
  }
  saveAudioSettings(currentVolume, currentMuted);
  notifyListeners();
}

export function increaseVolume(step = 10): void {
  setAudioVolume(currentVolume + step);
}

export function decreaseVolume(step = 10): void {
  setAudioVolume(currentVolume - step);
}

export function toggleAudioMute(): boolean {
  currentMuted = !currentMuted;
  if (currentMuted && isSpeakingActive) {
    stopSpeaking();
  }
  saveAudioSettings(currentVolume, currentMuted);
  notifyListeners();
  return currentMuted;
}

export function setAudioMute(muted: boolean): void {
  currentMuted = Boolean(muted);
  if (currentMuted && isSpeakingActive) {
    stopSpeaking();
  }
  saveAudioSettings(currentVolume, currentMuted);
  notifyListeners();
}

export function subscribeAudioState(listener: AudioListener): () => void {
  listeners.add(listener);
  // Emit current state immediately
  listener(getAudioSettings());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * React hook to access and control audio globally
 */
export function useAudioPlayer() {
  const [state, setState] = useState<AudioSettingsState>(getAudioSettings);

  useEffect(() => {
    return subscribeAudioState((newState) => {
      setState(newState);
    });
  }, []);

  return {
    ...state,
    setVolume: setAudioVolume,
    increaseVolume,
    decreaseVolume,
    toggleMute: toggleAudioMute,
    setMute: setAudioMute,
    stop: stopSpeaking,
  };
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const refreshVoices = () => {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
      }
    } catch {}
  };
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

export let lastSpokenTime = 0;
export let lastSpokenText = '';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false;
  return isSpeakingActive || window.speechSynthesis.speaking;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    } catch (e) {
      console.warn('Erro ao interromper áudio:', e);
    }
  }
  isSpeakingActive = false;
  currentlySpokenText = '';
  notifyListeners();
}

export function explainFunctionClick(name: string, description: string): void {
  speakText(`${name}: ${description}`);
}

export function setupGlobalFunctionSpeech(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
      'button, a, [role="button"], [data-speech-desc]'
    );
    if (!target) return;

    // Skip if an explicit onClick already spoke in the last 700ms
    if (Date.now() - lastSpokenTime < 700) {
      return;
    }

    const customDesc = target.getAttribute('data-speech-desc');
    if (customDesc) {
      speakText(customDesc);
      return;
    }

    const ariaLabel = target.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim().length > 3) {
      speakText(ariaLabel);
      return;
    }

    const title = target.getAttribute('title');
    if (title && title.trim().length > 3) {
      speakText(title);
      return;
    }

    const text = target.innerText?.trim();
    if (text && text.length > 2 && text.length < 120) {
      speakText(`Opção: ${text}`);
    }
  };

  window.addEventListener('click', handleClick, { capture: true });
  return () => window.removeEventListener('click', handleClick, { capture: true });
}

export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  rate = 0.9
): void {
  if (!isSpeechSupported()) {
    console.warn('Leitura de voz não suportada pelo navegador.');
    if (onEnd) onEnd();
    return;
  }

  stopSpeaking();
  if (!text || text.trim() === '') {
    if (onEnd) onEnd();
    return;
  }

  // If audio is muted by user, suppress audible speech
  if (currentMuted) {
    if (onEnd) onEnd();
    return;
  }

  lastSpokenTime = Date.now();
  lastSpokenText = text;
  currentlySpokenText = text;

  const cleanText = text
    .replace(/[#*_`]/g, '')
    .replace(/https?:\/\/\S+/g, 'link de internet')
    .replace(/\s+/g, ' ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = rate;
  utterance.pitch = 1.0;
  
  // Real volume from 0.0 to 1.0 respecting user volume control and mute state
  const effectiveVolume = currentMuted ? 0.0 : Math.max(0.0, Math.min(1.0, currentVolume / 100));
  utterance.volume = effectiveVolume;

  // Retrieve available voices dynamically
  let availableVoices =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];
  if ((!availableVoices || availableVoices.length === 0) && cachedVoices.length > 0) {
    availableVoices = cachedVoices;
  }

  // Explicit priority for natural Brazilian Portuguese voices
  const ptVoice =
    availableVoices.find((v) => v.lang === 'pt-BR' || v.lang === 'pt_BR' || v.lang.toLowerCase() === 'pt-br') ||
    availableVoices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('pt') &&
        (v.name.toLowerCase().includes('brazil') ||
          v.name.toLowerCase().includes('brasil') ||
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('natural'))
    ) ||
    availableVoices.find((v) => v.lang.toLowerCase().startsWith('pt')) ||
    availableVoices.find(
      (v) =>
        v.name.toLowerCase().includes('portugu') ||
        v.name.toLowerCase().includes('brasil') ||
        v.name.toLowerCase().includes('brazil') ||
        v.name.toLowerCase().includes('luciana') ||
        v.name.toLowerCase().includes('felipe') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('maria') ||
        v.name.toLowerCase().includes('raquel') ||
        v.name.toLowerCase().includes('leticia')
    );

  if (ptVoice) {
    utterance.voice = ptVoice;
    utterance.lang = ptVoice.lang || 'pt-BR';
  } else {
    utterance.lang = 'pt-BR';
  }

  utterance.onstart = () => {
    isSpeakingActive = true;
    notifyListeners();
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    isSpeakingActive = false;
    currentlySpokenText = '';
    notifyListeners();
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('Aviso na síntese de voz:', e.error);
    }
    activeUtterance = null;
    isSpeakingActive = false;
    currentlySpokenText = '';
    notifyListeners();
    if (onEnd) onEnd();
  };

  // Retain global reference to avoid V8 garbage collection dropping utterance
  activeUtterance = utterance;

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Falha ao executar speak():', err);
        activeUtterance = null;
        isSpeakingActive = false;
        notifyListeners();
        if (onEnd) onEnd();
      }
    }, 20);
  } catch (e) {
    console.error('Falha ao acionar voz:', e);
    activeUtterance = null;
    isSpeakingActive = false;
    notifyListeners();
    if (onEnd) onEnd();
  }
}
