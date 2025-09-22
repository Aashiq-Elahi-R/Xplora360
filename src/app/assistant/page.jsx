import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Send, Bot, User, Globe, Mic, MicOff } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function AssistantPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Local Voyage AI assistant. I can help you plan itineraries, find destinations, get safety tips, and answer questions about local culture in India. How can I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const languages = [
    "English",
    "Hindi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
  ];

  const quickActions = [
    { text: "Plan a 3-day Delhi itinerary", category: "Planning" },
    { text: "What are the safest areas in Mumbai?", category: "Safety" },
    { text: "Best local food in Rajasthan", category: "Food" },
    { text: "Cultural etiquette in South India", category: "Culture" },
    { text: "Hidden gems in Kerala", category: "Discovery" },
    { text: "Best time to visit Goa", category: "Travel Tips" },
  ];

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setIsLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const systemPrompt = `You are a helpful AI travel assistant for Local Voyage, specializing in Indian travel and tourism. You help users with:
      - Planning personalized itineraries
      - Finding tourist destinations and hidden gems
      - Providing safety tips and cultural advice
      - Recommending local food and experiences
      - Giving real-time travel information

      Respond in ${selectedLanguage} language. Be helpful, informative, and culturally sensitive. Always prioritize user safety and provide practical advice.`;

      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            userMessage,
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      handleStreamResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "Voice recognition is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage === "Hindi" ? "hi-IN" : "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Voice recognition error. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[280px] transition-all duration-300 flex flex-col">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-700 px-3 py-2.5 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-[18px] font-poppins font-semibold text-black dark:text-white">
            AI Assistant
          </h1>
          <div className="w-8" />
        </div>

        {/* Header */}
        <header className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-white">
                  Travel Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get personalized travel advice and planning help
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-3">
              <Globe size={18} className="text-gray-600 dark:text-gray-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 px-6 lg:px-8 py-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action.text)}
                      className="text-left p-4 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                    >
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                        {action.category}
                      </div>
                      <div className="text-gray-800 dark:text-white">
                        {action.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-pink-500 to-purple-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                  }`}
                >
                  {message.role === "user" ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                <div
                  className={`max-w-3xl p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {streamingMessage && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="max-w-3xl p-4 rounded-2xl bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">
                  <div className="whitespace-pre-wrap">{streamingMessage}</div>
                  <div className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && !streamingMessage && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="max-w-3xl p-4 rounded-2xl bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-[#1E1E1E] border-t border-gray-200 dark:border-gray-700 px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about travel plans, destinations, safety tips..."
                  className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="1"
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
                <button
                  onClick={startVoiceRecognition}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}
