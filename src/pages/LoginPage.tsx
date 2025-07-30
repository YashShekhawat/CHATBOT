import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { BotMessageSquare } from 'lucide-react';

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
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <BotMessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-3xl font-bold">Welcome to Chatbot AI</CardTitle>
          <CardDescription className="mt-2">
            Please choose how you'd like to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
  );
};

export default LoginPage;