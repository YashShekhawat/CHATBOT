import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, ArrowUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChatHistory } from '@/context/ChatHistoryContext';
import animationDocument from '../../public/animation.json';
import Lottie from 'lottie-react';
import CodeBlock from '@/components/CodeBlock';
import { toast } from 'sonner';
import { getChatHistoryKey } from '@/utils/constants'; // Import the new helper

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ConversationTurn {
  id: string; // Unique ID for the turn
  userMessage: Message;
  botMessage?: Message; // Optional, as bot response might be pending
}

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
      if (
        lines.length > 0 &&
        lines[0].trim().length > 0 &&
        !lines[0].includes(' ')
      ) {
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
          style={{ letterSpacing: '-0.1px' }}
        >
          {line}
        </p>
      ));
    }
  });
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ConversationTurn[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { role, userEmail } = useAuth();
  const { clearHistoryTrigger } = useChatHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages from local storage on component mount for employees
  useEffect(() => {
    if (role === 'employee' && userEmail) {
      const historyKey = getChatHistoryKey(userEmail);
      try {
        const storedMessages = localStorage.getItem(historyKey);
        if (storedMessages) {
          const parsedMessages: Message[] | ConversationTurn[] =
            JSON.parse(storedMessages);

          // Check if it's the old Message[] format and convert
          if (parsedMessages.length > 0 && 'sender' in parsedMessages[0]) {
            const convertedTurns: ConversationTurn[] = [];
            for (let i = 0; i < parsedMessages.length; i++) {
              const msg = parsedMessages[i] as Message;
              if (msg.sender === 'user') {
                const nextMsg = parsedMessages[i + 1] as Message;
                if (nextMsg && nextMsg.sender === 'bot') {
                  convertedTurns.push({
                    id: msg.id,
                    userMessage: msg,
                    botMessage: nextMsg,
                  });
                  i++; // Skip the bot message as it's now part of the turn
                } else {
                  // User message without a bot response (e.g., last message)
                  convertedTurns.push({
                    id: msg.id,
                    userMessage: msg,
                  });
                }
              }
            }
            setMessages(convertedTurns);
          } else {
            // It's already the new ConversationTurn[] format
            setMessages(parsedMessages as ConversationTurn[]);
          }
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to load chat history from local storage:', error);
        toast.error('Failed to load chat history.');
      }
    } else {
      // Clear messages if not an employee or no userEmail (e.g., guest or logged out)
      setMessages([]);
    }
  }, [role, userEmail, clearHistoryTrigger]);

  // Save messages to local storage whenever messages state changes for employees
  useEffect(() => {
    if (role === 'employee' && userEmail) {
      const historyKey = getChatHistoryKey(userEmail);
      try {
        if (messages.length > 0) {
          localStorage.setItem(historyKey, JSON.stringify(messages));
        } else {
          // If messages become empty for an employee, clear local storage
          localStorage.removeItem(historyKey);
        }
      } catch (error) {
        console.error('Failed to save chat history to local storage:', error);
        toast.error('Failed to save chat history.');
      }
    }
  }, [messages, role, userEmail]);

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

    const userMsgId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMsgId,
      text: input,
      sender: 'user',
    };

    // Create a new conversation turn
    const newTurn: ConversationTurn = {
      id: userMsgId, // Use user message ID for turn ID
      userMessage: newUserMessage,
      botMessage: undefined, // Bot message will be added later
    };

    setMessages((prevMessages) => [...prevMessages, newTurn]);
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
            query: newUserMessage.text, // Send the user's query
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponseText = data.output?.text || 'No response from bot.';

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: botResponseText,
        sender: 'bot',
      };

      // Update the last conversation turn with the bot message
      setMessages((prevMessages) =>
        prevMessages.map((turn) =>
          turn.id === userMsgId ? { ...turn, botMessage: botMessage } : turn
        )
      );
    } catch (error) {
      console.error('Error sending message to API:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, I could not get a response. Please try again.',
        sender: 'bot',
      };
      setMessages((prevMessages) =>
        prevMessages.map((turn) =>
          turn.id === userMsgId ? { ...turn, botMessage: errorMessage } : turn
        )
      );
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
      <ScrollArea className="flex-1 pb-[120px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mt-20 mb-6">
              <Lottie
                animationData={animationDocument}
                style={{ height: 100, width: 100 }}
              />
            </div>
            <div className="max-w-3xl mx-auto">
              {' '}
              {/* Added max-w and mx-auto */}
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
                  Instantly get clear answers to questions about how things
                  work, how to set them up,
                  <br />
                  or how to resolve issues—no matter if it’s about an API, a
                  step in your workflow, or a tricky system configuration.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
                  <p className="font-medium text-lg mb-1">
                    Password Reset Guide
                  </p>
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
                  <p className="font-medium text-lg mb-1">
                    User Manual Location
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Find comprehensive guides and documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 p-4 max-w-4xl mx-auto">
            {' '}
            {/* Added max-w-4xl and mx-auto */}
            {messages.map((turn) => (
              <div key={turn.id} className="relative">
                {/* User Question - Sticky Header */}
                <div className="sticky top-0 z-10 bg-background py-4 px-4 border-b border-border">
                  {' '}
                  {/* Adjusted padding */}
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p
                        className="text-xl font-medium leading-relaxed"
                        style={{ letterSpacing: '-0.4px' }}
                      >
                        {renderTextWithNewlinesAndCode(turn.userMessage.text)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bot Answer Section */}
                {turn.botMessage && (
                  <div className="mt-4 pl-11">
                    {' '}
                    {/* Indent bot response by 11 units (avatar width + gap) */}
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Answer
                      </span>
                    </div>
                    <div className="p-3 rounded-lg text-foreground">
                      {' '}
                      {/* Removed bg-muted, changed text color */}
                      {renderTextWithNewlinesAndCode(turn.botMessage.text)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start items-center gap-3 mt-4 p-4 max-w-4xl mx-auto">
            <div className="w-12 h-12 flex items-center justify-center">
              <Lottie
                animationData={animationDocument}
                style={{ height: 200, width: 100 }}
              />
            </div>
            <div className="text-base max-w-[80%] p-3">
              <p>Thinking...</p>
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
