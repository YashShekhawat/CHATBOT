import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner'; // Import toast for notifications

const LoginPage = () => {
  const { loginAsGuest, loginAsEmployee } = useAuth();
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage loading/submitting

  const handleEmployeeLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    try {
      const response = await fetch(
        'https://lsryw4rfx7.execute-api.ap-south-1.amazonaws.com/bot-api-gateway-stage/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      // Assuming the API returns the email in the response, e.g., { success: true, email: "user@example.com" }
      // If the API response structure is different, adjust `data.email` accordingly.
      if (data.email) {
        loginAsEmployee(data.email); // Pass the email received from the API to AuthContext
      } else {
        // Fallback: if API doesn't return email, use the one entered by user
        loginAsEmployee(email);
      }
      // The loginAsEmployee function already handles navigation and success toast.
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="h-screen flex flex-col bg-muted/40">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-grow rounded-xl overflow-hidden">
        <div className="bg-background p-8 md:p-12 flex flex-col justify-center items-center text-center md:text-left h-full">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="mb-16">
                <img src="/public/logo.png" alt="" width="190px" />
              </div>
              <h1 className="text-5xl font-semibold tracking-tight leading-12  mb-2">
                Have Issues? <br />
                Ask our AI
              </h1>
              <p className="text-lg text-muted-foreground">
                Instant solutions, one question away.
              </p>
            </div>

            <Card className="w-full shadow-none border-none bg-transparent">
              <CardContent className="space-y-6 p-0">
                {!showEmployeeForm ? (
                  <div className="space-y-4">
                    <Button
                      onClick={loginAsGuest}
                      className="w-full py-6 text-lg"
                    >
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
                  <form
                    onSubmit={handleEmployeeLoginSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting} // Disable input during submission
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
                        disabled={isSubmitting} // Disable input during submission
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowEmployeeForm(false)}
                      className="w-full"
                      disabled={isSubmitting} // Disable button during submission
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
        <div className="bg-muted/20 p-8 md:p-12 flex items-center justify-center h-full">
          <div className="flex justify-center">
            <img
              src="/public/qwikchat.svg" // Placeholder image
              alt="Visual representation"
              width="80%"
              className="max-w-full h-auto rounded-md mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;