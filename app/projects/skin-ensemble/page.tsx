import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function SkinEnsembleProjectPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen pt-24 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4 text-center">Using an Ensemble of GANs and CNNs to More Accurately Generate and Diagnose Skin Condition Datasets in Diverse Skin Types</h1>
        <div className="flex justify-center mb-6">
          <img src="/Murmure7.svg" alt="Skin Ensemble" className="rounded-lg shadow-lg w-full max-h-96 object-cover" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">Generated and validated synthetic images to address ethical AI bias due to lack of diverse skin condition images.</p>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{`# Skin Ensemble\n\n![Skin Ensemble](https://placehold.co/600x200)\n\n**Skin Ensemble** uses an ensemble of GANs and CNNs to generate and diagnose skin condition datasets, focusing on diversity and ethical AI.\n\n## Motivation\nMedical AI models often lack training data for diverse skin types, leading to bias. This project generates synthetic images to fill those gaps and validates them with CNNs.\n\n## Approach\n- GANs generate realistic skin condition images for underrepresented skin types\n- CNNs validate the generated images for accuracy\n- Ensemble methods improve robustness\n\n## Results\n- Improved dataset diversity\n- Better diagnostic accuracy across skin types\n\n## PDF\n[View the full project PDF](/skin-ensemble.pdf)\n\n---\n\n*Built with PyTorch, TensorFlow, and medical datasets.*`}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 