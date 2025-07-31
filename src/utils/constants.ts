export const EMPLOYEE_CHAT_HISTORY_KEY = 'employeeChatHistory'; // Keep for reference, but will use dynamic key
export const getChatHistoryKey = (email: string) => `chatHistory_${email}`;