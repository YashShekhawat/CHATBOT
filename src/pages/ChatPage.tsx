import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotMessageSquare, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage: Message = { text: currentInput, sender: "user" };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Integrate POST /api/chat here
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const botMessage: Message = {
        text: `This is a simulated response to: "${currentInput}"`,
        sender: "bot",
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      const errorMessage: Message = {
        text: "Sorry, I couldn't get a response. Please try again.",
        sender: "bot",
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-4 h-full">
      <div className="flex flex-col h-full bg-card shadow-md rounded-xl">
        <div className="flex-1 p-6 overflow-y-auto" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <BotMessageSquare className="h-16 w-16 mb-4 text-primary/50" />
              <h2 className="text-2xl font-semibold">Chatbot Ready</h2>
              <p className="text-muted-foreground max-w-sm mt-2">
                Ask me anything or start by uploading knowledge.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 ${
                    message.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="border w-9 h-9">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-xl ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="border w-9 h-9">
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
                  <div className="rounded-lg p-3 bg-muted">
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
        </div>
        <div className="p-4 border-t bg-background/95 rounded-b-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="pr-12 h-12 text-base bg-card"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute top-1/2 right-3 -translate-y-1/2 h-8 w-8 rounded-full"
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