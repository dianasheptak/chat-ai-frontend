<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const isLoggedIn = ref(false)

const form = reactive({
  name: '',
  email: '',
})

const isValid = computed(
  () => form.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
)

const buttonLabel = computed(() => (isLoggedIn.value ? 'Start Chatting' : 'Log in'))

function handleSubmit() {
  if (isLoggedIn.value) {
    return
  }
  if (!isValid.value) return
  isLoggedIn.value = true
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

          <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
            <div>
              <label for="name" class="mb-1.5 block text-sm font-medium text-slate-300">
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
              <label for="email" class="mb-1.5 block text-sm font-medium text-slate-300">
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
              type="submit"
              :disabled="!isLoggedIn && !isValid"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {{ buttonLabel }}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p v-if="isLoggedIn" class="mt-4 text-center text-xs text-slate-500">
            Not you?
            <button
              type="button"
              class="font-medium text-indigo-400 hover:text-indigo-300"
              @click="isLoggedIn = false"
            >
              Log out
            </button>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
