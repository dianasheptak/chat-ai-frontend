import { defineStore, type StoreDefinition } from "pinia";

type Theme = 'light' | 'dark';

export const useThemeStore: StoreDefinition = defineStore('theme', {
    state: () => ({
        theme: 'dark' as Theme
    }),
    getters: {
        isDark: (state: any): boolean => state.theme === 'dark'
    },
    actions: {
        applyTheme() {
            document.documentElement.classList.toggle('dark', this.theme === 'dark');
        },
        setTheme(theme: Theme) {
            this.theme = theme;
            this.applyTheme();
        },
        toggleTheme() {
            this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
        }
    },
    persist: true // remember the chosen theme 
})
