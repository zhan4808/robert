import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }
    
    // Path to the blog post file
    const filePath = path.join(process.cwd(), 'app/blog', slug, 'page.tsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract post data using regex
    const titleMatch = content.match(/<motion\.h1[^>]*>([\s\S]*?)<\/motion\.h1>/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    const descriptionMatch = content.match(/<motion\.h2[^>]*>([\s\S]*?)<\/motion\.h2>/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    
    const dateMatch = content.match(/(\w+ \d+, \d{4})/);
    const date = dateMatch ? dateMatch[1] : '';
    
    const iconMatch = content.match(/src="([^"]+)".*?alt="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '';
    
    // Extract audio information
    const songMatch = content.match(/src="(\/[^"]+\.mp3)"/);
    const song = songMatch ? songMatch[1] : '/sunflowerfeelings.mp3';
    
    const songTitleMatch = content.match(/sunflower feelings|charcoal baby/i);
    const songTitle = songTitleMatch ? songTitleMatch[0] : 'Sunflower Feelings';
    
    const songArtistMatch = content.match(/kuzu mellow|blood orange/i);
    const songArtist = songArtistMatch ? songArtistMatch[0] : 'Kuzu Mellow';
    
    const songCoverMatch = content.match(/src="(\/[^"]+\.(?:jpg|jpeg|png))"/);
    const songCover = songCoverMatch ? songCoverMatch[1] : '/sunflowerfeelings.jpeg';
    
    // Extract gradient colors
    const colorsMatch = content.match(/colors: \[(['"].*?['"](?:,\s*['"].*?['"])*)\]/);
    let colors = ['red', 'orange', 'indigo', 'purple', 'fuchsia', 'pink']; // Default
    
    if (colorsMatch && colorsMatch[1]) {
      colors = colorsMatch[1]
        .split(',')
        .map(c => c.trim().replace(/['"]/g, ''));
    }
    
    // Extract content
    const paragraphs: string[] = [];
    const paragraphMatches = content.matchAll(/<motion\.p[^>]*>\s*([\s\S]*?)\s*<\/motion\.p>/g);
    
    for (const match of paragraphMatches) {
      if (match[1]) {
        paragraphs.push(match[1].trim());
      }
    }
    
    // Format date for the form
    let formattedDate = '';
    if (date) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0];
      }
    }
    
    return NextResponse.json({
      slug,
      title,
      description,
      date: formattedDate || new Date().toISOString().split('T')[0],
      icon,
      content: paragraphs.join('\n\n'),
      song,
      songTitle,
      songArtist,
      songCover,
      colors
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
} 