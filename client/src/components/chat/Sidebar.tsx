import { useState } from "react";
import { Code, Video, Image, MessageCircle, Upload, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportConversation } from "@/lib/chat-api";
import { useToast } from "@/hooks/use-toast";
import type { Conversation } from "@shared/schema";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onFileUpload: () => void;
  completedTasks: number;
  activeTasks: number;
}

const categories = [
  { id: "website", label: "Website Editing", icon: Code, color: "primary" },
  { id: "video", label: "Video Editing", icon: Video, color: "accent" },
  { id: "graphics", label: "Graphics Creation", icon: Image, color: "success" },
  { id: "general", label: "General Assistant", icon: MessageCircle, color: "gray" },
];

export function Sidebar({
  conversations,
  currentConversationId,
  selectedCategory,
  onCategorySelect,
  onConversationSelect,
  onNewConversation,
  onFileUpload,
  completedTasks,
  activeTasks,
}: SidebarProps) {
  const { toast } = useToast();

  const handleExportConversation = async (conversationId: string) => {
    try {
      await exportConversation(conversationId);
      toast({
        title: "Success",
        description: "Conversation exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export conversation.",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    if (!categoryData) return MessageCircle;
    return categoryData.icon;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    if (!categoryData) return "gray";
    return categoryData.color;
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Task Categories */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Task Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewConversation}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            New Chat
          </Button>
        </div>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{category.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Task Stats */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">{completedTasks} Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 dark:text-gray-400">{activeTasks} Active</span>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Conversations</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </Button>
          </div>
          
          <div className="space-y-3">
            {conversations.slice(0, 10).map((conversation) => {
              const Icon = getCategoryIcon(conversation.category);
              const isSelected = currentConversationId === conversation.id;
              
              return (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700"
                      : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      conversation.category === "website" ? "bg-primary-500" :
                      conversation.category === "video" ? "bg-accent-500" :
                      conversation.category === "graphics" ? "bg-success" :
                      "bg-gray-500"
                    }`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTimestamp(conversation.updatedAt!)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a new chat to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onFileUpload}
            className="flex items-center justify-center space-x-2 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => currentConversationId && handleExportConversation(currentConversationId)}
            disabled={!currentConversationId}
            className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
