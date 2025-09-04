import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export const AuthCard = ({ title, description, children, className }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-md glass-effect shadow-premium border-0",
        "bg-gradient-to-br from-card/80 to-background/60",
        className
      )}>
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <div className="w-6 h-6 bg-primary-foreground rounded-md"></div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};