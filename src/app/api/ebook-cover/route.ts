import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicCoverPath = path.join(process.cwd(), 'public', 'Ebook', 'cover.png');

    // Otherwise, find the generated cover from brain folder and auto-copy it
    const brainDir = path.join(
      process.env.USERPROFILE || process.env.HOME || '',
      '.gemini', 'antigravity', 'brain'
    );

    let coverBuffer: Buffer | null = null;

    // Search brain directories for the generated cover
    if (fs.existsSync(brainDir)) {
      const conversations = fs.readdirSync(brainDir);
      for (const conv of conversations) {
        const convPath = path.join(brainDir, conv);
        if (!fs.statSync(convPath).isDirectory()) continue;
        const files = fs.readdirSync(convPath);
        const coverFile = files.find(f => f.startsWith('ebook_cover_tight')) 
                        || files.find(f => f.startsWith('ebook_cover_clean'));
        if (coverFile) {
          coverBuffer = fs.readFileSync(path.join(convPath, coverFile));
          break;
        }
      }
    }

    if (coverBuffer) {
      // Auto-copy to public folder for future use & deployment
      fs.writeFileSync(publicCoverPath, coverBuffer);
      
      return new NextResponse(new Uint8Array(coverBuffer), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // Fallback: serve from public cache (for production/Vercel)
    if (fs.existsSync(publicCoverPath) && fs.statSync(publicCoverPath).size > 100) {
      const buf = fs.readFileSync(publicCoverPath);
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    return NextResponse.json({ error: 'Cover image not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Error serving cover:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
