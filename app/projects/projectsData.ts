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
    content: `# VeriGen\n\n![VeriGen](https://placehold.co/600x200)\n\n**VeriGen** is an integrated RTL design verification tool that accelerates chip design by automating testbench generation, script and trace analysis, and enabling multi-agent collaboration.\n\n## Features\n- Automated testbench generation for RTL designs\n- Script and trace analysis for rapid debugging\n- Multi-agent collaboration for parallel verification\n\n## How it works\nVeriGen leverages AI agents to generate and validate testbenches, analyze simulation traces, and suggest fixes. This reduces manual effort and speeds up the verification cycle.\n\n## Example Usage\n\n\`\`\`python\ndef verify_design(design):\n    # Generate testbench\n    testbench = verigen.generate_testbench(design)\n    # Run simulation\n    result = verigen.simulate(design, testbench)\n    # Analyze trace\n    verigen.analyze_trace(result.trace)\n    return result.passed\n\`\`\`\n\n---\n\n*Built with Python, SystemVerilog, and multi-agent systems.*`
  },
  {
    title: 'ArtSage',
    description: 'Interactive AI museum exploration tool with image recognition and RAG workflows to identify art, retrieve museum data, and answer user prompts for enriched museum experience. Expanding with agentic features and AR.',
    image: '/QwQ1.gif',
    mediaType: 'gif',
    slug: 'artsage',
    external: false,
    content: `# ArtSage\n\n![ArtSage](https://placehold.co/600x200)\n\n**ArtSage** is an interactive AI-powered tool for museum exploration. Snap a photo of any artwork and ArtSage will identify it, retrieve museum data, and answer your questions using Retrieval-Augmented Generation (RAG) workflows.\n\n## Features\n- Image recognition for artwork\n- RAG-based Q&A about art and artists\n- AR features for immersive museum experiences (coming soon)\n\n## Example\n\n\`\`\`js\nconst result = await artsage.queryArt(image);\nconsole.log(result.title, result.artist, result.year);\n\`\`\`\n\n---\n\n*Built with React Native, Python, and OpenAI APIs.*`
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
    content: `# Skin Ensemble\n\n![Skin Ensemble](https://placehold.co/600x200)\n\n**Skin Ensemble** uses an ensemble of GANs and CNNs to generate and diagnose skin condition datasets, focusing on diversity and ethical AI.\n\n## Motivation\nMedical AI models often lack training data for diverse skin types, leading to bias. This project generates synthetic images to fill those gaps and validates them with CNNs.\n\n## Approach\n- GANs generate realistic skin condition images for underrepresented skin types\n- CNNs validate the generated images for accuracy\n- Ensemble methods improve robustness\n\n## Results\n- Improved dataset diversity\n- Better diagnostic accuracy across skin types\n\n## PDF\n[View the full project PDF](/skin-ensemble.pdf)\n\n---\n\n*Built with PyTorch, TensorFlow, and medical datasets.*`
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find(p => p.slug === slug);
} 