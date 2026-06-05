<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import axios from 'axios';


const userStore = useUserStore();
const router = useRouter();

const isLoggedIn = ref(false);
const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  email: '',
})


const createUser =  async() => {
    if (!form.name || !form.email) {
        error.value = 'Name and email are required!'
    }

    loading.value = true;
    error.value = "";

    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/register-user`, {
            name: form.name,
            email: form.email
        })

        userStore.setUser({
            userId: data.userId,
            name: data.name
        })

        router.push('/chat')

    } catch (e) {
        console.log(e);
        error.value = 'Something went wrong...'
    } finally {
        loading.value = false;
    }
}
</script>

<template>
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <div class="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <section
        class="relative hidden overflow-hidden border-r border-white/5 bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative flex items-center gap-2">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-indigo-500 text-lg font-bold">
            ✦
          </span>
          <span class="text-lg font-semibold tracking-tight">ChatAI</span>
        </div>

        <div class="relative">
          <div class="mb-10 max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
            <div class="mb-4 flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex justify-end">
                <p class="max-w-[80%] rounded-2xl rounded-br-sm bg-indigo-500 px-3.5 py-2 text-white">
                  Summarize my notes into 3 bullet points.
                </p>
              </div>
              <div class="flex justify-start">
                <p class="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-2 text-slate-200">
                  Sure — here's a quick recap of what matters most. ✨
                </p>
              </div>
              <div class="flex justify-start">
                <span class="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-3">
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </span>
              </div>
            </div>
          </div>

          <h2 class="text-4xl font-bold leading-tight">
            Conversations that think with you
          </h2>
          <p class="mt-3 max-w-md text-sm text-slate-400">
            Ask anything, brainstorm ideas, or get instant help. Your personal AI assistant is
            ready whenever you are.
          </p>

          <ul class="mt-6 flex flex-wrap gap-2">
            <li class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              ⚡ Instant answers
            </li>
            <li class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              🔒 Private &amp; secure
            </li>
            <li class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              🧠 Context-aware
            </li>
          </ul>
        </div>

        <p class="relative text-xs text-slate-500">© 2026. All rights reserved.</p>
      </section>

      <section class="flex items-center justify-center p-6 sm:p-12">
        <div class="w-full max-w-sm">
          <div class="mb-8 lg:hidden">
            <span class="grid h-10 w-10 place-items-center rounded-lg bg-indigo-500 text-xl font-bold">
              ✦
            </span>
          </div>

          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
            {{ isLoggedIn ? `Welcome back, ${form.name || 'friend'}` : 'Welcome to ChatAI' }}
          </h1>
          <p class="mt-2 text-sm text-slate-400">
            {{
              isLoggedIn
                ? "You're all set. Jump back into the conversation."
                : 'Enter your details to get started.'
            }}
          </p>

            <div class="mt-8 space-y-5">
              <label for="name" class="my-1.5 block text-sm font-medium text-slate-300">
                Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                autocomplete="name"
                placeholder="Jane Doe"
                :disabled="isLoggedIn"
                class="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <label for="email" class="my-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="jane@example.com"
                :disabled="isLoggedIn"
                class="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
                @click="createUser"
                class="w-full p-2 bg-blue-500 rounded-lg mt-5"
                :disabled="loading"
            >
                {{ loading ? 'Logging in...' : 'Start Chat' }}
            </button>

            <p v-if="error" class="mt-2 text-xs text-white text-center">{{ error }}</p>

        </div>
      </section>
    </div>
  </main>
</template>
