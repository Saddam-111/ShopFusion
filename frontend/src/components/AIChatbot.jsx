import React, { useState } from "react";
import { MdChat, MdClose, MdSend, MdAutoAwesome } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm ShopFusion AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const response = await axios.post(
        `${baseUrl}/api/v1/ai/chat`,
        { message: userMessage, userId: user?._id },
        { withCredentials: true },
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessageContent = (content) => {
    const linkRegex = /\[PRODUCT:([^|]+)\|([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(
        <button
          key={match[1]}
          onClick={() => navigate(`/product/${match[1]}`)}
          className="text-[var(--accent-gold)] underline hover:text-[var(--accent-gold)]/80 font-medium mx-1"
        >
          {match[2]}
        </button>,
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[var(--accent-gold)] text-[var(--bg-primary)] p-4 rounded-full shadow-lg hover:bg-[var(--accent-gold)]/80 transition-all z-50"
      >
        <MdChat className="text-2xl" />
      </button>

      {isOpen && (
        <div
          className="fixed bottom-0 right-0 w-full h-[85vh] sm:bottom-20 sm:right-6 sm:w-66 sm:h-[500px] 
  bg-[var(--bg-secondary)] rounded-t-2xl sm:rounded-lg shadow-2xl border border-[var(--accent-gold)]/20 flex flex-col z-50
"
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--accent-gold)]/20">
            <div className="flex items-center gap-2">
              <MdAutoAwesome className="text-[var(--accent-gold)] text-xl" />
              <h3 className="font-bold text-[var(--text-primary)]">
                AI Assistant
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-[var(--accent-gold)] text-[var(--bg-primary)]"
                      : "bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--accent-gold)]/20"
                  }`}
                >
                  {msg.role === "assistant"
                    ? renderMessageContent(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--accent-gold)]/20">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--accent-gold)] rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-[var(--accent-gold)] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-[var(--accent-gold)] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--accent-gold)]/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:outline-none focus:border-[var(--accent-gold)]"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-[var(--accent-gold)] text-[var(--bg-primary)] p-2 rounded-lg hover:bg-[var(--accent-gold)]/80 disabled:opacity-50"
              >
                <MdSend className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
