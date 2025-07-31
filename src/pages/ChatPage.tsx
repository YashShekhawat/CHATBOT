import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, ArrowUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { role } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API call
    // TODO: Replace with actual backend API call
    try {
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          const botResponse = `Echoing "${newMessage.text}". Your role is: ${role || 'unknown'}.`;
          resolve(botResponse);
        }, 1000);
      });

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: response,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error simulating API call:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 pb-[120px]"> {/* Added pb-[120px] */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
              How can we assist you today?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors flex flex-col items-start text-left"
                onClick={() => handleCardClick("What are the latest product updates?")}
              >
                <p className="font-medium text-lg mb-1">Latest Product Updates</p>
                <p className="text-sm text-muted-foreground">Discover new features and improvements.</p>
              </div>
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors flex flex-col items-start text-left"
                onClick={() => handleCardClick("How do I reset my password?")}
              >
                <p className="font-medium text-lg mb-1">Password Reset Guide</p>
                <p className="text-sm text-muted-foreground">Step-by-step instructions for account recovery.</p>
              </div>
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors flex flex-col items-start text-left"
                onClick={() => handleCardClick("Where can I find the user manual?")}
              >
                <p className="font-medium text-lg mb-1">User Manual Location</p>
                <p className="text-sm text-muted-foreground">Find comprehensive guides and documentation.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-bot.jpg" />
                    <AvatarFallback>
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start items-center gap-3 mt-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-bot.jpg" />
              <AvatarFallback>
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[70%] p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none">
              <p>Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 md:left-64">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-lg">
          <form
            onSubmit={handleSendMessage}
            className="relative flex items-end p-3"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="min-h-[4rem] max-h-[10rem] resize-none pr-12 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base overflow-y-auto"
              disabled={isLoading}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 right-3 h-8 w-8 rounded-full"
              disabled={isLoading || !input.trim()}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;