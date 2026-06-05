<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import Header from '../components/Header.vue';
import { useChatStore } from '../stores/chat.ts';
import { useUserStore } from '../stores/user.ts';
import { useRouter } from 'vue-router';

const chatStore = useChatStore();
const userStore = useUserStore();

const router = useRouter();

if (!userStore.userId) {
    router.push('/')
}

const scrollToBottom = () => {
    nextTick(() => {
        const chatRef = document.getElementById('chat-ref')

        if (chatRef) {
            chatRef.scrollTop = chatRef.scrollHeight;
        }
    }
)}

onMounted(() => {
    chatStore.loadChatHistory().then(() => scrollToBottom())
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#faf7f0] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <Header />

    <main class="flex min-h-0 flex-1 justify-center overflow-hidden p-4 sm:p-6">
      <div class="sparkle-border flex w-full max-w-4xl rounded-2xl p-[2px]">
        <div
          id="chat-ref"
          class="flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-[#faf7f0] p-4 sm:p-6 dark:bg-slate-950"
        >
          <p
            v-if="!chatStore.messages.length"
            class="mt-20 text-center text-sm text-slate-400 dark:text-slate-500"
          >
            No messages yet. Start the conversation 👋
          </p>

          <div
            v-for="(msg, i) in chatStore.messages"
            :key="i"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              :class="
                msg.role === 'user'
                  ? 'rounded-br-sm bg-indigo-500 text-white'
                  : 'rounded-bl-sm bg-black/5 text-slate-800 dark:bg-white/10 dark:text-slate-100'
              "
            >
              {{ msg.content }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sparkle-border {
  background: linear-gradient(
    120deg,
    #a78bfa,
    #8b5cf6,
    #c4b5fd,
    #7c3aed,
    #a78bfa
  );
  background-size: 300% 300%;
  animation: sparkle 6s ease infinite;
  box-shadow:
    0 0 18px -4px rgba(139, 92, 246, 0.55),
    0 0 40px -10px rgba(167, 139, 250, 0.45);
}

@keyframes sparkle {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
