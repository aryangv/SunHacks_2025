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
    
    const prompt = `Please convert the following content into comprehensive, well-structured notes using proper Markdown formatting. 
    Organize the information in a clear, hierarchical format with main topics, subtopics, and key points. 
    Use proper Markdown syntax including:
    - Headers (# ## ###)
    - Bullet points (- or *)
    - Numbered lists (1. 2. 3.)
    - Bold text (**text**)
    - Italic text (*text*)
    - Code blocks (\`\`\`code\`\`\`)
    - Blockquotes (> text)
    
    Make sure the output is clean, well-formatted Markdown that will render properly.
    
    Content to convert:
    ${contentToProcess}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const notes = response.text();

    return NextResponse.json({ notes });
  } catch (error: any) {
    console.error('Error generating notes:', error);
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later or upgrade your plan.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate notes' },
      { status: 500 }
    );
  }
}
