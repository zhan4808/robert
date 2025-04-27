import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: NextRequest) {
  try {
    // Get slug from query params
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }
    
    // Path to the blog post directory
    const blogDirectory = path.join(process.cwd(), 'app/blog', slug);
    
    // Check if directory exists
    if (!fs.existsSync(blogDirectory)) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Recursive function to delete directory contents
    const deleteDirectory = (dirPath: string) => {
      if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
          const curPath = path.join(dirPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // Recurse
            deleteDirectory(curPath);
          } else {
            // Delete file
            fs.unlinkSync(curPath);
          }
        });
        // Delete directory
        fs.rmdirSync(dirPath);
      }
    };
    
    // Delete the blog post directory
    deleteDirectory(blogDirectory);
    
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 