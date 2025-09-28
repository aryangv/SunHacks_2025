export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function generateNotes(text: string, fileContent?: string): Promise<ApiResponse<{ notes: string }>> {
  try {
    const response = await fetch('/api/files-to-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, fileContent }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to generate notes' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function generateFlashcards(text: string, fileContent?: string): Promise<ApiResponse<{ flashcards: Array<{ front: string; back: string }> }>> {
  try {
    const response = await fetch('/api/files-to-flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, fileContent }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to generate flashcards' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function generateResources(text?: string, fileContent?: string, query?: string): Promise<ApiResponse<{ resources: string }>> {
  try {
    const response = await fetch('/api/access-resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, fileContent, query }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to generate resources' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}
