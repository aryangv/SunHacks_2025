'use client';

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateFlashcards } from "@/lib/api-client";
import { processFile } from "@/lib/file-processor";
import { TextInputModal } from "@/components/text-input-modal";
import { Loader2 } from "lucide-react";

export default function FilesToFlashcardsPage() {
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const { text } = await processFile(file);
      const response = await generateFlashcards('', text);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Save flashcards to localStorage and navigate to display page
        localStorage.setItem('generatedFlashcards', JSON.stringify(response.data.flashcards));
        router.push('/flashcard-display');
      }
    } catch (err) {
      setError('Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateFlashcards(text);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Save flashcards to localStorage and navigate to display page
        localStorage.setItem('generatedFlashcards', JSON.stringify(response.data.flashcards));
        router.push('/flashcard-display');
      }
    } catch (err) {
      setError('Failed to generate flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        input.files = event.dataTransfer.files;
        handleFileUpload({ target: { files: [file] } } as any);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen space-background text-white font-lastica">
      <div className="min-h-screen grid grid-rows-[auto_1fr] gap-8 p-8">
        <header className="text-center pt-16">
          <Link href="/" className="inline-block mb-8 text-gray-300 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold tracking-wider mb-4 text-white">Files to Flashcards</h1>
          <p className="text-xl text-gray-300 font-light tracking-wide">
            Convert your files into interactive flashcards for better learning
          </p>
        </header>

        <main className="max-w-4xl mx-auto w-full">
          <div className="feature-card wave-pattern rounded-2xl p-12">
            <div className="grid grid-rows-[auto_1fr_auto] gap-8 min-h-96">
              <h2 className="text-3xl font-semibold text-white text-center">Create Flashcards</h2>

              <div className="place-self-center w-full max-w-md">
                <div 
                  className="border-2 border-dashed border-gray-400 rounded-xl p-12 text-center hover:border-gray-300 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 opacity-30 mx-auto mb-4"></div>
                  <p className="text-gray-300 text-lg mb-2">Drag and drop your files here</p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Flashcards'
                  )}
                </button>
                <button 
                  className="border border-gray-400 hover:border-gray-300 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  onClick={() => setIsTextModalOpen(true)}
                >
                  Input Text Instead
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TextInputModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        onSubmit={handleTextSubmit}
        title="Input Text for Flashcards"
        placeholder="Paste your text content here to generate interactive flashcards..."
        isLoading={isLoading}
      />
    </div>
  )
}

