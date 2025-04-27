import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to the blog posts directory
    const blogsDirectory = path.join(process.cwd(), 'app/blog');
    
    // Get all subdirectories (each subdirectory is a blog post)
    const entries = fs.readdirSync(blogsDirectory, { withFileTypes: true });
    const directories = entries
      .filter(entry => entry.isDirectory() && entry.name !== 'components' && !entry.name.startsWith('.'))
      .map(dir => dir.name);
    
    // Array to store blog post metadata
    const posts = [];
    
    // Process each blog post directory
    for (const slug of directories) {
      try {
        const filePath = path.join(blogsDirectory, slug, 'page.tsx');
        
        // Check if the file exists
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Extract title
          const titleMatch = content.match(/<motion\.h1[^>]*>([\s\S]*?)<\/motion\.h1>/);
          const title = titleMatch ? titleMatch[1].trim() : slug;
          
          // Extract date
          const dateMatch = content.match(/(\w+ \d+, \d{4})/);
          const date = dateMatch ? dateMatch[1] : 'Unknown date';
          
          // Extract description (subtitle)
          const descriptionMatch = content.match(/<motion\.h2[^>]*>([\s\S]*?)<\/motion\.h2>/);
          const description = descriptionMatch ? descriptionMatch[1].trim() : '';
          
          // Extract icon
          const iconMatch = content.match(/src="([^"]+)"/);
          const icon = iconMatch ? iconMatch[1] : '/default-icon.jpg';
          
          posts.push({
            slug,
            title,
            date,
            description,
            icon
          });
        }
      } catch (err) {
        console.error(`Error processing blog post ${slug}:`, err);
      }
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
} 