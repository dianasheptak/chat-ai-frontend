<script setup lang="ts">
import { useThemeStore } from '../stores/theme';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

defineEmits<{ (e: 'toggle-sidebar'): void }>();

const themeStore = useThemeStore();
const userStore = useUserStore();

const router = useRouter();

const logout = () => {
    userStore.logout();
    router.push('/');
}
</script>

<template>
  <header
    class="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-[#faf7f0]/80 px-4 py-3 backdrop-blur sm:px-6 dark:border-white/5 dark:bg-slate-950/80"
  >
    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="$emit('toggle-sidebar')"
        class="grid h-9 w-9 place-items-center rounded-lg border border-black/10 bg-white/60 text-slate-700 transition hover:bg-white sm:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        aria-label="Toggle chat list"
      >
        ☰
      </button>
      <span
        class="grid h-9 w-9 place-items-center rounded-lg bg-indigo-500 text-lg font-bold text-white"
      >
        ✦
      </span>
      <span class="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        ChatAI
      </span>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="themeStore.toggleTheme()"
        :aria-label="themeStore.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        :title="themeStore.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        class="grid h-9 w-9 place-items-center rounded-lg border border-black/10 bg-white/60 text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      >
        <span v-if="themeStore.isDark">🌙</span>
        <span v-else>☀️</span>
      </button>

      <button
        @click="logout"
        type="button"
        class="rounded-lg border border-black/10 bg-white/60 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      >
        Log out
      </button>
    </div>
  </header>
</template>
