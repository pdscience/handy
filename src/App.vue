<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from './stores/app';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const store = useAppStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  await store.initialize();
});

const navItems = [
  { name: 'Início', icon: '🏠', route: '/home', tab: 'home' },
  { name: 'Conversar', icon: '💬', route: '/conversation', tab: 'conversation' },
  { name: 'Rotinas', icon: '📅', route: '/routines', tab: 'routines' },
  { name: 'Escrever', icon: '✏️', route: '/writer', tab: 'writer' },
  { name: 'Interação', icon: '🎮', route: '/interactive', tab: 'interactive' },
];

const currentPath = computed(() => route.path);

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="app-container">
    <div v-if="store.isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-logo">
          <span class="logo-icon">🧠</span>
        </div>
        <h1 class="loading-title">TEA Kids</h1>
        <div class="loading-spinner"></div>
        <p class="loading-text">Carregando...</p>
      </div>
    </div>

    <template v-else>
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="slide-up" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <nav class="bottom-nav">
          <button
            v-for="item in navItems"
            :key="item.tab"
            class="nav-item"
            :class="{ active: currentPath.startsWith(item.route) }"
            @click="navigateTo(item.route)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.name }}</span>
          </button>
        </nav>
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #050510;
}

.loading-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4D94FF 0%, #E6F2FF 100%);
}

.loading-content {
  text-align: center;
}

.loading-logo {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.logo-icon {
  font-size: 60px;
}

.loading-title {
  color: white;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
}

.main-content {
  min-height: calc(100vh - 70px);
  padding-bottom: 70px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: #1E2235;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.nav-item.active {
  color: #4D94FF;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
}

.slide-up-enter-active {
  transition: all 0.28s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-up-leave-active {
  transition: all 0.2s ease-in;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
