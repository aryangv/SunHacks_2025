'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, X } from 'lucide-react';
import { useState } from 'react';

interface ResultsDisplayProps {
  title: string;
  content: string;
  onClose: () => void;
  type: 'notes' | 'flashcards' | 'resources';
}

export function ResultsDisplay({ title, content, onClose, type }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (type === 'flashcards') {
      try {
        const flashcards = JSON.parse(content);
        return (
          <div className="space-y-4">
            {flashcards.map((card: any, index: number) => (
              <Card key={index} className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Card {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">Front:</h4>
                    <p className="text-gray-300">{card.front}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Back:</h4>
                    <p className="text-gray-300">{card.back}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      } catch (error) {
        return <pre className="whitespace-pre-wrap text-gray-300">{content}</pre>;
      }
    }

    return <pre className="whitespace-pre-wrap text-gray-300">{content}</pre>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
