export const projects = [
  {
    title: 'Triton GEMM Kernel for Small Batch Transformer Inference on Low Resource Hardware',
    description: 'Open-source GEMM kernel for small batch transformer inference workloads with improved latency and throughput for low resource accelerated inference. Identifying efficient quantization algorithms in Triton.',
    image: '/Qyyy.gif',
    mediaType: 'gif',
    link: 'https://github.com/zhan4808/gemmopt',
    external: true,
  },
  {
    title: 'VeriGen: Agents for Accelerated Chip Design',
    description: 'Integrated RTL design verification tool for testbench generation, script and trace analysis with multi-agent collaboration for accelerated RTL development.',
    image: '/QwQ1.gif',
    mediaType: 'gif',
    slug: 'verigen',
    external: false,
    content: `# VeriGen\n\n![VeriGen](https://placehold.co/600x200)\n\nMulti-agent tool for RTL design verification.\n\n## Features\n- Testbench generation\n- Script and trace analysis\n- Multi-agent collaboration\n\n## Example Usage\n\n\`\`\`python\ndef verify_design(design):\n    # ...\n\`\`\`\n\nMore details coming soon.`
  },
  {
    title: 'ArtSage',
    description: 'Interactive AI museum exploration tool with image recognition and RAG workflows to identify art, retrieve museum data, and answer user prompts for enriched museum experience. Expanding with agentic features and AR.',
    image: '/QwQ1.gif',
    mediaType: 'gif',
    slug: 'artsage',
    external: false,
    content: `# ArtSage\n\n![ArtSage](https://placehold.co/600x200)\n\nAI-powered museum exploration.\n\n- Image recognition\n- RAG workflows\n- AR features (coming soon)\n\n## Example\n\n\`\`\`js\nconst queryArt = async (image) => {/* ... */}\n\`\`\`\n`
  },
  {
    title: 'OmNom | TreeHacks 2025 Most Creative Hack Grand Prize',
    description: 'An autonomous end-to-end 6-foot tall autonomous food delivery robot that navigates novel outdoor and indoor campus environments, interacts with ordering iPads, fetches and delives late-night food, allowing students to focus on their work while satisfying their cravings.',
    image: '/murmure6.mp4',
    mediaType: 'video',
    link: 'https://devpost.com/software/omnom-hg16v3',
    external: true,
  },
  {
    title: 'slynk: Turning Ads into Experiences',
    description: 'Reimagining ads with interactive AR avatars. meet and talk with your favorite celebrities with sylnk, our AR app offering a new personalized immersive experience for discovering advertisements.',
    image: '/murmure3.gif',
    mediaType: 'gif',
    link: 'https://devpost.com/software/slynk',
    external: true,
  },
  {
    title: 'Using an Ensemble of GANs and CNNs to More Accurately Generate and Diagnose Skin Condition Datasets in Diverse Skin Types',
    description: 'Generated and validated synthetic images to address ethical AI bias due to lack of diverse skin condition images.',
    image: '/Murmure7.svg',
    mediaType: 'image',
    slug: 'skin-ensemble',
    external: false,
    content: `# Skin Ensemble\n\n![Skin Ensemble](https://placehold.co/600x200)\n\nSynthetic image generation and diagnosis for diverse skin types.\n\n- GANs and CNNs\n- Ethical AI\n- Dataset validation\n\n## PDF\n\n[View PDF](/skin-ensemble.pdf)\n`
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find(p => p.slug === slug);
} 