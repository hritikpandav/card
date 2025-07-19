
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Basic greetings and common questions
    if (['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'].some(greet => lowerMessage === greet)) {
      return "Hello! How can I assist you with your digital business card today?";
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
      const now = new Date();
      return `Current date and time is ${now.toLocaleString()}`;
    }

    if (lowerMessage.includes('how are you')) {
      return "I'm just a bot, but I'm here to help you with your digital business card!";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our digital business cards start from free! We offer a free tier with basic features, and premium plans starting at $9.99/month with advanced customization, analytics, and more templates.";
    }
    
    if (lowerMessage.includes('template') || lowerMessage.includes('design')) {
      return "We have over 50+ professional templates to choose from! You can customize colors, fonts, layouts, and add your personal branding. Would you like me to guide you to the template gallery?";
    }
    
    if (lowerMessage.includes('share') || lowerMessage.includes('qr')) {
      return "You can share your digital card in multiple ways: QR code, direct link, email, social media, or even embed it on your website. Each card gets a unique URL that's easy to share!";
    }
    
    if (lowerMessage.includes('edit') || lowerMessage.includes('update')) {
      return "You can edit your digital card anytime! Just go to your dashboard, select the card you want to modify, and make changes. Updates are reflected immediately on your shared links.";
    }
    
    if (lowerMessage.includes('analytics') || lowerMessage.includes('track')) {
      return "With our premium plans, you get detailed analytics including views, clicks, contact saves, and engagement metrics. Perfect for tracking your networking success!";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I'm here to help! You can ask me about creating cards, pricing, features, sharing options, or anything else. What specific aspect would you like to know more about?";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
      return "For additional support, you can reach our team at support@digitalcards.com or use the contact form in the app. We typically respond within 24 hours!";
    }
    
    // Default responses
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AIChatBot;
