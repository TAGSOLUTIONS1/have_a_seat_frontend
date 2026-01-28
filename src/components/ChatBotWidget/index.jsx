// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   FaComments,
//   FaTimes,
//   FaUtensils,
//   FaStar,
//   FaSearch,
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVolumeUp,
//   FaVolumeMute,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// export default function ChatBotWidget() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatId, setChatId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [showBanner, setShowBanner] = useState(false);
//   const [hasSeenBanner, setHasSeenBanner] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const synthRef = useRef(null);
//   const transcriptRef = useRef("");

//   const silenceTimerRef = useRef(null);
//   const lastTranscriptRef = useRef("");

//   // Speech Recognition setup
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   // Check if browser supports speech recognition
//   if (!browserSupportsSpeechRecognition) {
//     console.warn("Browser doesn't support speech recognition");
//   }

//   // Text-to-Speech function
//   const speakText = (text) => {
//     if (!isVoiceEnabled || !text || !window.speechSynthesis) return;

//     // Stop any ongoing speech
//     window.speechSynthesis.cancel();

//     const synth = window.speechSynthesis;

//     // Ensure voices are loaded (Chrome fix)
//     let voices = synth.getVoices();
//     if (!voices.length) {
//       synth.onvoiceschanged = () => {
//         voices = synth.getVoices();
//       };
//     }

//     // Break long text into sentences (better UX)
//     const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];

//     setIsSpeaking(true);

//     chunks.forEach((chunk, index) => {
//       const utterance = new SpeechSynthesisUtterance(chunk.trim());

//       utterance.voice = voices.find((v) => v.lang === "en-US") || voices[0];

//       utterance.rate = 1;
//       utterance.pitch = 1;
//       utterance.volume = 1;

//       utterance.onend = () => {
//         if (index === chunks.length - 1) {
//           setIsSpeaking(false);

//           // Auto-start listening again (hands-free conversation)
//           setTimeout(() => {
//             if (!listening && !isListening) {
//               toggleListening();
//             }
//           }, 500);
//         }
//       };

//       utterance.onerror = () => {
//         setIsSpeaking(false);
//       };

//       synth.speak(utterance);
//     });
//   };

//   // Stop speaking
//   const stopSpeaking = () => {
//     if (window.speechSynthesis) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//       synthRef.current = null;
//     }
//   };

//   // Toggle voice input
//   const toggleListening = () => {
//     if (listening) {
//       SpeechRecognition.stopListening();
//       setIsListening(false);
//       clearSilenceTimer();
//     } else {
//       resetTranscript();
//       transcriptRef.current = "";
//       setInput("");

//       SpeechRecognition.startListening({
//         continuous: true,
//         language: "en-US",
//         interimResults: true,
//       });

//       setIsListening(true);
//     }
//   };

//   const clearSilenceTimer = () => {
//     if (silenceTimerRef.current) {
//       clearTimeout(silenceTimerRef.current);
//       silenceTimerRef.current = null;
//     }
//   };

//   useEffect(() => {
//     if (!listening) return;
//     if (!transcript) return;

//     setInput(transcript);
//     transcriptRef.current = transcript;

//     // Reset silence timer every time transcript changes
//     clearSilenceTimer();

//     silenceTimerRef.current = setTimeout(() => {
//       // If transcript hasn't changed → user stopped speaking
//       if (transcriptRef.current === transcript) {
//         SpeechRecognition.stopListening();
//         setIsListening(false);

//         const finalText = transcriptRef.current.trim();
//         if (finalText) {
//           sendMessage(finalText);
//         }

//         resetTranscript();
//         transcriptRef.current = "";
//       }
//     }, 1000); // 👈 silence threshold (800–1200ms feels natural)
//   }, [transcript, listening]);

//   // Prevent body scroll when chatbot is open
//   useEffect(() => {
//     if (open) {
//       // Save the current overflow value
//       const originalOverflow = document.body.style.overflow;
//       // Disable body scroll
//       document.body.style.overflow = "hidden";

//       // Cleanup: restore scroll when component unmounts or chat closes
//       return () => {
//         document.body.style.overflow = originalOverflow;
//       };
//     }
//   }, [open]);

//   // Check if user has seen the banner before
//   useEffect(() => {
//     const seenBanner = localStorage.getItem("chatbot_banner_seen");
//     if (!seenBanner) {
//       // Show banner after 3 seconds of page load
//       const timer = setTimeout(() => {
//         setShowBanner(true);
//       }, 3000);
//       return () => clearTimeout(timer);
//     } else {
//       setHasSeenBanner(true);
//     }
//   }, []);

//   // Show tooltip on hover after a delay
//   useEffect(() => {
//     if (!open && !hasSeenBanner) {
//       const timer = setTimeout(() => {
//         setShowTooltip(true);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [open, hasSeenBanner]);

//   // Add welcome message when chat opens
//   useEffect(() => {
//     if (open && messages.length === 0) {
//       const welcomeMessage = {
//         id: "welcome_message",
//         sender: "bot",
//         text: "Hi! How can we help you? Let's find your favorite restaurant with us. What would you like to explore today?",
//       };
//       setMessages([welcomeMessage]);
//       // Speak welcome message if voice is enabled
//       if (isVoiceEnabled) {
//         speakText(welcomeMessage.text);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   // Update input when transcript changes and store in ref
//   useEffect(() => {
//     if (transcript) {
//       transcriptRef.current = transcript;
//       setInput(transcript);
//     }
//   }, [transcript]);

//   // Update listening state
//   useEffect(() => {
//     setIsListening(listening);
//   }, [listening]);

//   // Cleanup speech synthesis on unmount
//   useEffect(() => {
//     return () => {
//       if (window.speechSynthesis) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   const sendMessage = async (messageOverride = null) => {
//     const messageText = (messageOverride || input).trim();
//     if (!messageText) return;

//     // Stop listening if active
//     if (listening) {
//       SpeechRecognition.stopListening();
//       setIsListening(false);
//     }

//     // Stop any ongoing speech
//     stopSpeaking();

//     const userMsg = {
//       id: Date.now().toString(),
//       sender: "user",
//       text: messageText,
//     };
//     setMessages((prev) => [...prev, userMsg]);
//     const currentInput = messageText;
//     setInput("");
//     resetTranscript();
//     setLoading(true);

//     try {
//       const params = chatId
//         ? { query: currentInput, chat_id: chatId }
//         : { query: currentInput };
//       const res = await axios.get(
//         "https://have-a-seatonline.com/api/v1/yelp/chat",
//         { params },
//       );

//       const data = res.data;
//       const botText = data?.data?.response?.text || "No response from server.";
//       const botMsg = {
//         id: Date.now().toString() + "_bot",
//         sender: "bot",
//         text: botText,
//         businesses: data?.data?.entities?.[0]?.businesses || [],
//       };

//       setMessages((prev) => [...prev, botMsg]);
//       if (data?.data?.chat_id && !chatId) setChatId(data.data.chat_id);

//       // Speak bot response if voice is enabled
//       if (isVoiceEnabled && botText) {
//         speakText(botText);
//       }
//     } catch (err) {
//       const errorMsg = "Error fetching response.";
//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now().toString() + "_err", sender: "bot", text: errorMsg },
//       ]);
//       if (isVoiceEnabled) {
//         speakText(errorMsg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleCloseBanner = () => {
//     setShowBanner(false);
//     setHasSeenBanner(true);
//     localStorage.setItem("chatbot_banner_seen", "true");
//   };
//   useEffect(() => {
//     if (window.speechSynthesis) {
//       window.speechSynthesis.getVoices();
//     }
//   }, []);

//   useEffect(() => {
//     if (!window.speechSynthesis) return;

//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length && !selectedVoice) {
//         // Pick a good default
//         const preferred =
//           voices.find((v) => v.name.includes("Google") && v.lang === "en-US") ||
//           voices.find((v) => v.lang === "en-US") ||
//           voices[0];

//         setSelectedVoice(preferred);
//       }
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;
//   }, [selectedVoice]);

//   console.log(messages);
//   return (
//     <>
//       {/* Introductory Banner */}
//       {showBanner && !open && (
//         <div className="fixed bottom-24 right-5 z-50 animate-slide-up">
//           <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-2xl p-4 max-w-sm border-2 border-purple-400">
//             <div className="flex items-start gap-3">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                   <FaSearch size={18} />
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-lg mb-1">
//                   Find Restaurants in One Click!
//                 </h3>
//                 <p className="text-sm text-purple-100 mb-3">
//                   Ask me anything about restaurants and I'll help you find the
//                   perfect place instantly.
//                 </p>
//                 <button
//                   onClick={() => {
//                     handleCloseBanner();
//                     setOpen(true);
//                   }}
//                   className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors mr-2"
//                 >
//                   Try It Now
//                 </button>
//                 <button
//                   onClick={handleCloseBanner}
//                   className="text-purple-100 text-sm hover:text-white underline"
//                 >
//                   Maybe Later
//                 </button>
//               </div>
//               <button
//                 onClick={handleCloseBanner}
//                 className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
//               >
//                 <FaTimes size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="fixed bottom-5 right-5 z-50">
//         {!open ? (
//           <div className="relative">
//             {/* Tooltip */}
//             {showTooltip && !showBanner && (
//               <div className="absolute bottom-full right-0 mb-3 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl animate-fade-in">
//                 <div className="flex items-start gap-2">
//                   <FaSearch className="mt-0.5 flex-shrink-0" size={14} />
//                   <div>
//                     <p className="font-semibold mb-1">
//                       Find restaurants instantly!
//                     </p>
//                     <p className="text-gray-300 text-xs">
//                       Click to chat and discover your perfect dining spot in one
//                       click.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
//                 <button
//                   onClick={() => setShowTooltip(false)}
//                   className="absolute top-1 right-1 text-gray-400 hover:text-white"
//                 >
//                   <FaTimes size={12} />
//                 </button>
//               </div>
//             )}

//             {/* Chat Button with Pulse Animation */}
//             <button
//               onClick={() => {
//                 setOpen(true);
//                 setShowTooltip(false);
//               }}
//               onMouseEnter={() => setShowTooltip(true)}
//               onMouseLeave={() => setShowTooltip(false)}
//               className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 group"
//             >
//               {/* Pulsing ring animation */}
//               <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></div>
//               <div className="absolute inset-0 rounded-full bg-purple-500 animate-pulse opacity-50"></div>

//               {/* Icon */}
//               <FaComments
//                 size={26}
//                 className="relative z-10 group-hover:scale-110 transition-transform"
//               />

//               {/* Notification badge */}
//               {!hasSeenBanner && (
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-20 animate-bounce">
//                   <span className="w-2 h-2 bg-white rounded-full"></span>
//                 </span>
//               )}
//             </button>
//           </div>
//         ) : (
//           <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
//             {/* Header */}
//             <div className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
//               <span className="font-medium">Chat with Have a Seat</span>
//               <div className="flex items-center gap-2">
//                 {/* Voice Toggle Button */}
//                 <button
//                   onClick={() => {
//                     setIsVoiceEnabled(!isVoiceEnabled);
//                     if (isVoiceEnabled) {
//                       stopSpeaking();
//                     }
//                   }}
//                   className="p-1.5 rounded hover:bg-white/20 transition-colors"
//                   title={isVoiceEnabled ? "Disable voice" : "Enable voice"}
//                 >
//                   {isVoiceEnabled ? (
//                     <FaVolumeUp size={16} />
//                   ) : (
//                     <FaVolumeMute size={16} />
//                   )}
//                 </button>
//                 <FaTimes
//                   className="cursor-pointer hover:bg-white/20 transition-colors"
//                   onClick={() => {
//                     stopSpeaking();
//                     if (listening) {
//                       SpeechRecognition.stopListening();
//                     }
//                     setOpen(false);
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 p-4 overflow-y-auto bg-white">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}
//                 >
//                   <span
//                     className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
//                       msg.sender === "user"
//                         ? "bg-purple-600 text-white"
//                         : "bg-gray-100 text-gray-800 border border-gray-200"
//                     }`}
//                   >
//                     {msg.text}
//                   </span>

//                   {msg?.businesses?.length > 0 && (
//                     <div className="mt-3 space-y-3">
//                       {msg?.businesses.map((business, index) => (
//                         <Link
//                           key={business.id || `business-${index}`}
//                           to={{
//                             pathname: "/restaurant-detail",
//                             search: `?yelp_alias=${encodeURIComponent(business.alias)}`,
//                           }}
//                           className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition text-left bg-white"
//                         >
//                           {/* Left: Circular Image */}
//                           <div className="w-12 h-12 flex-shrink-0">
//                             <img
//                               src={
//                                 business?.contextual_info?.photos?.[0]
//                                   ?.original_url ||
//                                 "https://via.placeholder.com/150"
//                               }
//                               alt={business.name}
//                               className="w-12 h-12 object-cover rounded-full"
//                             />
//                           </div>

//                           {/* Right: Name + Cuisine */}
//                           <div className="flex-1">
//                             <h4 className="font-medium text-gray-800">
//                               {business.name || "Restaurant Name"}
//                             </h4>
//                             <p className="text-sm text-gray-500">
//                               {business.categories?.[0]?.title || "Cuisine"}
//                             </p>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {loading && <p className="text-purple-600">Typing...</p>}
//             </div>

//             {/* Input */}
//             <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       sendMessage();
//                     }
//                   }}
//                   placeholder={
//                     isListening
//                       ? "Listening... Speak now"
//                       : "Lets find your favorite restaurant..."
//                   }
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800"
//                   readOnly={isListening}
//                 />
//                 {/* Voice Input Button */}
//                 {browserSupportsSpeechRecognition && (
//                   <button
//                     onClick={toggleListening}
//                     className={`p-2.5 rounded-md transition-all ${
//                       isListening
//                         ? "bg-red-500 text-white animate-pulse"
//                         : "bg-purple-600 text-white hover:bg-purple-700"
//                     }`}
//                     title={isListening ? "Stop listening" : "Start voice input"}
//                   >
//                     {isListening ? (
//                       <FaMicrophoneSlash size={16} />
//                     ) : (
//                       <FaMicrophone size={16} />
//                     )}
//                   </button>
//                 )}
//                 {/* Send Button */}
//                 <button
//                   onClick={sendMessage}
//                   disabled={!input.trim() || loading || isListening}
//                   className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Send
//                 </button>
//               </div>
//               {isListening && (
//                 <div className="mt-2 text-xs text-purple-600 flex items-center gap-2">
//                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                   <span>
//                     {transcript
//                       ? `Listening: "${transcript}"`
//                       : "Listening... Speak now"}
//                   </span>
//                 </div>
//               )}
//               {isSpeaking && (
//                 <div className="mt-2 text-xs text-purple-600 flex items-center gap-2">
//                   <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                   <span>Speaking...</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }


import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  FaComments,
  FaTimes,
  FaSearch,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

/**
 * CONVERSATION STATE MACHINE
 * ---------------------------
 * IDLE: Ready to start listening (initial state)
 * LISTENING: Actively capturing user speech
 * PROCESSING: Transcript finalized, sending to backend
 * SPEAKING: Assistant is responding via TTS
 * 
 * Flow: IDLE → LISTENING → PROCESSING → SPEAKING → LISTENING (loop)
 */

const ConversationState = {
  IDLE: "idle",
  LISTENING: "listening",
  PROCESSING: "processing",
  SPEAKING: "speaking",
};

export default function HandsFreeVoiceAgent() {
  // UI State
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [hasSeenBanner, setHasSeenBanner] = useState(false);

  // Voice State Machine
  const [conversationState, setConversationState] = useState(
    ConversationState.IDLE
  );
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // Current transcript being captured
  const [currentTranscript, setCurrentTranscript] = useState("");

  // Speech Recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Refs for managing async operations
  const silenceTimerRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const isMountedRef = useRef(true);
  const shouldRestartListeningRef = useRef(false);

  // Configuration
  const SILENCE_THRESHOLD_MS = 1000; // Time to wait after speech stops
  const MIN_TRANSCRIPT_LENGTH = 3; // Minimum characters to send

  /**
   * SILENCE DETECTION LOGIC
   * -----------------------
   * Uses a timeout-based approach:
   * 1. Every time transcript changes, reset the timer
   * 2. If no changes for SILENCE_THRESHOLD_MS, user has stopped speaking
   * 3. Finalize and send the message automatically
   */
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startSilenceDetection = useCallback(() => {
    clearSilenceTimer();

    silenceTimerRef.current = setTimeout(() => {
      // Only proceed if still in listening state and transcript hasn't changed
      if (
        conversationState === ConversationState.LISTENING &&
        lastTranscriptRef.current === transcript
      ) {
        const finalTranscript = transcript.trim();

        // Validate transcript before sending
        if (finalTranscript.length >= MIN_TRANSCRIPT_LENGTH) {
          // Stop listening
          SpeechRecognition.stopListening();

          // Transition to processing
          setConversationState(ConversationState.PROCESSING);

          // Send message
          sendMessage(finalTranscript);
        } else {
          // Transcript too short, keep listening
          console.log("Transcript too short, continuing to listen");
        }
      }
    }, SILENCE_THRESHOLD_MS);
  }, [
    conversationState,
    transcript,
    clearSilenceTimer,
    SILENCE_THRESHOLD_MS,
    MIN_TRANSCRIPT_LENGTH,
  ]);

  /**
   * TEXT-TO-SPEECH WITH AUTO-RESTART
   * --------------------------------
   * Speaks bot response and automatically restarts listening when done
   */
  const speakText = useCallback(
    (text) => {
      if (!isVoiceEnabled || !text || !window.speechSynthesis) {
        // If voice disabled, immediately restart listening
        if (shouldRestartListeningRef.current) {
          setConversationState(ConversationState.LISTENING);
          startListening();
        }
        return;
      }

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const synth = window.speechSynthesis;
      let voices = synth.getVoices();

      // Handle voice loading (Chrome requirement)
      if (!voices.length) {
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
        };
      }

      // Split into sentences for better UX
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

      // Transition to speaking state
      setConversationState(ConversationState.SPEAKING);

      let currentIndex = 0;

      const speakNext = () => {
        if (currentIndex >= sentences.length) {
          // All sentences spoken
          setConversationState(ConversationState.IDLE);

          // Auto-restart listening after short delay
          if (shouldRestartListeningRef.current && isMountedRef.current) {
            setTimeout(() => {
              if (isMountedRef.current) {
                setConversationState(ConversationState.LISTENING);
                startListening();
              }
            }, 500);
          }
          return;
        }

        const utterance = new SpeechSynthesisUtterance(
          sentences[currentIndex].trim()
        );

        // Voice selection (prefer US English)
        utterance.voice =
          voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
          voices.find((v) => v.lang === "en-US") ||
          voices[0];

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => {
          currentIndex++;
          speakNext();
        };

        utterance.onerror = (error) => {
          console.error("TTS error:", error);
          // On error, transition back to idle
          setConversationState(ConversationState.IDLE);

          if (shouldRestartListeningRef.current) {
            setTimeout(() => {
              setConversationState(ConversationState.LISTENING);
              startListening();
            }, 500);
          }
        };

        synth.speak(utterance);
      };

      speakNext();
    },
    [isVoiceEnabled]
  );

  /**
   * START LISTENING
   * ---------------
   * Begins continuous speech recognition
   */
  const startListening = useCallback(() => {
    resetTranscript();
    setCurrentTranscript("");
    lastTranscriptRef.current = "";

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
      interimResults: true,
    });
  }, [resetTranscript]);

  /**
   * STOP EVERYTHING
   * ---------------
   * Emergency stop for all voice operations
   */
  const stopAllVoiceOperations = useCallback(() => {
    // Stop listening
    if (listening) {
      SpeechRecognition.stopListening();
    }

    // Stop speaking
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Clear timers
    clearSilenceTimer();

    // Reset state
    setConversationState(ConversationState.IDLE);
    shouldRestartListeningRef.current = false;
  }, [listening, clearSilenceTimer]);

  /**
   * SEND MESSAGE TO BACKEND
   * -----------------------
   * Sends transcript to API and handles response
   */
  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim()) return;

      const userMsg = {
        id: Date.now().toString(),
        sender: "user",
        text: messageText,
      };

      setMessages((prev) => [...prev, userMsg]);
      setCurrentTranscript("");

      try {
        const params = chatId
          ? { query: messageText, chat_id: chatId }
          : { query: messageText };

        const res = await axios.get(
          "https://have-a-seatonline.com/api/v1/yelp/chat",
          { params }
        );

        const data = res.data;
        const botText =
          data?.data?.response?.text || "No response from server.";
        const botMsg = {
          id: Date.now().toString() + "_bot",
          sender: "bot",
          text: botText,
          businesses: data?.data?.entities?.[0]?.businesses || [],
        };

        setMessages((prev) => [...prev, botMsg]);

        if (data?.data?.chat_id && !chatId) {
          setChatId(data.data.chat_id);
        }

        // Speak response (will auto-restart listening when done)
        shouldRestartListeningRef.current = true;
        speakText(botText);
      } catch (err) {
        console.error("API error:", err);
        const errorMsg = "Sorry, I encountered an error. Please try again.";
        const errorMsgObj = {
          id: Date.now().toString() + "_err",
          sender: "bot",
          text: errorMsg,
        };

        setMessages((prev) => [...prev, errorMsgObj]);

        shouldRestartListeningRef.current = true;
        speakText(errorMsg);
      } finally {
        resetTranscript();
      }
    },
    [chatId, resetTranscript, speakText]
  );

  /**
   * TRANSCRIPT CHANGE HANDLER
   * -------------------------
   * Core silence detection logic - monitors transcript changes
   */
  useEffect(() => {
    if (conversationState !== ConversationState.LISTENING) return;
    if (!listening) return;

    // Update current transcript display
    setCurrentTranscript(transcript);

    // Store latest transcript
    lastTranscriptRef.current = transcript;

    // Reset silence timer on every change
    if (transcript.trim().length > 0) {
      startSilenceDetection();
    }
  }, [transcript, listening, conversationState, startSilenceDetection]);

  /**
   * WELCOME MESSAGE & AUTO-START
   * ----------------------------
   * When chat opens, send welcome and start listening if voice enabled
   */
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMessage = {
        id: "welcome_message",
        sender: "bot",
        text: "Hi! I'm your voice assistant. How can I help you find a restaurant today?",
      };

      setMessages([welcomeMessage]);

      if (isVoiceEnabled) {
        // Speak welcome, then start listening
        shouldRestartListeningRef.current = true;
        speakText(welcomeMessage.text);
      }
    }
  }, [open, isVoiceEnabled, messages.length, speakText]);

  /**
   * CLEANUP ON UNMOUNT
   */
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      stopAllVoiceOperations();
    };
  }, [stopAllVoiceOperations]);

  /**
   * PREVENT BODY SCROLL
   */
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  /**
   * BANNER LOGIC
   */
  useEffect(() => {
    const seenBanner = localStorage.getItem("chatbot_banner_seen");
    if (!seenBanner) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenBanner(true);
    }
  }, []);

  useEffect(() => {
    if (!open && !hasSeenBanner) {
      const timer = setTimeout(() => setShowTooltip(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [open, hasSeenBanner]);

  /**
   * VOICE TOGGLE HANDLER
   */
  const handleVoiceToggle = () => {
    if (isVoiceEnabled) {
      // Turning off voice
      stopAllVoiceOperations();
      setIsVoiceEnabled(false);
    } else {
      // Turning on voice
      setIsVoiceEnabled(true);
      // Start listening immediately
      setConversationState(ConversationState.LISTENING);
      startListening();
    }
  };

  /**
   * MANUAL VOICE TOGGLE (for user control)
   */
  const handleManualVoiceToggle = () => {
    if (conversationState === ConversationState.LISTENING) {
      // Stop listening
      SpeechRecognition.stopListening();
      clearSilenceTimer();
      setConversationState(ConversationState.IDLE);
      shouldRestartListeningRef.current = false;
    } else if (conversationState === ConversationState.IDLE) {
      // Start listening
      setConversationState(ConversationState.LISTENING);
      startListening();
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    setHasSeenBanner(true);
    localStorage.setItem("chatbot_banner_seen", "true");
  };

  /**
   * STATE INDICATORS
   */
  const getStateIndicator = () => {
    switch (conversationState) {
      case ConversationState.LISTENING:
        return (
          <div className="mt-2 text-xs text-purple-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>
              {currentTranscript
                ? `Listening: "${currentTranscript}"`
                : "Listening... Speak now"}
            </span>
          </div>
        );
      case ConversationState.PROCESSING:
        return (
          <div className="mt-2 text-xs text-blue-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Processing your request...</span>
          </div>
        );
      case ConversationState.SPEAKING:
        return (
          <div className="mt-2 text-xs text-purple-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Speaking...</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition");
  }

  return (
    <>
      {/* Banner */}
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
                <h3 className="font-bold text-lg mb-1">
                  Voice-Powered Restaurant Search!
                </h3>
                <p className="text-sm text-purple-100 mb-3">
                  Just speak naturally - I'll listen, understand, and respond
                  automatically.
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
                    <p className="font-semibold mb-1">Hands-free voice chat!</p>
                    <p className="text-gray-300 text-xs">
                      Click to start a natural conversation with voice.
                    </p>
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

            {/* Chat Button */}
            <button
              onClick={() => {
                setOpen(true);
                setShowTooltip(false);
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 group"
            >
              <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full bg-purple-500 animate-pulse opacity-50"></div>
              <FaComments
                size={26}
                className="relative z-10 group-hover:scale-110 transition-transform"
              />
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
              <span className="font-medium">Voice Assistant</span>
              <div className="flex items-center gap-2">
                {/* Voice Enable/Disable */}
                <button
                  onClick={handleVoiceToggle}
                  className="p-1.5 rounded hover:bg-white/20 transition-colors"
                  title={isVoiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  {isVoiceEnabled ? (
                    <FaVolumeUp size={16} />
                  ) : (
                    <FaVolumeMute size={16} />
                  )}
                </button>
                <FaTimes
                  className="cursor-pointer hover:bg-white/20 transition-colors p-1"
                  onClick={() => {
                    stopAllVoiceOperations();
                    setOpen(false);
                  }}
                  size={20}
                />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
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
                      {msg.businesses.map((business, index) => (
                        <Link
                          key={business.id || `business-${index}`}
                          to={{
                            pathname: "/restaurant-detail",
                            search: `?yelp_alias=${encodeURIComponent(business.alias)}`,
                          }}
                          className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition text-left bg-white"
                        >
                          <div className="w-12 h-12 flex-shrink-0">
                            <img
                              src={
                                business?.contextual_info?.photos?.[0]
                                  ?.original_url ||
                                "https://via.placeholder.com/150"
                              }
                              alt={business.name}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                          </div>
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
            </div>

            {/* Voice Control Footer */}
            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center justify-center gap-3">
                {/* Manual voice toggle for advanced users */}
                {browserSupportsSpeechRecognition && isVoiceEnabled && (
                  <button
                    onClick={handleManualVoiceToggle}
                    disabled={
                      conversationState === ConversationState.PROCESSING ||
                      conversationState === ConversationState.SPEAKING
                    }
                    className={`p-3 rounded-full transition-all ${
                      conversationState === ConversationState.LISTENING
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={
                      conversationState === ConversationState.LISTENING
                        ? "Stop listening"
                        : "Start listening"
                    }
                  >
                    {conversationState === ConversationState.LISTENING ? (
                      <FaMicrophoneSlash size={20} />
                    ) : (
                      <FaMicrophone size={20} />
                    )}
                  </button>
                )}

                {!isVoiceEnabled && (
                  <p className="text-sm text-gray-500">
                    Voice mode disabled. Enable to start.
                  </p>
                )}
              </div>

              {/* State Indicator */}
              {getStateIndicator()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}