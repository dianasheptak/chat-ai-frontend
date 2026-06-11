<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useChatStore } from '../stores/chat.ts';

defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>();

const chatStore = useChatStore();

const editingId = ref<string | null>(null);
const editTitle = ref('');
const editInput = ref<HTMLInputElement | null>(null);

const close = () => emit('update:open', false);

const startNewChat = () => {
    chatStore.newChat();
    close();
};

const openChat = (id: string) => {
    chatStore.selectConversation(id);
    close();
};

const startRename = async (id: string, title: string) => {
    editingId.value = id;
    editTitle.value = title;
    await nextTick();
    editInput.value?.focus();
    editInput.value?.select();
};

const confirmRename = async () => {
    if (editingId.value) {
        await chatStore.renameConversation(editingId.value, editTitle.value);
    }
    cancelRename();
};

const cancelRename = () => {
    editingId.value = null;
    editTitle.value = '';
};

const removeChat = (id: string, title: string) => {
    if (confirm(`Delete "${title || 'this chat'}"? This cannot be undone.`)) {
        chatStore.deleteConversation(id);
    }
};
</script>

<template>
  <!-- mobile backdrop -->
  <div
    v-if="open"
    @click="close"
    class="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm sm:hidden"
    aria-hidden="true"
  />

  <aside
    :class="open ? 'translate-x-0' : '-translate-x-full'"
    class="fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-black/5 bg-[#f4efe4] transition-transform duration-200 sm:static sm:z-0 sm:translate-x-0 dark:border-white/5 dark:bg-slate-900"
  >
    <div class="flex items-center justify-between px-3 py-3">
      <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Chats</span>
      <button
        type="button"
        @click="close"
        class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-black/5 sm:hidden dark:text-slate-400 dark:hover:bg-white/10"
        aria-label="Close sidebar"
      >
        ✕
      </button>
    </div>

    <div class="px-3 pb-2">
      <button
        type="button"
        @click="startNewChat"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
      >
        <span class="text-lg leading-none">+</span>
        New chat
      </button>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
      <p
        v-if="!chatStore.conversations.length"
        class="px-2 py-6 text-center text-xs text-slate-400 dark:text-slate-500"
      >
        No chats yet.
      </p>

      <div
        v-for="conv in chatStore.conversations"
        :key="conv.id"
        class="group relative flex items-center rounded-lg transition"
        :class="
          conv.id === chatStore.activeConversationId
            ? 'bg-violet-500/15 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200'
            : 'text-slate-700 hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/5'
        "
      >
        <!-- rename mode -->
        <input
          v-if="editingId === conv.id"
          ref="editInput"
          v-model="editTitle"
          @keyup.enter="confirmRename"
          @keyup.esc="cancelRename"
          @blur="confirmRename"
          class="w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:bg-slate-800 dark:text-slate-100"
        />

        <!-- normal mode -->
        <template v-else>
          <button
            type="button"
            @click="openChat(conv.id)"
            class="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm"
            :title="conv.title"
          >
            {{ conv.title || 'New chat' }}
          </button>

          <div
            class="flex shrink-0 items-center gap-0.5 pr-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100"
          >
            <button
              type="button"
              @click.stop="startRename(conv.id, conv.title)"
              class="grid h-7 w-7 place-items-center rounded-md text-slate-500 transition hover:bg-black/10 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
              aria-label="Rename chat"
              title="Rename"
            >
              ✎
            </button>
            <button
              type="button"
              @click.stop="removeChat(conv.id, conv.title)"
              class="grid h-7 w-7 place-items-center rounded-md text-slate-500 transition hover:bg-red-500/15 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
              aria-label="Delete chat"
              title="Delete"
            >
              🗑
            </button>
          </div>
        </template>
      </div>
    </nav>
  </aside>
</template>
