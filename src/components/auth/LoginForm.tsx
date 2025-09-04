import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "./AuthCard";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any credentials
    const storedUsers = JSON.parse(localStorage.getItem('ai_assistant_users') || '{}');
    const user = storedUsers[username];
    
    if (!user || user.password !== password) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    localStorage.setItem('ai_assistant_current_user', username);
    toast({
      title: "Welcome Back!",
      description: "Successfully logged in to your AI Assistant.",
    });
    
    setIsLoading(false);
    onSuccess();
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your AI Assistant account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username or Email</Label>
          <Input
            id="username"
            placeholder="Enter your username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          variant="premium"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:text-primary-glow transition-colors font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};