import { useState } from "react";
import { Settings, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useMessages } from "@/hooks/use-chat";

interface ChatAreaProps {
  conversationId: string | null;
  category: string;
  onSendMessage: (content: string) => void;
  onFileUpload: () => void;
  isLoading: boolean;
  isTyping: boolean;
}

export function ChatArea({
  conversationId,
  category,
  onSendMessage,
  onFileUpload,
  isLoading,
  isTyping,
}: ChatAreaProps) {
  const { data: messages = [], isLoading: isLoadingMessages } = useMessages(conversationId);

  const getCategoryTitle = (cat: string) => {
    const titles = {
      website: "Website Editing Assistant",
      video: "Video Editing Assistant", 
      graphics: "Graphics Design Assistant",
      general: "General Creative Assistant"
    };
    return titles[cat as keyof typeof titles] || "AI Assistant";
  };

  const getCategoryDescription = (cat: string) => {
    const descriptions = {
      website: "Ready to help with HTML, CSS, and design suggestions",
      video: "Expert guidance for video editing and production",
      graphics: "Creative assistance for design and visual projects", 
      general: "Helping with all your creative and technical needs"
    };
    return descriptions[cat as keyof typeof descriptions] || "How can I help you today?";
  };

  return (
    <main className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getCategoryTitle(category)}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getCategoryDescription(category)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">Online</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {isLoadingMessages ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading conversation...</p>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} isTyping={isTyping} />
      )}

      {/* Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onFileUpload={onFileUpload}
        isLoading={isLoading}
        category={category}
      />
    </main>
  );
}
