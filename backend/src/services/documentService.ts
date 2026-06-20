import mammoth from 'mammoth';

export async function extractTextFromFile(
  buffer: Buffer,
  mimetype: string,
  filename: string
): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (mimetype === 'text/plain' || ext === 'txt' || ext === 'md') {
    return buffer.toString('utf-8');
  }

  if (mimetype === 'application/rtf' || ext === 'rtf') {
    return buffer.toString('utf-8').replace(/\\[a-z]+\d*\s?/gi, '').replace(/[{}]/g, '');
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimetype === 'application/pdf' || ext === 'pdf') {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      return data.text;
    } catch {
      throw new Error('PDF parsing failed. Ensure the PDF contains extractable text.');
    }
  }

  throw new Error(`Unsupported file type: ${mimetype || ext}`);
}

export function generateMarkdownExport(title: string, content: string): string {
  return `# ${title}\n\n${content}\n\n---\n*Exported from LexWrite AI*`;
}

export function generateResearchPaperExport(title: string, content: string, author = 'Author'): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return `${title.toUpperCase()}\n\n${author}\n${date}\n\n${'='.repeat(60)}\n\n${content}\n\n${'='.repeat(60)}\n\nReferences\n[Preserved from original document]`;
}
