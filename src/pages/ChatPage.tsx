import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BotMessageSquare, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  // Removed sources?: { url: string; title: string }[];
  // Removed followUpQuestions?: string[];
}

const ChatPage = () => {
  const { role } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage: Message = { text: currentInput, sender: 'user' };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    // --- API INTEGRATION POINT ---
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const botMessage: Message = {
        text: `This is a simulated response to: "${currentInput}" (Role: ${
          role || 'unknown'
        }).`, // Simplified bot response
        sender: 'bot',
        // Removed sources and followUpQuestions from simulated response
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Failed to fetch chat response:', error);
      const errorMessage: Message = {
        text: "Sorry, I couldn't get a response. Please try again.",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col bg-muted/40">
      {/* Main chat content area */}
      <ScrollArea className="flex-1 p-4 md:p-6 pb-28" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <BotMessageSquare className="h-20 w-20 mb-6 text-primary/50" />
            <h2 className="text-3xl font-bold mb-3">Chatbot Ready</h2>
            <p className="text-lg text-muted-foreground max-w-md mt-2">
              Ask me anything or start by uploading knowledge.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="border w-9 h-9 flex-shrink-0">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[75%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.text}
                  </p>
                  {/* Removed message.sources rendering */}
                  {/* Removed message.followUpQuestions rendering */}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="border w-9 h-9 flex-shrink-0">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="border w-9 h-9">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-card border">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Fixed input area at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-background/95 backdrop-blur-sm md:left-64">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-end p-3"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="min-h-[3rem] max-h-[10rem] resize-none pr-12 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base overflow-y-auto"
              disabled={isLoading}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-3 right-3 h-8 w-8 rounded-full"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;