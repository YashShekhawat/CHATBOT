import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Corrected import path
import { Clipboard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const currentThemeStyle = theme === 'dark' ? atomOneDark : atomOneLight;

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy code.');
    });
  };

  return (
    <div className="relative my-2 rounded-md overflow-hidden">
      <SyntaxHighlighter
        language={language}
        style={currentThemeStyle}
        showLineNumbers={false}
        wrapLines={true}
        customStyle={{
          padding: '1rem',
          borderRadius: '0.375rem', // Tailwind 'rounded-md'
          backgroundColor: theme === 'dark' ? '#282c34' : '#f8f8f8', // Ensure background matches theme
          overflowX: 'auto',
        }}
      >
        {code}
      </SyntaxHighlighter>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 text-xs px-2 py-1 h-auto bg-background/50 backdrop-blur-sm hover:bg-background/70"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
};

export default CodeBlock;