import { useState, useEffect } from "react";
import axios from "axios";
import { FaComments, FaTimes, FaUtensils, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add welcome message when chat opens
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMessage = {
        id: "welcome_message",
        sender: "bot",
        text: "Hi! How can we help you? Let's find your favorite restaurant with us. What would you like to explore today?",
      };
      setMessages([welcomeMessage]);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const params = chatId ? { query: input, chat_id: chatId } : { query: input };
      const res = await axios.get("https://have-a-seatonline.com/api/v1/yelp/chat", { params });

      const data = res.data;
      const botMsg = {
        id: Date.now().toString() + "_bot",
        sender: "bot",
        text: data?.data?.response?.text || "No response from server.",
        businesses: data?.data?.entities?.[0]?.businesses || [],
      };

      setMessages((prev) => [...prev, botMsg]);
      if (data?.data?.chat_id && !chatId) setChatId(data.data.chat_id);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "_err", sender: "bot", text: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };
    console.log(messages);
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-purple-700 transition"
        >
          <FaComments size={24} />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-medium">Chat with Have a Seat</span>
            <FaTimes className="cursor-pointer" onClick={() => setOpen(false)} />
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </span>


                {msg?.businesses?.length > 0 && (
                    <div className="mt-3 space-y-3">
                        {msg?.businesses.map((business, index) => (
                        <Link
                            key={business.id || `business-${index}`}
                            to={{
                            pathname: "/restaurant-detail",
                            search: `?yelp_alias=${encodeURIComponent(business.alias)}`,
                            }}
                            className="w-full flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:bg-gray-50 transition text-left"
                        >  
                            {/* Left: Circular Image */}
                            <div className="w-12 h-12 flex-shrink-0">
                            <img
                                src={business?.contextual_info?.photos?.[0]?.original_url || "https://via.placeholder.com/150"}
                                alt={business.name}
                                className="w-12 h-12 object-cover rounded-full"
                            />
                            </div>

                            {/* Right: Name + Cuisine */}
                            <div className="flex-1">
                            <h4 className="font-medium text-gray-800">
                                {business.name || "Restaurant Name"}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {business.categories?.[0]?.title || "Cuisine"}
                            </p>
                            </div>
                        </Link>  
                        ))}
                    </div>
                    )}

              </div>
            ))}
            {loading && <p className="text-purple-600">Typing...</p>}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Lets find your favorite restaurant..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
