import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import axiosClient from "@/services/axiosClient";
import { API } from "@/lib/apiendpoint";
import { useUserStore } from "@/Store/userStore";
import { StringValue } from "@/lib/stringValue";

function formatTime(iso) {
    if (!iso) return "";
    const str = iso.endsWith("Z") ? iso : iso + "Z";
    const d = new Date(str);
    const now = new Date();
    const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
    return isToday
        ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString([], { month: "short", day: "numeric" });
}
function Avatar({ src, name, size = "md" }) {
    const [errored, setErrored] = useState(false);
    const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
    const initials = (name ?? "?")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (src && !errored) {
        return (
            <img
                src={src}
                alt={name}
                onError={() => setErrored(true)}
                className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
            />
        );
    }
    return (
        <div
            className={`${sizeClass} rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center flex-shrink-0`}
        >
            {initials}
        </div>
    );
}


export default function Messages() {
    const navigate = useNavigate();
    const { userInfo } = useUserStore();

    // conversations list (left panel)
    const [conversations, setConversations] = useState([]);
    const [convsLoading, setConvsLoading] = useState(true);
    const [search, setSearch] = useState("");

    // active conversation (right panel)
    const [activeId, setActiveId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgsLoading, setMsgsLoading] = useState(false);
    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);

    const bottomRef = useRef(null);
    const pollRef = useRef(null);

    //fetch conversations
    const fetchConversations = async () => {
        try {
            const res = await axiosClient.get(API.AXIOS_MESSAGE_GET_ALL);

            if (res.data.isSuccess) {
                setConversations(res.data.data?.conversations ?? []);
            }
        } catch {
            toast.error("Unable to load conversations");
        } finally {
            setConvsLoading(false);
        }
    };

    useEffect(() => {
        if (!userInfo) {
            navigate({ to: "/login" });
            return;
        }
        fetchConversations();
    }, []);

    const fetchMessages = async (partnerId) => {
        if (!partnerId) return;
        try {
            setMsgsLoading(true);
            const endpoint = API.AXIOS_MESSAGE_GET_BY_USER_ID.replace("{userId}", partnerId);
            const res = await axiosClient.get(endpoint);
            if (res.data.isSuccess) {
                const msgs = res.data.data?.messages ?? [];
                setMessages([...msgs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
            }
        } catch {
            toast.error("Unable to load messages");
        } finally {
            setMsgsLoading(false);
        }
    };

    useEffect(() => {
        if (!activeId) return;
        isFirstLoad.current = true;
        fetchMessages(activeId);
        const endpoint = API.AXIOS_MESSAGE_MARK_READ.replace("{userId}", activeId);
        axiosClient.put(endpoint).then(() => {
            setConversations((prev) =>
                prev.map((c) => c.partnerId === activeId ? { ...c, unreadCount: 0 } : c)
            );
        }).catch(() => {});
    }, [activeId]);

    const isFirstLoad = useRef(true);
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            bottomRef.current?.scrollIntoView();
            return;
        }
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!draft.trim() || sending || !activeId) return;
        const text = draft.trim();
        setSending(true);
        setDraft("");

        // optimistic
        const tempMsg = {
            id: `temp-${Date.now()}`,
            content: text,
            senderId: userInfo.id,
            createdAt: new Date().toISOString().replace("Z", ""),
            isPending: true,
        };
        setMessages((prev) => [...prev, tempMsg]);

        try {
            const res = await axiosClient.post(API.AXIOS_MESSAGE_INSERT, {
                receiverId: activeId,
                content: text,
            });
            if (res.data.isSuccess) {
                setMessages((prev : any) =>
                    prev.map((m) => (m.id === tempMsg.id ? res.data.data : m))
                );
                setConversations((prev : any) =>
                    prev.map((c) =>
                        c.id === activeId
                            ? { ...c, lastMessage: text, lastMessageAt: new Date().toISOString() }
                            : c
                    )
                );
            } else {
                // revert optimistic
                setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
                setDraft(text);
                toast.error(res.data.message || "Failed to send");
            }
        } catch {
            setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
            setDraft(text);
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    // ── derived ───────────────────────────────────────────────────────────────
    const activeConv = conversations.find((c) => c.partnerId === activeId);

    const filtered = conversations.filter((c) => {
        if (!search.trim()) return true;
        return c.partnerUsername?.toLowerCase().includes(search.toLowerCase());
    });

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <div className="px-6 sm:px-10 lg:px-16 flex flex-col" style={{ height: "calc(100vh - 370px)" }}>
                <div className="flex flex-1 overflow-hidden bg-white min-h-0">

                    {/* ── LEFT: conversation list ──────────────────────────────────── */}
                    <aside className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">

                        {/* header */}
                        <div className="px-4 pt-5 pb-3 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 mb-3">Messages</h2>
                            <div className="relative">
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search conversations"
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* list */}
                        <ul className="flex-1 overflow-y-auto">
                            {convsLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <li key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                                        </div>
                                    </li>
                                ))
                            ) : filtered.length === 0 ? (
                                <li className="px-4 py-8 text-center text-sm text-gray-400">
                                    No conversations yet.
                                </li>
                            ) : (
                                filtered.map((conv) => {
                                    const isActive = conv.partnerId === activeId;
                                    const avatarSrc = conv.partnerProfileImageUrl ? `${API.URL}${conv.partnerProfileImageUrl}` : null;
                                    const name = conv.partnerUsername ?? "Unknown";

                                    return (
                                        <li key={conv.id}>
                                            <button
                                                onClick={() => setActiveId(conv.partnerId)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                    isActive
                                                        ? "bg-blue-50"
                                                        : "hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className="relative flex-shrink-0">
                                                    <Avatar src={avatarSrc} name={name} />
                                                    {conv.unreadCount > 0 && (
                                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
                                                            {name || "Unknown"}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                                                            {formatTime(conv.lastMessageAt)}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                                                        {conv.lastMessage || "No messages yet"}
                                                    </p>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </aside>

                    {/* ── RIGHT: chat area ─────────────────────────────────────────── */}
                    {!activeId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                            <p className="text-sm font-medium">Select a conversation</p>
                            <p className="text-xs mt-1">Choose from the list on the left</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col min-w-0">

                            {/* chat header */}
                            {activeConv && (
                                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
                                    <Avatar
                                        src={activeConv?.partnerProfileImageUrl
                                            ? `${API.URL}${activeConv.partnerProfileImageUrl}`
                                            : null}
                                        name={activeConv?.partnerUsername ?? ""}
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {activeConv?.partnerUsername}
                                        </p>
                                        <p className="text-xs text-gray-400">@{activeConv?.partnerUsername}</p>
                                    </div>
                                    <button
                                        onClick={() => fetchMessages(activeId)}
                                        title="Refresh"
                                        className="cursor-pointer ml-auto p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* messages */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
                                {msgsLoading ? (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                                        Loading...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                                        No messages yet. Say hi!
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMine = msg.senderId === userInfo?.id;
                                        return (
                                            <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                                {!isMine && (
                                                    <Avatar
                                                        src={activeConv?.partnerProfileImageUrl
                                                            ? `${API.URL}${activeConv.partnerProfileImageUrl}`
                                                            : null}
                                                        name={activeConv?.partnerUsername ?? ""}
                                                        size="sm"
                                                    />
                                                )}
                                                <div className={`max-w-[65%] min-w-0 w-fit ${isMine ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                                                    <div
                                                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-all whitespace-normal ${
                                                            isMine
                                                                ? `bg-blue-600 text-white rounded-br-sm ${msg.isPending ? "opacity-60" : ""}`
                                                                : "bg-gray-100 text-gray-800 rounded-bl-sm"
                                                        }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 px-1">
                                                        {msg.isPending ? "Sending..." : formatTime(msg.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* input area */}
                            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
                                <div className="flex items-end gap-2">
                                    <textarea
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message... (Enter to send)"
                                        rows={1}
                                        style={{ resize: "none" }}
                                        className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 min-h-[42px] max-h-32 overflow-y-auto"
                                        onInput={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                                        }}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!draft.trim() || sending}
                                        className="cursor-pointer flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                                    Shift + Enter for new line · auto-refreshes every 5s
                                </p>
                            </div>

                        </div>
                    )}
                </div>
            </div>    
    );
}
