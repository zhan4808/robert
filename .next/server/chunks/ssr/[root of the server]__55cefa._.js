module.exports = {

"[project]/app/projects/projectsData.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "getProjectBySlug": (()=>getProjectBySlug),
    "projects": (()=>projects)
});
const projects = [
    {
        title: 'Triton GEMM Kernel for Small Batch Transformer Inference on Low Resource Hardware',
        description: 'Open-source GEMM kernel for small batch transformer inference workloads with improved latency and throughput for low resource accelerated inference. Identifying efficient quantization algorithms in Triton.',
        image: '/Qyyy.gif',
        mediaType: 'gif',
        link: 'https://github.com/zhan4808/gemmopt',
        external: true
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
        external: true
    },
    {
        title: 'slynk: Turning Ads into Experiences',
        description: 'Reimagining ads with interactive AR avatars. meet and talk with your favorite celebrities with sylnk, our AR app offering a new personalized immersive experience for discovering advertisements.',
        image: '/murmure3.gif',
        mediaType: 'gif',
        link: 'https://devpost.com/software/slynk',
        external: true
    },
    {
        title: 'Using an Ensemble of GANs and CNNs to More Accurately Generate and Diagnose Skin Condition Datasets in Diverse Skin Types',
        description: 'Generated and validated synthetic images to address ethical AI bias due to lack of diverse skin condition images.',
        image: '/Murmure7.svg',
        mediaType: 'image',
        slug: 'skin-ensemble',
        external: false,
        content: `# Skin Ensemble\n\n![Skin Ensemble](https://placehold.co/600x200)\n\n**Skin Ensemble** uses an ensemble of GANs and CNNs to generate and diagnose skin condition datasets, focusing on diversity and ethical AI.\n\n## Motivation\nMedical AI models often lack training data for diverse skin types, leading to bias. This project generates synthetic images to fill those gaps and validates them with CNNs.\n\n## Approach\n- GANs generate realistic skin condition images for underrepresented skin types\n- CNNs validate the generated images for accuracy\n- Ensemble methods improve robustness\n\n## Results\n- Improved dataset diversity\n- Better diagnostic accuracy across skin types\n\n## PDF\n[View the full project PDF](/skin-ensemble.pdf)\n\n---\n\n*Built with PyTorch, TensorFlow, and medical datasets.*`
    }
];
function getProjectBySlug(slug) {
    return projects.find((p)=>p.slug === slug);
}
}}),
"[externals]/node:process [external] (node:process, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("node:process", () => require("node:process"));

module.exports = mod;
}}),
"[externals]/node:process [external] (node:process, cjs) <export default as minproc>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "minproc": (()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_import__("[externals]/node:process [external] (node:process, cjs)");
}}),
"[externals]/node:path [external] (node:path, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("node:path", () => require("node:path"));

module.exports = mod;
}}),
"[externals]/node:path [external] (node:path, cjs) <export default as minpath>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "minpath": (()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_import__("[externals]/node:path [external] (node:path, cjs)");
}}),
"[externals]/node:url [external] (node:url, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("node:url", () => require("node:url"));

module.exports = mod;
}}),
"[externals]/node:url [external] (node:url, cjs) <export fileURLToPath as urlToPath>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "urlToPath": (()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__["fileURLToPath"])
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__ = __turbopack_import__("[externals]/node:url [external] (node:url, cjs)");
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("os", () => require("os"));

module.exports = mod;
}}),
"[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ProjectDetailPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$projects$2f$projectsData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/projects/projectsData.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_import__("[project]/node_modules/react-markdown/lib/index.js [app-rsc] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
function ProjectDetailPage({ params }) {
    const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$projects$2f$projectsData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProjectBySlug"])(params.slug);
    if (!project) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white dark:bg-black min-h-screen pt-24 px-4 flex flex-col items-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-black dark:text-white mb-4 text-center",
                    children: project.title
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mb-6",
                    children: project.mediaType === 'video' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        src: project.image,
                        autoPlay: true,
                        loop: true,
                        muted: true,
                        playsInline: true,
                        className: "rounded-lg shadow-lg w-full max-h-96 object-cover"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 16,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: project.image,
                        alt: project.title,
                        className: "rounded-lg shadow-lg w-full max-h-96 object-cover"
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 18,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-700 dark:text-gray-300 mb-8 text-center",
                    children: project.description
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                project.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "prose dark:prose-invert max-w-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                        children: project.content
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 24,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 23,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/projects/[slug]/page.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}}),
"[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_namespace__(__turbopack_import__("[project]/app/projects/[slug]/page.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/.next-internal/server/app/projects/[slug]/page/actions.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__55cefa._.js.map