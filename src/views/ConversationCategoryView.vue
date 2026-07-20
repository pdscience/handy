<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../stores/app';
import type { ConversationCategory } from '../types/models';
import { getConversationItems } from '../data/conversation';

const props = defineProps<{
  category: string;
}>();

const store = useAppStore();
const route = useRoute();

const categoryId = computed(() => props.category || (route.params.category as string));

const conversationItems = computed(() => {
  return getConversationItems(categoryId.value as ConversationCategory);
});

const categoryTitles: Record<string, { title: string; icon: string; color: string }> = {
  greetings: { title: 'Saudações', icon: '👋', color: '#4D94FF' },
  needs: { title: 'Necessidades', icon: '🍎', color: '#FF6B35' },
  health: { title: 'Saúde', icon: '❤️', color: '#FF1744' },
  activities: { title: 'Atividades', icon: '⚽', color: '#00C853' },
  family: { title: 'Família', icon: '👨‍👩‍👧', color: '#B24BF3' },
  places: { title: 'Locais', icon: '🏠', color: '#00BCD4' },
};

const categoryInfo = computed(() => {
  return categoryTitles[categoryId.value] || { title: 'Conversar', icon: '💬', color: '#4D94FF' };
});

const speakingIndex = ref<number | null>(null);

const speak = async (text: string, index: number) => {
  if (speakingIndex.value === index) {
    store.stopSpeaking();
    speakingIndex.value = null;
    return;
  }
  speakingIndex.value = index;
  store.unlockAchievement('usedConversation');
  await store.speakText(text);
  speakingIndex.value = null;
};
</script>

<template>
  <div class="category-screen">
    <header class="screen-header">
      <h1 class="screen-title">{{ categoryInfo.icon }} {{ categoryInfo.title }}</h1>
      <p class="screen-subtitle">Toque nos cartões para falar</p>
    </header>

    <main class="items-content">
      <div class="items-grid">
        <button
          v-for="(item, index) in conversationItems"
          :key="index"
          class="conversation-card"
          :class="{ speaking: speakingIndex === index }"
          :style="{ 
            borderColor: speakingIndex === index ? categoryInfo.color : (item.color || '#4D94FF') + '99',
            boxShadow: speakingIndex === index ? `0 0 24px ${categoryInfo.color}88` : 'none'
          }"
          @click="speak(item.text, index)"
        >
          <span class="card-icon" :class="{ bounce: speakingIndex === index }">{{ item.icon }}</span>
          <span class="card-text">{{ item.text }}</span>

          <!-- Sound Wave Indicator -->
          <div v-if="speakingIndex === index" class="sound-wave">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.category-screen {
  min-height: 100vh;
  background-color: #050510;
}

.screen-header {
  padding: 20px 16px;
  background-color: #050510;
}

.screen-title {
  font-weight: bold;
  font-size: 28px;
  color: white;
  margin-bottom: 8px;
}

.screen-subtitle {
  color: #888;
  font-size: 16px;
}

.items-content {
  padding: 16px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 600px) {
  .items-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 900px) {
  .items-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.conversation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1E2235;
  border: 2px solid rgba(77, 148, 255, 0.4);
  border-radius: 20px;
  padding: 20px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
  position: relative;
  overflow: hidden;
}

.conversation-card:active {
  transform: scale(0.95);
}

.conversation-card.speaking {
  background: #1a2640;
  transform: scale(1.03);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 8px;
  display: block;
  transition: transform 0.3s ease;
}

.card-icon.bounce {
  animation: iconBounce 0.6s ease infinite alternate;
}

@keyframes iconBounce {
  from { transform: scale(1); }
  to   { transform: scale(1.18); }
}

.card-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sound wave */
.sound-wave {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  margin-top: 10px;
  height: 20px;
}

.wave-bar {
  display: block;
  width: 4px;
  background: #4D94FF;
  border-radius: 2px;
  animation: waveAnim 0.8s ease-in-out infinite;
}

.wave-bar:nth-child(1) { animation-delay: 0s;    height: 8px; }
.wave-bar:nth-child(2) { animation-delay: 0.1s;  height: 14px; }
.wave-bar:nth-child(3) { animation-delay: 0.2s;  height: 20px; }
.wave-bar:nth-child(4) { animation-delay: 0.1s;  height: 14px; }
.wave-bar:nth-child(5) { animation-delay: 0s;    height: 8px; }

@keyframes waveAnim {
  0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
  50%       { transform: scaleY(1);   opacity: 1; }
}
</style>
