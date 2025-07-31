import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clipboard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';

interface CodeBlockProps {
  code: string;
  language: string;
}

const normalizeLanguage = (lang: string) => {
  const map: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    html: 'markup',
    yml: 'yaml',
    md: 'markdown',
    json: 'json',
  };
  return map[lang?.toLowerCase()] || lang?.toLowerCase() || 'text';
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy code.');
      });
  };

  return (
    <div className="relative my-4 rounded-md overflow-hidden border border-border">
      <SyntaxHighlighter
        language="json"
        style={dracula}
        showLineNumbers={false}
        wrapLines={true}
        customStyle={{
          padding: '1rem',
          borderRadius: '0.5rem',
          background: '#1e1e1e', // background color to override theme background
          // Removed explicit color to allow Prism syntax coloring to take effect
          fontSize: '0.875rem',
          fontFamily: '"Fira Code", Menlo, Consolas, monospace',
          lineHeight: '1.6',
          overflowX: 'auto',
          margin: 0,
          // Optionally you can add boxShadow for nicer UI
          // boxShadow: '0 2px 8px rgba(0,0,0,0.7)'
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", Menlo, Consolas, monospace',
          },
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
        {copied ? (
          <Check className="h-4 w-4 mr-1" />
        ) : (
          <Clipboard className="h-4 w-4 mr-1" />
        )}
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
};

export default CodeBlock;
