import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: true, message: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name || 'resume';
    const fileSize = file.size || 0;
    const fileType = file.type || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    let extractedText = '';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (extension === 'pdf' || fileType === 'application/pdf') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        let pdfParse: any;
        try {
          // Direct lib require avoids the buggy index.js debug check that looks for test/data/05-versions-space.pdf
          pdfParse = require('pdf-parse/lib/pdf-parse.js');
        } catch {
          pdfParse = require('pdf-parse');
        }

        if (typeof pdfParse === 'function') {
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text || '';
        } else if (typeof pdfParse?.default === 'function') {
          const pdfData = await pdfParse.default(buffer);
          extractedText = pdfData.text || '';
        } else if (typeof pdfParse?.PDFParse === 'function') {
          const parser = new pdfParse.PDFParse(new Uint8Array(arrayBuffer));
          await parser.load();
          const res = await parser.getText();
          extractedText = typeof res === 'string' ? res : (res?.text || '');
        } else {
          throw new Error('Unsupported pdf-parse module format');
        }
      } catch (pdfErr: any) {
        console.error('PDF parsing error:', pdfErr);
        return NextResponse.json(
          {
            error: true,
            message: `Failed to extract text from PDF (${pdfErr.message || 'Corrupt or password-protected PDF'}).`,
          },
          { status: 422 }
        );
      }
    } else if (
      extension === 'docx' ||
      extension === 'doc' ||
      fileType.includes('wordprocessingml') ||
      fileType.includes('msword')
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mammoth = require('mammoth');
        const docxData = await mammoth.extractRawText({ buffer });
        extractedText = docxData.value || '';
      } catch (docxErr: any) {
        console.error('DOCX parsing error:', docxErr);
        return NextResponse.json(
          {
            error: true,
            message: `Failed to extract text from DOCX file: ${docxErr.message || 'Unknown error'}.`,
          },
          { status: 422 }
        );
      }
    } else if (
      extension === 'txt' ||
      extension === 'md' ||
      extension === 'rtf' ||
      fileType.startsWith('text/')
    ) {
      extractedText = buffer.toString('utf-8');
    } else {
      // Try fallback to text
      try {
        extractedText = buffer.toString('utf-8');
      } catch {
        return NextResponse.json(
          {
            error: true,
            message: `Unsupported file format (.${extension}). Please upload a PDF, DOCX, or TXT file.`,
          },
          { status: 400 }
        );
      }
    }

    // Clean up whitespace
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        {
          error: true,
          message:
            'The uploaded resume appears to be empty or contains scanned images without selectable text. Please ensure your PDF or DOCX contains selectable text.',
        },
        { status: 422 }
      );
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      success: true,
      data: {
        text: extractedText,
        fileName,
        fileSize,
        wordCount,
        characterCount: extractedText.length,
      },
    });
  } catch (err: any) {
    console.error('Resume parse error:', err);
    return NextResponse.json(
      { error: true, message: err.message || 'An unexpected error occurred while parsing the resume.' },
      { status: 500 }
    );
  }
}
