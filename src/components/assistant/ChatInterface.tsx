import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your friendly AI assistant. I'm here to help you with questions, have a chat, brainstorm ideas, or just keep you company. What's on your mind today? 😊",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      const greetings = [
        "Hello there! 👋 I'm excited to chat with you today. What's on your mind?",
        "Hi! Great to see you here. I'm ready to help with whatever you need - questions, conversations, or just a friendly chat!",
        "Hey! 😊 Thanks for stopping by. I'm here and happy to assist you with anything you'd like to discuss."
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // How are you responses
    if (message.includes("how are you") || message.includes("how do you do")) {
      return "I'm doing great, thank you for asking! 😊 I'm here, energized, and ready to help. How are you doing today?";
    }

    // Weather queries
    if (message.includes("weather")) {
      return "I don't have access to real-time weather data, but I'd love to help you think about weather-related topics! You might want to check your local weather app for current conditions. Is there something specific about weather you're curious about?";
    }

    // Help requests
    if (message.includes("help") || message.includes("assist") || message.includes("support")) {
      return "I'm absolutely here to help! 🤝 I can assist with answering questions, explaining concepts, brainstorming ideas, having conversations, or just being a friendly companion. What would you like to explore together?";
    }

    // Thank you responses
    if (message.includes("thank") || message.includes("thanks")) {
      return "You're very welcome! 😊 I'm happy I could help. Is there anything else you'd like to discuss or explore?";
    }

    // Questions about the AI
    if (message.includes("what are you") || message.includes("who are you")) {
      return "I'm your friendly AI assistant! Think of me as a helpful companion who's here to chat, answer questions, help you think through problems, or just have interesting conversations. I aim to be helpful, harmless, and honest in all our interactions. What would you like to know about me?";
    }

    // Capabilities questions
    if (message.includes("what can you do") || message.includes("capabilities")) {
      return "I can help with lots of things! 🌟 I can answer questions, explain complex topics, help with creative writing, brainstorm solutions, have philosophical discussions, assist with learning, or just chat about whatever interests you. I'm here to be genuinely helpful. What sounds interesting to you?";
    }

    // Conversation starters and general responses
    const thoughtfulResponses = [
      "That's a fascinating topic! I'd love to dive deeper into that with you. What aspects interest you most?",
      "Interesting perspective! I enjoy exploring ideas like this. Tell me more about your thoughts on this.",
      "That's something I find really engaging to discuss. What drew you to thinking about this?",
      "Great question! Let me share some thoughts on that, and I'd love to hear your perspective too.",
      "I appreciate you bringing this up! It's the kind of topic that can lead to really meaningful conversations.",
      "That's wonderful to explore! I think there are several interesting angles we could look at this from.",
      "I'm genuinely curious about your take on this! What's your experience been with this kind of thing?",
      "That strikes me as really important to think about. What's been on your mind about this lately?",
    ];
    
    return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(input),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-surface">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center space-y-0 py-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Chat Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 p-4">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                    : 'bg-card border glass-effect'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                
                {message.isUser && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card border glass-effect px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <Card className="rounded-none border-x-0 border-b-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              variant="premium"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};