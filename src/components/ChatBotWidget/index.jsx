import { useState, useEffect } from "react";
import axios from "axios";
import { FaComments, FaTimes, FaUtensils, FaStar, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [hasSeenBanner, setHasSeenBanner] = useState(false);

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    if (open) {
      // Save the current overflow value
      const originalOverflow = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restore scroll when component unmounts or chat closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Check if user has seen the banner before
  useEffect(() => {
    const seenBanner = localStorage.getItem("chatbot_banner_seen");
    if (!seenBanner) {
      // Show banner after 3 seconds of page load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenBanner(true);
    }
  }, []);

  // Show tooltip on hover after a delay
  useEffect(() => {
    if (!open && !hasSeenBanner) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [open, hasSeenBanner]);

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
    const handleCloseBanner = () => {
      setShowBanner(false);
      setHasSeenBanner(true);
      localStorage.setItem("chatbot_banner_seen", "true");
    };

    console.log(messages);
  return (
    <>
      {/* Introductory Banner */}
      {showBanner && !open && (
        <div className="fixed bottom-24 right-5 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-2xl p-4 max-w-sm border-2 border-purple-400">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaSearch size={18} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Find Restaurants in One Click!</h3>
                <p className="text-sm text-purple-100 mb-3">
                  Ask me anything about restaurants and I'll help you find the perfect place instantly.
                </p>
                <button
                  onClick={() => {
                    handleCloseBanner();
                    setOpen(true);
                  }}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors mr-2"
                >
                  Try It Now
                </button>
                <button
                  onClick={handleCloseBanner}
                  className="text-purple-100 text-sm hover:text-white underline"
                >
                  Maybe Later
                </button>
              </div>
              <button
                onClick={handleCloseBanner}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-50">
        {!open ? (
          <div className="relative">
            {/* Tooltip */}
            {showTooltip && !showBanner && (
              <div className="absolute bottom-full right-0 mb-3 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl animate-fade-in">
                <div className="flex items-start gap-2">
                  <FaSearch className="mt-0.5 flex-shrink-0" size={14} />
                  <div>
                    <p className="font-semibold mb-1">Find restaurants instantly!</p>
                    <p className="text-gray-300 text-xs">Click to chat and discover your perfect dining spot in one click.</p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-1 right-1 text-gray-400 hover:text-white"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
            
            {/* Chat Button with Pulse Animation */}
            <button
              onClick={() => {
                setOpen(true);
                setShowTooltip(false);
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 group"
            >
              {/* Pulsing ring animation */}
              <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full bg-purple-500 animate-pulse opacity-50"></div>
              
              {/* Icon */}
              <FaComments size={26} className="relative z-10 group-hover:scale-110 transition-transform" />
              
              {/* Notification badge */}
              {!hasSeenBanner && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-20 animate-bounce">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              )}
            </button>
          </div>
        ) : (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
            <span className="font-medium">Chat with Have a Seat</span>
            <FaTimes className="cursor-pointer hover:bg-white/20 transition-colors" onClick={() => setOpen(false)} />
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
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
                            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition text-left bg-white"
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
          <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Lets find your favorite restaurant..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800"
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}
