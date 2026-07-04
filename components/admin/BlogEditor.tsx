'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => insertMarkdown('# ', '\n'),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      action: () => insertMarkdown('## ', '\n'),
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      action: () => insertMarkdown('### ', '\n'),
    },
    { type: 'divider' },
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertMarkdown('*', '*'),
    },
    {
      icon: Code,
      label: 'Inline Code',
      action: () => insertMarkdown('`', '`'),
    },
    { type: 'divider' },
    {
      icon: List,
      label: 'Bullet List',
      action: () => insertMarkdown('- ', '\n'),
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => insertMarkdown('1. ', '\n'),
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertMarkdown('> ', '\n'),
    },
    { type: 'divider' },
    {
      icon: LinkIcon,
      label: 'Link',
      action: () => insertMarkdown('[', '](url)'),
    },
    {
      icon: ImageIcon,
      label: 'Image',
      action: () => insertMarkdown('![alt text](', ')'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((button, index) => {
            if ('type' in button && button.type === 'divider') {
              return (
                <div
                  key={`divider-${index}`}
                  className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"
                />
              );
            }

            const Icon = button.icon!;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.label}
                className="h-8 w-8 p-0"
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <textarea
            id="blog-content"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your blog content here using Markdown..."
            className="w-full h-[500px] p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Markdown is supported. Use the toolbar buttons or type Markdown syntax directly.
          </p>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="w-full min-h-[500px] p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            {content ? (
              <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </article>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                Start writing to see the preview
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Markdown Guide */}
      <details className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
          Markdown Quick Reference
        </summary>
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <code># Heading 1</code>
              <br />
              <code>## Heading 2</code>
              <br />
              <code>### Heading 3</code>
            </div>
            <div>
              <code>**bold**</code>
              <br />
              <code>*italic*</code>
              <br />
              <code>`code`</code>
            </div>
            <div>
              <code>[link](url)</code>
              <br />
              <code>![image](url)</code>
            </div>
            <div>
              <code>- bullet list</code>
              <br />
              <code>1. numbered list</code>
              <br />
              <code>&gt; quote</code>
            </div>
          </div>
        </div>
      </details>
    </motion.div>
  );
}
