import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { text, fileContent } = await request.json();

    if (!text && !fileContent) {
      return NextResponse.json(
        { error: 'Either text or file content is required' },
        { status: 400 }
      );
    }

    const contentToProcess = text || fileContent;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Please convert the following content into flashcards in JSON format. 
    Create multiple flashcards that cover the key concepts, definitions, and important information.
    Each flashcard should have a clear question and a comprehensive answer.
    Return the response as a JSON array with the following structure:
    [
      {
        "question": "Question or prompt",
        "answer": "Answer or explanation"
      }
    ]
    
    Content to convert:
    ${contentToProcess}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const flashcardsText = response.text();

    // Try to extract JSON from the response
    let flashcards;
    try {
      const jsonMatch = flashcardsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a simple flashcard structure
        flashcards = [{
          question: "Generated from content",
          answer: flashcardsText
        }];
      }
    } catch (parseError) {
      // Fallback: create a simple flashcard structure
      flashcards = [{
        question: "Generated from content",
        answer: flashcardsText
      }];
    }

    return NextResponse.json({ flashcards });
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later or upgrade your plan.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
