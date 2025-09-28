"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

export default function NotesDisplayPage() {
  const [generatedNotes, setGeneratedNotes] = useState(`
# Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that focuses on the development of algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience.

## Key Concepts

### Supervised Learning
- Uses labeled training data
- Common algorithms: Linear Regression, Decision Trees, Random Forest
- Applications: Classification and regression problems

### Unsupervised Learning  
- Works with unlabeled data
- Common algorithms: K-means clustering, PCA
- Applications: Pattern recognition, data mining

### Deep Learning
- Uses neural networks with multiple layers
- Excellent for image recognition, natural language processing
- Requires large amounts of data and computational power

## Applications
- Image recognition and computer vision
- Natural language processing
- Recommendation systems
- Autonomous vehicles
- Medical diagnosis

## Getting Started
1. Learn Python programming fundamentals
2. Study statistics and linear algebra
3. Practice with datasets on Kaggle
4. Implement basic algorithms from scratch
5. Use libraries like scikit-learn and TensorFlow
  `)

  // Get notes from URL parameters or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const notesFromUrl = urlParams.get('notes')
    
    if (notesFromUrl) {
      setGeneratedNotes(decodeURIComponent(notesFromUrl))
    } else {
      // Try to get from localStorage as fallback
      const savedNotes = localStorage.getItem('generatedNotes')
      if (savedNotes) {
        // Ensure the notes are properly formatted as markdown
        let formattedNotes = savedNotes
        
        // Convert plain text to markdown format
        formattedNotes = formattedNotes
          // Convert numbered sections to headers
          .replace(/^(\d+\.\s+[A-Z][^:\n]*)/gm, '## $1')
          // Convert bullet points to proper markdown
          .replace(/^(\s*)[-*]\s+/gm, '$1- ')
          // Convert numbered lists to proper markdown
          .replace(/^(\s*)(\d+)\.\s+/gm, '$1$2. ')
          // Convert bold text patterns
          .replace(/\*\*([^*]+)\*\*/g, '**$1**')
          // Convert italic text patterns
          .replace(/\*([^*]+)\*/g, '*$1*')
          // Ensure proper line breaks
          .replace(/\n\n+/g, '\n\n')
          // Add proper spacing around headers
          .replace(/(\n)(##[^\n]+)/g, '$1\n$2')
          .replace(/(##[^\n]+)(\n)/g, '$1\n$2')
        
        // Always add markdown structure if none found
        if (!formattedNotes.includes('##') && !formattedNotes.includes('#')) {
          // Try to detect sections and convert them
          formattedNotes = formattedNotes
            .replace(/^([A-Z][^:\n]*:)/gm, '## $1')
            .replace(/^([A-Z][^.\n]*\.)/gm, '### $1')
          
          // If still no headers, add a main header
          if (!formattedNotes.includes('##') && !formattedNotes.includes('#')) {
            formattedNotes = '# Generated Notes\n\n' + formattedNotes
          }
        }
        
        console.log('Original notes:', savedNotes)
        console.log('Formatted notes:', formattedNotes)
        setGeneratedNotes(formattedNotes)
      }
    }
  }, [])

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedNotes], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "synapse-x-notes.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    URL.revokeObjectURL(element.href)
  }

  return (
    <div className="min-h-screen space-background text-white font-montserrat">
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto] gap-8 p-8">
        <header className="grid grid-cols-[auto_1fr] items-center pt-8">
          <Link
            href="/"
            className="bg-black/30 border border-gray-400 hover:border-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors backdrop-blur-sm"
          >
            SYNAPSE X
          </Link>

          <div className="text-center">
            <div className="bg-black/30 border border-gray-400 text-white font-bold py-3 px-8 rounded-xl backdrop-blur-sm inline-block">
              NOTES
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto w-full">
          <div className="bg-black/30 border border-gray-400 rounded-2xl p-8 backdrop-blur-sm min-h-96">
            <div className="bg-white/5 rounded-xl p-8 h-full">
              <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed font-montserrat">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-white border-b border-gray-600 pb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 text-white mt-8 border-b border-gray-700 pb-1">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-medium mb-3 text-white mt-6">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-lg font-medium mb-2 text-white mt-4">{children}</h4>,
                    p: ({ children }) => <p className="mb-4 text-gray-200 leading-relaxed">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-200 ml-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-200 ml-4">{children}</ol>
                    ),
                    li: ({ children }) => <li className="text-gray-200 leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-300 mb-4 bg-gray-800/30 py-2 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-800 px-2 py-1 rounded text-purple-300 font-mono text-sm">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-700">{children}</pre>
                    ),
                    hr: () => <hr className="border-gray-600 my-6" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-600 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 px-4 py-2 bg-gray-800 text-white font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 px-4 py-2 text-gray-200">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {generatedNotes}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </main>

        <footer className="flex justify-center">
          <button
            onClick={handleDownload}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            DOWNLOAD
          </button>
        </footer>
      </div>
    </div>
  )
}
