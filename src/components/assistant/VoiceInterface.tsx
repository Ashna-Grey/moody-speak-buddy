import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInterfaceProps {
  onBack: () => void;
}

export const VoiceInterface = ({ onBack }: VoiceInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setIsSupported(false);
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support voice recognition or speech synthesis.",
        variant: "destructive",
      });
      return;
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    synthRef.current = window.speechSynthesis;

    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);
      
      if (event.results[event.results.length - 1].isFinal) {
        handleVoiceInput(currentTranscript);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "There was an error with voice recognition. Please try again.",
        variant: "destructive",
      });
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [toast]); // Add toast to dependency array

  const generateVoiceResponse = (input: string): string => {
    // Sentiment-aware responses for demo
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('sad') || lowerInput.includes('upset') || lowerInput.includes('bad')) {
      return "I can hear that you might be feeling a bit down. I'm here to listen and help in any way I can. Would you like to talk about what's bothering you?";
    }
    
    if (lowerInput.includes('happy') || lowerInput.includes('great') || lowerInput.includes('amazing')) {
      return "That's wonderful! I can sense the positive energy in your voice. It's great to hear you're doing well!";
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello there! It's lovely to hear your voice. How are you feeling today?";
    }
    
    if (lowerInput.includes('weather')) {
      return "I don't have access to current weather data through voice, but I'd suggest checking your weather app for the most accurate forecast.";
    }
    
    if (lowerInput.includes('help')) {
      return "Of course! I'm your voice assistant and I'm here to help. You can speak naturally and I'll do my best to understand and respond. What would you like assistance with?";
    }
    
    const responses = [
      "That's interesting! I can sense the tone in your voice, and I appreciate you sharing that with me.",
      "I hear you clearly. Let me think about that for a moment...",
      "Your voice carries a lot of emotion. I want to make sure I understand you correctly.",
      "Thank you for speaking with me. I'm processing what you've said...",
      "I can hear the nuances in your voice. That helps me understand you better.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceInput = async (input: string) => {
    if (!input.trim()) return;

    const aiResponse = generateVoiceResponse(input);
    setResponse(aiResponse);
    
    // Speak the response
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      
      // Adjust voice parameters based on content sentiment
      const lowerResponse = aiResponse.toLowerCase();
      if (lowerResponse.includes('wonderful') || lowerResponse.includes('great')) {
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
      } else if (lowerResponse.includes('sorry') || lowerResponse.includes('down')) {
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
      } else {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    setTranscript("");
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
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
            <div className="w-10 h-10 rounded-lg bg-gradient-voice flex items-center justify-center">
              <Mic className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Voice Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready to listen"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        {/* Voice Visualization */}
        <div className="relative">
          <div className={`w-32 h-32 rounded-full bg-gradient-voice flex items-center justify-center shadow-voice transition-all duration-300 ${
            isListening ? 'voice-active scale-110' : isSpeaking ? 'animate-pulse scale-105' : ''
          }`}>
            {isListening ? (
              <MicOff className="w-12 h-12 text-accent-foreground" />
            ) : isSpeaking ? (
              <Volume2 className="w-12 h-12 text-accent-foreground" />
            ) : (
              <Mic className="w-12 h-12 text-accent-foreground" />
            )}
          </div>
          
          {/* Pulse rings for listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>

        {/* Status and Transcript */}
        <div className="text-center space-y-4 max-w-lg">
          {transcript && (
            <Card className="glass-effect border-0 bg-card/60">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">You said:</p>
                <p className="text-foreground">{transcript}</p>
              </CardContent>
            </Card>
          )}
          
          {response && (
            <Card className="glass-effect border-0 bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">AI Response:</p>
                <p className="text-foreground">{response}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          {!isListening ? (
            <Button
              onClick={startListening}
              variant="voice"
              size="lg"
              disabled={!isSupported}
              className="text-base px-8"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Listening
            </Button>
          ) : (
            <Button
              onClick={stopListening}
              variant="destructive"
              size="lg"
              className="text-base px-8"
            >
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </Button>
          )}
          
          {isSpeaking && (
            <Button
              onClick={stopSpeaking}
              variant="outline"
              size="lg"
              className="text-base px-8"
            >
              <VolumeX className="w-5 h-5 mr-2" />
              Stop Speaking
            </Button>
          )}
        </div>

        {/* Instructions */}
        {!isSupported ? (
          <Card className="glass-effect border-0 bg-destructive/10">
            <CardContent className="pt-4 text-center">
              <p className="text-destructive">
                Voice features are not supported in your browser. Please try using Chrome, Edge, or Safari.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-effect border-0 bg-card/40">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Click "Start Listening" and speak naturally. The AI will respond with mood-adaptive voice synthesis.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};