import { useEffect, useRef } from "react";
import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./CodeBlock";
import type { Message } from "@shared/schema";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    const metadata = message.metadata as any;

    return (
      <div
        key={message.id}
        className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">You</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 max-w-3xl ${isUser ? "ml-auto" : ""}`}>
          <div
            className={`rounded-2xl p-4 ${
              isUser
                ? "bg-primary-500 text-white rounded-tr-sm"
                : "bg-gray-50 dark:bg-gray-700 rounded-tl-sm"
            }`}
          >
            <div className={`flex items-center space-x-2 mb-2 ${isUser ? "justify-end" : ""}`}>
              {!isUser && metadata?.category && (
                <Badge variant="secondary" className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
                  {metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1)}
                </Badge>
              )}
              <span className={`font-semibold ${isUser ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {isUser ? "You" : "Nile"}
              </span>
              <span className={`text-xs ${isUser ? "text-primary-100" : "text-gray-500 dark:text-gray-400"}`}>
                {formatTimestamp(message.createdAt!)}
              </span>
            </div>
            
            <div className={`prose prose-sm max-w-none ${isUser ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
              {message.content.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Code Blocks */}
          {!isUser && metadata?.codeBlocks && metadata.codeBlocks.length > 0 && (
            <div className="mt-4 space-y-4">
              {metadata.codeBlocks.map((codeBlock: any, index: number) => (
                <CodeBlock
                  key={index}
                  language={codeBlock.language}
                  code={codeBlock.code}
                  filename={codeBlock.filename}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-2xl rounded-tl-sm p-4 max-w-3xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Nile</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">just now</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              👋 Hello! I'm Nile, your AI creative assistant. I can help you with:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">Website Editing</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  HTML/CSS code generation, responsive design, accessibility improvements
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">Video Editing</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Cutting techniques, transitions, color grading, workflow optimization
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Try asking me something like "Create a responsive navigation bar" or "How do I add smooth transitions to my video?"
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map(renderMessage)}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl rounded-tl-sm p-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 dark:text-white">Nile</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">typing...</span>
            </div>
            <div className="flex items-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
