import { useState, useRef } from "react";
import { X, Upload, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function FileUploadModal({ isOpen, onClose, onFileUpload, isUploading }: FileUploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await onFileUpload(file);
      toast({
        title: "Success",
        description: `${file.name} has been uploaded and analyzed.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Files</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
          
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragOver
                ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={openFileDialog}
          >
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {isUploading ? "Uploading..." : "Drop files here or click to browse"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Supports: Images, Videos, HTML, CSS, JS
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*,.html,.css,.js,.json,.txt"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>

          {/* File Type Options */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex items-center space-x-2 p-3 h-auto"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "image/*";
                  fileInputRef.current.click();
                }
              }}
              disabled={isUploading}
            >
              <Image className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Images</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 p-3 h-auto"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = ".html,.css,.js,.json,.txt";
                  fileInputRef.current.click();
                }
              }}
              disabled={isUploading}
            >
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Code Files</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
