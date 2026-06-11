<script setup lang="ts">
import { onMounted, nextTick, ref, watch } from 'vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import { useChatStore } from '../stores/chat.ts';
import { useUserStore } from '../stores/user.ts';
import { useRouter } from 'vue-router';

const chatStore = useChatStore();
const userStore = useUserStore();

const router = useRouter();

const newMessage = ref('');
const chatRef = ref<HTMLElement | null>(null);
const sidebarOpen = ref(false);

const scrollToBottom = () => {
    nextTick(() => {
        if (chatRef.value) {
            chatRef.value.scrollTop = chatRef.value.scrollHeight;
        }
    });
}

const sendMessage = () => {
    const message = newMessage.value.trim();
    if (!message) { return; }

    newMessage.value = '';
    chatStore.sendMessage(message);
}

if (!userStore.userId) {
    router.push('/')
}

const formatAImessage = (text: string) => {
    if (!text) { return "" }

    return text
    .replace(/\n/g, '<br>') // Preserve line breaks
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic text
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li>$1</li>') // Bullet points
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li>$1. $2</li>') // Numbered lists
    .replace(/<\/li>\n<li>/g, '</li><li>') // Ensure list continuity
    .replace(/<li>/, '<ul><li>') // Wrap in `<ul>`
    .replace(/<\/li>$/, '</li></ul>'); // Close the `<ul>`
};

watch(
    () => [chatStore.messages.length, chatStore.isLoading],
    () => scrollToBottom()
)

onMounted(() => {
    chatStore.init().then(() => scrollToBottom())
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#faf7f0] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="flex min-h-0 flex-1">
      <Sidebar v-model:open="sidebarOpen" />

      <main class="flex min-h-0 flex-1 justify-center overflow-hidden p-4 pb-32 sm:p-6 sm:pb-32">
      <div class="sparkle-border flex w-full max-w-3xl rounded-2xl p-[2px]">
        <div
          ref="chatRef"
          class="flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-[#faf7f0] p-4 sm:p-6 dark:bg-slate-950"
        >
          <p
            v-if="!chatStore.messages.length"
            class="mt-20 text-center text-sm text-slate-400 dark:text-slate-500"
          >
            No messages yet. Start the conversation!
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
              v-html="formatAImessage(msg.content)"
            />
          </div>

          <div v-if="chatStore.isLoading" class="flex justify-start">
            <span
              class="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-black/5 px-4 py-3.5 dark:bg-white/10"
            >
              <span class="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span class="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span class="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
            </span>
          </div>
        </div>
      </div>
      </main>
    </div>

    <footer
      class="fixed inset-x-0 bottom-0 bg-gradient-to-t from-[#faf7f0] via-[#faf7f0] to-transparent px-4 pb-6 pt-10 sm:left-72 dark:from-slate-950 dark:via-slate-950"
    >
      <div class="relative mx-auto w-full max-w-3xl">
        <div
          class="sparkle-glow pointer-events-none absolute -inset-3 rounded-full opacity-70 blur-2xl"
          aria-hidden="true"
        />

        <div
          class="relative flex items-center gap-2 rounded-full border border-violet-200/60 bg-white py-2 pl-6 pr-2 shadow-lg shadow-violet-500/10 dark:border-violet-400/20 dark:bg-slate-900"
        >
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ask anything..."
            @keyup.enter="sendMessage"
            class="flex-1 bg-transparent py-2 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            @click="sendMessage"
            :disabled="!newMessage.trim()"
            aria-label="Send message"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600 text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
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

.sparkle-glow {
  background: linear-gradient(
    120deg,
    #c4b5fd,
    #a78bfa,
    #8b5cf6,
    #818cf8,
    #c4b5fd
  );
  background-size: 300% 300%;
  animation: sparkle 6s ease infinite;
}
</style>
