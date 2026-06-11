import { defineStore, type StoreDefinition } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "./user";

interface ChatMessage {
    message: string;
    reply: string;
}

interface FormattedMessage {
    role: 'user' | 'ai';
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    updatedAt?: string;
}

const API = import.meta.env.VITE_API_URL;

export const useChatStore: StoreDefinition = defineStore('chat', () => {
    const messages = ref<{ role: string; content: string }[]>([]);
    const conversations = ref<Conversation[]>([]);
    const activeConversationId = ref<string | null>(null);
    const isLoading = ref(false);

    const userStore = useUserStore();

    // backend may return the array directly or wrapped — normalize both
    const unwrap = <T>(data: any, key: string): T[] =>
        Array.isArray(data) ? data : (data?.[key] ?? []);

    const formatMessages = (raw: ChatMessage[]): FormattedMessage[] =>
        raw
            .flatMap((msg): FormattedMessage[] => [
                { role: 'user', content: msg.message },
                { role: 'ai', content: msg.reply },
            ])
            .filter((msg) => msg.content);

    // sidebar list — newest first (backend already orders them)
    const loadConversations = async () => {
        if (!userStore.userId) { return; }

        try {
            const { data } = await axios.get(`${API}/conversations/${userStore.userId}`);
            conversations.value = unwrap<Conversation>(data, 'conversations');
        } catch (e) {
            console.error(e);
        }
    };

    // open a chat from the sidebar
    const selectConversation = async (id: string) => {
        if (!userStore.userId || activeConversationId.value === id) { return; }

        activeConversationId.value = id;
        messages.value = [];
        isLoading.value = true;

        try {
            const { data } = await axios.post(`${API}/get-messages`, {
                userId: userStore.userId,
                conversationId: id,
            });
            messages.value = formatMessages(unwrap<ChatMessage>(data, 'messages'));
        } catch (e) {
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    };

    // "New chat" — just reset; the conversation is created on first message
    const newChat = () => {
        activeConversationId.value = null;
        messages.value = [];
    };

    const sendMessage = async (message: string) => {
        if (!message || !userStore.userId) { return; }

        messages.value.push({ role: 'user', content: message });
        isLoading.value = true;

        try {
            const { data } = await axios.post(`${API}/chat`, {
                message,
                userId: userStore.userId,
                conversationId: activeConversationId.value ?? undefined,
            });

            messages.value.push({ role: 'ai', content: data.reply });

            // backend returns the conversationId (new or existing) — remember it
            if (data.conversationId) {
                activeConversationId.value = data.conversationId;
            }

            // refresh sidebar so a new chat appears / order bumps to top
            await loadConversations();
        } catch (e) {
            console.log(e);
            messages.value.push({ role: 'ai', content: 'Cannot proccess current request...' });
        } finally {
            isLoading.value = false;
        }
    };

    const renameConversation = async (id: string, title: string) => {
        const trimmed = title.trim();
        if (!userStore.userId || !trimmed) { return; }

        try {
            await axios.patch(`${API}/conversations/${id}`, {
                userId: userStore.userId,
                title: trimmed,
            });
            const conv = conversations.value.find((c) => c.id === id);
            if (conv) { conv.title = trimmed; }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteConversation = async (id: string) => {
        if (!userStore.userId) { return; }

        try {
            await axios.delete(`${API}/conversations/${id}`, {
                data: { userId: userStore.userId },
            });
            conversations.value = conversations.value.filter((c) => c.id !== id);
            if (activeConversationId.value === id) {
                newChat();
            }
        } catch (e) {
            console.error(e);
        }
    };

    // on entering the chat: load the sidebar and open the most recent chat
    const init = async () => {
        await loadConversations();
        if (conversations.value.length) {
            await selectConversation(conversations.value[0].id);
        }
    };

    return {
        messages,
        conversations,
        activeConversationId,
        isLoading,
        init,
        loadConversations,
        selectConversation,
        newChat,
        sendMessage,
        renameConversation,
        deleteConversation,
    };
});
