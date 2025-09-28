"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

export default function FlashcardDisplayPage() {
  const [flashcards, setFlashcards] = useState([
    {
      question: "What is photosynthesis?",
      answer:
        "The process by which plants convert light energy into chemical energy using chlorophyll, carbon dioxide, and water to produce glucose and oxygen.",
    },
    {
      question: "What are the main components of a cell?",
      answer:
        "Cell membrane (controls what enters/exits), cytoplasm (gel-like substance), and nucleus (contains DNA and controls cell activities) in eukaryotic cells.",
    },
    {
      question: "What is the difference between mitosis and meiosis?",
      answer:
        "Mitosis produces two identical diploid cells for growth and repair, while meiosis produces four genetically diverse haploid gametes for reproduction.",
    },
    {
      question: "What is Newton's First Law of Motion?",
      answer:
        "An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an unbalanced external force.",
    },
    {
      question: "What is the chemical formula for water?",
      answer:
        "H2O - consisting of two hydrogen atoms covalently bonded to one oxygen atom, forming a polar molecule essential for life.",
    },
  ])

  // Load flashcards from localStorage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('generatedFlashcards')
    if (savedFlashcards) {
      try {
        const parsedFlashcards = JSON.parse(savedFlashcards)
        // Convert API format (front/back) to display format (question/answer)
        const convertedFlashcards = parsedFlashcards.map((card: any) => ({
          question: card.question || card.front || 'Question',
          answer: card.answer || card.back || 'Answer'
        }))
        setFlashcards(convertedFlashcards)
      } catch (error) {
        console.error('Error parsing flashcards from localStorage:', error)
      }
    }
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false) // Reset answer visibility when changing cards
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false) // Reset answer visibility when changing cards
    }
  }

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const handleDownload = () => {
    const flashcardContent = `SYNAPSE X - Generated Flashcards\n\n${flashcards
      .map((card, index) => `Question ${index + 1}: ${card.question}\nAnswer: ${card.answer}\n`)
      .join("\n")}`

    const blob = new Blob([flashcardContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "synapse-x-flashcards.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  return (
    <div className="min-h-screen space-background text-white font-montserrat">
      <div className="min-h-screen grid grid-rows-[auto_1fr] gap-8 p-8">
        <header className="text-center pt-8">
          <div className="grid grid-cols-3 items-center max-w-6xl mx-auto">
            <div className="justify-self-start">
              <Link
                href="/"
                className="inline-block bg-black/30 border-2 border-gray-400 hover:border-gray-300 text-white font-bold py-3 px-8 rounded-xl transition-colors backdrop-blur-sm"
              >
                SYNAPSE X
              </Link>
            </div>
            <div className="justify-self-center">
              <h1 className="bg-black/30 border-2 border-gray-400 text-white font-bold py-3 px-12 rounded-xl backdrop-blur-sm text-2xl tracking-wider">
                FLASHCARD
              </h1>
            </div>
            <div></div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto w-full">
          <div className="grid grid-rows-[1fr_auto] gap-8 min-h-[600px]">
            <div className="bg-black/30 border-2 border-gray-400 rounded-2xl p-8 backdrop-blur-sm">
              <div className="h-full grid place-items-center">
                <div className="w-full max-w-4xl">
                  <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-400/30 rounded-xl p-8 mb-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-purple-300 mb-2">
                        Question {currentIndex + 1} of {flashcards.length}
                      </h2>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-semibold text-white mb-8 min-h-[100px] flex items-center justify-center">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-3xl font-semibold text-white">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-2xl font-semibold text-white">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-semibold text-white">{children}</h3>,
                            p: ({ children }) => <p className="text-3xl font-semibold text-white">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-white">{children}</em>,
                            code: ({ children }) => (
                              <span className="text-purple-300 font-medium">
                                {children}
                              </span>
                            ),
                            pre: ({ children }) => (
                              <div className="hidden">
                                {children}
                              </div>
                            ),
                          }}
                        >
                          {currentCard.question}
                        </ReactMarkdown>
                      </div>

                      {showAnswer && (
                        <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-6 mb-6">
                          <div className="text-green-200 text-lg leading-relaxed">
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-green-100">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-green-100">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-green-100">{children}</h3>,
                                p: ({ children }) => <p className="mb-3 text-green-200 leading-relaxed">{children}</p>,
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside mb-3 space-y-1 text-green-200 ml-4">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-inside mb-3 space-y-1 text-green-200 ml-4">{children}</ol>
                                ),
                                li: ({ children }) => <li className="text-green-200 leading-relaxed">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-green-100">{children}</strong>,
                                em: ({ children }) => <em className="italic text-green-300">{children}</em>,
                                code: ({ children }) => (
                                  <span className="text-green-300 font-medium">
                                    {children}
                                  </span>
                                ),
                                pre: ({ children }) => (
                                  <div className="hidden">
                                    {children}
                                  </div>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-green-400 pl-4 italic text-green-300 mb-3 bg-green-800/20 py-2 rounded-r">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {currentCard.answer}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={toggleAnswer}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mb-4"
                      >
                        {showAnswer ? "Hide Answer" : "Show Answer"}
                      </button>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <button
                          onClick={goToPrevious}
                          disabled={currentIndex === 0}
                          className={`font-semibold py-2 px-6 rounded-lg transition-colors ${
                            currentIndex === 0
                              ? "border border-gray-600 text-gray-600 cursor-not-allowed"
                              : "border border-gray-400 hover:border-gray-300 text-gray-300 hover:text-white"
                          }`}
                        >
                          Previous
                        </button>
                        <button
                          onClick={goToNext}
                          disabled={currentIndex === flashcards.length - 1}
                          className={`font-semibold py-2 px-6 rounded-lg transition-colors ${
                            currentIndex === flashcards.length - 1
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-gray-400">
                    <p>Generated flashcards from your study material</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="justify-self-end">
              <button
                onClick={handleDownload}
                className="bg-black/30 border-2 border-gray-400 hover:border-gray-300 text-white font-bold py-3 px-8 rounded-xl transition-colors backdrop-blur-sm"
              >
                DOWNLOAD
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
