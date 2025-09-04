import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mic, LogOut } from "lucide-react";

interface ModeSelectorProps {
  onSelectChat: () => void;
  onSelectVoice: () => void;
  onLogout: () => void;
}

export const ModeSelector = ({ onSelectChat, onSelectVoice, onLogout }: ModeSelectorProps) => {
  const currentUser = localStorage.getItem('ai_assistant_current_user');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome back, {currentUser}! Choose your interaction mode.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="glass-effect shadow-premium border-0 bg-gradient-to-br from-card/80 to-background/60 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-glow transition-all">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Chat Assistant</CardTitle>
              <CardDescription className="text-muted-foreground">
                Text-based conversation with intelligent responses
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Fast text-based interactions</li>
                <li>• Conversation memory</li>
                <li>• Intelligent responses</li>
                <li>• Perfect for detailed queries</li>
              </ul>
              <Button 
                onClick={onSelectChat}
                variant="premium"
                className="w-full"
              >
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect shadow-premium border-0 bg-gradient-to-br from-card/80 to-background/60 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:shadow-voice transition-all">
                <Mic className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Voice Assistant</CardTitle>
              <CardDescription className="text-muted-foreground">
                Natural voice conversations with mood adaptation
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Natural voice interactions</li>
                <li>• Mood-adaptive responses</li>
                <li>• Hands-free operation</li>
                <li>• Expressive voice output</li>
              </ul>
              <Button 
                onClick={onSelectVoice}
                variant="voice"
                className="w-full"
              >
                Start Voice Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="text-center pt-8">
          <Button 
            onClick={onLogout}
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};