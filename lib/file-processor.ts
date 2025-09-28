export interface FileProcessorResult {
  text: string;
  fileName: string;
  fileType: string;
}

export async function processFile(file: File): Promise<FileProcessorResult> {
  const fileName = file.name;
  const fileType = file.type;
  
  // For text files, read directly
  if (fileType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    const text = await file.text();
    return { text, fileName, fileType };
  }
  
  // For PDF files, we'll need a PDF parser (you might want to add pdf-parse)
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    // For now, return a placeholder - you can add PDF parsing later
    return { 
      text: `[PDF file: ${fileName} - PDF content extraction not implemented yet. Please use text input instead.]`, 
      fileName, 
      fileType 
    };
  }
  
  // For other file types, try to read as text
  try {
    const text = await file.text();
    return { text, fileName, fileType };
  } catch (error) {
    return { 
      text: `[File: ${fileName} - Unable to extract text content. Please use text input instead.]`, 
      fileName, 
      fileType 
    };
  }
}

export function extractTextFromContent(content: string): string {
  // Basic text cleaning and extraction
  return content
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();
}
