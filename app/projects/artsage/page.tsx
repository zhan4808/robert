import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ArtSageProjectPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen pt-24 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4 text-center">ArtSage</h1>
        <div className="flex justify-center mb-6">
          <img src="/QwQ1.gif" alt="ArtSage" className="rounded-lg shadow-lg w-full max-h-96 object-cover" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">Interactive AI museum exploration tool with image recognition and RAG workflows to identify art, retrieve museum data, and answer user prompts for enriched museum experience. Expanding with agentic features and AR.</p>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{`# ArtSage\n\n![ArtSage](https://placehold.co/600x200)\n\n**ArtSage** is an interactive AI-powered tool for museum exploration. Snap a photo of any artwork and ArtSage will identify it, retrieve museum data, and answer your questions using Retrieval-Augmented Generation (RAG) workflows.\n\n## Features\n- Image recognition for artwork\n- RAG-based Q&A about art and artists\n- AR features for immersive museum experiences (coming soon)\n\n## Example\n\n\`\`\`js\nconst result = await artsage.queryArt(image);\nconsole.log(result.title, result.artist, result.year);\n\`\`\`\n\n---\n\n*Built with React Native, Python, and OpenAI APIs.*`}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 