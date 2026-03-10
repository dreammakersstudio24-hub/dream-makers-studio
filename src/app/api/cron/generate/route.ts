import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  // 1. Verify Authentication (Protect the automated route)
  const authHeader = request.headers.get('authorization');
  const vercelCronHeader = request.headers.get('x-vercel-cron');

  // Allow if it has the correct Bearer token OR if it's called by Vercel Cron
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    vercelCronHeader !== '1'
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 2. Fetch a random active generation idea
    const { data: ideas, error: fetchError } = await supabase
      .from('generation_ideas')
      .select('*')
      .eq('is_active', true);

    if (fetchError || !ideas || ideas.length === 0) {
      console.error("No active ideas found", fetchError);
      return new NextResponse('No active ideas available.', { status: 200 }); // Return 200 so cron doesn't fail repeatedly
    }

    // Pick a random idea
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    console.log(`Generating image for idea: ${randomIdea.prompt_idea}`);

    // 3. Mock AI Generation Process
    // In a real scenario, this would call Replicate, OpenAI DALL-E 3, etc.
    // e.g. const aiResponse = await openai.images.generate({ prompt: randomIdea.prompt_idea });
    
    // For now, we simulate a delay and use a high-quality placeholder image
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Placeholder image based on a design keyword
    const randomSeed = Math.floor(Math.random() * 1000);
    const mockImageUrl = `https://picsum.photos/seed/${randomSeed}/800/1000`; // Placeholder portrait image

    // Generate some mock keywords based on the prompt
    const baseKeywords = randomIdea.prompt_idea.toLowerCase().split(' ').filter((w: string) => w.length > 3);
    const additionalKeywords = ['interior', 'design', 'modern', 'luxury', 'ai-generated'];
    const mockKeywords = Array.from(new Set([...baseKeywords, ...additionalKeywords])).slice(0, 6);

    // 4. Save the generated item to the gallery table
    const { error: insertError } = await supabase
      .from('gallery_items')
      .insert({
        title: `AI Concept: ${randomIdea.prompt_idea.split(' ').slice(0, 3).join(' ')}...`,
        style_category: 'AI Concept',
        after_image_url: mockImageUrl,
        is_ai_generated: true,
        keywords: mockKeywords
      });

    if (insertError) {
      console.error("Error inserting generated item:", insertError);
      return new NextResponse(`Error saving to DB: ${insertError.message}`, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully generated and saved new AI gallery item.',
      idea: randomIdea.prompt_idea 
    });

  } catch (error) {
    console.error("Cron generation error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
