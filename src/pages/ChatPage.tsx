import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage: Message = { text: currentInput, sender: "user" };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Integrate POST /api/chat here
    try {
      // Example API call:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: currentInput }),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();
      // const botMessage: Message = { text: data.reply, sender: 'bot' };

      // Simulating network delay for demonstration
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
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-screen bg-white dark:bg-gray-950 rounded-lg border">
      <div className="flex-1 p-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Start a conversation</h2>
              <p className="text-muted-foreground">
                Ask me anything or start by uploading knowledge.
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    message.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="border">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-xl shadow-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="border">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="border">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="p-4 border-t">
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
            placeholder="Type your message..."
            className="pr-12 h-10"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;