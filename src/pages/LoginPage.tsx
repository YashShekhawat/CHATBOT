import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { BotMessageSquare } from 'lucide-react';
// Removed import for RotatingGlowBorder

const LoginPage = () => {
  const { loginAsGuest, loginAsEmployee } = useAuth();
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmployeeLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsEmployee(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full rounded-xl overflow-hidden"> {/* Removed max-w-6xl and shadow-xl */}
        {/* Left Section: Login Form */}
        <div className="bg-background p-8 md:p-12 flex flex-col justify-center items-center text-center md:text-left">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <BotMessageSquare className="h-16 w-16 mx-auto md:mx-0 mb-4 text-primary" />
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
                Your ideas, amplified
              </h1>
              <p className="text-lg text-muted-foreground">
                Privacy-first AI that helps you create in confidence.
              </p>
            </div>

            <Card className="w-full shadow-none border-none bg-transparent">
              <CardContent className="space-y-6 p-0">
                {!showEmployeeForm ? (
                  <div className="space-y-4">
                    <Button onClick={loginAsGuest} className="w-full py-6 text-lg">
                      Continue as Guest
                    </Button>
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="flex-shrink mx-4 text-gray-500">OR</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <Button
                      onClick={() => setShowEmployeeForm(true)}
                      variant="outline"
                      className="w-full py-6 text-lg"
                    >
                      Login as Employee
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleEmployeeLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowEmployeeForm(false)}
                      className="w-full"
                    >
                      Back to options
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Section: Image/Visual */}
        <div className="bg-muted/20 p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-full">
          <div className="bg-card p-6 rounded-lg shadow-xl flex flex-col items-center justify-center text-center">
            <img
              src="https://via.placeholder.com/400x300/F0F0F0/333333?text=Your+Image+Here" // Placeholder image
              alt="Visual representation"
              className="max-w-full h-auto rounded-md mb-4"
            />
            <p className="text-lg font-semibold text-foreground">
              Visualize your data with AI
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload an image to see how AI can enhance your experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;