(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_a53f7d._.js", {

"[project]/app/components/ImageIcon.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ImageIcon)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
// Define image collections
const AI_IMAGES = [
    '/oai1.jpg',
    '/oai2.jpeg',
    '/oai3.jpg',
    '/oai4.jpg',
    '/oai5.png',
    '/oai6.png',
    '/oai7.png'
];
const WEBP_IMAGES = [
    '/WEBP to JPG 1.jpg',
    '/WEBP to JPG 2.jpg',
    '/WEBP to JPG 3.jpg',
    '/WEBP to JPG 4.jpg',
    '/WEBP to JPG 5.jpg',
    '/WEBP to JPG Conversion.jpg'
];
// Combine all images
const ALL_IMAGES = [
    ...AI_IMAGES,
    ...WEBP_IMAGES
];
function ImageIcon({ src, randomFromCollection, alt = 'Image icon', size = 'md', withGradientBorder = true, withHoverEffect = true, className = '', borderGradient = 'from-purple-400 via-pink-500 to-blue-500' }) {
    _s();
    // Determine the image source
    const imageSrc = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "ImageIcon.useMemo[imageSrc]": ()=>{
            if (src) return src;
            // If no src provided, get random from collection
            let collection = ALL_IMAGES;
            if (randomFromCollection === 'ai') {
                collection = AI_IMAGES;
            } else if (randomFromCollection === 'webp') {
                collection = WEBP_IMAGES;
            }
            const randomIndex = Math.floor(Math.random() * collection.length);
            return collection[randomIndex];
        }
    }["ImageIcon.useMemo[imageSrc]"], [
        src,
        randomFromCollection
    ]);
    // Size classes
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-20 h-20',
        xl: 'w-32 h-32'
    }[size];
    // Border size
    const borderSize = {
        sm: 'p-0.5',
        md: 'p-0.5',
        lg: 'p-1',
        xl: 'p-1.5'
    }[size];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        className: `flex-shrink-0 rounded-lg overflow-hidden ${sizeClasses} ${withGradientBorder ? `${borderSize} bg-gradient-to-br ${borderGradient}` : ''} ${className}`,
        initial: {
            opacity: 0,
            scale: 0.8
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        transition: {
            duration: 0.5
        },
        whileHover: withHoverEffect ? {
            scale: 1.05
        } : {},
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full rounded-md overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: imageSrc,
                alt: alt,
                className: "w-full h-full object-cover"
            }, void 0, false, {
                fileName: "[project]/app/components/ImageIcon.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/ImageIcon.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ImageIcon.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(ImageIcon, "mRSGXVyHq4I/W09hpJ1wpVs3GB8=");
_c = ImageIcon;
var _c;
__turbopack_refresh__.register(_c, "ImageIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/blog/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=app_a53f7d._.js.map