import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, ArrowUp, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import animationDocument from '../../public/animation.json';
import Lottie from 'lottie-react';
import CodeBlock from '@/components/CodeBlock'; // Import the new CodeBlock component
import { toast } from 'sonner'; // Import toast for notifications

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const EMPLOYEE_CHAT_HISTORY_KEY = 'employeeChatHistory';

// Helper function to render text with newlines and code blocks
const renderTextWithNewlinesAndCode = (text: string) => {
  const parts = text.split('```');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // This is a code block
      const lines = part.split('\n');
      let language = 'plaintext';
      let codeContent = part;

      // Check if the first line specifies a language
      if (lines.length > 0 && lines[0].trim().length > 0 && !lines[0].includes(' ')) {
        // If the first line is a single word (e.g., 'javascript'), treat it as the language
        language = lines[0].trim();
        codeContent = lines.slice(1).join('\n'); // Remove the first line (language)
      } else {
        // If no language is specified, the entire part is code
        codeContent = part;
      }

      return (
        <CodeBlock key={index} code={codeContent.trim()} language={language} />
      );
    } else {
      // This is regular text, handle newlines
      return part.split('\n').map((line, lineIndex) => (
        <p
          key={`${index}-${lineIndex}`}
          className={lineIndex > 0 ? 'mt-2' : ''}
        >
          {line}
        </p>
      ));
    }
  });
};

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

  // Load messages from local storage on component mount for employees
  useEffect(() => {
    if (role === 'employee') {
      try {
        const storedMessages = localStorage.getItem(EMPLOYEE_CHAT_HISTORY_KEY);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error("Failed to load chat history from local storage:", error);
        toast.error("Failed to load chat history.");
      }
    } else {
      // Clear messages if not an employee (e.g., guest or logged out)
      setMessages([]);
    }
  }, [role]);

  // Save messages to local storage whenever messages state changes for employees
  useEffect(() => {
    if (role === 'employee' && messages.length > 0) {
      try {
        localStorage.setItem(EMPLOYEE_CHAT_HISTORY_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save chat history to local storage:", error);
        toast.error("Failed to save chat history.");
      }
    } else if (role === 'employee' && messages.length === 0) {
      // If messages become empty for an employee, clear local storage
      localStorage.removeItem(EMPLOYEE_CHAT_HISTORY_KEY);
    }
  }, [messages, role]);

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

    try {
      const response = await fetch(
        'https://lsryw4rfx7.execute-api.ap-south-1.amazonaws.com/bot-api-gateway-stage/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: role || 'guest', // Send the actual role or 'guest' if null
            query: newMessage.text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Extract the output.text from the API response
      const botResponseText = data.output?.text || 'No response from bot.';

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: botResponseText,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to API:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, I could not get a response. Please try again.',
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

  const handleClearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(EMPLOYEE_CHAT_HISTORY_KEY);
    toast.info("Chat history cleared!");
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 pb-[120px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mt-20 mb-6">
              <Lottie
                animationData={animationDocument}
                style={{ height: 100, width: 100 }}
              />
            </div>
            <h1
              className="text-4xl font-light text-gray-700 dark:text-gray-300 mb-6"
              style={{ letterSpacing: '-2.3px' }}
            >
              How can we{' '}
              <span className="text-4xl font-light bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                assist
              </span>{' '}
              you today?
            </h1>
            <div className="mb-8 ">
              <p
                className="text-sm text-muted-foreground"
                style={{ letterSpacing: '-0.2px' }}
              >
                Instantly get clear answers to questions about how things work,
                how to set them up,
                <br />
                or how to resolve issues—no matter if it’s about an API, a step
                in your workflow, or a tricky system configuration.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors flex flex-col items-start text-left"
                onClick={() =>
                  handleCardClick('What are the latest product updates?')
                }
              >
                <p className="font-medium text-lg mb-1">
                  Latest Product Updates
                </p>
                <p className="text-sm text-muted-foreground">
                  Discover new features and improvements.
                </p>
              </div>
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors flex flex-col items-start text-left"
                onClick={() => handleCardClick('How do I reset my password?')}
              >
                <p className="font-medium text-lg mb-1">Password Reset Guide</p>
                <p className="text-sm text-muted-foreground">
                  Step-by-step instructions for account recovery.
                </p>
              </div>
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors flex flex-col items-start text-left"
                onClick={() =>
                  handleCardClick('Where can I find the user manual?')
                }
              >
                <p className="font-medium text-lg mb-1">User Manual Location</p>
                <p className="text-sm text-muted-foreground">
                  Find comprehensive guides and documentation.
                </p>
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
                  {renderTextWithNewlinesAndCode(message.text)}
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
        {role === 'employee' && messages.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear Chat History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;