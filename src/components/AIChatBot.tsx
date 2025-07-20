
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your digital card assistant. I can help you create amazing business cards, answer questions about features, or guide you through the process. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    // Reset quick replies by default
    setQuickReplies([]);

    // Expanded basic Q&A
    if (["hi", "hello", "hey", "good morning", "good afternoon", "good evening"].some(greet => lowerMessage === greet)) {
      setQuickReplies(["What can you do?", "Show me templates", "How to upgrade?"]);
      return "Hello! How can I assist you with your digital business card today?";
    }
    if (lowerMessage.includes("account") || lowerMessage.includes("login") || lowerMessage.includes("sign in")) {
      setQuickReplies(["How to reset password?", "Create account", "Contact support"]);
      return "You can log in or create an account from the top right menu. If you forgot your password, click 'Forgot password' on the login page.";
    }
    if (lowerMessage.includes("reset password")) {
      setQuickReplies(["How to login?", "Contact support"]);
      return "To reset your password, click 'Forgot password' on the login page and follow the instructions sent to your email.";
    }
    if (lowerMessage.includes("feature") || lowerMessage.includes("can you do") || lowerMessage.includes("what can you do")) {
      setQuickReplies(["Show me templates", "How to share card?", "Pricing"]);
      return "I can help you create, customize, and share digital business cards, explain features, guide you through templates, and answer any questions about the platform.";
    }
    if (lowerMessage.includes("template") || lowerMessage.includes("design")) {
      setQuickReplies(["Show me templates", "How to customize?", "Go to dashboard"]);
      return "We have over 50+ professional templates! You can customize colors, fonts, layouts, and add your branding. Would you like to see the template gallery?";
    }
    if (lowerMessage.includes("share") || lowerMessage.includes("qr")) {
      setQuickReplies(["How to share card?", "Show QR code", "Copy link"]);
      return "You can share your card via QR code, direct link, email, or social media. Each card gets a unique URL that's easy to share!";
    }
    if (lowerMessage.includes("edit") || lowerMessage.includes("update")) {
      setQuickReplies(["How to edit card?", "Go to dashboard"]);
      return "You can edit your card anytime! Go to your dashboard, select the card, and make changes. Updates are instant.";
    }
    if (lowerMessage.includes("analytics") || lowerMessage.includes("track")) {
      setQuickReplies(["What analytics are available?", "How to upgrade?"]);
      return "Premium plans include analytics: views, clicks, contact saves, and engagement metrics. Perfect for tracking your networking success!";
    }
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pricing")) {
      setQuickReplies(["Show pricing", "Start free trial"]);
      return "We offer a free tier with basic features, and premium plans starting at $9.99/month with advanced customization, analytics, and more templates.";
    }
    if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
      setQuickReplies(["How to create card?", "How to share?", "Contact support"]);
      return "I'm here to help! Ask me about creating cards, pricing, features, sharing, or anything else. What would you like to know more about?";
    }
    if (lowerMessage.includes("contact") || lowerMessage.includes("support")) {
      setQuickReplies(["Contact support", "Email support", "FAQ"]);
      return "For support, email support@digitalcards.com or use the contact form. We respond within 24 hours!";
    }
    if (lowerMessage.includes("faq") || lowerMessage.includes("question")) {
      setQuickReplies(["How does free trial work?", "Can I change plans?", "Refund policy"]);
      return "You can find answers to common questions in our FAQ section. Ask me anything specific!";
    }
    if (lowerMessage.includes("create") && lowerMessage.includes("card")) {
      setQuickReplies(["Show me templates", "Go to dashboard"]);
      return "To create a card, go to the dashboard and click 'Create New Card'. Choose a template and start customizing!";
    }
    if (lowerMessage.includes("upgrade")) {
      setQuickReplies(["Show pricing", "Start free trial"]);
      return "To upgrade, go to the pricing page and select a plan that fits your needs. You can upgrade anytime from your dashboard.";
    }
    // Default responses
    setQuickReplies(["Show me templates", "How to share?", "Contact support"]);
    const defaultResponses = [
      "That's a great question! Digital business cards are eco-friendly, always up-to-date, and much more interactive than traditional cards. Would you like to create one?",
      "I'd be happy to help you with that! Can you tell me more about what you're looking to achieve with your digital business card?",
      "Digital cards are the future of networking! They're contactless, professional, and you never run out. What features are most important to you?",
      "Great choice exploring digital business cards! They save trees, save money, and make networking so much easier. What would you like to know more about?"
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue.trim()),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg z-50 transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        style={{ backgroundColor: '#3B82F6' }}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-4 right-4 w-full max-w-sm sm:max-w-md md:max-w-lg h-[60vh] sm:h-[70vh] md:h-[80vh] z-50 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
      >
        <Card className="h-full flex flex-col shadow-2xl rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-600 text-white rounded-t-lg flex-shrink-0">
            <CardTitle id="chat-title" className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 w-8 h-8 p-0"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages Area with Fixed Height and Scrollbar */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 text-sm break-words ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.text}
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Input Area */}
            <div className="border-t p-4 flex-shrink-0 bg-white rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  aria-label="Chat input"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-3 flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {/* Quick Replies */}
              {quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickReplies.map((reply, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1"
                      onClick={() => {
                        setInputValue(reply);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AIChatBot;
