import React, { useState } from "react";

const ChatbotPopup = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Xử lý phản hồi (có thể gọi API OpenAI ở đây)
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    const botMessage = { from: "bot", text: data.reply };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <>
      {/* Nút tròn nổi */}
      <div
        className="fixed bottom-20 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        💬
      </div>

      {/* Popup chatbot */}
      {open && (
        <div className="fixed bottom-28 right-4 w-80 bg-white shadow-xl rounded-xl border z-50">
          <div className="p-3 font-bold border-b">Hỗ trợ khách hàng</div>
          <div className="p-3 h-64 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.from === "user" ? "text-right text-blue-600" : "text-left text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-sm border px-2 rounded"
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="ml-2 text-sm text-blue-600">
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;
