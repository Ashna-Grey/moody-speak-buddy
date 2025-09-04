import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ModeSelector } from "@/components/assistant/ModeSelector";
import { ChatInterface } from "@/components/assistant/ChatInterface";
import { VoiceInterface } from "@/components/assistant/VoiceInterface";

type Screen = "login" | "register" | "mode-select" | "chat" | "voice";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('ai_assistant_current_user');
    if (currentUser) {
      setCurrentScreen("mode-select");
    }
  }, []);

  const handleLogin = () => {
    setCurrentScreen("mode-select");
  };

  const handleRegister = () => {
    setCurrentScreen("mode-select");
  };

  const handleLogout = () => {
    localStorage.removeItem('ai_assistant_current_user');
    setCurrentScreen("login");
  };

  const handleSelectChat = () => {
    setCurrentScreen("chat");
  };

  const handleSelectVoice = () => {
    setCurrentScreen("voice");
  };

  const handleBackToModeSelect = () => {
    setCurrentScreen("mode-select");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <LoginForm
            onSuccess={handleLogin}
            onSwitchToRegister={() => setCurrentScreen("register")}
          />
        );
      case "register":
        return (
          <RegisterForm
            onSuccess={handleRegister}
            onSwitchToLogin={() => setCurrentScreen("login")}
          />
        );
      case "mode-select":
        return (
          <ModeSelector
            onSelectChat={handleSelectChat}
            onSelectVoice={handleSelectVoice}
            onLogout={handleLogout}
          />
        );
      case "chat":
        return <ChatInterface onBack={handleBackToModeSelect} />;
      case "voice":
        return <VoiceInterface onBack={handleBackToModeSelect} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {renderScreen()}
    </div>
  );
};

export default Index;
