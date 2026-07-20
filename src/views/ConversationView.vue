<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getAllConversationCategories } from '../data/conversation';

const router = useRouter();
const categories = getAllConversationCategories();

const navigateToCategory = (categoryId: string) => {
  router.push(`/conversation/${categoryId}`);
};
</script>

<template>
  <div class="conversation-screen">
    <header class="screen-header">
      <h1 class="screen-title">Conversar</h1>
      <p class="screen-subtitle">Escolha uma categoria para se comunicar</p>
    </header>

    <main class="categories-content">
      <div class="categories-grid">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          :style="{ borderColor: category.color }"
          @click="navigateToCategory(category.id)"
        >
          <div 
            class="category-icon"
            :style="{ backgroundColor: category.color + '20' }"
          >
            <span class="icon-emoji">{{ category.icon }}</span>
          </div>
          <div class="category-text">
            <h3 class="category-name">{{ category.name }}</h3>
          </div>
          <span class="arrow-icon">→</span>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.conversation-screen {
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
  font-size: 14px;
}

.categories-content {
  padding: 16px;
}

.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-card {
  display: flex;
  align-items: center;
  background: #1E2235;
  border: 2px solid rgba(77, 148, 255, 0.3);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.category-card:hover {
  transform: translateX(8px);
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.icon-emoji {
  font-size: 32px;
}

.category-text {
  flex: 1;
}

.category-name {
  color: white;
  font-size: 22px;
  font-weight: bold;
}

.arrow-icon {
  font-size: 20px;
  color: #4D94FF;
}
</style>
