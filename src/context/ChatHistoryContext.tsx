import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ChatHistoryContextType {
  clearHistoryTrigger: number;
  triggerClearChatHistory: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [clearHistoryTrigger, setClearHistoryTrigger] = useState(0);

  const triggerClearChatHistory = useCallback(() => {
    setClearHistoryTrigger(prev => prev + 1);
  }, []);

  return (
    <ChatHistoryContext.Provider value={{ clearHistoryTrigger, triggerClearChatHistory }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};