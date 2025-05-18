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
        external: true,
        content: `# Triton GEMM Kernel\n\n![GEMM Kernel](/Qyyy.gif)\n\nA blazing-fast, open-source GEMM kernel designed for small batch transformer inference on low-resource hardware.\n\n- **Optimized for latency and throughput** on edge devices\n- **Custom quantization algorithms** in Triton\n- **Open-source**: [View on GitHub](https://github.com/zhan4808/gemmopt)\n\n## Key Features\n- Small batch transformer support\n- Quantization for efficient inference\n- Written in Triton\n\n## Example\n\n\`\`\`python\n# Example kernel call\nfrom gemmopt import run_gemm\nrun_gemm(input, weights, quantize=True)\n\`\`\`\n`
    },
    {
        title: 'VeriGen: Agents for Accelerated Chip Design',
        description: 'Multi-agent tool for RTL design verification, testbench generation, and trace analysis. Accelerate chip design with AI-powered collaboration.',
        image: '/QwQ1.gif',
        mediaType: 'gif',
        slug: 'verigen',
        external: false,
        content: `# VeriGen\n\n![VeriGen](/QwQ1.gif)\n\n**AI agents for chip design.**\n\n- Automated testbench generation\n- Script and trace analysis\n- Multi-agent collaboration for RTL development\n\n## Why VeriGen?\nAccelerate verification cycles and catch bugs early with intelligent agents.\n\n## Example\n\n\`\`\`python\nfrom verigen import Agent\nagent = Agent()\nagent.verify('my_design.sv')\n\`\`\`\n`
    },
    {
        title: 'ArtSage',
        description: 'AI-powered museum exploration: image recognition, RAG workflows, and AR for immersive art discovery.',
        'image': '/QwQ1.gif',
        mediaType: 'gif',
        slug: 'artsage',
        external: false,
        content: `# ArtSage\n\n![ArtSage](/QwQ1.gif)\n\n**Explore museums with AI.**\n\n- Snap a photo, get instant art info\n- RAG-powered Q&A\n- AR overlays for deeper context\n\n## Example\n\n\`\`\`js\nconst result = await artsage.recognize(image)\nconsole.log(result.title, result.artist)\n\`\`\`\n`
    },
    {
        title: 'OmNom | TreeHacks 2025 Most Creative Hack Grand Prize',
        description: '6-foot autonomous food delivery robot for campus environments. Interacts with iPads, fetches food, and navigates indoors/outdoors.',
        'image': '/murmure6.mp4',
        mediaType: 'video',
        link: 'https://devpost.com/software/omnom-hg16v3',
        external: true,
        content: `# OmNom\n\n![OmNom Robot](/murmure6.mp4)\n\n**Autonomous food delivery, reimagined.**\n\n- 6-foot robot\n- Indoor/outdoor navigation\n- iPad ordering integration\n- TreeHacks 2025 Grand Prize\n\n[See on Devpost](https://devpost.com/software/omnom-hg16v3)\n`
    },
    {
        title: 'slynk: Turning Ads into Experiences',
        description: 'AR app that transforms ads into interactive experiences with celebrity avatars. Personalized, immersive, and fun.',
        'image': '/murmure3.gif',
        mediaType: 'gif',
        link: 'https://devpost.com/software/slynk',
        external: true,
        content: `# slynk\n\n![slynk](/murmure3.gif)\n\n**Meet your favorite celebrities in AR.**\n\n- Interactive ad avatars\n- Personalized recommendations\n- Immersive AR experience\n\n[See on Devpost](https://devpost.com/software/slynk)\n`
    },
    {
        title: 'Using an Ensemble of GANs and CNNs to More Accurately Generate and Diagnose Skin Condition Datasets in Diverse Skin Types',
        description: 'Synthetic image generation and diagnosis for diverse skin types. GANs, CNNs, and ethical AI for unbiased datasets.',
        image: '/Murmure7.svg',
        mediaType: 'image',
        slug: 'skin-ensemble',
        external: false,
        content: `# Skin Ensemble\n\n![Skin Ensemble](/Murmure7.svg)\n\n**Diverse, ethical AI for dermatology.**\n\n- GANs and CNNs for synthetic data\n- Bias reduction in medical AI\n- Dataset validation\n\n## PDF\n[View PDF](/skin-ensemble.pdf)\n`
    }
];
function getProjectBySlug(slug) {
    return projects.find((p)=>p.slug === slug);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
;
const ReactMarkdown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-markdown/index.js [app-rsc] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "app/projects/[slug]/page.tsx -> " + "react-markdown"
        ]
    },
    ssr: false
});
async function ProjectDetailPage({ params }) {
    // Await params as required by Next.js 15+ dynamic routes
    const { slug } = params;
    const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$projects$2f$projectsData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProjectBySlug"])(slug);
    if (!project) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "bg-white dark:bg-black min-h-screen pt-24 px-4 flex flex-col items-center",
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        transition: {
            duration: 0.6
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
            className: "max-w-2xl w-full rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white/80 via-gray-50/60 to-indigo-50/40 dark:from-black/80 dark:via-gray-900/60 dark:to-indigo-950/40 p-8 relative overflow-hidden",
            initial: {
                y: 40,
                opacity: 0
            },
            animate: {
                y: 0,
                opacity: 1
            },
            transition: {
                duration: 0.7,
                delay: 0.1,
                type: 'spring',
                stiffness: 60
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].h1, {
                    className: "text-4xl font-extrabold text-black dark:text-white mb-6 text-center tracking-tight",
                    initial: {
                        opacity: 0,
                        y: -20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.2,
                        duration: 0.6
                    },
                    children: project.title
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "flex justify-center mb-8",
                    initial: {
                        scale: 0.95,
                        opacity: 0
                    },
                    animate: {
                        scale: 1,
                        opacity: 1
                    },
                    transition: {
                        delay: 0.3,
                        duration: 0.7,
                        type: 'spring',
                        stiffness: 80
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative rounded-xl overflow-hidden shadow-lg group border-2 border-transparent bg-gradient-to-tr from-indigo-200/40 via-pink-100/30 to-blue-100/30 dark:from-indigo-900/40 dark:via-pink-900/30 dark:to-blue-900/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "absolute inset-0 z-0 pointer-events-none group-hover:blur-[2px] group-hover:opacity-80 transition-all duration-500",
                                initial: {
                                    opacity: 0.7
                                },
                                animate: {
                                    opacity: 1
                                },
                                style: {
                                    background: 'radial-gradient(circle at 60% 40%, #a5b4fc33 0%, #fbcfe833 100%)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this),
                            project.mediaType === 'video' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                src: project.image,
                                autoPlay: true,
                                loop: true,
                                muted: true,
                                playsInline: true,
                                className: "relative z-10 rounded-xl w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 50,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: project.image,
                                alt: project.title,
                                className: "relative z-10 rounded-xl w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                            }, void 0, false, {
                                fileName: "[project]/app/projects/[slug]/page.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].p, {
                    className: "text-lg text-gray-700 dark:text-gray-300 mb-8 text-center font-light",
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.4,
                        duration: 0.5
                    },
                    children: project.description
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                project.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "prose dark:prose-invert max-w-none prose-lg mx-auto",
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.5,
                        duration: 0.7
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactMarkdown, {
                        children: project.content
                    }, void 0, false, {
                        fileName: "[project]/app/projects/[slug]/page.tsx",
                        lineNumber: 82,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/projects/[slug]/page.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/projects/[slug]/page.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/projects/[slug]/page.tsx",
        lineNumber: 15,
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

//# sourceMappingURL=_c916e7._.js.map