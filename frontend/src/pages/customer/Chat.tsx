import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { ChatInfo, getChat, sendChatMessage } from "../../services/chatService";
import { connectSocket } from "../../utils/socket";
import { ChatMessage } from "../../types/Booking";

import useAuth from "../../hooks/useAuth";

function Chat() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user, token } = useAuth();

  const [info, setInfo] = useState<ChatInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // add a message once (the same message can arrive by socket AND by the POST reply)
  const addMessage = (message: ChatMessage): void => {
    setMessages((previous) =>
      previous.some((m) => m._id === message._id)
        ? previous
        : [...previous, message],
    );
  };

  const loadChat = async (): Promise<void> => {
    const data = await getChat(bookingId as string);
    setInfo(data);
    setMessages(data.messages);
  };

  // ---------- first load ----------
  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        await loadChat();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Unable to open chat");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // ---------- real-time connection ----------
  useEffect(() => {
    if (!token || !bookingId) return;

    const socket = connectSocket(token);

    socket.on("connect", () => {
      socket.emit("join", bookingId, (reply: { ok: boolean; message?: string }) => {
        if (!reply?.ok) toast.error(reply?.message || "Could not join chat");
      });
    });

    socket.on("message", (message: ChatMessage) => {
      addMessage(message);

      // a system message means the booking status changed -> refresh the header
      if (message.type === "system") {
        loadChat().catch(() => undefined);
      }
    });

    return () => {
      socket.emit("leave", bookingId);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, bookingId]);

  // ---------- scroll down on new message ----------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const value = text.trim();
    if (!value) return;

    try {
      setSending(true);

      const response = await sendChatMessage(bookingId as string, value);

      addMessage(response.message);
      setText("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Message not sent");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading chat...</div>;
  }

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/my-bookings" className="text-emerald-700">← Back to bookings</Link>
      </div>
    );
  }

  const isArtist = user?.role === "artist";
  const otherName = isArtist ? info.booking.customer.name : info.booking.artist.name;

  return (
    <div className="min-h-screen bg-emerald-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
        {/* header */}
        <div className="bg-emerald-700 text-white p-5">
          <Link to="/my-bookings" className="text-emerald-100 text-sm">
            ← My bookings
          </Link>

          <h1 className="text-xl font-bold mt-1">Chat with {otherName}</h1>

          <p className="text-emerald-100 text-sm">
            {info.booking.service} · {info.booking.dateKey}{" "}
            {info.booking.startTime}–{info.booking.endTime} ·{" "}
            <span className="capitalize">{info.booking.status.replace("_", " ")}</span>
          </p>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No messages yet. Say hello! 👋
            </p>
          )}

          {messages.map((message) => {
            if (message.type === "system") {
              return (
                <div key={message._id} className="text-center">
                  <span className="inline-block bg-yellow-100 text-yellow-900 text-xs rounded-full px-4 py-2">
                    {message.text}
                  </span>
                </div>
              );
            }

            const mine = message.sender === user?._id;

            return (
              <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    mine
                      ? "bg-emerald-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>

                  <p className={`text-[10px] mt-1 ${mine ? "text-emerald-100" : "text-gray-400"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* input */}
        {info.canSend ? (
          <form onSubmit={handleSend} className="p-4 border-t flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              maxLength={2000}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 rounded-xl font-semibold"
            >
              Send
            </button>
          </form>
        ) : (
          <p className="p-4 border-t text-center text-gray-500 text-sm">
            This conversation is closed because the booking is {info.booking.status}.
          </p>
        )}
      </div>
    </div>
  );
}

export default Chat;
