import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  TabName, 
  ConversationCategory, 
  InteractiveCategory, 
  RoutineProgress,
  ConversationItem,
  RoutineItem,
  AlphabetItem,
  InteractiveItem
} from '../types/models';
import { getAlphabetItems } from '../data/alphabet';
import { getRoutineItems, createEmptyRoutineProgress, createRoutineProgressFromStorage } from '../data/routines';
import { getConversationItems } from '../data/conversation';
import { getInteractiveItems } from '../data/interactive';
import { useTts } from '../composables/useTts';
import { useStorage } from '../composables/useStorage';
import { dbLoadAchievements, dbSaveAchievement } from '../services/database';

export type AchievementKey = 'morningRoutine' | 'afternoonRoutine' | 'nightRoutine' | 'usedConversation' | 'quizStreak';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const VALID_ACHIEVEMENT_KEYS: AchievementKey[] = ['morningRoutine', 'afternoonRoutine', 'nightRoutine', 'usedConversation', 'quizStreak'];

const loadDailyAchievements = async (): Promise<Record<AchievementKey, boolean>> => {
  const empty: Record<AchievementKey, boolean> = {
    morningRoutine: false, afternoonRoutine: false, nightRoutine: false,
    usedConversation: false, quizStreak: false,
  };
  const data = await dbLoadAchievements(getTodayKey());
  for (const key of VALID_ACHIEVEMENT_KEYS) {
    if (typeof data[key] === 'boolean') {
      empty[key] = data[key];
    }
  }
  return empty;
};

const saveDailyAchievements = async (data: Record<AchievementKey, boolean>) => {
  const today = getTodayKey();
  for (const [key, value] of Object.entries(data)) {
    await dbSaveAchievement(today, key, value);
  }
};

export const useAppStore = defineStore('app', () => {
  // TTS
  const { speak: ttsSpeak, stop: ttsStop, initialize: ttsInitialize, isInitialized: isTtsInitialized } = useTts();
  const { loadAllRoutineProgress, saveRoutineProgress, clearRoutineProgress } = useStorage();

  // Navigation state
  const currentTab = ref<TabName>('home');
  const isLoading = ref(true);

  // Conversation state
  const currentConversationTab = ref<ConversationCategory>('greetings');

  // Routine state
  const currentRoutineTab = ref<'morning' | 'afternoon' | 'night'>('morning');
  const routineProgress = ref<Record<string, RoutineProgress>>({});

  // Interactive state
  const currentInteractiveTab = ref<InteractiveCategory>('shapes');

  // Writer state
  const writerText = ref('');

  // TTS speaking state
  const isSpeaking = ref(false);
  const speakingText = ref('');

  // Daily achievements
  const dailyAchievements = ref<Record<AchievementKey, boolean>>({
    morningRoutine: false, afternoonRoutine: false, nightRoutine: false,
    usedConversation: false, quizStreak: false,
  });
  const quizCorrectStreak = ref(0);

  // Computed
  const currentRoutineProgress = computed(() => {
    return routineProgress.value[currentRoutineTab.value] || 
           createEmptyRoutineProgress(currentRoutineTab.value);
  });

  // Actions
  const initialize = async () => {
    isLoading.value = true;
    try {
      await ttsInitialize();
      dailyAchievements.value = await loadDailyAchievements();
      await loadAllRoutineProgressData();
    } catch {
      // Initialization failed
    } finally {
      isLoading.value = false;
    }
  };

  const loadAllRoutineProgressData = async () => {
    const periods = ['morning', 'afternoon', 'night'];
    
    for (const period of periods) {
      const completedItems = await loadAllRoutineProgress(period);
      if (completedItems.length > 0) {
        routineProgress.value[period] = createRoutineProgressFromStorage(period, completedItems);
      } else {
        routineProgress.value[period] = createEmptyRoutineProgress(period);
      }
    }
  };

  // Navigation
  const setCurrentTab = (tab: TabName) => {
    currentTab.value = tab;
  };

  const setCurrentConversationTab = (tab: ConversationCategory) => {
    currentConversationTab.value = tab;
  };

  const setCurrentRoutineTab = (tab: 'morning' | 'afternoon' | 'night') => {
    currentRoutineTab.value = tab;
  };

  const setCurrentInteractiveTab = (tab: InteractiveCategory) => {
    currentInteractiveTab.value = tab;
  };

  // Writer
  const setWriterText = (text: string) => {
    writerText.value = text;
  };

  const clearWriterText = () => {
    writerText.value = '';
  };

  // TTS
  const speakText = async (text: string) => {
    if (!isTtsInitialized.value) {
      console.log('❌ TTS não inicializado');
      isSpeaking.value = false;
      return;
    }
    isSpeaking.value = true;
    speakingText.value = text;
    await ttsSpeak(text);
    isSpeaking.value = false;
    speakingText.value = '';
  };

  const stopSpeaking = async () => {
    await ttsStop();
    isSpeaking.value = false;
    speakingText.value = '';
  };

  // Achievements
  const unlockAchievement = async (key: AchievementKey) => {
    if (!dailyAchievements.value[key]) {
      dailyAchievements.value[key] = true;
      await saveDailyAchievements(dailyAchievements.value);
    }
  };

  const incrementQuizStreak = () => {
    quizCorrectStreak.value++;
    if (quizCorrectStreak.value >= 3) {
      unlockAchievement('quizStreak');
    }
  };

  const resetQuizStreak = () => {
    quizCorrectStreak.value = 0;
  };

  // Routine
  const toggleRoutineItem = async (period: string, index: number) => {
    const currentProgress = routineProgress.value[period] || createEmptyRoutineProgress(period);
    
    const updatedItems = [...currentProgress.completedItems];
    updatedItems[index] = !updatedItems[index];

    routineProgress.value[period] = createRoutineProgressFromStorage(period, updatedItems);

    await saveRoutineProgress(period, index, updatedItems[index]);
  };

  const clearRoutineProgressData = async (period: string) => {
    await clearRoutineProgress(period);
    routineProgress.value[period] = createEmptyRoutineProgress(period);
  };

  // Getters
  const getConversationItemsData = (category: ConversationCategory): ConversationItem[] => {
    return getConversationItems(category);
  };

  const getRoutineItemsData = (period: 'morning' | 'afternoon' | 'night'): RoutineItem[] => {
    return getRoutineItems(period);
  };

  const getAlphabetItemsData = (): AlphabetItem[] => {
    return getAlphabetItems();
  };

  const getInteractiveItemsData = (category: InteractiveCategory): InteractiveItem[] => {
    return getInteractiveItems(category);
  };

  const getRoutineProgressData = (period: string): RoutineProgress => {
    return routineProgress.value[period] || createEmptyRoutineProgress(period);
  };

  return {
    // State
    currentTab,
    isLoading,
    currentConversationTab,
    currentRoutineTab,
    currentInteractiveTab,
    writerText,
    routineProgress,
    isTtsInitialized,
    isSpeaking,
    speakingText,
    dailyAchievements,
    quizCorrectStreak,
    
    // Computed
    currentRoutineProgress,
    
    // Actions
    initialize,
    setCurrentTab,
    setCurrentConversationTab,
    setCurrentRoutineTab,
    setCurrentInteractiveTab,
    setWriterText,
    clearWriterText,
    speakText,
    stopSpeaking,
    toggleRoutineItem,
    clearRoutineProgressData,
    unlockAchievement,
    incrementQuizStreak,
    resetQuizStreak,
    
    // Getters
    getConversationItemsData,
    getRoutineItemsData,
    getAlphabetItemsData,
    getInteractiveItemsData,
    getRoutineProgressData,
  };
});
