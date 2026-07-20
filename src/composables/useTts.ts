import { ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

type TtsState = 'playing' | 'stopped' | 'paused';

const isInitialized = ref(false);
const ttsState = ref<TtsState>('stopped');

export function useTts() {
  const isNative = Capacitor.isNativePlatform();

  const initialize = async (): Promise<void> => {
    if (!isNative) {
      isInitialized.value = true;
      return;
    }

    try {
      await TextToSpeech.isLanguageSupported({ lang: 'pt-BR' });
      isInitialized.value = true;
    } catch {
      isInitialized.value = false;
    }
  };

  const speak = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    if (!isNative) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      speechSynthesis.speak(utterance);
      return;
    }

    if (!isInitialized.value) {
      await initialize();
    }

    if (!isInitialized.value) {
      return;
    }

    try {
      if (ttsState.value === 'playing') {
        await stop();
      }

      ttsState.value = 'playing';

      await TextToSpeech.speak({
        text: text,
        lang: 'pt-BR',
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
      });

      ttsState.value = 'stopped';
    } catch {
      ttsState.value = 'stopped';
    }
  };

  const stop = async (): Promise<void> => {
    if (!isNative) {
      speechSynthesis.cancel();
      ttsState.value = 'stopped';
      return;
    }

    try {
      await TextToSpeech.stop();
      ttsState.value = 'stopped';
    } catch {
      // TTS stop failed silently
    }
  };

  const pause = async (): Promise<void> => {
    await stop();
  };

  const isSupported = (): boolean => {
    return isNative || typeof window !== 'undefined' && 'speechSynthesis' in window;
  };

  return {
    isInitialized,
    ttsState,
    initialize,
    speak,
    stop,
    pause,
    isSupported,
  };
}
