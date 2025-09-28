import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { text, fileContent, query } = await request.json();

    if (!text && !fileContent && !query) {
      return NextResponse.json(
        { error: 'Text, file content, or query is required' },
        { status: 400 }
      );
    }

    const contentToProcess = text || fileContent || '';
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    let prompt = '';
    
    if (query) {
      // If it's a search query, provide educational resources
      prompt = `Based on the query "${query}", provide a comprehensive list of educational resources and learning materials. 
      
      IMPORTANT: Format each resource EXACTLY as follows (one resource per section):
      
      **Title:** [Actual resource name]
      **Description:** [Brief description of what the resource covers]
      **URL:** [Actual URL if available, or "N/A" if not]
      **Author:** [Author or creator if known]
      **Type:** [Course/Book/Video/Article/etc.]
      
      Focus on well-known, reputable educational resources like:
      - Khan Academy (khanacademy.org)
      - Coursera (coursera.org)
      - edX (edx.org)
      - MIT OpenCourseWare (ocw.mit.edu)
      - YouTube educational channels
      - Academic websites
      - Popular educational books
      - Interactive learning platforms
      
      Provide 5-8 high-quality resources with real titles and URLs when possible. Each resource should be clearly separated.`;
    } else {
      // If it's content-based, analyze and suggest resources
      prompt = `Based on the following content, suggest relevant educational resources and learning materials that would help someone understand and learn more about these topics.
      
      Content:
      ${contentToProcess}
      
      IMPORTANT: Format each resource EXACTLY as follows (one resource per section):
      
      **Title:** [Actual resource name]
      **Description:** [Brief description of what the resource covers]
      **URL:** [Actual URL if available, or "N/A" if not]
      **Author:** [Author or creator if known]
      **Type:** [Course/Book/Video/Article/etc.]
      
      Focus on well-known, reputable educational resources like:
      - Khan Academy (khanacademy.org)
      - Coursera (coursera.org)
      - edX (edx.org)
      - MIT OpenCourseWare (ocw.mit.edu)
      - YouTube educational channels
      - Academic websites
      - Popular educational books
      - Interactive learning platforms
      
      Provide 5-8 high-quality resources with real titles and URLs when possible. Each resource should be clearly separated.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resources = response.text();

    return NextResponse.json({ resources });
  } catch (error: any) {
    console.error('Error generating resources:', error);
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later or upgrade your plan.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate resources' },
      { status: 500 }
    );
  }
}
