export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "image"; src: string; alt: string; caption?: string; invert?: boolean }
  | { type: "gallery"; images: { src: string; alt: string; caption?: string }[] }
  | { type: "video"; src: string; caption?: string }
  | { type: "gradient"; className: string }
  | { type: "list"; items: string[] }
  | { type: "link"; label: string; href: string; description?: string }
  | { type: "code"; code: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "code-highlighted"; language: string; code: string }
  | { type: "math"; latex: string; display?: boolean }
  | {
      type: "visualization";
      title: string;
      prompt: string;
      caption: string;
      media?: { type: "image" | "video"; src: string; alt: string };
    }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface JournalTrack {
  title: string;
  artist: string;
  albumArt?: string;
  spotifyUrl?: string;
  audioSrc?: string;
}

export interface JournalPost {
  slug: string;
  month: string;
  subtitle: string;
  date: string;
  year: number;
  coverImage?: string;
  coverGradient?: string;
  tracks: JournalTrack[];
  blocks: ContentBlock[];
  hidden?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  year: number;
  tags: string[];
  featured?: boolean;
  hidden?: boolean;
  externalUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  githubUrl?: string;
  hero?: { type: "image" | "video"; src: string; alt: string };
  sections: { id: string; title: string; blocks: ContentBlock[] }[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo?: string;
  period: string;
  highlights?: string[];
}

export const experiences: Experience[] = [
  {
    id: "sandisk-2025",
    title: "Advanced Memory Intern",
    company: "SanDisk",
    logo: "/sandisk.svg",
    period: "Feb 2025 - Aug 2025",
    highlights: [
      "Built ML trim optimization platform to predict read-window outcomes using XGBoost, configurable DNNs, and clustering to guide trim selection across process corners.",
      "Scaled ingestion and feature pipelines to 48TB+ with NumPy, Pandas, and SQL, using parallelism and batching to cut manual optimization time by 7x.",
      "Automated experiments with an LLM-backed reporting stack and Dockerized workflows for reproducible execution across test sites.",
    ],
  },
  {
    id: "socet-2024",
    title: "ASIC Design Flow Researcher",
    company: "Purdue SoC Extension Technologies",
    logo: "/socetlogo.svg",
    period: "2023 - ",
    highlights: [
      "Built a Cadence Genus/Innovus physical flow for MITLL 20nm with automated congestion and IR-drop checks.",
      "Developed C operator kernels (GEMM, Softmax, ReLU) and integrated PyTorch with an in-house systolic-array accelerator.",
      "Optimized a GPU compiler to reduce divergence and improve scheduling for higher throughput.",
    ],
  },
  {
    id: "endian-2025",
    title: "Engineer",
    company: "Endian",
    period: "Mar 2025 - May 2025",
    highlights: [
      "Built an automation platform with Node.js and FastAPI, Dockerized and backed by Supabase, orchestrating a 20-agent browser-use fleet.",
      "Designed a security-first credential flow with incremental capture, client-side encryption, and secrets management.",
    ],
  },
  {
    id: "comma-2025",
    title: "Comma Capital Fellow",
    company: "Comma Capital",
    period: "2025",
    highlights: [
      "Selected fellow focused on frontier systems and AI infrastructure; collaborated on product and investment research.",
    ],
  },
  {
    id: "stars-2024",
    title: "Chip Design Intern",
    company: "STARS @Purdue",
    logo: "/purduelogo.svg",
    period: "Summer 2024",
    highlights: [
      "Designed and taped out a wireless messaging ASIC in SKY130 with GPIO, Wishbone bus control, and maskable interrupts.",
    ],
  },
  {
    id: "stanford-2022",
    title: "Student Researcher",
    company: "Stanford Cornfield Lab",
    logo: "/stanfordlogo.svg",
    period: "2022 - 2022",
  },
  {
    id: "ibm-2021",
    title: "Research Intern",
    company: "IBM Almaden",
    logo: "/ibmlogo.svg",
    period: "2021 - 2021",
  },
];

export const journalPosts: JournalPost[] = [
  {
    slug: "cuda-mmm",
    month: "How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance",
    subtitle: "going from naive to 94% of cuBLAS, one kernel at a time",
    date: "October 2025",
    year: 2025,
    tracks: [],
    blocks: [
      {
        type: "paragraph",
        text: "SGEMM is probably the single most important computational kernel in modern deep learning — if you could only profile one operation in a transformer, it would be this one. I wanted to understand from first principles why GPUs are so good at it, and what it actually takes to close the gap with cuBLAS. This is my attempt to work through that iteratively, going from a naive kernel to something that hits ~94% of cuBLAS on an A6000.",
      },
      {
        type: "paragraph",
        text: "The thing I find fascinating about this exercise is that the gap between the naive implementation and cuBLAS is about 75x in raw throughput. Almost none of that gap comes from algorithmic cleverness — it's all about understanding the memory hierarchy and feeding the compute units correctly. The math is simple; the hard part is data movement.",
      },
      {
        type: "paragraph",
        text: "Before diving in: CUDA organizes computation into a three-level hierarchy. A kernel launch creates a grid of blocks, each block contains up to 1024 threads, and threads within the same block share a fast on-chip scratchpad called shared memory (SMEM). This hierarchy exists primarily to map cleanly onto GPU hardware — blocks map to streaming multiprocessors (SMs), and threads within a block share SMEM.",
      },
      {
        type: "paragraph",
        text: "The blockDim variable is a 3D integer vector specifying how many threads live in each block dimension. Combined with gridDim (the number of blocks), this determines the full thread layout:",
      },
      {
        type: "image",
        src: "/cuda-mmm/CUDA_thread_hierarchy.png",
        alt: "CUDA thread hierarchy diagram showing blockDim and threadIdx relationships",
        caption: "The CUDA thread hierarchy. blockDim.x × blockDim.y gives threads per block; gridDim.x × gridDim.y gives the total block count.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "One important mental model shift: the thread hierarchy is primarily a correctness tool, not a performance one. For performance, you have to think in terms of warps — groups of 32 threads that execute in lockstep on the hardware. The block/grid structure tells you who can communicate; the warp structure tells you what the hardware actually schedules.",
      },
      // Kernel 1
      {
        type: "heading",
        level: 2,
        text: "Kernel 1: Naive Implementation",
      },
      {
        type: "paragraph",
        text: "The simplest possible kernel: assign each thread one output element in C, then loop over the K dimension accumulating the dot product. Dead simple, and predictably slow. Each thread independently reads a full row of A and full column of B, with essentially no data reuse.",
      },
      {
        type: "image",
        src: "/cuda-mmm/naive-kernel.png",
        alt: "Naive kernel visualization showing thread layout and computation assignments",
        caption: "Each thread computes exactly one output entry of C.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `__global__ void sgemm_naive(int M, int N, int K, float alpha, const float *A,
                            const float *B, float beta, float *C) {
  const uint x = blockIdx.x * blockDim.x + threadIdx.x;
  const uint y = blockIdx.y * blockDim.y + threadIdx.y;

  if (x < M && y < N) {
    float tmp = 0.0;
    for (int i = 0; i < K; ++i) {
      tmp += A[x * K + i] * B[i * N + y];
    }
    C[x * N + y] = alpha * tmp + beta * C[x * N + y];
  }
}`,
      },
      {
        type: "paragraph",
        text: "CUDA kernels are written from a single-thread perspective — you write what one thread does, and the runtime stamps out N copies of that logic across the grid. The blockIdx and threadIdx builtins tell each thread where it sits. The math for your global index is always the same pattern: blockIdx * blockDim + threadIdx.",
      },
      {
        type: "paragraph",
        text: "One subtlety worth flagging: if the matrix dimension isn't cleanly divisible by BLOCKSIZE, you need to launch extra blocks to cover the remainder. Those blocks will have some inactive threads (tile quantization). It's a small overhead for large matrices, but matters at small sizes — which is part of why cuBLAS switches kernels depending on matrix dimensions.",
      },
      {
        type: "image",
        src: "/cuda-mmm/Tile_quantization.png",
        alt: "Tile quantization illustration showing partial block utilization",
        caption: "Tile quantization: extra blocks are launched for the remainder, not all threads are active.",
        invert: true,
      },
      {
        type: "heading",
        level: 3,
        text: "Napkin Math: How Fast Can This Be?",
      },
      {
        type: "paragraph",
        text: "Before profiling, let's bound the problem. For two 4092² matrices, the GEMM requires 2×4092³ ≈ 137 GFLOPs. The minimum GMEM transfer is 268MB (3 matrices × 4092² × 4B). On an A6000 with 30 TFLOPs/s compute and 768 GB/s bandwidth, compute takes ~4.5ms and memory takes ~0.34ms. The kernel is ~13x more compute-intensive than memory-intensive — so it should be compute-bound once we stop wasting memory bandwidth. cuBLAS itself loads about 500MB during the computation (not the theoretical minimum), which is the target to beat.",
      },
      {
        type: "paragraph",
        text: "I find this ratio really useful to keep in mind as we go through each optimization. The question to ask at each step is: are we closer to being compute-bound, or are we still hemorrhaging bandwidth? The roofline model makes this explicit.",
      },
      {
        type: "heading",
        level: 3,
        text: "Why the Naive Kernel is Terrible",
      },
      {
        type: "paragraph",
        text: "Two threads in the same block with threadIds (0,0) and (0,1) load the same column of B but different rows of A. With no caching, each thread loads 2×4092 floats, so 4092² threads produce 548GB of memory traffic for a 268MB problem — a 2× overshoot even in theory, and in practice much worse because there's no data reuse at all across threads.",
      },
      {
        type: "image",
        src: "/cuda-mmm/naive_kernel_mem_access.png",
        alt: "Two threads' data access patterns from matrices A and B",
        caption: "Memory access pattern of the naive kernel for two example threads (red and green).",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Result: ~300 GFLOPs on an A6000. For context, that's about what a well-tuned 2015 Haswell CPU achieves. A GPU with 100× the memory bandwidth is performing at CPU level because we're completely ignoring its access pattern requirements.",
      },
      // Kernel 2
      {
        type: "heading",
        level: 2,
        text: "Kernel 2: Global Memory Coalescing",
      },
      {
        type: "paragraph",
        text: "The key GPU concept here is the warp. Threads within a block are grouped into warps of 32, and a warp is the actual unit of execution on the hardware — all 32 threads in a warp execute the same instruction simultaneously (SIMT). The warp scheduler is what actually dispatches instructions to the CUDA cores.",
      },
      {
        type: "paragraph",
        text: "Warps are formed from consecutive threadIds: threadId = threadIdx.x + blockDim.x*(threadIdx.y + blockDim.y*threadIdx.z). The x dimension is the fast-varying one. Think of it as column-major in 'warp space' — threads with adjacent threadIdx.x values end up in the same warp.",
      },
      {
        type: "image",
        src: "/cuda-mmm/threadId_to_warp_mapping.png",
        alt: "Illustration of how threadIds map to warps",
        caption: "Thread-to-warp mapping illustrated using an 8-thread warp example (real warps have 32 threads).",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Global memory coalescing is the single most important GMEM optimization on GPU. When threads in the same warp issue memory requests to consecutive addresses, the hardware can combine them into one transaction. 32 threads × 4 bytes = 128 bytes, which fits exactly in one L2 cache line — perfect coalescing means 1 transaction per warp instead of 32.",
      },
      {
        type: "image",
        src: "/cuda-mmm/GMEM_coalescing.png",
        alt: "Consecutive memory accesses grouped into single transactions",
        caption: "Global memory coalescing groups consecutive warp accesses into fewer, larger transactions.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "An interesting nuance: threads within a warp don't have to access memory in threadIdx order for coalescing to work — they just need to collectively touch a consecutive, aligned 128B region. The hardware figures out which transaction to issue based on the union of all the addresses. Non-consecutive within-warp access patterns can still coalesce as long as the addresses themselves are contiguous.",
      },
      {
        type: "image",
        src: "/cuda-mmm/random_access_coalescing.png",
        alt: "Non-consecutive within-warp accesses that still coalesce",
        caption: "Non-consecutive within-warp accesses can still coalesce as long as they target consecutive addresses.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "In the naive kernel we mapped threadIdx.x to the row of A. Threads with consecutive threadIdx.x (i.e., in the same warp) therefore load consecutive rows of A — but A is row-major, so consecutive rows are strided by K floats. That's 32 × K × 4B of cache-line fetches for K dot-product steps. No coalescing at all.",
      },
      {
        type: "image",
        src: "/cuda-mmm/Naive_kernel_mem_coalescing.png",
        alt: "Non-consecutive row loading from matrix A in naive kernel",
        caption: "The naive kernel accesses A non-consecutively, preventing coalescing.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The fix: swap how we assign output elements to threads. Instead of threadIdx.x → row, use threadIdx.x → column. Threads in the same warp now compute the same row of C but consecutive columns — meaning they load the same row of A (broadcast-friendly) and consecutive columns of B (coalesced).",
      },
      {
        type: "image",
        src: "/cuda-mmm/Naive_kernel_improved_access.png",
        alt: "Reorganized thread-to-result mapping for coalescing",
        caption: "Reorganizing the thread-to-result mapping enables coalesced global memory access.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "To implement this, we only need to change the first two lines of the index computation:",
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `const int x = blockIdx.x * BLOCKSIZE + (threadIdx.x / BLOCKSIZE);
const int y = blockIdx.y * BLOCKSIZE + (threadIdx.x % BLOCKSIZE);

if (x < M && y < N) {
  float tmp = 0.0;
  for (int i = 0; i < K; ++i) {
    tmp += A[x * K + i] * B[i * N + y];
  }
  C[x * N + y] = alpha * tmp + beta * C[x * N + y];
}`,
      },
      {
        type: "paragraph",
        text: "What I found surprising: enabling coalescing changes zero assembly instructions. Coalescing is handled entirely by the hardware memory system at runtime — the PTX and SASS look identical. That makes sense: the compiler can't know at compile time whether the base pointers will be aligned, so it can't emit different instructions. The hardware figures it out dynamically per transaction.",
      },
      {
        type: "paragraph",
        text: "The payoff is huge: memory throughput jumps from 15 GB/s to 110 GB/s, and FLOP/s goes from ~300 to ~2000 GFLOPS. We haven't changed any math, any shared memory usage, or any arithmetic — just the index assignment. It's a pure access pattern win.",
      },
      // Kernel 3
      {
        type: "heading",
        level: 2,
        text: "Kernel 3: Shared Memory Cache-Blocking",
      },
      {
        type: "paragraph",
        text: "The GPU memory hierarchy has a crucial middle tier: shared memory (SMEM). It sits on-chip, physically next to the CUDA cores, and is partitioned among blocks — every thread in a block can read and write the same SMEM region. On Volta-era hardware, SMEM bandwidth is measured at ~12 TB/s vs. ~750 GB/s for DRAM — roughly a 16× difference. On an A6000, each block gets up to 48KB of SMEM.",
      },
      {
        type: "image",
        src: "/cuda-mmm/memory-hierarchy-in-gpus.png",
        alt: "GPU memory hierarchy showing cache structure for A100",
        caption: "The GPU memory hierarchy. Shared memory is on-chip and orders of magnitude faster than DRAM.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The cache-blocking idea: instead of every thread independently fetching from GMEM, a group of threads cooperatively loads a tile of A and a tile of B into SMEM. Then everyone computes on the fast local copy. We slide the tile along the K dimension, accumulating partial sums. Each float in SMEM gets used by multiple threads, so the GMEM traffic per FLOP drops significantly.",
      },
      {
        type: "image",
        src: "/cuda-mmm/cache-blocking.png",
        alt: "Cache-blocking visualization showing chunk-based loading and computation",
        caption: "Cache-blocking: load tiles of A and B into shared memory, compute partial sums, then advance.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `A += cRow * BLOCKSIZE * K;
B += cCol * BLOCKSIZE;
C += cRow * BLOCKSIZE * N + cCol * BLOCKSIZE;

float tmp = 0.0;
for (int bkIdx = 0; bkIdx < K; bkIdx += BLOCKSIZE) {
  As[threadRow * BLOCKSIZE + threadCol] = A[threadRow * K + threadCol];
  Bs[threadRow * BLOCKSIZE + threadCol] = B[threadRow * N + threadCol];

  __syncthreads();

  A += BLOCKSIZE;
  B += BLOCKSIZE * N;

  for (int dotIdx = 0; dotIdx < BLOCKSIZE; ++dotIdx) {
    tmp += As[threadRow * BLOCKSIZE + dotIdx] *
           Bs[dotIdx * BLOCKSIZE + threadCol];
  }
  __syncthreads();
}
C[threadRow * N + threadCol] =
    alpha * tmp + beta * C[threadRow * N + threadCol];`,
      },
      {
        type: "paragraph",
        text: "The result is ~2200 GFLOPS — only a 50% improvement. That might seem small given the effort. The reason: Kernel 2 already got decent L1 hit rates due to the access pattern change, so the explicit SMEM tiling doesn't buy as much as you'd hope. More importantly, the roofline reveals the real problem.",
      },
      {
        type: "image",
        src: "/cuda-mmm/roofline_kernel_3.png",
        alt: "Roofline analysis showing performance vs arithmetic intensity for Kernel 3",
        caption: "Roofline plot for Kernel 3. We're far from the compute roofline — arithmetic intensity is the bottleneck.",
        invert: true,
      },
      {
        type: "heading",
        level: 3,
        text: "The Roofline and the Arithmetic Intensity Problem",
      },
      {
        type: "paragraph",
        text: "The roofline model plots achieved FLOPs/s vs. arithmetic intensity (FLOPs per byte of memory traffic). It has two limits: a horizontal line at peak compute (30 TFLOPs/s), and a diagonal line at peak memory bandwidth (768 GB/s × FLOPs/byte). If you're below the diagonal, you're memory-bound. If you're at the horizontal ceiling, you're compute-bound. Kernel 3 sits far below both — its arithmetic intensity is too low to be compute-bound, but it's also not saturating bandwidth. It's stalling on SMEM.",
      },
      {
        type: "paragraph",
        text: "Occupancy at CHUNKSIZE=32 is ~66% (limited by thread count, not SMEM or registers). That's not terrible. But the profiler tells the real story: the instruction mix is dominated by LDS (shared memory loads) rather than FMA. We're spending cycles fetching from SMEM, not doing math. The fix: each thread needs to compute more output elements per SMEM access — reduce the ratio of loads to FMAs by doing more work in registers.",
      },
      // Kernel 4
      {
        type: "heading",
        level: 2,
        text: "Kernel 4: 1D Blocktiling for Calculating Multiple Results per Thread",
      },
      {
        type: "paragraph",
        text: "Instead of each thread computing one output element, we assign it a column of TM output elements. Each thread now keeps an array of TM partial sums in registers across the K-dimension loop. The critical loop reordering: put dotIdx (the position within the BK tile) as the outer inner loop, and resIdx (which of the TM outputs) as the inner loop. This way, for each dotIdx we load one value of Bs into a register (Btmp) and reuse it across all TM multiply-accumulates. One SMEM load, TM FMAs.",
      },
      {
        type: "image",
        src: "/cuda-mmm/kernel_4_1D_blocktiling.png",
        alt: "1D blocktiling showing multiple results per thread computation pattern",
        caption: "1D blocktiling: each thread computes a column of TM output elements, improving register reuse.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `float threadResults[TM] = {0.0};

for (uint bkIdx = 0; bkIdx < K; bkIdx += BK) {
  As[innerRowA * BK + innerColA] = A[innerRowA * K + innerColA];
  Bs[innerRowB * BN + innerColB] = B[innerRowB * N + innerColB];
  __syncthreads();

  A += BK;
  B += BK * N;

  for (uint dotIdx = 0; dotIdx < BK; ++dotIdx) {
    float Btmp = Bs[dotIdx * BN + threadCol];
    for (uint resIdx = 0; resIdx < TM; ++resIdx) {
      threadResults[resIdx] +=
          As[(threadRow * TM + resIdx) * BK + dotIdx] * Btmp;
    }
  }
  __syncthreads();
}`,
      },
      {
        type: "heading",
        level: 3,
        text: "What the Compiler Does for You",
      },
      {
        type: "paragraph",
        text: "With TM known at compile time (it's a template parameter), the compiler can unroll the inner resIdx loop and allocate the threadResults array entirely in registers. The Btmp caching happens automatically too — the compiler sees that Bs[dotIdx * BN + threadCol] doesn't change across the resIdx iterations and hoists it into a register. This is why templating the tile sizes matters: without compile-time knowledge, the compiler has to be conservative.",
      },
      {
        type: "image",
        src: "/cuda-mmm/1d_warp_tiling.png",
        alt: "1D warp tiling benefits showing shared input advantage",
        caption: "The benefit of 1D blocktiling: threads in the same warp share loads from Bs, amortizing SMEM traffic.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Result: ~8,600 GFLOPs, a 4× jump from Kernel 3. The profiler confirms the story — MIO stall cycles (shared memory contention) drop dramatically. We've shifted the bottleneck from 'waiting for SMEM' to actually doing FMAs. But we're still only doing 1D output tiling; we can push further.",
      },
      // Kernel 5
      {
        type: "heading",
        level: 2,
        text: "Kernel 5: Increasing Arithmetic Intensity via 2D Blocktiling",
      },
      {
        type: "paragraph",
        text: "Extend the idea to 2D: each thread now computes a TM×TN output tile. The arithmetic intensity improvement is multiplicative — instead of reusing a Bs value across TM rows, we now reuse a regM value across TN columns and a regN value across TM rows. The inner loop becomes an outer product: load TM values from As into regM, load TN values from Bs into regN, then compute the full TM×TN outer product and accumulate into threadResults.",
      },
      {
        type: "image",
        src: "/cuda-mmm/raising_arith_inten.png",
        alt: "Arithmetic intensity explanation showing compute-to-bandwidth ratio improvement",
        caption: "2D tiling raises arithmetic intensity by reusing loaded values across both row and column dimensions.",
        invert: true,
      },
      {
        type: "image",
        src: "/cuda-mmm/kernel_5_2D_blocktiling.png",
        alt: "2D blocktiling diagram with three loop levels",
        caption: "2D blocktiling: each thread computes an 8×8 result tile using three nested loops.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `float threadResults[TM * TN] = {0.0};
float regM[TM] = {0.0};
float regN[TN] = {0.0};

for (uint bkIdx = 0; bkIdx < K; bkIdx += BK) {
  for (uint loadOffset = 0; loadOffset < BM; loadOffset += strideA) {
    As[(innerRowA + loadOffset) * BK + innerColA] =
        A[(innerRowA + loadOffset) * K + innerColA];
  }
  for (uint loadOffset = 0; loadOffset < BK; loadOffset += strideB) {
    Bs[(innerRowB + loadOffset) * BN + innerColB] =
        B[(innerRowB + loadOffset) * N + innerColB];
  }
  __syncthreads();

  A += BK;
  B += BK * N;

  for (uint dotIdx = 0; dotIdx < BK; ++dotIdx) {
    for (uint i = 0; i < TM; ++i) {
      regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
    }
    for (uint i = 0; i < TN; ++i) {
      regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
    }
    for (uint resIdxM = 0; resIdxM < TM; ++resIdxM) {
      for (uint resIdxN = 0; resIdxN < TN; ++resIdxN) {
        threadResults[resIdxM * TN + resIdxN] +=
            regM[resIdxM] * regN[resIdxN];
      }
    }
  }
  __syncthreads();
}`,
      },
      {
        type: "image",
        src: "/cuda-mmm/kernel_5_GMEM_loading.png",
        alt: "Multiple-element loading per thread into SMEM",
        caption: "GMEM loading pattern for Kernel 5: each thread loads multiple elements into shared memory.",
        invert: true,
      },
      {
        type: "image",
        src: "/cuda-mmm/kernel_5_reg_blocking.png",
        alt: "Register blocking showing dotIdx loop across time",
        caption: "Register blocking: regM and regN cache SMEM values in registers, then compute outer products.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Result: ~16 TFLOPs — another 2× improvement. The GMEM accesses per output element drop to K/64, and SMEM accesses to K/4. We're now genuinely close to the compute roofline. The remaining gap to cuBLAS is about vectorized loads (memory efficiency) and warp-level data locality, which Kernels 6 and 10 address.",
      },
      // Kernel 6
      {
        type: "heading",
        level: 2,
        text: "Kernel 6: Vectorize SMEM and GMEM Accesses",
      },
      {
        type: "paragraph",
        text: "Two tricks in one kernel. First, vectorized GMEM loads: use float4 to load 128 bits (4 floats) per instruction, turning LDG.E.32 into LDG.E.128. You have to explicitly promise the compiler the pointer is 128-bit aligned via reinterpret_cast — it can't figure that out from a generic float* argument. Second, transpose As during the SMEM load so that the subsequent SMEM reads along the column dimension become sequential (enabling LDS.128 instead of strided scalar loads).",
      },
      {
        type: "image",
        src: "/cuda-mmm/kernel_6_As_transpose.png",
        alt: "Memory layout changes enabling vectorized SMEM loads for As",
        caption: "Transposing As during the GMEM→SMEM transfer enables vectorized 128-bit SMEM loads.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `float4 tmp =
    reinterpret_cast<float4 *>(&A[innerRowA * K + innerColA * 4])[0];
As[(innerColA * 4 + 0) * BM + innerRowA] = tmp.x;
As[(innerColA * 4 + 1) * BM + innerRowA] = tmp.y;
As[(innerColA * 4 + 2) * BM + innerRowA] = tmp.z;
As[(innerColA * 4 + 3) * BM + innerRowA] = tmp.w;

reinterpret_cast<float4 *>(&Bs[innerRowB * BN + innerColB * 4])[0] =
    reinterpret_cast<float4 *>(&B[innerRowB * N + innerColB * 4])[0];
__syncthreads();`,
      },
      {
        type: "paragraph",
        text: "The As transpose is the subtle part. In Kernel 5, loading a column of As during the inner computation required strided SMEM reads (bad for bank conflicts). By storing As transposed (column-major) during the loading phase, the inner reads become row-sequential, which both avoids bank conflicts and enables vectorized LDS.128. The extra work during loading is cheap compared to the savings during compute.",
      },
      {
        type: "paragraph",
        text: "Performance: ~18,200 GFLOPs, about 500 GFLOP/s over Kernel 5. Meaningful but not dramatic — the low-hanging fruit is mostly picked. The remaining gap to cuBLAS at this point is bank conflicts in SMEM, no double buffering (the GPU stalls waiting for SMEM loads to complete instead of overlapping compute and fetch), and the warp-level register locality that warptiling exploits.",
      },
      // Kernel 9
      {
        type: "heading",
        level: 2,
        text: "Kernel 9: Autotuning",
      },
      {
        type: "paragraph",
        text: "By this point, the kernel has accumulated five template parameters: BM and BN for the shared memory tile dimensions, BK for the K-dimension tile, and TM and TN for the per-thread register tile. The initial guess — BM=BN=128, BK=8, TM=TN=8 — is reasonable but almost certainly not optimal. Autotuning is just a grid search with validation: write a bash script, sweep sensible combinations, benchmark each, pick the winner.",
      },
      {
        type: "paragraph",
        text: "The tricky part is keeping the search space honest. Not all combinations are valid — vectorized SMEM loads require BM*BK to be divisible by 4*NUM_THREADS, for instance. Out of ~400 configurations, maybe 200 compile and produce correct results. Validating each against a reference prevents accepting fast-but-wrong kernels.",
      },
      {
        type: "paragraph",
        text: "On the A6000, the winner was BM=BN=128, BK=16, TM=TN=8 — only the K-tile changed. That tweak alone pushed throughput from ~19 to ~20 TFLOPs, a ~5% gain. What's humbling is that we can't fully explain *why* BK=16 beats BK=8 on this GPU. Larger BK means more data loaded per SMEM phase, which reduces the total number of GMEM loads — but it also increases register pressure and affects occupancy. The optimal balance is hardware-specific and analytically difficult to predict. This is why production libraries like CUTLASS and cuDNN literally ship hundreds of kernel variants selected at runtime by a dispatcher — the hardware landscape is too fragmented for any single 'best' configuration.",
      },
      // Kernel 10
      {
        type: "heading",
        level: 2,
        text: "Kernel 10: Warptiling",
      },
      {
        type: "paragraph",
        text: "Kernel 10 introduces a third level of tiling between blocktiling and threadtiling: warptiling. This is the sneaky level that CUDA hides from you — warps don't appear as an explicit concept in your code, but they're very real in the hardware. Every 32 threads are grouped into a warp that executes in lockstep, and the warp ID is just threadIdx.x / 32. The hardware scheduler thinks in warps, not threads.",
      },
      {
        type: "image",
        src: "/cuda-mmm/Loop_structure.png",
        alt: "Block, thread, and warp tiling nesting levels",
        caption: "The three-level loop structure: block tiles → warp tiles → thread tiles.",
        invert: true,
      },
      {
        type: "image",
        src: "/cuda-mmm/WarpSchedulers.png",
        alt: "Four warp schedulers per multiprocessor diagram",
        caption: "Each SM has four warp schedulers. Warptiling lets different warps run on different schedulers concurrently.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Warps matter for three distinct reasons. First, they're the unit of scheduling — the A6000 has four warp schedulers per SM, so four warps can issue instructions concurrently each cycle. If your block only has one warp's worth of useful work at a time, you're leaving 3/4 of the scheduler capacity idle. Second, SMEM bank conflicts happen at the warp level — when 32 threads in a warp all access the same bank, those accesses serialize. Third, recent GPUs have register file caches that provide faster access to recently used registers; warptiling ensures that the threads in a warp all operate on adjacent data, maximizing cache locality at the register level. Warptiling is what makes the three levels of the memory hierarchy map cleanly to the three levels of the GPU compute hierarchy: GMEM → block, SMEM → warp, registers → thread.",
      },
      {
        type: "image",
        src: "/cuda-mmm/kernel_10_warp_tiling.png",
        alt: "Three-level tiling visualization for Kernel 10",
        caption: "Kernel 10 warptiling: each warp computes a (WSUBN*WNITER) × (WSUBM*WMITER) chunk of C.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `for (uint dotIdx = 0; dotIdx < BK; ++dotIdx) {
  for (uint wSubRowIdx = 0; wSubRowIdx < WMITER; ++wSubRowIdx) {
    for (uint i = 0; i < TM; ++i) {
      regM[wSubRowIdx * TM + i] =
          As[(dotIdx * BM) + warpRow * WM + wSubRowIdx * WSUBM +
             threadRowInWarp * TM + i];
    }
  }
  for (uint wSubColIdx = 0; wSubColIdx < WNITER; ++wSubColIdx) {
    for (uint i = 0; i < TN; ++i) {
      regN[wSubColIdx * TN + i] =
          Bs[(dotIdx * BN) + warpCol * WN + wSubColIdx * WSUBN +
             threadColInWarp * TN + i];
    }
  }

  for (uint wSubRowIdx = 0; wSubRowIdx < WMITER; ++wSubRowIdx) {
    for (uint wSubColIdx = 0; wSubColIdx < WNITER; ++wSubColIdx) {
      for (uint resIdxM = 0; resIdxM < TM; ++resIdxM) {
        for (uint resIdxN = 0; resIdxN < TN; ++resIdxN) {
          threadResults[(wSubRowIdx * TM + resIdxM) * (WNITER * TN) +
                        (wSubColIdx * TN) + resIdxN] +=
              regM[wSubRowIdx * TM + resIdxM] *
              regN[wSubColIdx * TN + resIdxN];
        }
      }
    }
  }
}`,
      },
      {
        type: "paragraph",
        text: "After autotuning kernel 10, throughput climbed from ~19.7 to ~21.7 TFLOPs — a 10% jump from warptiling alone. The gap to cuBLAS at large sizes is now small, maybe 5-10%. But look at the small-matrix performance in the chart below: cuBLAS crushes us on small dimensions. The reason is instructive. By using nvcc --generate-code and peeling apart the cuBLAS binary, you can see it contains ~16 distinct SGEMM implementations, dispatched at runtime based on matrix shape and size. For small square matrices it uses a split-K variant that partitions the K-dimension across thread blocks, enabling more parallelism when M and N are small. Writing one kernel that's optimal at every shape is essentially impossible — cuBLAS doesn't try.",
      },
      {
        type: "image",
        src: "/cuda-mmm/split_k.png",
        alt: "Split-K concept showing K-dimension partitioning across multiple thread blocks",
        caption: "Split-K: partition the K dimension across multiple blocks, useful for small square matrices.",
        invert: true,
      },
      {
        type: "image",
        src: "/cuda-mmm/cublas_vs_kernel_10_sizes.png",
        alt: "Line graph comparing Kernel 10 performance vs cuBLAS across matrix sizes",
        caption: "Kernel 10 vs cuBLAS across matrix sizes. Near-parity at large dimensions; gap at small sizes.",
        invert: true,
      },
      // Conclusion
      {
        type: "heading",
        level: 2,
        text: "Conclusion",
      },
      {
        type: "paragraph",
        text: "The thing that surprised me most about this project wasn't any particular optimization — it was the shape of the progress curve. The first two kernels (naive → coalesced) covered about 80% of the gap to cuBLAS and took maybe a weekend to understand and implement. The remaining 14% took weeks more. Every optimization past the low-hanging fruit required deeper hardware knowledge, better profiling intuition, and a higher tolerance for ambiguity. The power law of optimization effort is real.",
      },
      {
        type: "paragraph",
        text: "Looking back, what SGEMM teaches about GPU programming transfers everywhere. Memory bandwidth is almost always the binding constraint, and every layer of the memory hierarchy (GMEM → L2 → SMEM → registers) is there to fight that constraint at a progressively smaller scale. The tiling pattern — identify a bottleneck, tile across the level of memory hierarchy that resolves it, repeat — shows up in virtually every high-performance GPU kernel. Attention kernels (FlashAttention), convolutions, sparse operations: they're all variations on the same theme. Learning SGEMM from scratch is basically learning the vocabulary of GPU optimization.",
      },
      {
        type: "paragraph",
        text: "One thing I'd add beyond the original: if you want to understand why cuBLAS is so hard to beat, spend time with a profiler looking at your kernel's warp efficiency, memory throughput, and SM occupancy simultaneously. These numbers are often at tension with each other — maximizing occupancy can hurt register reuse, maximizing tile size can hurt occupancy. The art is in the tradeoffs. CUTLASS's design, with its hierarchical policy system and autotuned dispatch, is essentially a systematic solution to that multi-objective problem. If you're building production ML infrastructure, using CUTLASS as a foundation is almost certainly the right call. If you're learning, writing kernels from scratch like this is irreplaceable.",
      },
      {
        type: "heading",
        level: 2,
        text: "Further Resources",
      },
      {
        type: "list",
        items: [
          "wangzyon's GitHub repository — the benchmarking harness used here as a starting point. Well-structured for iterating on kernel variants.",
          "NVIDIA CUTLASS library — readable, production-grade CUDA for GEMM and related ops. The source of truth for how modern GPU kernels are structured.",
          "Official CUDA docs: Toolkit Programming Guide, Best Practices Guide, Kernel Profiling Guide — dense but complete.",
          "Onur Mutlu's YouTube lectures on Computer Architecture and Heterogeneous Systems — best free resource for building a mental model of GPU hardware.",
          "'Understanding Latency Hiding on GPUs' (Volkov, 2016) — the canonical deep-dive on occupancy, ILP, and warp scheduling. Required reading if you want to understand why occupancy != utilization.",
          "Lei Mao's CUDA blog — pragmatic, code-first coverage of CUDA patterns and pitfalls.",
          "ONNX Runtime CUDA provider and cuDNN source — when you want to see what a production system actually looks like under the hood.",
        ],
      },
      {
        type: "link",
        label: "Reimagined from article by Simon Boehm",
        href: "https://siboehm.com/articles/22/CUDA-MMM"
      },
    ],
  },
  // ─── CPU Matrix Multiplication ───────────────────────────────────────────────
  {
    slug: "cpu-mmm",
    month: "Fast Multidimensional Matrix Multiplication on CPU from Scratch",
    subtitle: "loop reordering, tiling, and multithreading",
    date: "January 2026",
    year: 2026,
    tracks: [],
    blocks: [
      {
        type: "paragraph",
        text: "NumPy can multiply two 1024×1024 float32 matrices on a quad-core Intel CPU in roughly 8ms. That translates to ~250 GFLOP/s — about 18 FLOPs per core per clock cycle at 3.4 GHz. For a CPU released in 2015, that's absurd. And it's not magic: it's the result of decades of highly specific, hand-tuned assembly in libraries like Intel MKL and OpenBLAS.",
      },
      {
        type: "paragraph",
        text: "The question I kept coming back to: how far can you get starting from a simple nested for-loop in C++? Not to beat BLAS — OpenBLAS's SGEMM is ~7,000 lines of hand-written x86 assembly — but to understand *why* the gap exists, and what techniques close it. This is the CPU companion to my CUDA SGEMM post. Same algorithm, same hierarchical optimization story, different hardware.",
      },
      {
        type: "paragraph",
        text: "Spoiler: we end up at ~9 FLOPs/core/cycle (half of peak) using cache-aware loop ordering, tiling, and OpenMP multithreading. The final kernel works only for fixed matrix sizes and makes no attempt to generalize. The goal isn't a production library — it's a working mental model of how CPU memory hierarchies interact with compute.",
      },
      // Section: Calculating total FLOPs
      {
        type: "heading",
        level: 2,
        text: "FLOPs and Arithmetic Intensity",
      },
      {
        type: "paragraph",
        text: "For square matrices of size N×N, computing C = A×B requires one dot product per output element. Each dot product is N multiply-accumulate operations. Total: N² output entries × N inner multiplications × 2 FLOPs (mul + add) = 2N³ FLOPs.",
      },
      {
        type: "image",
        src: "/cpu-mmm/Basic_MMM.png",
        alt: "Basic matrix multiplication diagram",
        caption: "Matrix multiplication: each output entry requires a dot product of a row and a column.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "For N=1024: 2 × 1024³ ≈ 2.1 billion FLOPs. Memory footprint for three 1024×1024 float32 matrices: 3 × 4MB = 12MB. Arithmetic intensity = 2N³ / (3 × 4 × N²) ≈ N/6 ≈ 170 FLOP/byte for N=1024. At L3 bandwidth of ~40 GB/s and peak compute of ~250 GFLOP/s, the compute-to-bandwidth ratio for this size is already squarely in the compute-bound regime. Once you get the data into cache and stop thrashing it, the bottleneck is FP throughput, not memory.",
      },
      {
        type: "code-highlighted",
        language: "python",
        code: `def MMM(A, B):
    C = np.zeros((A.n_rows, B.n_columns))
    for row in range(A.n_rows):
        for col in range(B.n_columns):
            for inner in range(A.n_inner):
                C[row, col] = C[row, col] + A[row, inner] * B[inner, col]
    return C`,
      },
      // Section: Running on a physical machine
      {
        type: "heading",
        level: 2,
        text: "Benchmarking the Baseline: NumPy on Haswell",
      },
      {
        type: "code-highlighted",
        language: "python",
        code: `x = np.random.randn(1024, 1024).astype(np.float32)
y = np.random.randn(1024, 1024).astype(np.float32)
start = time.time_ns()
z = np.dot(x, y)
end = time.time_ns() - start`,
      },
      {
        type: "paragraph",
        text: "On an Intel i7-6700 Haswell (quad-core, 3.4 GHz), this takes ~8ms. 2.1B FLOPs in 8ms = 263 GFLOP/s = 18.5 FLOPs/core/cycle. On silicon from 2015. NumPy dispatches to Intel MKL's SGEMM kernel here — the BLAS routine for single-precision general matrix multiply: C = α·A·B + β·C.",
      },
      {
        type: "paragraph",
        text: "Where does 18.5 FLOPs/core/cycle come from? The theoretical peak for Haswell with AVX2 and FMA is 2 × (256/32) = 16 FLOPs per VFMADD instruction, at 2 instructions/cycle = 32 FLOPs/cycle. MKL achieves 18.5/32 ≈ 58% of peak — excellent for a general-purpose BLAS on arbitrary matrices. We'll aim to hit half that.",
      },
      // Section: How can a single core do 18 FLOPs in a cycle?
      {
        type: "heading",
        level: 2,
        text: "SIMD and FMA: The Secret to 18 FLOPs/Cycle",
      },
      {
        type: "paragraph",
        text: "A scalar float multiply takes one execution unit one clock. But a 256-bit AVX2 YMM register holds 8 floats, so a VMULPS (vectorized multiply) executes 8 multiplications in the same slot. That's 8× instruction-level throughput for free — the silicon is already there, you just have to tell the compiler to use it.",
      },
      {
        type: "image",
        src: "/cpu-mmm/Scalar_vs_Vectorized.png",
        alt: "Scalar vs vectorized operations comparison",
        caption: "SIMD: one instruction, multiple data. AVX2 processes 8 floats per operation.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "FMA (Fused Multiply-Add) fuses a multiply and add into a single instruction: A += B * C. On Haswell, VFMADD213PS operates on three 256-bit YMM registers, performing 8 fused multiply-adds — 16 FLOPs — in one instruction. According to Agner Fog's tables, VFMADD has a throughput of 0.5 cycles on Haswell (two execution ports can handle it). So theoretical peak is 2 VFMADD/cycle × 16 FLOP/VFMADD = 32 FLOP/cycle per core.",
      },
      {
        type: "paragraph",
        text: "But VFMADD has a latency of 5 cycles — meaning you have to wait 5 cycles for the result before using it as an input to the next FMA. To sustain 2 FMAs/cycle despite that 5-cycle latency, you need at least 5 × 2 = 10 independent FMA operations in flight simultaneously — 160 FLOPs of in-flight work. That's where instruction-level parallelism (ILP) comes in: structure your inner loop so that the compiler can issue multiple independent FMA instructions without waiting on data dependencies. This is why the MKL SGEMM kernel uses multiple accumulator registers — each register holds an independent partial sum, eliminating the dependency chain.",
      },
      // Section: Trying to recreate from scratch
      {
        type: "heading",
        level: 2,
        text: "Starting from Scratch: Naive C++",
      },
      {
        type: "paragraph",
        text: "Target hardware: Intel i7-6700, quad-core Haswell @ 3.4GHz. Cache layout: 32KiB L1d per core, 256KiB L2 per core, 8MB shared L3. Compiler: clang 14.0 with -O3 -march=native -ffast-math. Benchmarking via Google Benchmark; every variant validated against PyTorch's output for numerical correctness.",
      },
      {
        type: "paragraph",
        text: "The target is ~9 FLOPs/core/cycle — roughly half of the theoretical peak. Not competitive with BLAS (which is 18), but above the noise floor of a naive implementation. The constraint: our kernel only works for fixed matrix sizes known at compile time (template parameters). We sacrifice generality for speed, and that tradeoff is entirely intentional.",
      },
      {
        type: "paragraph",
        text: "Starting point — the most straightforward thing you'd write:",
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `template <int rows, int columns, int inners>
inline void matmulImplNaive(const float *left, const float *right,
                            float *result) {
  for (int row = 0; row < rows; row++) {
    for (int col = 0; col < columns; col++) {
      for (int inner = 0; inner < inners; inner++) {
        result[row * columns + col] +=
            left[row * columns + inner] * right[inner * columns + col];
      }
    }
  }
}`,
      },
      {
        type: "paragraph",
        text: "Without optimization flags: 4.4s. With -O3 -march=native -ffast-math: 1.6s — a 2.75× speedup from the compiler alone. That's already a reminder that the compiler is doing real work. But 1.6s is still ~20× slower than NumPy. A small improvement: accumulate the inner dot product in a local register and write it to C once at the end:",
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `template <int rows, int columns, int inners>
inline void matmulImplNaiveRegisterAcc(const float *left, const float *right,
                                       float *result) {
  for (int row = 0; row < rows; row++) {
    for (int col = 0; col < columns; col++) {
      float acc = 0.0;
      for (int inner = 0; inner < inners; inner++) {
        acc += left[row * columns + inner] * right[inner * columns + col];
      }
      result[row * columns + col] = acc;
    }
  }
}`,
      },
      {
        type: "paragraph",
        text: "Down to 1.5s. Modest, but real. The reason: without the explicit accumulator, the compiler has to prove it's safe to keep partial sums in a register rather than writing them to `result[]` on every iteration (pointer aliasing can prevent this). Being explicit removes the ambiguity. We're still nowhere near BLAS — the next bottleneck is the memory access pattern.",
      },
      // Section: Cache-aware implementation
      {
        type: "heading",
        level: 2,
        text: "Cache-Aware Loop Ordering",
      },
      {
        type: "paragraph",
        text: "C and most systems languages use row-major storage: matrix elements are laid out row by row in memory. A[i][j] and A[i][j+1] are adjacent. A[i][j] and A[i+1][j] are N floats apart.",
      },
      {
        type: "image",
        src: "/cpu-mmm/stride_matrix_representation.png",
        alt: "Strided matrix memory layout",
        caption: "Row-major memory layout: rows are contiguous, columns are strided by N×4 bytes.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "In the naive row-col-inner loop order, the innermost loop walks across a row of A (sequential — good, cache-line friendly) but walks down a *column* of B (stride-N — terrible). For N=1024 with float32, each step down a column of B jumps 4KB. A full column traversal touches 1024 × 4KB = 4MB, and our L1d is only 32KB. Every access to B in the inner loop is a cache miss. This is why the naive implementation is so slow — it's memory-bound despite the problem being arithmetically intensive.",
      },
      {
        type: "image",
        src: "/cpu-mmm/cache-unaware-dot-product.png",
        alt: "Cache-unfriendly access pattern for matrix B",
        caption: "The naive loop order walks B column-by-column — every inner step is a cache miss.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The fix: swap the col and inner loop order. Instead of iterating over all columns before advancing the inner index, iterate over the inner index first:",
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `template <int rows, int columns, int inners>
inline void matmulImplLoopOrder(const float *left, const float *right,
                                float *result) {
  for (int row = 0; row < rows; row++) {
    for (int inner = 0; inner < inners; inner++) {
      for (int col = 0; col < columns; col++) {
        result[row * columns + col] +=
            left[row * columns + inner] * right[inner * columns + col];
      }
    }
  }
}`,
      },
      {
        type: "image",
        src: "/cpu-mmm/cache-aware-dot-prod-reorder-loops.png",
        alt: "Optimized cache-aware access pattern after loop reordering",
        caption: "After loop reordering: the inner loop traverses B and C sequentially — cache-line friendly, vectorizable.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Runtime: 89ms. That's a 17× speedup from a one-line loop swap — the most dramatic win in the whole optimization journey. The inner loop now walks rows of B and C sequentially, so every cache miss fetches 16 useful floats. And because the memory pattern is predictable, the hardware prefetcher kicks in. More importantly, the compiler can now auto-vectorize: the sequential access pattern is exactly what allows it to emit VFMADD instructions:",
      },
      {
        type: "code-highlighted",
        language: "asm",
        code: `; Broadcast a single fp32 from row of A to all 8 entries of ymm0
; vbroadcastss ymm0, dword ptr [rsi + 4*r8]

; Load 8 entries from current row of B into ymm registers
vmovups ymm1, ymmword ptr [rbx + 4*rbp - 96]
vmovups ymm2, ymmword ptr [rbx + 4*rbp - 64]
vmovups ymm3, ymmword ptr [rbx + 4*rbp - 32]
vmovups ymm4, ymmword ptr [rbx + 4*rbp]
; Multiply current entry of A (ymm0) times B (ymm1-4), add partial results from C
vfmadd213ps ymm1, ymm0, ymmword ptr [rcx + 4*rbp - 96]
vfmadd213ps ymm2, ymm0, ymmword ptr [rcx + 4*rbp - 64]
vfmadd213ps ymm3, ymm0, ymmword ptr [rcx + 4*rbp - 32]
vfmadd213ps ymm4, ymm0, ymmword ptr [rcx + 4*rbp]
; Store partial results back to C
vmovups ymmword ptr [rcx + 4*rbp - 96], ymm1
vmovups ymmword ptr [rcx + 4*rbp - 64], ymm2
vmovups ymmword ptr [rcx + 4*rbp - 32], ymm3
vmovups ymmword ptr [rcx + 4*rbp], ymm4`,
      },
      // Section: Tiling
      {
        type: "heading",
        level: 2,
        text: "Tiling: Making the Cache Work Harder",
      },
      {
        type: "paragraph",
        text: "Loop reordering solved one cache problem but introduced another. In the reordered implementation, the middle loop (over `inner`) scans through full rows of B. For a 1024×1024 matrix, a full row is 4KB. By the time the outer `row` loop increments and we start the `inner` loop again, the B rows we just processed have been evicted from L1 (32KB). We reload them for every row of A — same data, cold cache every time.",
      },
      {
        type: "image",
        src: "/cpu-mmm/Basic_tiling_inner.png",
        alt: "Cache tiling concept visualization",
        caption: "Without tiling: by the time we revisit a tile of B for the next row of A, it's been evicted from cache.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Tiling (also called cache blocking) fixes this by splitting the middle loop into an outer tile loop and an inner tile loop. The tile loop processes a chunk of the `inner` dimension that fits in L1, then moves to the next chunk. Crucially, multiple rows of A are processed within each tile before moving on — so the tile of B stays hot in cache across those rows:",
      },
      {
        type: "code-highlighted",
        language: "python",
        code: `def matmulImplTiling(left, right, result):
    # iteration 1
    for row in range(6):
        for inner in range(3):
            for column in range(6):
                result[row, column] += left[row, inner] * right[inner, column]

    # iteration 2
    for row in range(6):
        for inner in range(3, 6):
            for column in range(6):
                result[row, column] += left[row, inner] * right[inner, column]`,
      },
      {
        type: "image",
        src: "/cpu-mmm/Tiling_on_inner.png",
        alt: "Tiling visualization with block boxes and colored arrows",
        caption: "Tiling: the colored arrows show that the same tile of B is reused across multiple rows of A before eviction.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `template <int rows, int columns, int inners, int tileSize>
inline void matmulImplTiling(const float *left, const float *right,
                             float *result) {
  for (int innerTile = 0; innerTile < inners; innerTile += tileSize) {
    for (int row = 0; row < rows; row++) {
      int innerTileEnd = std::min(inners, innerTile + tileSize);
      for (int inner = innerTile; inner < innerTileEnd; inner++) {
        for (int column = 0; column < columns; column++) {
          result[row * columns + column] +=
              left[row * inners + inner] * right[inner * columns + column];
        }
      }
    }
  }
}`,
      },
      {
        type: "paragraph",
        text: "At tile size = 16, runtime drops to 70ms — another 21% improvement over the loop-reordering baseline. The analytically 'optimal' tile size based purely on L1 capacity comes out to ~3.5 (just enough rows of B to fit in 32KB), but grid searching finds 16 to be better empirically. The discrepancy comes from loop overhead, the hardware prefetcher's preference for larger strides, and L2 reuse: tiles that are too small are evicted from L1 into L2 but may still be warm when re-accessed.",
      },
      // Section: Tiling on multiple dimensions
      {
        type: "heading",
        level: 2,
        text: "Multi-Dimensional Tiling",
      },
      {
        type: "paragraph",
        text: "We tiled the `inner` dimension — but we can also tile `rows` and `columns`. Each new tiled dimension creates a smaller inner working set that fits more comfortably in a shallower cache level, at the cost of extra loop overhead. For our 1024×1024 matrices, tiling all three dimensions gives diminishing returns; the dataset is small enough that L3 handles most of the traffic anyway. For larger matrices (say 8192×8192), multi-level tiling is essential — otherwise the B tile you worked so hard to keep in L1 gets evicted to L3 before the next row of A even starts.",
      },
      {
        type: "image",
        src: "/cpu-mmm/full_tiling.png",
        alt: "Multi-dimensional tiling visualization",
        caption: "Tiling all three dimensions: outer tiles target L3, inner tiles target L2, innermost tiles target L1.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The connection to CUDA SGEMM is direct: blocktiling is L3-equivalent (GMEM → SMEM), and threadtiling is L1-equivalent (SMEM → registers). The CPU just lets you say 'tileSize=16' in a loop; CUDA forces you to manage the shared memory buffer explicitly. Same idea, more control.",
      },
      // Section: Multithreaded
      {
        type: "heading",
        level: 2,
        text: "Multithreading with OpenMP",
      },
      {
        type: "paragraph",
        text: "The i7-6700 has 4 physical cores with hyperthreading — 8 logical cores. We've been using one. OpenMP makes adding parallelism trivial syntactically, but you have to think carefully about data dependencies before slapping a `#pragma omp parallel for` on the outermost loop.",
      },
      {
        type: "image",
        src: "/cpu-mmm/tiled_MMM_dependecies.png",
        alt: "Thread dependency partitioning for matrix multiplication",
        caption: "Dependency structure: C[i][j] depends only on row i of A and column j of B — no cross-output dependencies.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The key insight: different output tiles C[rowTile][colTile] have no write dependencies between them — each thread writes to a disjoint region of C. Partition C into (rows/256) × (cols/256) chunks and assign each chunk to a thread. Threads read from A and B (shared, read-only) and write to non-overlapping regions of C. Zero synchronization needed.",
      },
      {
        type: "image",
        src: "/cpu-mmm/Thread_partitioning.png",
        alt: "Work distribution across threads",
        caption: "Partitioning C into 16 chunks (4×4 blocks) assigned to 8 hyperthreads — roughly 2 chunks per thread.",
        invert: true,
      },
      {
        type: "code-highlighted",
        language: "cpp",
        code: `template <int rows, int columns, int inners,
          int tileSize = ROW_COL_PARALLEL_INNER_TILING_TILE_SIZE>
inline void matmulImplRowColParallelInnerTiling(const float *left,
                                                const float *right,
                                                float *result) {
#pragma omp parallel for shared(result, left, right) default(none) \\
  collapse(2) num_threads(8)
  for (int rowTile = 0; rowTile < rows; rowTile += 256) {
    for (int columnTile = 0; columnTile < columns; columnTile += 256) {
      for (int innerTile = 0; innerTile < inners; innerTile += tileSize) {
        for (int row = rowTile; row < rowTile + 256; row++) {
          int innerTileEnd = std::min(inners, innerTile + tileSize);
          for (int inner = innerTile; inner < innerTileEnd; inner++) {
            for (int col = columnTile; col < columnTile + 256; col++) {
              result[row * columns + col] +=
                  left[row * inners + inner] * right[inner * columns + col];
            }
          }
        }
      }
    }
  }
}`,
      },
      {
        type: "paragraph",
        text: "With 8 threads (collapse(2) across rowTile and columnTile loops), runtime drops to ~16ms. That's a 5.5× speedup from 8 threads — reasonable given hyperthreading sharing physical execution units. Total path from naive to final: 4400ms → 89ms → 70ms → 16ms. About 5× slower than NumPy/MKL, which achieves 8ms. The gap is register tiling (MKL manually manages accumulator registers across multiple output rows simultaneously), better loop unrolling, and handwritten SIMD that the compiler misses.",
      },
      // Conclusion
      {
        type: "heading",
        level: 2,
        text: "Conclusion",
      },
      {
        type: "paragraph",
        text: "CPU SGEMM and GPU SGEMM are the same algorithm in different hardware costumes. Both are fundamentally about managing a three-level memory hierarchy to keep compute units fed. The CPU's hierarchy is L1/L2/L3 caches; the GPU's is registers/SMEM/GMEM. The tiling patterns are identical — the GPU just makes you spell them out explicitly in CUDA rather than letting a compiler figure them out.",
      },
      {
        type: "paragraph",
        text: "What surprised me most: a single loop-order swap (naive → cache-aware) produced a 17× speedup with zero algorithmic change. The naive implementation wasn't compute-bound or even particularly memory-bandwidth-bound in an absolute sense — it was *cache-thrashing* at an absurd rate, stalling the execution units waiting for DRAM. Performance optimization is often less about raw compute and more about reducing the latency of waiting for data. The patterns that matter: sequential access, reuse, prefetching, and not fighting the hardware prefetcher.",
      },
      {
        type: "paragraph",
        text: "The gap to production BLAS (~5× in our case) comes from three things we didn't implement: register-level tiling (maintaining multiple independent FMA accumulators to exploit ILP), hand-tuned SIMD intrinsics for the inner kernel, and full multi-level tiling calibrated for each cache level. OpenBLAS's SGEMM kernel is 7,000 lines of x86 assembly for a reason. We got about 50% of theoretical peak; BLAS gets ~56%. That remaining margin is years of engineering.",
      },
      {
        type: "link",
        label: "Reimagined from article by Simon Boehm",
        href: "https://siboehm.com/articles/22/Fast-MMM-on-CPU"
      },
    ],
  },
  // ─── Pipeline Parallelism ────────────────────────────────────────────────────
  {
    slug: "pipeline-parallel",
    month: "Pipeline Parallelism",
    subtitle: "distributed training via model partitioning",
    date: "February 2026",
    year: 2026,
    tracks: [],
    blocks: [
      {
        type: "paragraph",
        text: "At some point, a model stops fitting in a single GPU's memory and you have to split it across multiple GPUs. BLOOM, Huggingface's 175B parameter Transformer, requires ~350GB just to store weights in bfloat16. A100 80GB GPUs hold roughly a quarter of that. Training on 384 GPUs required spreading different layers across machines — a technique called model partitioning or pipeline parallelism.",
      },
      {
        type: "paragraph",
        text: "The naive version of this is embarrassingly bad at GPU utilization. If GPU2 can't start until GPU1 finishes, you've essentially serialized your compute across machines that are supposed to run in parallel. This post walks through three approaches — naive, GPipe, and PipeDream — and explains the concrete tradeoffs between GPU utilization, memory consumption, and mathematical equivalence to single-GPU training. Along the way I'll highlight the parts that didn't fully click for me until I traced through the actual scheduling logic.",
      },
      // Section: Naive model parallelism
      {
        type: "heading",
        level: 2,
        text: "Naive Model Parallelism",
      },
      {
        type: "paragraph",
        text: "The most straightforward implementation: split the model layers into contiguous groups, assign each group to a GPU, and run training one minibatch at a time. For a 4-layer model split across 2 GPUs: GPU1 runs layers L1–L2, produces the intermediate activation tensor, and MPI-sends it to GPU2. GPU2 runs L3–L4, computes the loss, and begins the backward pass. At the L2→L3 boundary in the backward direction, GPU2 sends its input gradients back to GPU1, which finishes backprop. Gradient updates happen locally on each GPU.",
      },
      {
        type: "paragraph",
        text: "This approach is bit-exact with single-GPU training — same math, same numerics. The communication is point-to-point (MPI.Send/MPI.Recv), not collective, so there's no need for AllReduce or broadcast primitives. Simple and correct. But watch the pebble graph below and you'll immediately see the problem:",
      },
      {
        type: "image",
        src: "/pipeline-parallel/PP_pebble_graph.gif",
        alt: "Pebble graph illustrating naive model parallelism with GPU1 forward caching and MPI communication",
        caption: "Naive model parallelism: GPU1 runs forward and waits while GPU2 runs backward. One GPU is always idle.",
      },
      {
        type: "paragraph",
        text: "Three problems are immediately visible:",
      },
      {
        type: "list",
        items: [
          "GPU utilization is 1/n: at any given moment, exactly one GPU is computing and the rest are idle. With 8 pipeline stages, each GPU is productive only 12.5% of the time.",
          "Communication and computation don't overlap: while the activation tensor is in flight over the network, no GPU does useful work. The interconnect stall is dead time.",
          "Memory blowup on early stages: GPU1 must cache all forward-pass activations for the entire minibatch until the backward pass reaches it — potentially gigabytes of intermediate tensors kept alive for the full forward+backward duration.",
        ],
      },
      // Section: GPipe
      {
        type: "heading",
        level: 2,
        text: "GPipe: Microbatches and Gradient Accumulation",
      },
      {
        type: "paragraph",
        text: "GPipe's core idea: split each minibatch into m equal-sized microbatches, process them sequentially through the pipeline, and accumulate gradients before applying the optimizer step. The math is exact: the gradient of a sum is the sum of the gradients, so summing microbatch gradients gives you the same gradient estimate as processing the full minibatch at once. This is called gradient accumulation, and it's mathematically bit-equivalent to single-GPU training.",
      },
      {
        type: "paragraph",
        text: "The key win: while GPU2 is running the forward pass for microbatch 2, GPU1 can already start the forward pass for microbatch 3. Multiple microbatches are in flight simultaneously, keeping more GPUs busy at once.",
      },
      {
        type: "heading",
        level: 3,
        text: "GPipe: Interleaving and Its Limits",
      },
      {
        type: "image",
        src: "/pipeline-parallel/interleaved-GPipe.png",
        alt: "Sketch of interleaved GPipe showing dependency arrows",
        caption: "GPipe with interleaving: dependency arrows show which microbatch results each GPU is waiting on.",
      },
      {
        type: "paragraph",
        text: "In practice, the interleaving of communication and computation is limited. A GPU can't start processing microbatch i until the previous stage has finished and transmitted its output. If all stages take the same time, you get a clean pipeline — but you still get startup and teardown overhead where some GPUs are idle. These idle slots are called pipeline bubbles.",
      },
      {
        type: "heading",
        level: 3,
        text: "GPipe: Pipeline Bubbles",
      },
      {
        type: "paragraph",
        text: "A bubble is idle time in the pipeline caused by a data dependency that hasn't resolved yet. GPU4 can't run forward pass for microbatch 1 until GPU3 has finished it and sent the activation. Similarly in the backward pass, each stage has to wait for the next stage to send back its input gradient. The fraction of time wasted in bubbles is a function of pipeline depth n (number of GPU stages) and number of microbatches m:",
      },
      {
        type: "math",
        latex: "\\text{bubble fraction} = 1 - \\frac{m}{m + n - 1}",
        display: true,
      },
      {
        type: "paragraph",
        text: "As m → ∞, the bubble fraction → 0. In practice, m ≈ 4n is a common target (bubble fraction ≈ 20%). The tradeoff: larger m means larger total batch size, which requires learning rate scaling (linear scaling rule) and increases the amount of activation memory you're caching. There's no free lunch — you're trading memory pressure for utilization.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/Gpipe_bubbles.png",
        alt: "Demonstration of pipeline bubble inefficiencies caused by data dependencies",
        caption: "Pipeline bubbles: GPUs sit idle waiting for the previous stage to finish.",
        invert: true,
      },
      {
        type: "image",
        src: "/pipeline-parallel/Gpipe_bubble_fractions.png",
        alt: "Example calculations comparing single vs 4-microbatch bubble fractions",
        caption: "Bubble fraction comparison: 4 microbatches cuts wasted time dramatically vs. 1 microbatch.",
        invert: true,
      },
      {
        type: "heading",
        level: 3,
        text: "GPipe: Memory and Gradient Checkpointing",
      },
      {
        type: "paragraph",
        text: "The memory problem in GPipe is stark: all m microbatch activations are in flight simultaneously during the all-forward phase. Each GPU must cache activations from the time a microbatch was forwarded until the corresponding backward reaches it. For m=8 microbatches on a 4-GPU pipeline, GPU1 holds 8 microbatches worth of activations simultaneously — that's 8× the activation memory of a single-GPU run.",
      },
      {
        type: "paragraph",
        text: "GPipe's solution: gradient checkpointing (also called activation recomputation). Instead of caching all intermediate activations, cache only the inputs at pipeline-stage boundaries and recompute activations on the fly during the backward pass. This trades compute for memory. Without gradient checkpointing, peak memory per GPU is O(batchsize × layers_per_gpu). With it:",
      },
      {
        type: "math",
        latex: "O\\left(\\text{batchsize} + \\frac{\\#\\text{total layers}}{\\#\\text{GPUs}} \\cdot \\frac{\\text{batchsize}}{\\#\\text{microbatches}}\\right)",
        display: true,
      },
      {
        type: "image",
        src: "/pipeline-parallel/GPipe-gradient-checkpointing.png",
        alt: "Memory state during backward pass with gradient checkpointing",
        caption: "Gradient checkpointing: only boundary inputs are cached. Activations are recomputed during backward, adding ~33% compute overhead.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The 33% compute overhead from recomputation is usually worth it for large models — it's often the only way to fit a model in GPU memory at all. PyTorch's `torch.utils.checkpoint.checkpoint()` and Megatron-LM's activation recomputation are both GPipe-style gradient checkpointing. If you've used either, you've used this idea.",
      },
      // Section: PipeDream
      {
        type: "heading",
        level: 2,
        text: "PipeDream: 1F1B and Earlier Backward Passes",
      },
      {
        type: "paragraph",
        text: "PipeDream's key insight: you don't have to wait until all microbatches have been forwarded before starting any backward passes. As soon as the last stage completes the forward pass for microbatch 1, it can immediately start the backward pass for microbatch 1 — even while earlier stages are still processing microbatches 2, 3, 4... This is the 1F1B (one forward, one backward) pattern: in steady state, each GPU alternates between a forward pass for a new microbatch and a backward pass for an older one.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/PipeDream_schedule.png",
        alt: "PipeDream schedule with 4 GPUs and 8 microbatches showing 1F1B pattern",
        caption: "PipeDream 1F1B schedule: blue = forward, green = backward. Numbered by microbatch ID.",
      },
      {
        type: "paragraph",
        text: "The memory benefit is substantial. In GPipe, all m microbatches are in flight during the all-forward phase, so you need activation memory proportional to m. In PipeDream's steady state, GPU1 starts a backward as soon as it finishes a forward — so at most n microbatches are in flight simultaneously (where n is pipeline depth). For both algorithms, activation memory without gradient checkpointing is:",
      },
      {
        type: "math",
        latex: "O\\left(\\#\\text{max microbatches in flight} \\cdot \\text{microbatch-size} \\cdot \\frac{\\#\\text{total layers}}{\\#\\text{GPUs}}\\right)",
        display: true,
      },
      {
        type: "paragraph",
        text: "The max-microbatches-in-flight term is where GPipe and PipeDream differ: GPipe's all-forward phase puts all m microbatches in flight; PipeDream's 1F1B schedule keeps at most n in flight (the pipeline depth). Look at GPU1 in the diagram during steady state — it alternates F and B, never starting a new forward without completing a backward first.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/Pipedream_steady_state.png",
        alt: "PipeDream steady state showing GPU1 alternating forward and backward passes",
        caption: "PipeDream steady state: GPU1 alternates 1F1B after the warmup phase, keeping at most n microbatches in flight.",
      },
      {
        type: "paragraph",
        text: "In the example above (4 GPUs, 8 microbatches): PipeDream has at most 4 microbatches in flight, GPipe has 8. PipeDream halves the activation memory overhead. The bubble fraction is identical between the two algorithms — that's determined by the pipeline structure (n stages, m microbatches), not by when backwards start. You can verify this visually: take the PipeDream schedule and slide all the backward passes to the right (consolidating them after all forwards complete) and you recover GPipe. Same total time, different activation memory profile.",
      },
      {
        type: "heading",
        level: 3,
        text: "Communication Volume: Pipeline vs Data Parallelism",
      },
      {
        type: "paragraph",
        text: "For a model with dense layers of hidden dimension N, each pipeline stage boundary sends activations of size (microbatch_size × N) forward and gradients of the same size backward. Total pipeline communication per minibatch: (n-1) × 2 × batchsize × N floats — it scales with pipeline depth and activation size, not parameter count. Data parallelism (Ring AllReduce) transfers roughly 2 × (total_params / n_gpus) floats per step — scales with model size, not activations. For very large models with small activations, pipeline parallelism can be cheaper to communicate. For models with large activations (vision, long-context language models), it can be more expensive. The other critical difference: data-parallel AllReduce overlaps with the backward pass naturally; pipeline-parallel point-to-point transfers are on the critical path and harder to hide.",
      },
      // Section: Combining DP and PP
      {
        type: "heading",
        level: 2,
        text: "Combining Pipeline and Data Parallelism",
      },
      {
        type: "paragraph",
        text: "Pipeline and data parallelism are orthogonal — you can use both simultaneously. In a combined setup, you run multiple pipeline *replicas* (data parallelism across replicas) where each replica is itself a pipeline (pipeline parallelism across stages). The constraint: your effective batch size is (microbatch_size × n_microbatches × n_data_parallel_replicas), so you need a large enough batch to keep both dimensions busy without gradient noise from tiny microbatches.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/DP_and_PP.png",
        alt: "Illustration of orthogonal communication partners in combined data and pipeline parallelism",
        caption: "Combined DP + PP: each GPU participates in two communicators — one for pipeline neighbors, one for data-parallel peers.",
      },
      {
        type: "paragraph",
        text: "The implementation uses MPI Communicators — subgroups of GPUs that only communicate within the group. Each GPU belongs to two: one for its pipeline stage peers (all GPUs with the same layer slice, for AllReduce), and one for its pipeline neighbors (the stages before and after, for point-to-point activations and gradients). These communicators partition the GPU cluster into a 2D grid: pipeline depth × data-parallel width. DeepSpeed, Megatron-LM, and FairScale all implement this pattern. In practice, large training runs often use a 3rd dimension — tensor parallelism within each layer — giving a 3D parallelism grid: pipeline × data × tensor.",
      },
      // Section: Implementation
      {
        type: "heading",
        level: 2,
        text: "Implementation: GPipe in Python",
      },
      {
        type: "paragraph",
        text: "Unlike data parallelism (which requires AllReduce — a collective operation requiring coordination among all workers), pipeline parallelism uses only point-to-point sends and receives between adjacent stages. This means each GPU can follow a simple, static schedule without global synchronization. DeepSpeed's pipeline engine uses exactly this design: one worker per GPU, executing a sequence of commands determined before the minibatch starts.",
      },
      {
        type: "code-highlighted",
        language: "python",
        code: `def minibatch_steps(self):
    yield [ZeroGrad()]

    # STAGE 1: First, we FWD all microbatches
    for microbatch_id in range(self.num_micro_batches):
        yield self.steps_FWD_microbatch(microbatch_id)

    # at this position, all microbatches are in flight and
    # memory demand is highest

    # STAGE 2: Then, we BWD all microbatches
    for microbatch_id in reversed(range(self.num_micro_batches)):
        yield from self.steps_BWD_microbatch(microbatch_id)

    # updating the weights is the last step of processing any batch
    yield [OptimizerStep()]`,
      },
      {
        type: "paragraph",
        text: "This is the GPipe schedule: all forwards first, then all backwards in reverse order. The comment at peak memory is key — between the last FWD and the first BWD, every microbatch's activations are live simultaneously. For the forward pass of each microbatch:",
      },
      {
        type: "code-highlighted",
        language: "python",
        code: `def steps_FWD_microbatch(self, microbatch_id):
    cmds = []
    if self.is_first_stage:
        # first pipeline stage loads data from disk
        cmds.append(LoadMicroBatchInput(microbatch_id=microbatch_id))
    else:
        # all other stages receive activations from prev pipeline stage
        cmds.append(RecvActivations())

    cmds.append(Forward(microbatch_id=microbatch_id))

    if not self.is_last_stage:
        # all but the last pipeline stage send their output to next stage
        cmds.append(SendActivations())
    return cmds`,
      },
      {
        type: "paragraph",
        text: "Load input (or receive activations), run the forward pass, send activations to the next stage. Clean and self-contained. The backward pass is symmetric but runs in reverse — the last stage has the loss, so it loads targets instead of receiving gradients. A notable detail: the `BackwardGradAllReduce` on the first microbatch (processed last in backward order) overlaps the gradient AllReduce with the actual backward computation, hiding some of the data-parallel communication cost:",
      },
      {
        type: "code-highlighted",
        language: "python",
        code: `def steps_BWD_microbatch(self, microbatch_id):
    cmds = []
    if self.is_last_stage:
        # last pipeline stage loads targets from disk
        cmds.append(LoadMicroBatchTarget(microbatch_id=microbatch_id))
    else:
        # all other stages wait to receive grad from next stage
        cmds.append(RecvOutputGrad())

    if self.is_first_microbatch(microbatch_id):
        # interleaved backprop and AllReduce during last microBatch of BWD
        cmds.append(BackwardGradAllReduce(microbatch_id=microbatch_id))
    else:
        cmds.append(BackwardGradAcc(microbatch_id=microbatch_id))

    if not self.is_first_stage:
        # all but last pipeline stage send their input grad to prev stage
        cmds.append(SendInputGrad())
    yield cmds`,
      },
      {
        type: "paragraph",
        text: "The `BackwardGradAcc` vs `BackwardGradAllReduce` distinction is subtle but important. For all but the last microbatch (in backward order), we accumulate gradients locally without synchronizing with other data-parallel replicas. Only on the last backward do we AllReduce — and by launching it as a background NCCL operation overlapping with the final backprop, we hide part of the network round-trip latency.",
      },
      // Section: Hardware appendix
      {
        type: "heading",
        level: 2,
        text: "Hardware Context: Interconnects and Scaling",
      },
      {
        type: "image",
        src: "/pipeline-parallel/distributed-computing-hardware.png",
        alt: "Hardware hierarchy showing multi-node GPU clusters with PCIe, NVLink, InfiniBand",
        caption: "Distributed training hardware: NVLink at ~900GB/s within a node; InfiniBand HDR at ~200Gbps between nodes.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The bandwidth numbers matter a lot for pipeline parallelism design. NVLink bandwidth within a node is ~900GB/s bidirectional — fast enough that intra-node pipeline stages are almost never bandwidth-limited. Cross-node InfiniBand is 25–200Gbps depending on generation — easily 10-100× slower. A good rule of thumb: place pipeline stage boundaries at intra-node boundaries where possible, and use pipeline parallelism to handle the inter-node communication that you can't avoid.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/strong-vs-weak-scaling.png",
        alt: "Visual comparison of strong vs weak scaling strategies",
        caption: "Strong vs weak scaling: strong = fixed problem size across more GPUs; weak = fixed per-GPU workload.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Pipeline parallelism is a form of weak scaling for model size: each GPU holds a fixed number of layers, and you scale up the total parameter count by adding more GPUs to the pipeline. Bubble overhead is independent of model size (it's determined by pipeline depth and microbatch count). This is why pipeline parallelism is a first-class citizen in the infrastructure of LLM training — adding more layers doesn't increase utilization loss.",
      },
      // Conclusion
      {
        type: "heading",
        level: 2,
        text: "Conclusion",
      },
      {
        type: "paragraph",
        text: "Pipeline parallelism is ultimately about scheduling. Given that a model must be split across GPUs, the question is: in what order do you run forward and backward passes across microbatches to maximize utilization and minimize memory? Naive MP gives you correctness but terrible utilization. GPipe restores utilization with microbatches but blows up activation memory. PipeDream halves the activation memory with 1F1B while maintaining the same bubble fraction. None of these choices are free — every improvement comes with a cost somewhere else.",
      },
      {
        type: "paragraph",
        text: "What I find most interesting about this space is the interaction between pipeline depth and batch size. Deep pipelines (more stages) have higher bubble overhead unless you increase microbatch count, which increases batch size, which requires learning rate scaling. At some point you're constrained by convergence — very large batches don't generalize as well without careful warmup and decay schedules. The scheduling algorithm and the optimization algorithm aren't actually independent. Modern large-scale training infrastructure (Megatron-LM, DeepSpeed, FairScale) has to co-design both.",
      },
      {
        type: "paragraph",
        text: "If you're building or debugging a multi-GPU training setup, the most common failure mode I've seen is incorrect gradient accumulation — treating microbatch gradients as independent updates instead of accumulating them before the optimizer step. Always validate against single-GPU training numerics before debugging performance. Correctness first, then throughput.",
      },
      {
        type: "link",
        label: "Reimagined from article by Simon Boehm",
        href: "https://siboehm.com/articles/22/pipeline-parallel-training"
      },
    ],
  },
  {
    slug: "website-refresh",
    month: "website refresh",
    subtitle: "my website refresh",
    date: "January 21, 2026",
    year: 2026,
    coverGradient: "from-slate-800 via-slate-700 to-zinc-900",
    tracks: [],
    blocks: [
      {
        type: "paragraph",
        text:
          "i used to wonder why my professors kept such simple websites--just lists of publications and projects. now i understand: they focused on their work, letting it speak for itself.",
      },
      {
        type: "paragraph",
        text:
          "for a long time, i treated my own site like a sandbox, full of half-baked posts and scattered components. it felt distracting and directionless. so i'm making a little change.",
      },
      {
        type: "quote",
        text:
          "there's a tremendous power in using the least amount of information to get a point across.",
        author: "Rick Rubin",
      },
      {
        type: "paragraph",
        text:
          "that's the spirit behind this 2025 version of my personal website. rather than implementing every new ui trend that catches my attention, i'm focusing on what matters most--curating work and references that reflect my journey and interests.",
      },
      {
        type: "paragraph",
        text:
          "don't get me wrong, i still enjoy experimenting with new web technologies, but i'm keeping that separate. this will be a focused space for sharing my work and the occasional life update. peace.",
      },
    ],
  },
  {
    slug: "july",
    month: "july",
    subtitle: "finding excitement in the everyday",
    date: "July 31, 2025",
    year: 2025,
    coverImage: "/oai2.jpeg",
    coverGradient: "from-orange-300 via-pink-300 to-blue-300",
    tracks: [
      {
        title: "where you are",
        artist: "john summit",
        albumArt: "/whereyouare.jpg",
        audioSrc: "/whereyouare.mp3",
        spotifyUrl: "https://open.spotify.com/track/0bFBRve9nqszP6fC7eX8nY",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-orange-300 via-pink-300 to-blue-300" },
      {
        type: "quote",
        text: "music has been the fuel for a lot of my optimism and positivity.",
      },
      {
        type: "paragraph",
        text:
          "july passed by pretty fast, but there were many experiences to look back fondly on. i've been overcoming a hurdle of thinking that my life wasn't exciting enough to share with others. instead, i'm learning to normalize repetitiveness while taking on new adventures and being intentional with my time with others.",
      },
      {
        type: "paragraph",
        text:
          "this month has been about enjoying meeting new people and catching up with old friends. there's something beautiful about the rhythm of familiar faces and the excitement of new connections. i've realized that life doesn't need to be constantly groundbreaking to be meaningful--sometimes the most profound moments happen in the spaces between the big events.",
      },
      {
        type: "gallery",
        images: [
          {
            src: "/IMG_1493.JPG",
            alt: "Horseback riding on the beach",
            caption: "horseback riding on the beach",
          },
          {
            src: "/IMG_1760.JPG",
            alt: "Coastal landscape at sunset",
            caption: "views at sea ranch, ca",
          },
          {
            src: "/IMG_1887.JPG",
            alt: "Rocky shoreline at golden hour",
            caption: "beautiful rugged coastline",
          },
          {
            src: "/IMG_2767.JPG",
            alt: "Mountain camping at dawn",
            caption: "backpacking with friends in hoover wilderness",
          },
          {
            src: "/IMG_2847.jpg",
            alt: "Night sky over mountains",
            caption: "stargazing in the wilderness",
          },
          {
            src: "/IMG_3691.JPG",
            alt: "City skyline from rooftop",
            caption: "new york city weekend getaway",
          },
        ],
      },
      {
        type: "paragraph",
        text:
          "i backpacked for the first time in years, feeling the weight of my pack and the freedom of the trail. weekend getaways to sea ranch, ca and new york city reminded me that adventure doesn't have to be far-flung to be transformative. weekend bbq + poker with friends became these perfect moments of connection and laughter.",
      },
      { type: "gradient", className: "from-pink-300 via-blue-300 to-orange-300" },
      {
        type: "paragraph",
        text:
          "music has been the fuel for a lot of my optimism and positivity. i love house, techno, afro, progressive house, everything electronic dance music. there's something about the rhythm and energy that connects me to a deeper sense of joy and possibility. when i'm listening to the right track, everything feels possible.",
      },
      {
        type: "paragraph",
        text:
          "i've been learning to find excitement in the everyday. it's not about constantly seeking the next big thing, but about being present in the moments that make up a life. the coffee with a friend, the walk in the park, the late-night conversation--these are the threads that weave together into something beautiful.",
      },
      {
        type: "paragraph",
        text:
          "there's a certain magic in being intentional with time. when i'm fully present with someone, whether it's an old friend or someone i just met, i feel more alive. it's like each interaction is a small adventure, a chance to learn something new or see the world through different eyes.",
      },
      { type: "gradient", className: "from-blue-300 via-orange-300 to-pink-300" },
      {
        type: "paragraph",
        text:
          "july taught me that life doesn't need to be constantly extraordinary to be extraordinary. sometimes the most profound experiences come from the simple act of showing up, being present, and allowing yourself to be moved by the people and places around you. it's about finding the music in the everyday rhythm.",
      },
      {
        type: "paragraph",
        text:
          "as the month comes to a close, i'm grateful for these moments of connection and discovery. for the friends who make me laugh, the music that moves me, and the adventures that remind me of the beauty in both the grand and the simple. here's to finding excitement in the everyday and letting the rhythm carry us forward.",
      },
    ],
  },
  {
    slug: "june",
    month: "june",
    subtitle: "choosing commitment over comfort",
    date: "June 12, 2025",
    year: 2025,
    hidden: true,
    coverImage: "/oai4.jpg",
    coverGradient: "from-pink-300 via-fuchsia-300 to-red-300",
    tracks: [
      {
        title: "gesture",
        artist: "home alone",
        albumArt: "/gesture.jpg",
        audioSrc: "/gesture.mp3",
        spotifyUrl: "https://open.spotify.com/track/2r7E8XjJ1l9vD29kGZXV0K",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-pink-300 via-fuchsia-300 to-red-300" },
      {
        type: "quote",
        text:
          "i've been showing up to life just enough to say i'm there, but never enough to actually be there.",
      },
      {
        type: "paragraph",
        text:
          "june has been a month of harsh realizations and necessary reckonings. i've come to understand something fundamental about myself: i cannot function without challenges. when i'm not solving problems or pushing against something difficult, i spiral into depression. it's not optional for me--it's essential.",
      },
      {
        type: "paragraph",
        text:
          "i've realized i can't go through life just showing up, eating, sleeping--i'll get depressed. the human organism needs problem-solving, complex problems, stress, something difficult to overcome. it's through conquering these challenges that i can truly relax. i can't just have happiness all the time; that's not real. i have to experience discomfort to appreciate happiness. instead of dropping problems to avoid discomfort and never truly experiencing joy, i can actually value the things and people in my life by embracing that discomfort.",
      },
      {
        type: "paragraph",
        text:
          "lately, i've been reflecting on how i sometimes lose sight of my dreams. worse, i don't consistently establish and follow the goals needed to get closer to those dreams. i've been coasting, showing up just enough to say i'm in a space or working towards something, but not giving it my 100%. it's a comfortable lie i've been telling myself.",
      },
      {
        type: "paragraph",
        text:
          "i've convinced myself that my goals will work out with little bits of effort over time. maybe they will, but i personally feel that it's time to go 100% on something. if it doesn't work out, i need to have the discipline to go back to school and follow the traditional laid-out path. that's the deal i'm making with myself.",
      },
      { type: "gradient", className: "from-fuchsia-300 via-red-300 to-pink-300" },
      {
        type: "paragraph",
        text:
          "i live my life by the code of not following traditional footsteps. but in doing so, i take risks. and taking risks means i need to have a concrete plan. by the next blog post, i will have given my 100% towards something and made the decision whether to pursue it further or return to the laid-out path for a bit. this is my commitment to myself.",
      },
      {
        type: "paragraph",
        text:
          "because i haven't been giving 100% to anything recently, i find myself surrounded by amazing people yet somehow feeling empty and unworthy inside. months ago, i thought coming back to somewhere full of people i knew and admired would bring me meaning and happiness. now, i don't know if i'll ever be satisfied with enough of anything.",
      },
      {
        type: "paragraph",
        text:
          "this feeling has culminated from me valuing everything in my life very little for a while now. just like the higher i can get emotionally, the lower i can fall as well. right now, in this moment, i don't know what i'm searching for, how i can ever truly appreciate what i have, or what drives me and gives me meaning.",
      },
      { type: "gradient", className: "from-red-300 via-pink-300 to-fuchsia-300" },
      {
        type: "paragraph",
        text:
          "i've gotten much better at picking myself up from being down, but i still sporadically fall into periods of dissatisfaction and low self-esteem. i don't think it's sadness, but rather unhappiness with where i am given what i have and what i can do. the gap between my potential and my reality feels paralyzing.",
      },
      {
        type: "paragraph",
        text:
          "while i will continue growing my community of people that inspire me and i enjoy being around, i think what's important for me now is to work on motivating myself. the start to that is honestly pretending to be motivated when i am unmotivated, since that is really what motivation is at its core.",
      },
      {
        type: "paragraph",
        text:
          "same with bravery--in moments of peril, pretending to be brave is what sparks bravery. so i'm going to start there. fake it until i make it, but with intention and commitment. no more half-measures, no more comfortable lies. it's time to choose commitment over comfort.",
      },
    ],
  },
  {
    slug: "may",
    month: "may",
    subtitle: "redefining balance, purpose, and connections",
    date: "May 17, 2025",
    year: 2025,
    hidden: true,
    coverImage: "/WEBPtoJPG4.jpg",
    coverGradient: "from-yellow-100 via-blue-100 to-red-200",
    tracks: [
      {
        title: "house of love",
        artist: "smooth touch",
        albumArt: "/houseoflove.jpg",
        audioSrc: "/houseoflove.mp3",
        spotifyUrl: "https://open.spotify.com/track/7v0G2WwH1g1bEVF6t7F8x8",
      },
      {
        title: "unforgettable",
        artist: "smokepurpp",
        albumArt: "/unforgettable.jpg",
        audioSrc: "/unforgettable.mp3",
        spotifyUrl: "https://open.spotify.com/track/1w9m0wYdM0ZWsK8aZs1Xc9",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-yellow-100 via-blue-100 to-red-200" },
      {
        type: "quote",
        text:
          "to live in balance is to let disappointment pass through you, leaving only the shape of what you've learned.",
      },
      {
        type: "paragraph",
        text:
          "i am living may with more purpose--balancing adventure, friendship, and self-discovery. may always feels like a season of possibility, but also a time when i am questioning my place in the world.",
      },
      {
        type: "paragraph",
        text:
          "i have always hated being the one reaching out to others to catch up. it has felt like no one wants to reach out to me, and i have wondered if i am just forcing connections. but i have grown fine with that reality. i am seeing my initiative to catch up as a strength, not a weakness. i am proud to be the one who brings people together, even if it sometimes feels one-sided.",
      },
      {
        type: "paragraph",
        text:
          "my friends are all incredibly progress- and career-driven. i admire that, but i hope we all see each other for more than just our career value. i want our friendships to be about more than what we achieve. i want us to celebrate the small moments, the spontaneous adventures, and the simple joy of being together.",
      },
      { type: "gradient", className: "from-blue-100 via-yellow-100 to-red-200" },
      {
        type: "paragraph",
        text:
          "i have been realizing that most things i enjoy doing are not meaningful without friends. that is a tough truth, but it is also an opportunity. now, i am growing some passions on my own--finding things that light me up, even when i am alone. i want people to discover me for who i am, not just for what i do or who i know.",
      },
      {
        type: "paragraph",
        text:
          "i am excited for what is ahead. this may, i am embracing adventure, seeking out new opportunities, and learning to enjoy my own company. i am reaching out, not because i have to, but because i want to. and i am hopeful that the connections i am making--old and new--are deeper and more genuine than ever before.",
      },
    ],
  },
  {
    slug: "happiness",
    month: "happiness",
    subtitle: "ambition has made college lose true happiness",
    date: "April 25, 2025",
    year: 2025,
    hidden: true,
    coverImage: "/oai1.jpg",
    coverGradient: "from-purple-500 via-pink-500 to-blue-500",
    tracks: [
      {
        title: "sunflower feelings",
        artist: "kuzu mellow",
        albumArt: "/sunflowerfeelings.jpeg",
        audioSrc: "/sunflowerfeelings.mp3",
        spotifyUrl: "https://open.spotify.com/track/5H8gV0nYB0V3n3jX7aVtQ0",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-red-400 via-orange-300 to-indigo-300" },
      {
        type: "paragraph",
        text:
          "two years into college and i'm asking myself again: what the hell am i doing? who am i becoming? i've spent the past two years meticulously constructing my resume, obsessing over internships, and judging everyone--including myself--by a single metric: career potential.",
      },
      {
        type: "paragraph",
        text:
          "it started innocently enough. my first semester, i was just trying to \"get ahead,\" to \"set myself up for success.\" now i find myself categorizing people within seconds of meeting them. engineering major? respect. art history? what's your backup plan? i've become the human embodiment of linkedin, constantly calculating everyone's professional value while ignoring what makes them... human.",
      },
      {
        type: "quote",
        text: "i've been so busy building a career-worthy life that i forgot to build a life worth living.",
      },
      {
        type: "paragraph",
        text:
          "i wonder if my friends or classmates think i'm crushing it. from the outside, i'm this put-together, ambitious, cracked sophomore with a five-year plan and his shit figured out. they don't see me staring at the ceiling at night, wondering why success feels so empty. or scrolling through texts from high school friends i never grew close to again because who knows why. or realizing i haven't laughed--really laughed--in months.",
      },
      {
        type: "paragraph",
        text:
          "last week, my roommate invited me to a concert. my first instinct wasn't \"sounds fun\" but \"who will be there that could be useful for my career?\" that's when i knew something was broken in me. i'm 20 years old, and i've already turned my life into a never-ending job interview. the worst part? i'm not even passionate about the career i'm killing myself for. i'm chasing status, not fulfillment.",
      },
      { type: "gradient", className: "from-indigo-300 via-purple-400 to-fuchsia-300" },
      {
        type: "paragraph",
        text:
          "i've become so focused on being impressive that i've forgotten how to be present. i scroll through social media and mentally rank everyone's career trajectories instead of appreciating their joy. i have 1500+ linkedin connections but can't name five people who really know me. i've sacrificed deep connections for shallow networking, genuine interests for resume-building activities.",
      },
      {
        type: "paragraph",
        text:
          "the most messed up part? i've internalized capitalism so completely that i evaluate my own worth through the lens of productivity. watching a movie feels like wasted time. going for a walk without listening to an educational podcast feels irresponsible. my self-worth has become completely entangled with my perceived market value. no wonder i'm miserable.",
      },
      {
        type: "paragraph",
        text:
          "i can't even remember the last time i genuinely talked to someone for hours to someone not about internships or classes, but about our families, our fears, our favorite movies from childhood. i don't feel like a real person, more like a walking resume. now i wait for something revolutionary to come to me, most likely the reality is not. still, i know i will be the one to dig myself out of this as i have so many times before. i've noticed i've built this terrible habit of just dropping things and not caring about them when things get hard, and this needs to change. desperately waiting for someone to change me but i think i've realized that person is myself. still, i'm lost and confused. ive slowly lost motivation discipline and commitment to work and becoming someone that is fine with whatever comes to them in life while not giving something their everything. i go in cycles of hyper productivity to extremely low points of doing zero work in a week. i dont think this is me burning out, its just me being lazy. how should i go about fixing this?",
      },
      { type: "gradient", className: "from-fuchsia-300 via-pink-300 to-red-400" },
      {
        type: "paragraph",
        text:
          "being happy scares me. i don't think i deserve happiness, but it's more so the fear of happiness blinding me and inevitably causing more misery to ppl i care abt. tbh im so emotionally detached from everything. isn't there the saying of how being alone means nobody can hurt you and you cannot hurt anyone who cares about you. i don't have some grand solution yet. i'm not suddenly \"fixed.\" small steps. i'm trying to relearn how to value people--including myself--not for what we can achieve, but for who we are. because i'm starting to realize that being the perfect job candidate means nothing if you've lost yourself along the way.",
      },
      {
        type: "paragraph",
        text:
          "so if you're like me--someone who's been measuring life in linkedin endorsements and forgotten how to just be--maybe we can figure this out together. because i think there's more to these college years, more to life, than just preparing for some hypothetical career. at least, i really hope there is.",
      },
    ],
  },
  {
    slug: "college",
    month: "college",
    subtitle: "unexpected friends and experiences",
    date: "April 14, 2025",
    year: 2025,
    hidden: true,
    coverImage: "/oai3.jpg",
    coverGradient: "from-pink-200 via-rose-300 to-orange-200",
    tracks: [
      {
        title: "charcoal baby",
        artist: "blood orange",
        albumArt: "/charcoalbaby.jpg",
        audioSrc: "/charcoalbaby.mp3",
        spotifyUrl: "https://open.spotify.com/track/4jBfUBDkK4wzpv25VufQnS",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-pink-400 via-rose-300 to-orange-300" },
      {
        type: "paragraph",
        text:
          "this past semester has been nothing short of transformative. i've met so many incredible people who've expanded my world in ways i never expected. startup founders with audacious visions, industry leaders who somehow make time to mentor, and classmates who are both terrifyingly brilliant and refreshingly down-to-earth. it's humbling and exhilarating all at once.",
      },
      {
        type: "paragraph",
        text:
          "one weekend, i ended up on an impromptu trip with a mix of good friends and people i barely knew of. we stayed in some off grid cabin, and somehow in the span of two days, i genuinely enjoyed being around everyone. there's something about seeing people outside the classroom context--away from the polished performances we all put on--that accelerates closeness in ways that feel almost magical.",
      },
      {
        type: "quote",
        text:
          "what connects us isn't just our ambitions but the moments we admit we're struggling to reach them.",
      },
      {
        type: "paragraph",
        text:
          "i've discovered pockets of creativity i didn't know existed on campus. a fashion collective that puts on guerrilla runway shows in unexpected campus locations. a group of art students who sneak onto rooftops to draw the cityscape at sunset. runners who meet at 5am and somehow make it seem fun rather than torturous. each community has its own language, inside jokes, and rituals that make being part of it feel special.",
      },
      {
        type: "paragraph",
        text:
          "what's fascinating is the undercurrent of \"duck syndrome\" that connects us all--we're gliding seemingly effortlessly on the surface while paddling frantically underneath. it's weirdly comforting when someone i admire admits they're struggling too. the most profound bonding happens in those moments of vulnerability, when the facade cracks and we acknowledge how hard we're all working to stay afloat.",
      },
      { type: "gradient", className: "from-orange-300 via-rose-300 to-pink-400" },
      {
        type: "paragraph",
        text:
          "there's something powerful about being surrounded by people who are unapologetically pursuing their passions. my roommate who codes until 3am because she's building something she believes in. the guy from my writing workshop who's already published two sci-fi novellas. the international student who's creating a platform to connect rural artisans from her home country with global markets. their drive doesn't make me feel inadequate; it ignites something in me.",
      },
      {
        type: "paragraph",
        text:
          "i find myself wanting to match their energy, to contribute something meaningful. it's not competitive in a toxic way--it's this collective current pushing us all forward. when one person breaks through, achieves something remarkable, it expands our sense of what's possible. their success becomes proof that the rest of us can reach our goals too, even if those goals look completely different.",
      },
      {
        type: "paragraph",
        text:
          "we've created these core rituals that keep us grounded--weekly dinners where phones are banned, spontaneous study sessions that inevitably devolve into philosophical debates, celebrations for even minor victories. these shared experiences form a safety net. when imposter syndrome hits hard (which it does, regularly), there's always someone who can remind you of what you've already accomplished and why you belong here.",
      },
      {
        type: "paragraph",
        text:
          "i'm learning that being humbled by exceptional peers doesn't have to diminish me--it can actually expand my vision for myself. there's this quote i keep coming back to: \"surround yourself with people who make you uncomfortable with settling for less.\" that's what this semester has given me--a community that simultaneously accepts me exactly as i am and inspires me to become more.",
      },
      { type: "gradient", className: "from-rose-300 via-pink-400 to-orange-300" },
      {
        type: "paragraph",
        text:
          "there are days when i wonder if i belong among these incredible people. days when the gap between where i am and where i want to be feels impossibly wide. but then i remember that everyone starts somewhere, and that even the most accomplished people i've met are still works in progress themselves. we're all just at different points on similar journeys.",
      },
      {
        type: "paragraph",
        text:
          "as the semester ends, i'm grateful not just for what i've learned in classrooms, but for these unexpected connections that have shaped me. for late-night conversations that helped clarify my own dreams. for witnessing peers overcome obstacles that once seemed insurmountable. for finding a community that celebrates ambition while acknowledging vulnerability. college isn't just about building a resume--it's about building a constellation of relationships that illuminate possibilities i couldn't have imagined on my own.",
      },
    ],
  },
  {
    slug: "purpose",
    month: "purpose",
    subtitle: "finding what makes me",
    date: "December 22, 2024",
    year: 2024,
    coverImage: "/oai5.png",
    coverGradient: "from-blue-400 via-purple-400 to-pink-400",
    tracks: [
      {
        title: "here with me",
        artist: "d4v4d",
        albumArt: "/herewithme.jpg",
        audioSrc: "/herewithme.mp3",
        spotifyUrl: "https://open.spotify.com/track/5PjdY0CKGZdEuoNab3yDmX",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-blue-400 via-purple-400 to-pink-400" },
      {
        type: "paragraph",
        text:
          "lately, i keep coming back to the question: what gives me purpose? is it personal growth, the praise of others, or the rare moments when i actually feel proud of myself? is it the number of people i know, or the depth of the connections i have? does my sense of self shape how others see me, or is it the other way around? do i feel valued, seen as someone with potential, or am i just hoping for it?",
      },
      {
        type: "paragraph",
        text:
          "i keep wondering if my purpose should be about what i do for others, or if it should be about my own growth and fulfillment. even if i help people or give them purpose, is that really what gives me purpose? or am i just searching for something to fill the space where meaning should be? sometimes i think about how much of my self-worth is tied to being recognized, and how much is just about being able to look at myself and feel content with who i am becoming.",
      },
      { type: "gradient", className: "from-blue-400 via-purple-400 to-pink-400" },
      {
        type: "paragraph",
        text:
          "i've realized that a lot of my drive comes from wanting to be seen as someone with potential, someone who is going somewhere. but the more i chase that, the more i wonder if i'm just running from the fear of being ordinary. is it enough to just be, or do i need to be impressive? i think about the times i've felt most alive--usually not when i'm being praised, but when i'm deeply engaged in something, or when i'm with people who make me feel understood.",
      },
      {
        type: "paragraph",
        text:
          "i used to think purpose would just appear, but now i see it's something i have to build, one uncomfortable step at a time. the truth is, most of the time, it's a lot of not fully vibing with people, awkward conversations, and rejection. but i'm starting to value these moments--they help me figure out what i want, and who i want to be purposeful with. i'm learning that the quality of my connections matters more than the quantity, and that being vulnerable is the only way to find people who really get me.",
      },
      { type: "gradient", className: "from-purple-400 via-blue-400 to-pink-400" },
      {
        type: "paragraph",
        text:
          "i'm still not sure if my purpose is supposed to be about others or just about me. maybe it's both. maybe it changes. i'm learning that it's okay to not have a clear answer. what matters is that i keep asking, keep trying, and keep showing up--even when it's awkward, even when it's hard. i'm starting to see that purpose isn't something you find--it's something you create, slowly, by being honest with yourself and others. it's in the moments you risk being misunderstood, the times you reach out even when you're scared, and the days you choose to keep going, even when you're not sure why.",
      },
      {
        type: "paragraph",
        text:
          "maybe purpose is about learning to be okay with not knowing, and finding meaning in the process of searching. maybe it's about letting go of the need to be perfect, and just being real. i'm still figuring it out, but for now, i'm grateful for the questions, the connections, and the chance to keep growing.",
      },
      {
        type: "quote",
        text: "maybe purpose is just the courage to keep searching.",
      },
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "mla-profiling",
    title: "The Hidden Bottleneck in MLA Serving: Reconstruction GEMMs and the L2 Cache Barrier",
    description:
      "Profiling MLA attention on H100 reveals reconstruction GEMMs consume 61% of attention-layer time. INT4 quantization should help but doesn't, because the weights fit in L2 cache.",
    longDescription:
      "Multi-head Latent Attention compresses KV cache 7× via low-rank projections, but the reconstruction step that recovers full K/V from latents has never been profiled. On DeepSeek-V3-scale architectures, reconstruction GEMMs dominate attention-layer time at small batch sizes. INT4 quantization preserves quality but is 2× slower than FP16, traced to L2 cache residency invalidating the roofline assumption.",
    date: "2026",
    year: 2026,
    tags: ["MLA", "FlashInfer", "Triton", "NCU", "H100", "LLM Inference", "Quantization"],
    featured: true,
    githubUrl: "https://github.com/zhan4808/sglang",
    paperUrl: "/mla-profiling/paper.pdf",
    sections: [
      {
        id: "motivation",
        title: "Motivation",
        blocks: [
          {
            type: "paragraph",
            text: "Multi-head Latent Attention (MLA) is the attention architecture behind DeepSeek-V2 and V3. It compresses the KV cache through low-rank latent projections, cutting KV memory traffic by 7.1× compared to standard multi-head attention. The attention kernel runs faster because there's less data to move. Everyone talks about this part.",
          },
          {
            type: "paragraph",
            text: "What nobody talks about is the cost of getting that data back. During inference, the compressed latents have to be reconstructed into full-dimensional K and V through weight-absorbed batch matrix multiplications. These reconstruction GEMMs run every layer, every token, with weight matrices that are fixed regardless of batch size or sequence length. The DeepSeek papers describe the math but don't profile the runtime cost. FlashInfer and other kernel work benchmarks the attention kernel in isolation. The reconstruction step just doesn't appear in anyone's measurements.",
          },
          {
            type: "paragraph",
            text: "I wanted to know how much time it actually takes. The answer turned out to be more than I expected, and trying to fix it with INT4 quantization led to a hardware-level finding about L2 cache residency that I haven't seen written up before.",
          },
          {
            type: "image",
            src: "/mla-profiling/e2e.png",
            alt: "Share of decode step by operation category",
            caption: "Decode step time breakdown on DeepSeek-V3 shapes. Linear projections dominate at 70.6%, with attention at 19.6% — reconstruction lives inside that attention slice.",
          },
        ],
      },
      {
        id: "reconstruction",
        title: "The Reconstruction Bottleneck",
        blocks: [
          {
            type: "paragraph",
            text: "MLA compresses KV to a 512-dimensional latent. To compute attention, it reconstructs full K and V via two batched matrix multiplications per layer: BMM1 absorbs the key projection into the query, BMM2 reconstructs values after attention. Both are [128, bs, 128] × [128, 128, 512] or similar — 128 heads, each doing an independent small GEMM.",
          },
          {
            type: "paragraph",
            text: "I profiled these BMMs separately from the FlashInfer MLA attention kernel on DeepSeek-V3 shapes (128 heads, 61 layers). At batch size 1, reconstruction takes 35.6 µs per layer while the attention kernel takes 23.0 µs. That's 61% of total attention-layer time spent on reconstruction, not attention. Across 61 layers, it adds up to 2.17 ms per token — a fixed overhead that doesn't depend on KV sequence length at all.",
          },
          {
            type: "image",
            src: "/mla-profiling/recon_overhead.png",
            alt: "MLA attention-layer time decomposition: reconstruction BMMs vs attention kernel across batch sizes",
            caption: "Per-layer time split between reconstruction BMMs (red) and the attention kernel (blue). At bs=1, reconstruction is 61% of the total. It stays nearly constant (~35 µs) while attention scales linearly with batch size.",
          },
          {
            type: "paragraph",
            text: "MLA's 7× KV compression made the attention kernel faster, but exposed a cost that was previously negligible. Reconstruction is the bottleneck now. And because these are batched GEMMs with fixed weight matrices, they're a natural target for optimization.",
          },
          {
            type: "paragraph",
            text: "A roofline analysis confirms that all reconstruction BMMs are memory-bound. Arithmetic intensity peaks at 93 (bs=128), well below the H100 crossover at 295. Achieved bandwidth ranges from 952 GB/s to 2,114 GB/s — 28-63% of HBM peak. There's room to improve, and the weights dominate the data transfer: 16 MB per BMM, fixed regardless of batch size.",
          },
          {
            type: "image",
            src: "/mla-profiling/roofline.png",
            alt: "H100 roofline plot with MLA reconstruction BMMs",
            caption: "H100 roofline with reconstruction BMMs plotted. Every operating point sits on the memory-bound slope, well below the compute ceiling. Even at bs=128, reconstruction achieves only 55% of the memory ceiling.",
          },
        ],
      },
      {
        id: "int4",
        title: "The INT4 Attempt",
        blocks: [
          {
            type: "paragraph",
            text: "Memory-bound operation, weight-dominated transfer, fixed 16 MB matrix. The roofline says: cut weight precision from FP16 to INT4, read 4× fewer bytes, get 3.9× speedup at bs=1. That would drop the 2.17 ms full-model reconstruction overhead to about 0.55 ms. Worth trying.",
          },
          {
            type: "paragraph",
            text: "First question: does INT4 break model quality? I evaluated on DeepSeek-V2-Lite (15.7B) using wikitext-2 perplexity. Three configs: FP16 baseline (5.727 PPL), selective INT4 of just the reconstruction weights (5.777 PPL, +0.051), and naive INT4 of all linear weights (11.784 PPL, +6.057). Selective INT4 is fine, an order of magnitude below the 0.5 PPL threshold. The reconstruction weights are projection matrices mapping between a compressed 512-dim latent and 128-dim head spaces; they have smooth spectral properties and errors average across 128 heads.",
          },
          {
            type: "image",
            src: "/mla-profiling/ppl.png",
            alt: "Perplexity comparison: FP16 baseline, selective INT4, all INT4",
            caption: "Wikitext-2 perplexity. Selective INT4 of reconstruction weights adds +0.051 PPL. Naive INT4 of everything more than doubles it.",
          },
          {
            type: "paragraph",
            text: "Second question: does it actually run faster? I wrote a custom batched W4A16 Triton kernel that fuses the head dimension into the grid (avoiding 128 separate kernel launches), dequantizes INT4 weights to FP16 in registers, and uses tensor core tl.dot for the matmul.",
          },
          {
            type: "paragraph",
            text: "The result: the INT4 kernel is 2× slower than cuBLAS FP16, not 3.9× faster. At bs=1, FP16 torch.bmm takes 0.036 ms; INT4 Triton takes 0.073 ms. The kernel is 30× faster than a naive per-head FP16 loop (2.19 ms), so the batched approach works. The problem is competing with cuBLAS.",
          },
          {
            type: "table",
            headers: ["BS", "FP16 bmm (ms)", "INT4 Triton (ms)", "INT4/FP16 Ratio"],
            rows: [
              ["1",   "0.036", "0.073", "0.49×"],
              ["4",   "0.037", "0.073", "0.50×"],
              ["16",  "0.036", "0.082", "0.44×"],
              ["64",  "0.036", "0.129", "0.28×"],
              ["128", "0.040", "0.187", "0.21×"],
              ["256", "0.070", "0.302", "0.23×"],
            ],
          },
          {
            type: "paragraph",
            text: "The roofline predicted 3.9×. We measured 0.49×. That's an 8× gap, which means the roofline assumption itself is wrong.",
          },
        ],
      },
      {
        id: "l2-barrier",
        title: "The L2 Cache Barrier",
        blocks: [
          {
            type: "paragraph",
            text: "The roofline model assumes data is served from HBM at 3.35 TB/s. But the total reconstruction weight per BMM is 128 × 128 × 512 × 2 = 16 MB. The H100's L2 cache is 50 MB. After the first access, torch.bmm serves these weights from L2 at roughly 12 TB/s, not HBM. INT4 reduces weight size from 16 MB to 4 MB, saving HBM bandwidth that was never being used in the first place.",
          },
          {
            type: "image",
            src: "/mla-profiling/l2barrier.png",
            alt: "L2 cache barrier: roofline predicted vs measured INT4/FP16 speedup",
            caption: "Roofline predicts 2-3.9× INT4 speedup (green). Measured performance is 0.2-0.5× (red) — INT4 is slower than FP16. The 8× gap at bs=1 is explained by L2 cache residency.",
          },
          {
            type: "paragraph",
            text: "This is the paradox specific to MLA: the same low-rank compression that makes reconstruction weights small enough to be a latency concern also makes them small enough to be L2-resident, which removes the motivation for weight quantization entirely. Standard LLM linear layers have weights in the hundreds of megabytes — they blow past L2 capacity and stream from HBM, where INT4 actually helps. Reconstruction weights at 16 MB don't.",
          },
          {
            type: "paragraph",
            text: "Two secondary factors. First, INT4 dequantization overhead: bit masking, shifting, signed extension, and type conversion on every packed byte, plus stride-2 activation loads for even/odd packing. The roofline doesn't account for this. Second, cuBLAS has hardware-optimized batched GEMM scheduling that a Triton kernel can't match (fused warp-level batching versus one thread block per head-tile).",
          },
          {
            type: "paragraph",
            text: "This barrier isn't absolute. In production serving, concurrent FFN GEMMs, multi-layer attention, and request batching all contend for L2 capacity. Under enough L2 pressure, reconstruction weights get evicted back to HBM and INT4 should start helping. The gains are deployment-dependent: negligible in isolated benchmarks, potentially real in high-throughput serving. Alternatively, fusing reconstruction across multiple layers to exceed L2 capacity could restore the roofline prediction.",
          },
          {
            type: "heading",
            level: 3,
            text: "Causal Validation: L2 Boundary Sweep",
          },
          {
            type: "paragraph",
            text: "To causally isolate the L2 effect, I swept weight matrix size from 8 MB to 128 MB by scaling d_lora from 256 to 4096 while holding H=128 and d_nope=128 fixed. The result: the INT4/FP16 time ratio drops from 1.91× at 8 MB to 1.08× at 128 MB, with a sharp knee at 40–48 MB as weights begin to exceed L2 capacity. At MLA's operating point (16 MB), INT4 is 1.86× slower; at 128 MB (well past L2), the gap nearly closes.",
          },
          {
            type: "image",
            src: "/mla-profiling/l2sweep.png",
            alt: "INT4/FP16 time ratio vs FP16 weight size, showing sharp transition at the 50 MB L2 boundary",
            caption: "Weight-size scaling across the L2 boundary. Below 50 MB (green, L2-resident), INT4 is ~1.9× slower. Above 50 MB, the ratio drops sharply toward parity as FP16 falls back to HBM. MLA's 16 MB operating point sits firmly in the L2-resident regime.",
          },
          {
            type: "paragraph",
            text: "NCU profiling across the sweep confirms the mechanism. The FP16 cuBLAS kernel is DRAM-bound: DRAM utilization scales from 35% at 8 MB to 83% at 128 MB while SM utilization stays below 15%. The INT4 Triton kernel is the opposite: SM utilization scales from 33% to 79% (dequantization dominates) while DRAM utilization stays below 23%. INT4 reads exactly 4× fewer DRAM bytes as expected, but the kernel is compute-bound from dequantization overhead, so it can't convert bandwidth savings into latency reduction.",
          },
        ],
      },
      {
        id: "kernel-validation",
        title: "FlashInfer vs Triton (Methodology Validation)",
        blocks: [
          {
            type: "paragraph",
            text: "Before running the MLA analysis I needed to trust the profiling setup. I benchmarked FlashInfer against Triton attention kernels on Llama-3-8B GQA, a well-studied configuration where the performance gap is known. If my numbers match the literature, the methodology is sound.",
          },
          {
            type: "paragraph",
            text: "In decode (memory-bound), FlashInfer peaks at 2,987 GB/s (89% of H100's 3.35 TB/s HBM bandwidth). Triton peaks at 2,669 GB/s (80%). The gap narrows from 2× at bs=1 to 1.12× at bs=256 as launch overhead becomes negligible relative to streaming KV reads. These numbers reproduce known results.",
          },
          {
            type: "image",
            src: "/mla-profiling/decode_bw.png",
            alt: "Decode bandwidth vs batch size for FlashInfer and Triton",
            caption: "HBM bandwidth vs batch size in decode. FlashInfer saturates at 89% of H100 peak; Triton at 80%. The gap narrows as batch size increases.",
          },
          {
            type: "paragraph",
            text: "In prefill (compute-bound), FlashInfer peaks at 552 TFLOPS (56% of 990T peak) while Triton peaks at 209 TFLOPS (21%). The 2.6× gap is consistent across all configurations and widens with sequence length.",
          },
          {
            type: "image",
            src: "/mla-profiling/prefill_tflops.png",
            alt: "Prefill TFLOPS by configuration for FlashInfer and Triton",
            caption: "Prefill compute throughput. FlashInfer is 2.1-2.7× higher across all configs. The gap widens with sequence length.",
          },
          {
            type: "heading",
            level: 3,
            text: "NCU root causes",
          },
          {
            type: "paragraph",
            text: "NCU profiling reveals three root causes, none obvious from timing alone.",
          },
          {
            type: "paragraph",
            text: "First: TMA vs global loads. A naive reading of NCU's L1 sector counters gives FlashInfer a 97% L1 hit rate and Triton 0.1%. This is misleading. FlashInfer's Hopper kernel uses TMA (Tensor Memory Accelerator), a dedicated hardware unit that copies data directly from HBM/L2 into shared memory, bypassing L1 entirely. The 108K L1 sectors in FlashInfer are residual metadata accesses, not QKV data. TMA is not \"better caching\"; it's a different hardware data path that Triton's compiler cannot generate.",
          },
          {
            type: "paragraph",
            text: "Second: the occupancy paradox. FlashInfer uses 183 registers per thread (2.4× Triton's 76), yielding only 12.2% active warps versus 35.4%. Yet FlashInfer achieves 84% DRAM throughput versus 76%. Fewer warps, more bandwidth. For bandwidth-bound kernels, memory access pattern quality matters more than occupancy. FlashInfer's fused design with coalesced, pipelined accesses extracts more bandwidth per warp than Triton's higher-occupancy two-phase approach.",
          },
          {
            type: "paragraph",
            text: "Third: cooperative grid launch. FlashInfer launches exactly 132 thread blocks (one per SM) using CUDA cooperative launch semantics. Triton launches 2,048 blocks in multiple waves. Each wave evicts the previous wave's L2 residency, explaining the 14-point L2 hit rate gap (86.4% vs 72.0%).",
          },
        ],
      },
      {
        id: "takeaways",
        title: "Takeaways",
        blocks: [
          {
            type: "paragraph",
            text: "MLA's KV compression cuts attention memory traffic 7× and makes the attention kernel faster. But optimizing one component reveals a hidden cost: reconstruction GEMMs that were negligible under standard MHA become the dominant bottleneck under MLA. At bs=1, reconstruction is 61% of attention-layer time. This is a fixed per-token cost that doesn't show up in attention-only benchmarks.",
          },
          {
            type: "paragraph",
            text: "INT4 quantization is the obvious fix, and the quality story is good: reconstruction weights tolerate INT4 with minimal degradation (+0.051 PPL). But the performance story is inverted: INT4 is slower, not faster, because the weights are small enough to live in L2 cache. The roofline model breaks when working sets fit in L2. Quantization targets HBM bandwidth, and if you're not reading from HBM, there's nothing to target.",
          },
          {
            type: "paragraph",
            text: "More generally, optimizations that reduce data movement can shift workloads into regimes where cache hierarchy, not raw bandwidth, determines performance. MLA reconstruction on H100 is a concrete instance of this.",
          },
          {
            type: "heading",
            level: 3,
            text: "What's next",
          },
          {
            type: "list",
            items: [
              "CUDA-native INT8 tensor core kernel for reconstruction: bypasses the FP16 dequant path entirely and uses native low-precision MMA.",
              "Cross-layer weight fusion: fusing reconstruction across multiple layers so the combined weight set exceeds L2 capacity, restoring the roofline prediction.",
              "Production serving measurement: profiling reconstruction under real L2 pressure from concurrent FFN GEMMs and multi-tenant batching, where the cache barrier may weaken.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "tiny-gemm",
    title: "Tiny-GEMM: Packed INT4 Triton GEMM for Decode-Heavy LLM Inference",
    description:
      "Packed INT4 GEMM kernel in Triton for decode-heavy LLM inference with hardware counter attribution and a regime model for when quantization helps. Up to 3.7× speedup on A10G.",
    longDescription:
      "Small-batch LLM decoding is dominated by narrow GEMMs that stress memory bandwidth and launch overhead rather than peak FLOPs. Tiny-GEMM is a packed INT4 GEMM kernel in Triton for decode-heavy shapes, with measurement-driven analysis backed by hardware counters of when weight-only INT4 helps or hurts.",
    date: "2025",
    year: 2025,
    tags: ["Triton", "CUDA", "LLM Inference", "Quantization", "GPU Kernels"],
    featured: true,
    githubUrl: "https://github.com/zhan4808/gemmopt",
    paperUrl: "/tiny-gemm/Tiny-GEMM.pdf",
    sections: [
      {
        id: "motivation",
        title: "Motivation",
        blocks: [
          {
            type: "paragraph",
            text: "LLM inference and training are fundamentally different workloads. Training runs large, square-ish matrices that saturate tensor cores. Decoding runs one token at a time — batch size 1 to 8, skinny weight projections, tight latency budgets. In this regime the bottleneck shifts entirely: it's memory bandwidth and kernel launch overhead, not peak FLOPs.",
          },
          {
            type: "paragraph",
            text: "This creates a real problem for quantization. The naive story is \"INT4 halves your weight size so you get 2× bandwidth and 2× speed.\" But in the decode regime that math breaks down — you also have to unpack those 4-bit values back to float inside the kernel, and that dequantization cost is fixed per launch regardless of how much work you do. For narrow projections like KV, that overhead dominates and INT4 ends up slower than FP16.",
          },
          {
            type: "paragraph",
            text: "Tiny-GEMM is my attempt to pin this down precisely: build the fused kernel, run it against FP16 and dequantized-FP16 baselines across the actual decode shapes that matter, use Nsight Compute to see what's really happening in hardware, and derive a concrete rule for when INT4 is worth using.",
          },
        ],
      },
      {
        id: "kernel",
        title: "The Kernel",
        blocks: [
          {
            type: "paragraph",
            text: "The kernel is written in Triton with per-tensor quantization and bit-packed weight tensors. INT4 values are stored two-per-byte and unpacked into FP32 accumulators inside the kernel. Tile configurations are static and keyed by shape family and batch bucket — decode shapes cluster tightly enough that a small lookup table beats dynamic autotuning at runtime.",
          },
          {
            type: "image",
            src: "/tiny-gemm/architecture_diagram.png",
            alt: "Tiny-GEMM kernel architecture: INT4 unpack → SRAM → FP32 accumulate → output",
            caption: "Kernel flow: packed INT4 weights are loaded from DRAM, unpacked in shared memory, accumulated in FP32, and written to output. The unpack step is what sets the regime — it's free when work is large, expensive when it's not.",
          },
          {
            type: "paragraph",
            text: "Three baselines are compared across every shape: FP16 (torch.matmul / cuBLAS, vendor-optimized), dequantized FP16 (INT4 quantize → dequant → FP16 GEMM as a two-step pipeline), and the fused INT4 kernel. The dequantized baseline is important — it isolates whether the problem is the quantization format or the fused computation, and it's what most deployed systems actually do before switching to a fused kernel.",
          },
          {
            type: "paragraph",
            text: "One important caveat: the kernel accumulates in FP32, not using INT4 tensor core MMA instructions. Exploiting Ampere/Hopper INT4 MMA is future work — the current bottleneck on decode shapes is memory, not compute, so the MMA throughput gap doesn't matter yet.",
          },
        ],
      },
      {
        id: "setup",
        title: "Setup",
        blocks: [
          {
            type: "paragraph",
            text: "All experiments run on an NVIDIA A10G. Shapes are derived from Llama-style models — Q/K/V projections (K=N=4096), KV projections (K=4096, N=1024), FFN up-projections (K=4096, N=14336), and FFN down-projections (K=14336, N=4096). Batch sizes M ∈ {1…8} cover the decode regime. Each latency is the median of 50 runs after 10 warmup iterations; profiling uses Nsight Compute for hardware counters and Nsight Systems for kernel time breakdowns.",
          },
          {
            type: "table",
            headers: ["Layer", "M", "K", "N"],
            rows: [
              ["Q/K/V proj", "1–8", "4096", "4096"],
              ["KV proj",    "1–8", "4096", "1024"],
              ["FFN up",     "1–8", "4096", "14336"],
              ["FFN down",   "1–8", "14336", "4096"],
            ],
          },
        ],
      },
      {
        id: "results",
        title: "Results",
        blocks: [
          {
            type: "paragraph",
            text: "The headline numbers at M=1. The split is immediate — FFN up gets 3.58×, KV proj gets 0.62× (it's slower with INT4). This isn't a subtle effect or a tuning artifact; it's a structural consequence of shape geometry.",
          },
          {
            type: "table",
            headers: ["Shape", "FP16 (ms)", "INT4 (ms)", "Speedup", "Bottleneck"],
            rows: [
              ["KV proj   (K=4096, N=1024)",  "0.027", "0.043", "0.62×", "Dequant overhead"],
              ["Q proj    (K=4096, N=4096)",  "0.075", "0.047", "1.58×", "Mixed"],
              ["FFN up    (K=4096, N=14336)", "0.239", "0.067", "3.58×", "Memory bandwidth"],
              ["FFN down  (K=14336, N=4096)", "0.258", "0.152", "1.69×", "Memory bandwidth"],
            ],
          },
          {
            type: "image",
            src: "/tiny-gemm/speedup_vs_n_k4096.png",
            alt: "Speedup vs output width N at fixed K=4096",
            caption: "Speedup vs N at fixed K=4096. Sub-1× for narrow N, climbing to 3.7× at N=14336. The transition happens around N=2–4K.",
          },
          {
            type: "image",
            src: "/tiny-gemm/family_latency_m1.png",
            alt: "Latency by layer family at M=1",
            caption: "Latency by layer family at M=1. FFN layers improve substantially; projection layers are mixed; KV proj regresses.",
          },
        ],
      },
      {
        id: "prefill-vs-decode",
        title: "Prefill vs. Decode",
        blocks: [
          {
            type: "paragraph",
            text: "The same kernel, same weights, different batch size — the story changes completely. In prefill you're running M in the hundreds or thousands, so dequantization overhead gets amortized across a huge amount of output work. INT4 helps across nearly all shapes. In decode, M is 1–8 and the fixed overhead per launch is a much larger fraction of total runtime.",
          },
          {
            type: "image",
            src: "/tiny-gemm/prefill_vs_decode_speedup.png",
            alt: "Prefill vs decode speedup by layer family",
            caption: "Prefill vs decode speedup by family. KV proj goes from 0.62× in decode to ~2.3× in prefill — same kernel, same weights, just more work to amortize the overhead.",
          },
          {
            type: "paragraph",
            text: "This means a blanket quantization policy that's tuned for prefill throughput can actively hurt decode latency on the same model. Deployment decisions need to be mode-aware, not just shape-aware.",
          },
          {
            type: "image",
            src: "/tiny-gemm/int4_speedup_heatmap_m1.png",
            alt: "INT4 speedup heatmap across (K, N) at M=1",
            caption: "Speedup heatmap at M=1 across (K, N). The geometry is clear: large-N shapes in the top-right consistently win; small-N shapes lose.",
          },
        ],
      },
      {
        id: "regime",
        title: "The Regime Model",
        blocks: [
          {
            type: "paragraph",
            text: "To make the pattern precise, I decompose kernel runtime into four additive costs:",
          },
          {
            type: "math",
            latex: "T_{\\text{total}} = T_{\\text{launch}} + T_{\\text{mem}}(W) + T_{\\text{dequant}} + T_{\\text{compute}}",
            display: true,
          },
          {
            type: "paragraph",
            text: "INT4 reduces T_mem by roughly 2× (half the bits to move). INT4 also adds T_dequant. The kernel wins when the bandwidth savings exceed the unpack cost:",
          },
          {
            type: "math",
            latex: "T_{\\text{mem}}^{\\text{FP16}} - T_{\\text{mem}}^{\\text{INT4}} > T_{\\text{dequant}}",
            display: true,
          },
          {
            type: "paragraph",
            text: "This inequality is equivalent to an arithmetic intensity threshold. Below a certain α (FLOPs/byte), dequantization dominates and INT4 loses. Above it, bandwidth savings dominate and INT4 wins. In the sweep that boundary falls at roughly α ≈ 8 FLOPs/byte.",
          },
          {
            type: "image",
            src: "/tiny-gemm/regime_boundary.png",
            alt: "Regime boundary: speedup vs arithmetic intensity",
            caption: "Each point is one (M, K, N) shape. The transition at α ≈ 8 FLOPs/byte cleanly separates regressions from wins.",
          },
          {
            type: "image",
            src: "/tiny-gemm/roofline_scatter.png",
            alt: "Roofline view: arithmetic intensity vs achieved TFLOPs",
            caption: "Roofline view. INT4 shifts points rightward (higher arithmetic intensity) and off the memory bandwidth ceiling — but narrow shapes land in the dequant-overhead region instead.",
          },
        ],
      },
      {
        id: "hardware",
        title: "Hardware Counter Attribution",
        blocks: [
          {
            type: "paragraph",
            text: "The regime model is clean but abstract — Nsight Compute lets me check it against actual hardware behavior. FP16 decode GEMMs on the A10G reach ~75–77% of peak DRAM bandwidth while compute utilization stays low. This is the textbook memory-bound regime: the GPU is waiting on DRAM, not doing arithmetic.",
          },
          {
            type: "image",
            src: "/tiny-gemm/ncu_utilization_comparison.png",
            alt: "Hardware utilization: FP16 vs INT4 from Nsight Compute",
            caption: "FP16 vs INT4 hardware utilization from NCU. FP16 saturates DRAM. INT4 frees up bandwidth but the compute utilization reading tells you where that headroom goes.",
          },
          {
            type: "image",
            src: "/tiny-gemm/dequant_breakdown.png",
            alt: "Dequantization overhead breakdown by shape",
            caption: "Microbenchmark isolating dequantization cost per shape. For KV proj, dequant is a large fraction of total runtime — explaining why INT4 loses there despite lower memory traffic.",
          },
          {
            type: "paragraph",
            text: "INT4 ends up at ~23% peak SM throughput vs ~32% for FP16. That's 28% less compute pressure — not because INT4 is more efficient, but because it's doing less useful work per cycle (more of the SM time goes to the unpack path). The memory traffic numbers confirm it: INT4 halves weight reads, consistently, across all shapes. The variable is whether you can convert that into latency savings.",
          },
          {
            type: "image",
            src: "/tiny-gemm/peak_compute_utilization.png",
            alt: "Peak SM compute utilization: FP16 vs INT4",
            caption: "Peak SM utilization. INT4 is lower — bandwidth relief doesn't help when dequant eats the freed capacity.",
          },
          {
            type: "image",
            src: "/tiny-gemm/ncu_utilization_int4.png",
            alt: "INT4 kernel NCU breakdown across shapes",
            caption: "INT4 kernel NCU breakdown across representative decode shapes — SM efficiency, memory throughput, warp stalls.",
          },
          {
            type: "image",
            src: "/tiny-gemm/memory_traffic_scatter.png",
            alt: "Memory traffic: INT4 vs FP16",
            caption: "Memory traffic scatter. INT4 consistently halves DRAM reads for weights. The bandwidth savings are real; the question is always whether they exceed dequant cost.",
          },
        ],
      },
      {
        id: "systems",
        title: "Systems View",
        blocks: [
          {
            type: "paragraph",
            text: "Decode latency and serving throughput are different objectives that sometimes point in opposite directions. Interactive serving wants minimum single-token latency (M=1). Batch serving wants maximum tokens/second (larger M). INT4 behaves differently in each.",
          },
          {
            type: "image",
            src: "/tiny-gemm/batch_scaling_k4096_n4096.png",
            alt: "Latency vs batch size at K=N=4096",
            caption: "Latency vs M at K=N=4096. Both scale sublinearly — launch overhead amortizes — but the INT4/FP16 ratio stays roughly constant.",
          },
          {
            type: "image",
            src: "/tiny-gemm/tokens_per_sec_k4096_n4096.png",
            alt: "Tokens per second vs batch size",
            caption: "Throughput (tokens/sec) vs batch. INT4 throughput advantage grows with batch size as memory becomes the sustained bottleneck.",
          },
          {
            type: "paragraph",
            text: "The batch-size stability of the speedup profile is actually good news for deployment: it means the INT4/FP16 decision is static per layer, not dynamic per request. You don't need to re-evaluate at runtime — just apply the α > 8 FLOPs/byte rule at model load time.",
          },
          {
            type: "image",
            src: "/tiny-gemm/int4_speedup_by_m.png",
            alt: "Speedup vs batch size M=1–8 by family",
            caption: "Speedup profile across M=1–8. Remarkably flat per family — the regime boundary is geometry-driven, not batch-driven.",
          },
          {
            type: "image",
            src: "/tiny-gemm/decode_latency_m1.png",
            alt: "Absolute decode latency at M=1",
            caption: "Absolute latency at M=1. Wide FFN shapes dominate total transformer runtime — and these are exactly the shapes where INT4 wins the most.",
          },
          {
            type: "image",
            src: "/tiny-gemm/kernel_time_top_shapes.png",
            alt: "Top shapes by CUDA execution time",
            caption: "Top decode shapes by CUDA time from Nsight Systems. A small set of wide FFN GEMMs accounts for most of decode runtime — optimizing them has outsized impact.",
          },
        ],
      },
      {
        id: "takeaways",
        title: "Takeaways",
        blocks: [
          {
            type: "paragraph",
            text: "The practical upshot: don't apply INT4 uniformly. The arithmetic intensity threshold (α ≈ 8 FLOPs/byte) is a reliable decision boundary. Above it — wide FFN projections — INT4 wins by 1.5–3.7× in decode. Below it — narrow KV projections — keep FP16. The layers you most want to quantize (FFN, because they're the largest) are also the ones where INT4 actually helps.",
          },
          {
            type: "paragraph",
            text: "There's a broader systems lesson here too: reducing bandwidth pressure doesn't automatically improve latency if the freed capacity gets consumed by something else. Quantization is only effective when arithmetic intensity is high enough to amortize the dequantization overhead — and that threshold is measurable. The model isn't hard to derive; you just have to actually measure it instead of assuming.",
          },
          {
            type: "heading",
            level: 3,
            text: "What's next",
          },
          {
            type: "list",
            items: [
              "INT4 tensor core MMA: the kernel currently accumulates in FP32, skipping Ampere/Hopper INT4 MMA instructions. On compute-bound shapes this matters.",
              "Split-K for M=1 to improve SM occupancy on the narrowest projections by splitting the K dimension across thread blocks.",
              "FP8 on Blackwell. tcgen05.mma.kind::f8f6f4 changes the roofline substantially; re-evaluating the regime boundary on B200 is the next step.",
              "Multi-GPU and serving stack integration, connecting kernel-level gains to end-to-end serving latency under concurrent requests.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "atalla-kernels",
    title: "FlashAttention & Kernel Development on Atalla Ax01",
    description:
      "Kernel development and HW/SW co-design for Atalla, a student-built weight-stationary systolic array AI accelerator. FlashAttention mapping, im2col convolution, tiled GEMM, and PyTorch backend integration.",
    longDescription:
      "Atalla is a research-grade AI accelerator built end-to-end at Purdue's SoCET lab: a weight-stationary 32×32 BF16 systolic array with programmer-managed scratchpad SRAM, VLIW scheduling, and no hardware cache. I own the systems software workstream: FlashAttention kernel mapping, implicit im2col convolution, tiled GEMM, and PyTorch frontend integration.",
    date: "2025",
    year: 2025,
    tags: ["GPU Kernels", "Computer Architecture", "HW/SW Co-Design", "VLIW", "Systolic Array", "PyTorch"],
    featured: true,
    githubUrl: "https://github.com/Purdue-SoCET/atalla",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Atalla is a student-led effort within Purdue's SoCET lab to design a research-grade AI accelerator stack from scratch: RTL, kernel software, FPGA emulation. The core is a parameterizable 32×32 BF16 systolic array with three dataflow implementations (naïve, MEISSA-inspired, TPU-inspired), a 1MB dual-partition scratchpad SRAM, and a VLIW scheduler.",
          },
          {
            type: "paragraph",
            text: "I work on the Systems Software team, owning the kernel and PyTorch integration layer. The design philosophy is closer to a TPU than a GPU: there's no hardware cache, no SIMT abstraction, and no hardware scoreboard. All data movement between DRAM and on-chip SRAM is explicit via SDMA instructions. All dependency tracking is the programmer's responsibility. This makes the programming model hard, but the optimization surface is wide open.",
          },
          {
            type: "image",
            src: "/atalla/toplevelatalla.png",
            alt: "Atalla Ax01 top-level system view",
            caption: "Atalla Ax01 top-level architecture. Compute (systolic array), memory (scratchpad + DDR4), systems software (kernels + PyTorch), compiler (PPCI-based), and FPGA emulation are all student-built.",
            invert: true,
          },
          {
            type: "image",
            src: "/atalla/atallaax02arch.png",
            alt: "Atalla Ax02 full chip architecture",
            caption: "Ax02 next-generation architecture: dual-core design with 128×128 systolic arrays, 2MB L1 scratchpad per core, shared L2 scratchpad, and HBM via Ramulator.",
            invert: true,
          },
        ],
      },
      {
        id: "architecture",
        title: "Architecture & Programming Model",
        blocks: [
          {
            type: "paragraph",
            text: "The Atalla programming model is tile-centric and single-threaded. Instead of writing scalar SIMT code that the runtime fans out, you write explicit tile descriptors and intrinsic calls that directly orchestrate the systolic array and SRAM. The key abstractions are GlobalTile (tensor in DRAM), ScpadTile (tensor in on-chip SRAM), and VectorReg (register in the VEGGIE file).",
          },
          {
            type: "heading",
            level: 3,
            text: "Memory Hierarchy",
          },
          {
            type: "table",
            headers: ["Level", "Size", "Access", "Latency"],
            rows: [
              ["DRAM (Global)", "8GB+", "SDMA only (scpad.ld / scpad.st)", "High"],
              ["Scratchpad (SCPAD)", "1MB SRAM, 2 partitions", "SDMA only", "Low"],
              ["Vector Registers (VEGGIE)", "On-chip", "VM instructions (vreg.ld / vreg.st)", "Very low"],
              ["Scalar Registers", "On-chip", "Hardware-managed L1 cache", "Very low"],
              ["SA Accumulation Buffers", "Hardware-controlled", "Not programmable", "—"],
            ],
          },
          {
            type: "paragraph",
            text: "The dual scratchpad partition (SCPAD0, SCPAD1) is a key design choice. The compiler can issue loads to both partitions in the same VLIW bundle, enabling overlap between SCPAD0 loads and SCPAD1 compute. The GEMMV execution pattern exploits this: A tiles load into SCPAD0, B and C tiles into SCPAD1, allowing the systolic array to consume one pair while the next is loading.",
          },
          {
            type: "heading",
            level: 3,
            text: "ISA Highlights",
          },
          {
            type: "paragraph",
            text: "The ISA has 7-bit opcodes across instruction types: scalar integer and BF16 arithmetic, vector-vector and vector-scalar masked operations, SDMA bulk DMA, VM vector-register loads and stores, and the GEMMV and CONV compute intrinsics. expi.vi (element-wise exp) costs 15 cycles, which matters a lot for softmax. The vector reduction tree (rmax.vi, rsum.vi) costs 13 cycles. These latencies make the case for polynomial exp emulation in attention kernels.",
          },
        ],
      },
      {
        id: "flashattention",
        title: "FlashAttention Kernel",
        blocks: [
          {
            type: "paragraph",
            text: "I own the FlashAttention kernel workstream. The Q·Kᵀ and attn·V matmuls map cleanly onto GEMMV: tiles of Q, K, V load into SCPAD, the systolic array handles the matmul, and partial sums accumulate in the hardware accumulation buffers before transfer to VEGGIE. But softmax is inherently scalar and sequential. It runs on the scalar unit using rmax.vi (13 cycles), expi.vi (15 cycles), and rsum.vi (13 cycles) per tile.",
          },
          {
            type: "paragraph",
            text: "The co-design question this raises: can the scalar unit begin softmax rescaling on the previous tile's output while the systolic array's PSUM writeback to VEGGIE is happening for the current tile? The two operations use distinct hardware units (scalar unit vs. accumulation buffer writeback path). If they can be pipelined across tiles using the dual-SCPAD architecture, that's free latency hiding. Still being validated in the emulator.",
          },
          {
            type: "heading",
            level: 3,
            text: "Key Optimizations",
          },
          {
            type: "list",
            items: [
              "Polynomial exp emulation: degree-3 Horner's method replaces the 15-cycle expi.vi with a ~4–5 cycle sequence of mul.vv + add.vv at acceptable accuracy for inference.",
              "Conditional softmax rescaling: skip the rescale step when the running tile max doesn't change, reducing scalar unit pressure on locally stable attention distributions.",
              "Tiling strategy: explicit SDMA prefetch of Q/K/V tiles into alternating SCPAD partitions, targeting overlap between SCPAD loads and systolic array compute.",
              "Online softmax (FlashAttention-style): maintain running (max, denominator, output) accumulators across tiles — never materialize the full N×N attention matrix in SRAM.",
            ],
          },
        ],
      },
      {
        id: "im2col",
        title: "Implicit Im2col Convolution",
        blocks: [
          {
            type: "paragraph",
            text: "Standard convolution can be lowered to GEMM via im2col: rearrange the input tensor so each convolution window becomes a column, then run a single GEMM. The naive approach materializes the im2col buffer explicitly — for a 3×3 conv over a 224×224 feature map, that's a 9× expansion of the input, turning a 48MB tensor into 432MB. This is impractical for a 1MB scratchpad.",
          },
          {
            type: "paragraph",
            text: "The implicit channel-first variant avoids materialization entirely. The im2col addressing is computed on-the-fly inside the SDMA load — the scratchpad sees a logically rearranged tensor computed from index arithmetic, not a pre-expanded buffer. This keeps the memory footprint bounded by the tile size. I built a Streamlit-based simulator and visualizer for this kernel to make the addressing logic debuggable and to help teammates understand the co-design constraints.",
          },
        ],
      },
      {
        id: "tiled-gemm",
        title: "Tiled GEMM",
        blocks: [
          {
            type: "paragraph",
            text: "The GEMMV intrinsic operates on tiles ≤ 32×32. A full M×N×K GEMM is decomposed into MT×NT×KT tile groups, each loaded into SCPAD before a GEMMV call. The C tile accumulates across all k-slices before being written back to DRAM. Tile sizing is a constraint satisfaction problem: TM × TK + TK × TN + TM × TN must fit within one SCPAD partition's budget with room for double-buffering the other partition.",
          },
          {
            type: "code",
            code: `// Outer tile loop (output tiles)
  for each (i, j) in output tile grid:
    load C_tile → SCPAD1
    
    // Inner K-reduction loop
    for each k-slice:
      load A_tile[i, k] → SCPAD0   // SDMA to partition 0
      load B_tile[k, j] → SCPAD1   // SDMA to partition 1
      GEMMV(sc_C, sc_A, sc_B)      // blocks until SCPAD_C updated
    
    store C_tile → DRAM`,
          },
        ],
      },
      {
        id: "pytorch",
        title: "PyTorch Backend Integration",
        blocks: [
          {
            type: "paragraph",
            text: "To run real PyTorch models on Atalla, I built a custom backend using torch.export and FX graph capture. The flow: capture a model as an FX graph, walk the graph nodes, map recognized op patterns (linear, conv2d, relu, etc.) to Atalla kernel calls via an op registry, emit the SDMA + GEMMV instruction sequence for each mapped op, and hand off to the simulator for cycle-accurate execution. This gives the team a path from 'standard PyTorch model' to 'runs on Atalla' without hand-writing kernels for every model.",
          },
        ],
      },
      {
        id: "open-questions",
        title: "Open Co-Design Questions",
        blocks: [
          {
            type: "paragraph",
            text: "Some open co-design directions the team is exploring:",
          },
          {
            type: "list",
            items: [
              "PSUM overlap: can PSUM writeback to VEGGIE be pipelined with scalar unit softmax computation? This requires careful timing analysis in the emulator.",
              "Sparsity support: structured sparsity in specific model families could give 2× weight compression with hardware support. What ISA changes would enable this?",
              "Multi-datatype: extending beyond BF16 to INT8 or FP8 would open up quantized inference; the scalar core already has type conversion instructions (stbf.s, bfts.s).",
              "Transpose units: attention requires Kᵀ, currently handled in software via SDMA swizzle. Dedicated transpose hardware would eliminate that overhead.",
              "Compiler packetization: the VLIW scheduler leaves performance on the table; better packetization heuristics could meaningfully improve utilization.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "riscv-cpu",
    title: "5-Stage Pipelined RISC-V CPU",
    description:
      "Fully pipelined 5-stage RISC-V processor in SystemVerilog with hazard detection, data forwarding, and a 2-bit branch predictor. Synthesized in Cadence targeting 70 MHz.",
    longDescription:
      "Designed and verified a 5-stage RISC-V pipeline (IF→ID→EX→MEM→WB) in SystemVerilog with full forwarding, load-use stall detection, and a 2-bit saturating branch predictor. Synthesized in Cadence targeting 70 MHz, achieving ~80 MHz Fmax on the CPUCLK domain.",
    date: "2025",
    year: 2025,
    tags: ["RTL", "SystemVerilog", "Computer Architecture", "ASIC Design"],
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Designed and verified a fully pipelined 5-stage RISC-V processor in SystemVerilog, implementing the classic IF → ID → EX → MEM → WB pipeline with all the hardware mechanisms necessary to handle real program behavior correctly — hazard detection, data forwarding, and branch prediction.",
          },
          {
            type: "paragraph",
            text: "A single-cycle processor has CPI=1 by construction, but its clock frequency is limited by the longest combinational path (typically load-use through the memory stage). Pipelining breaks that critical path across five registers, lifting clock frequency at the cost of introducing data and control hazards that must be resolved in hardware.",
          },
          {
            type: "image",
            src: "/pipeline-cpu/Onyx Pipeline Branch Predictor.svg",
            alt: "Full RTL diagram of the 5-stage RISC-V pipeline with branch predictor",
            caption: "Full RTL schematic: 5-stage pipeline (IF/ID/EX/MEM/WB), forwarding paths, hazard detection unit, and 2-bit branch predictor. Designed in draw.io / Cadence.",
          },
        ],
      },
      {
        id: "hazards",
        title: "Hazard Detection and Data Forwarding",
        blocks: [
          {
            type: "paragraph",
            text: "Data hazards occur when an instruction reads a register that a preceding instruction hasn't yet written back. Without intervention, this would require inserting NOPs (stall bubbles) after every instruction that produces a result. The forwarding unit eliminates most of this penalty by detecting RAW (read-after-write) conflicts and bypassing results directly from pipeline registers back to the EX stage inputs.",
          },
          {
            type: "paragraph",
            text: "Two forwarding paths are implemented: EX/MEM → EX (one-cycle-old result) and MEM/WB → EX (two-cycle-old result). Both rs1 and rs2 are checked independently; EX-stage forwarding takes priority when both paths are valid. The one case that can't be forwarded: a load followed immediately by an instruction that uses the loaded value. The data doesn't exist until after MEM, so the hazard detection unit inserts a one-cycle stall by freezing IF/ID and injecting a NOP into the EX stage.",
          },
        ],
      },
      {
        id: "branch-prediction",
        title: "Branch Prediction",
        blocks: [
          {
            type: "paragraph",
            text: "Control hazards arise when a branch is taken: the instruction fetched speculatively at PC+4 is wrong and must be flushed. The baseline implementation uses always-not-taken prediction — the pipeline fetches PC+4 and flushes the IF/ID register (one-cycle penalty) only when a branch resolves as taken in EX. Zero hardware overhead; zero penalty on not-taken branches.",
          },
          {
            type: "paragraph",
            text: "The design was extended with a 2-bit saturating counter predictor (states: strongly-not-taken, weakly-not-taken, weakly-taken, strongly-taken). A branch history table indexed by PC maintains per-branch state. This dramatically reduces misprediction penalty on loops (where branches are taken repeatedly) and other repeating patterns. The predictor is evaluated at LAT=2 (2-cycle misprediction penalty) and LAT=6.",
          },
        ],
      },
      {
        id: "performance",
        title: "Performance: Mergesort Sweep",
        blocks: [
          {
            type: "paragraph",
            text: "Benchmark: mergesort on a fixed array. Run across three design snapshots (Feb 5, Feb 22, Feb 26) with four predictor configurations each. The Feb 26 build is the final design. Performance is measured in simulation cycles and wall-clock latency derived from synthesis Fmax.",
          },
          {
            type: "heading",
            level: 3,
            text: "Final design (Feb 26, 2026)",
          },
          {
            type: "table",
            headers: ["Configuration", "Cycles", "CPUCLK Fmax", "Wall-clock latency", "CPI (est.)"],
            rows: [
              ["No predictor (LAT=0)",    "7,741",  "80.42 MHz", "96.3 µs",  "~1.20"],
              ["2-bit predictor (LAT=2)", "15,640", "80.37 MHz", "194.6 µs", "~2.43"],
              ["2-bit predictor (LAT=6)", "29,672", "80.37 MHz", "369.2 µs", "~4.60"],
              ["2-bit predictor (LAT=10)","43,704", "80.37 MHz", "543.8 µs", "~6.78"],
            ],
          },
          {
            type: "paragraph",
            text: "CPI estimated assuming ~6,450 effective instructions (derived from LAT=0 cycles ÷ ~1.2 ideal pipeline CPI with forwarding overhead). Note: the predictor increases cycle count because this mergesort workload has many taken branches — the 2-bit predictor's prediction latency costs more than it saves here, indicating branch prediction is only beneficial when misprediction rate < penalty overhead / branch frequency.",
          },
          {
            type: "heading",
            level: 3,
            text: "Design progression across builds",
          },
          {
            type: "table",
            headers: ["Processor Type", "Config", "Cycles", "CPUCLK Fmax", "MAIN Fmax"],
            rows: [
              ["Singlecycle", "LAT=0",  "6,907",  "51.62 MHz", "105.46 MHz"],
              ["Singlecycle", "LAT=2",  "13,814", "51.99 MHz", "101.53 MHz"],
              ["Pipeline", "LAT=0",  "9,239",  "81.50 MHz", "157.33 MHz"],
              ["Pipeline", "LAT=2",  "17,887", "91.12 MHz", "161.34 MHz"],
              ["Pipeline w/ Branch Prediction", "LAT=0",  "7,741",  "80.42 MHz", "142.41 MHz"],
              ["Pipeline w/ Branch Prediction", "LAT=2",  "15,640", "80.37 MHz", "149.21 MHz"],
            ],
          },
          {
            type: "paragraph",
            text: "The LAT = 2 Pipeline build shows the highest Fmax (91.12 MHz at LAT=2) but more cycles than Pipeline w/ Branch Prediction, indicating a different microarchitectural tradeoff. The final Pipeline w/ Branch Prediction design converges at ~80 MHz, exceeding the 70 MHz synthesis target.",
          },
        ],
      },
      {
        id: "verification",
        title: "Verification",
        blocks: [
          {
            type: "paragraph",
            text: "Verified in QuestaSim with directed assembly tests covering: all R-type instructions (ADD, SUB, AND, OR, XOR, SLL, SRL, SRA, SLT, SLTU), load/store (LW, SW), branches (BEQ, BNE, BLT, BGE taken and not-taken), jumps (JAL, JALR), and all forwarding paths including the double-forwarding case where both rs1 and rs2 require simultaneous bypass from different pipeline stages.",
          },
          {
            type: "paragraph",
            text: "Synthesis was run in AMD Xilinx Vivado targeting the CPUCLK domain at 70 MHz. Timing reports confirmed no setup violations at 70 MHz; Fmax was determined by iterative tightening of the constraint until the first failing path.",
          },
        ],
      },
    ],
  },
  {
    slug: "graph-scheduling",
    title: "Memory-Constrained Graph Scheduling",
    description:
      "A scheduler for ML accelerator computation DAGs that minimizes latency while respecting tight on-chip SRAM capacity constraints. Google MLSys 2026, Track A.",
    longDescription:
      "Given a computation DAG of MatMul and pointwise ops, produce an execution schedule that minimizes total latency while never exceeding fast-memory (SRAM) capacity. The solver is written in C++ and implements fusion with cycle detection, granularity search, zig-zag tile ordering, retention decisions, and recomputation.",
    date: "2026",
    year: 2026,
    tags: ["Systems", "Compilers", "Graph Optimization", "ML Accelerators"],
    featured: true,
    sections: [
      {
        id: "problem",
        title: "The Problem",
        blocks: [
          {
            type: "paragraph",
            text: "Modern AI accelerators live with a hard constraint: fast on-chip SRAM is tiny, neural network tensors are not. Compute can only happen on data currently in fast memory — everything else sits in slow HBM, bandwidth-limited and expensive to move. A scheduler's job is to decide how data flows between those levels to minimize total execution latency.",
          },
          {
            type: "paragraph",
            text: "The competition hands you a computation DAG — MatMul and pointwise ops (ReLU, addition, etc.) — and asks: produce an execution schedule that minimizes total latency without ever exceeding fast-memory capacity. You control how ops are grouped, how tiles are sized, which direction tiles are traversed, and which tensors stay resident in fast memory.",
          },
          {
            type: "paragraph",
            text: "Benchmarks: 5 graphs (5–103 ops each, numbered 1, 5, 9, 13, 17). Scored as geometric mean speedup over a naive unfused baseline. Deadline: April 2026.",
          },
          {
            type: "image",
            src: "/graph-scheduling/1_memory_hierarchy.png",
            alt: "Three-tier memory hierarchy: slow HBM, fast SRAM, ephemeral within-subgraph",
            caption: "Three-tier memory model. Ephemeral intermediates — tensors produced and consumed within a fused subgraph — cost zero capacity and zero bandwidth. That's what makes fusion the highest-leverage optimization.",
          },
        ],
      },
      {
        id: "latency-model",
        title: "The Latency Model",
        blocks: [
          {
            type: "paragraph",
            text: "Each tile's execution time is determined by whichever of compute or memory is the bottleneck:",
          },
          {
            type: "math",
            latex: "T_{\\text{tile}} = \\max\\left(T_{\\text{compute}},\\; T_{\\text{mem\\_in}} + T_{\\text{mem\\_out}}\\right)",
            display: true,
          },
          {
            type: "paragraph",
            text: "Total schedule latency is the sum over all tiles across all subgraphs. The optimizer's goal is to push each tile toward the compute-bound side of the roofline — large enough to amortize memory transfer, small enough to fit in SRAM.",
          },
          {
            type: "image",
            src: "/graph-scheduling/4_roofline.png",
            alt: "Roofline model: compute-bound vs memory-bound regimes",
            caption: "Roofline plot. Each granularity choice places a tile at a specific arithmetic intensity. The goal is to operate at or above the ridge point where compute and memory are balanced.",
          },
        ],
      },
      {
        id: "levers",
        title: "The Four Optimization Levers",
        blocks: [
          {
            type: "heading",
            level: 3,
            text: "1. Fusion",
          },
          {
            type: "paragraph",
            text: "When consecutive ops are fused into one subgraph, their shared intermediate tensor becomes ephemeral — computed and consumed entirely in fast memory, never touching HBM. This eliminates both the capacity cost of holding the tensor and the bandwidth cost of a round-trip through HBM. The constraint: all ops in a fused subgraph share a single tile granularity, so aggressive fusion can force a suboptimal granularity compromise.",
          },
          {
            type: "image",
            src: "/graph-scheduling/2_fusion_before_after.png",
            alt: "Fusion before and after: intermediate tensor goes from HBM round-trip to ephemeral",
            caption: "Unfused (left): intermediate tensor written to HBM then reloaded. Fused (right): intermediate is ephemeral — lives entirely in SRAM, bandwidth cost eliminated.",
          },
          {
            type: "heading",
            level: 3,
            text: "2. Granularity [w, h, k]",
          },
          {
            type: "paragraph",
            text: "Controls spatial tiling of the output tensor and the k-dimension partitioning of MatMuls. Larger tiles have better arithmetic intensity (fewer tiles, less overhead) but need more SRAM. Split-K — small k — is particularly useful for chained MatMuls: streaming thin slices of B and C keeps the accumulator resident in fast memory, enabling fusion of chains that would OOM at larger k.",
          },
          {
            type: "heading",
            level: 3,
            text: "3. Traversal Order",
          },
          {
            type: "paragraph",
            text: "For MatMul C = A × B tiled into a grid, traversal order determines which tiles share SRAM-resident data. Raster order (left-to-right, top-to-bottom) reuses A strips but reloads B columns on each row. Zig-zag alternates direction on each row, reusing B strips across adjacent rows — cutting unique HBM loads by up to 50% for typical shapes.",
          },
          {
            type: "image",
            src: "/graph-scheduling/3_traversal_order.png",
            alt: "Raster vs zig-zag tile traversal order",
            caption: "Raster order (left) reloads the B strip on every row change. Zig-zag (right) reuses the B strip across adjacent rows by reversing direction, halving the unique HBM loads in many cases.",
          },
          {
            type: "heading",
            level: 3,
            text: "4. Recomputation",
          },
          {
            type: "paragraph",
            text: "In diamond/skip-connection patterns (ubiquitous in transformers), a tensor produced by one op is consumed by two downstream ops in different subgraphs. The options: spill it to HBM (pay bandwidth to store + reload), retain it in SRAM (pay capacity to hold it), or recompute it in each consuming subgraph (pay compute to avoid the HBM trip). For cheap pointwise producers, recomputation is often the right call — same idea as FlashAttention's recomputation of attention weights in the backward pass.",
          },
          {
            type: "image",
            src: "/graph-scheduling/5_diamond_strategies.png",
            alt: "Diamond graph: spill vs recompute vs retain strategies",
            caption: "Three strategies for a skip-connection pattern. Spill: 3 subgraphs, highest latency. Recompute: 2 subgraphs with the producer duplicated, avoids HBM round-trip. Retain: 2 subgraphs with the tensor kept resident, lowest latency if SRAM budget allows.",
          },
        ],
      },
      {
        id: "solver",
        title: "The Solver",
        blocks: [
          {
            type: "paragraph",
            text: "The solver is implemented in C++. Fusion is a greedy hill-climber: evaluate all adjacent subgraph pairs, score each candidate merge by estimated latency reduction, commit the highest-scoring merge that passes the capacity check, and repeat until no beneficial merge remains. Before committing any merge, the solver runs a BFS cycle check — merging two subgraphs can create a cycle in the subgraph DAG, which is a correctness violation.",
          },
          {
            type: "image",
            src: "/graph-scheduling/6_split_k.png",
            alt: "Split-K accumulation for chained MatMuls",
            caption: "Split-K for a chained MatMul (A×B)×C. Small k streams thin slices of B and C while keeping the accumulator resident in SRAM — enabling fusion of chains that would OOM at larger k values.",
          },
          {
            type: "paragraph",
            text: "After fusion, each subgraph gets an independent granularity search: iterate tile sizes from large to small, pick the largest [w, h, k] that fits within SRAM budget, using the roofline model to bias toward compute-bound configurations. Tile order defaults to zig-zag for all MatMul subgraphs; retention decisions are made greedily based on next-use distance and current capacity pressure.",
          },
        ],
      },
      {
        id: "results",
        title: "Results",
        blocks: [
          {
            type: "image",
            src: "/graph-scheduling/7_benchmark_results.png",
            alt: "Benchmark results: speedup over unfused baseline per graph",
            caption: "Speedup over the unfused naive baseline across the 5 benchmark graphs. Larger graphs with more fusion opportunities (e.g., graph 17, 103 ops) see the largest gains.",
          },
        ],
      },
    ],
  },
  {
    slug: "sparse-attention",
    title: "Sparse Attention Kernel for DeepSeek V3.2 on B200",
    description:
      "A fused CUDA kernel implementing DeepSeek Sparse Attention on NVIDIA B200 (Blackwell). FlashInfer AI Kernel Generation Contest, MLSys 2026.",
    longDescription:
      "Implements DeepSeek Sparse Attention (DSA) on B200 Blackwell, fusing FP8 indexer scoring, histogram-based top-K selection, and sparse BF16 attention into minimal kernel launches using TMEM, tcgen05.mma, and page-sorted gather.",
    date: "2026",
    year: 2026,
    tags: ["CUDA", "Triton", "Sparse Attention", "GPU Kernels", "LLM Inference"],
    featured: true,
    sections: [
      {
        id: "overview",
        title: "The Problem: O(L²) Attention at Long Context",
        blocks: [
          {
            type: "paragraph",
            text: "Standard full attention scales as O(L²) in both compute and memory. At L=128K tokens, a single attention head requires 128K × 128K = 16B attention weights — 64 GB at FP16. That's not a compute problem, it's a physics problem.",
          },
          {
            type: "paragraph",
            text: "DeepSeek V3.2 addresses this with DeepSeek Sparse Attention (DSA): instead of attending to all L tokens, each query identifies the k=2048 most relevant KV tokens and computes full BF16 attention only over that sparse subset. The selection uses a lightweight FP8 indexer — a compressed key cache of 132 bytes/token — to score all L tokens cheaply, then picks the top-2048 by score. The result is O(L·k) compute instead of O(L²), with attention quality close to full attention because attention weight distributions are naturally sparse.",
          },
          {
            type: "table",
            headers: ["Metric", "Full Attention", "DSA Sparse Attention"],
            rows: [
              ["Compute complexity",    "O(L²)",         "O(L·k), k=2048"],
              ["KV tokens attended",    "L (all)",        "2048 (top-k)"],
              ["Memory per head (L=128K)", "~64 GB at FP16", "~16 MB at BF16"],
              ["Scoring dtype",         "BF16",           "FP8 (132 bytes/token)"],
              ["Top-k selection",       "N/A",            "Histogram scan O(256)"],
            ],
          },
        ],
      },
      {
        id: "b200",
        title: "B200 Blackwell: New Architecture Primitives",
        blocks: [
          {
            type: "paragraph",
            text: "The kernel targets NVIDIA B200, which introduces a fundamentally different programming model compared to Hopper/Ampere. Two new primitives are central to this work:",
          },
          {
            type: "heading",
            level: 3,
            text: "Tensor Memory (TMEM)",
          },
          {
            type: "paragraph",
            text: "TMEM is 256 KB of dedicated per-SM accumulator storage, separate from registers and shared memory. Estimated bandwidth: ~100 TB/s — 10× faster than SMEM and unconstrained by the register file. The new tcgen05.mma instruction writes accumulators directly into TMEM rather than registers, eliminating register pressure from accumulation entirely. This is a major win for attention kernels: accumulating Q·K and attn·V results previously competed with live register state for the finite register file.",
          },
          {
            type: "heading",
            level: 3,
            text: "tcgen05.mma vs Hopper wgmma",
          },
          {
            type: "paragraph",
            text: "Hopper's wgmma (warp-group MMA) requires all 128 threads in a warp group to participate in a single synchronous MMA operation. Blackwell's tcgen05.mma has single-thread semantics — one thread issues the MMA, freeing the other 31 threads in the warp to do epilogue work (softmax, output writeback) concurrently. This enables clean warp specialization without the tight coupling that made Hopper kernels hard to overlap.",
          },
          {
            type: "table",
            headers: ["Feature", "Hopper (H100)", "Blackwell (B200)"],
            rows: [
              ["Peak FP8 compute",     "~2.0 PFLOPS",   "~4.5 PFLOPS"],
              ["HBM bandwidth",        "3.35 TB/s",     "8 TB/s"],
              ["L2 cache",             "50 MB",          "65 MB"],
              ["MMA instruction",      "wgmma (128-thread)", "tcgen05.mma (1-thread)"],
              ["Accumulator storage",  "Registers",      "TMEM (256KB/SM, ~100 TB/s)"],
            ],
          },
        ],
      },
      {
        id: "design",
        title: "End-to-End Kernel Design",
        blocks: [
          {
            type: "paragraph",
            text: "The kernel fuses three logical stages into minimal CUDA launches:",
          },
          {
            type: "heading",
            level: 3,
            text: "Stage 1 — FP8 Indexer Scoring",
          },
          {
            type: "paragraph",
            text: "Use tcgen05.mma.kind::f8f6f4 to compute Q·K scores over all L tokens using the compressed FP8 key cache (132 bytes/token). In the scoring kernel's epilogue, fuse a histogram accumulation pass: since FP8 scores map to only 256 discrete values, a per-bin histogram in shared memory captures the full score distribution. This enables exact top-K selection without sorting.",
          },
          {
            type: "heading",
            level: 3,
            text: "Stage 2 — Top-K Selection via Histogram Scan",
          },
          {
            type: "paragraph",
            text: "The standard approach to top-K is radix sort: O(L log L). Here, FP8 quantization makes O(256) possible: scan the 256-bin histogram from the highest bin downward, accumulating counts until the running sum reaches k=2048. The threshold bin gives the exact top-K boundary. This is the most elegant property of FP8 scoring — the discrete score space converts an O(L log L) selection problem into an O(256) scan. Selected indices are then sorted by page_id for coalesced HBM access in stage 3.",
          },
          {
            type: "heading",
            level: 3,
            text: "Stage 3 — Sparse Gather + FlashAttention",
          },
          {
            type: "paragraph",
            text: "Load 32 selected pages (2048 tokens at page_size=64) from HBM via cp.async with double-buffering — while computing attention over page i, page i+1 is loading. Run FlashAttention's online softmax across 64-token tiles using tcgen05.mma for Q·K and attn·V, accumulating in TMEM at FP32 precision. Output is written to HBM in BF16.",
          },
        ],
      },
      {
        id: "optimizations",
        title: "Key Optimizations",
        blocks: [
          {
            type: "heading",
            level: 3,
            text: "Page-sorted gather",
          },
          {
            type: "paragraph",
            text: "The 2048 selected token indices from stage 2 are sorted by page_id before loading. This transforms random HBM accesses (one cache-line per arbitrary token) into sequential page-level reads (64 contiguous tokens per page). Within each page, 32 threads each load 4 bytes of a 128-byte FP8 key — a single perfectly coalesced cache-line transaction. Estimated efficiency improvement: 40–60% on gather bandwidth.",
          },
          {
            type: "heading",
            level: 3,
            text: "Online softmax with exp2",
          },
          {
            type: "paragraph",
            text: "FlashAttention's online softmax maintains running (max, denominator, output) accumulators across tiles, avoiding materializing the full N×N attention weight matrix. Using exp2f() instead of expf() in the softmax maps directly to the GPU's MUFU.EX2 hardware instruction, avoiding the implicit multiply by log2(e) = 1.4427 that expf() requires internally. This is a ~1.4× throughput improvement on the softmax step at no accuracy cost.",
          },
          {
            type: "heading",
            level: 3,
            text: "L2 persistence",
          },
          {
            type: "paragraph",
            text: "Total gathered KV data per query: 2048 tokens × 128 bytes/token (BF16 keys + values) = 512 KB. This fits in B200's 65 MB L2. Marking the index arrays and hot KV pages as cudaAccessPropertyPersisting prevents eviction across attention heads and layers, eliminating repeated HBM round-trips for the same KV pages.",
          },
          {
            type: "heading",
            level: 3,
            text: "Warp specialization",
          },
          {
            type: "paragraph",
            text: "Four warp roles per thread block: one producer warp (issues cp.async loads for the next page while current page computes), two MMA warps (Q·K scoring and attn·V accumulation via tcgen05.mma), and one epilogue warp (online softmax correction and BF16 output writeback). Unlike Hopper where wgmma requires 128-thread synchrony, Blackwell's single-thread MMA semantics makes this clean warp specialization straightforward.",
          },
          {
            type: "table",
            headers: ["Theoretical bound", "Value", "Assumption"],
            rows: [
              ["Min gather latency (512KB @ 8TB/s)", "~64 ns",   "100% HBM bandwidth utilization"],
              ["Target end-to-end per step",          "5–15 µs", "Well-optimized kernel, 128K context"],
              ["Dense attention (128K ctx)",           "~300 µs", "Full O(L²) FlashAttention-3 estimate"],
              ["Theoretical speedup",                  "~20–60×", "DSA vs dense at L=128K"],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "verigen",
    title: "VeriGen: Agents for Accelerated Chip Design",
    description:
      "Integrated RTL design verification tool for testbench generation, script and trace analysis with multi-agent collaboration for accelerated RTL development.",
    longDescription:
      "VeriGen automates verification workflows with agents that generate testbenches, analyze traces, and help teams collaborate on RTL correctness faster.",
    date: "2025",
    year: 2025,
    tags: ["RTL", "Verification", "Agents", "SystemVerilog"],
    featured: true,
    hero: { type: "image", src: "/QwQ1.gif", alt: "VeriGen workflow" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "verigen is an integrated rtl design verification tool that accelerates chip design by automating testbench generation, script and trace analysis, and enabling multi-agent collaboration.",
          },
        ],
      },
      {
        id: "capabilities",
        title: "Capabilities",
        blocks: [
          {
            type: "list",
            items: [
              "automated testbench generation for rtl designs",
              "script and trace analysis for rapid debugging",
              "multi-agent collaboration for parallel verification",
            ],
          },
        ],
      },
      {
        id: "how-it-works",
        title: "How it works",
        blocks: [
          {
            type: "paragraph",
            text:
              "verigen leverages ai agents to generate and validate testbenches, analyze simulation traces, and suggest fixes. this reduces manual effort and speeds up the verification cycle.",
          },
        ],
      },
    ],
  },
  {
    slug: "artsage",
    title: "ArtSage",
    description:
      "Interactive AI museum exploration tool with image recognition and RAG workflows to identify art, retrieve museum data, and answer user prompts for enriched museum experience. Expanding with agentic features and AR.",
    longDescription:
      "ArtSage turns museum visits into interactive learning with image recognition, RAG-powered Q&A, and future AR-driven exploration.",
    date: "2025",
    year: 2025,
    hidden: true,
    tags: ["RAG", "Computer Vision", "AR", "AI"],
    featured: true,
    hero: { type: "image", src: "/QwQ1.gif", alt: "ArtSage demo" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "artsage is an interactive ai-powered tool for museum exploration. snap a photo of any artwork and artsage will identify it, retrieve museum data, and answer your questions using retrieval-augmented generation workflows.",
          },
        ],
      },
      {
        id: "features",
        title: "Features",
        blocks: [
          {
            type: "list",
            items: [
              "image recognition for artwork",
              "rag-based q&a about art and artists",
              "ar features for immersive museum experiences (coming soon)",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "omnom",
    title: "OmNom | TreeHacks 2025 Most Creative Hack Grand Prize",
    description:
      "An autonomous end-to-end 6-foot tall autonomous food delivery robot that navigates novel outdoor and indoor campus environments, interacts with ordering iPads, fetches and delivers late-night food.",
    longDescription:
      "A full-stack robotics prototype that handles navigation, interaction, and delivery, enabling students to focus while OmNom handles the late-night run.",
    date: "2025",
    year: 2025,
    hidden: true,
    tags: ["Robotics", "Autonomy", "HCI"],
    liveUrl: "https://devpost.com/software/omnom-hg16v3",
    hero: { type: "video", src: "/murmure6.mp4", alt: "OmNom demo video" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "omnom is a six-foot autonomous food delivery robot that navigates indoor and outdoor campus environments, interacts with ordering tablets, and completes end-to-end deliveries.",
          },
        ],
      },
      {
        id: "system",
        title: "System Architecture",
        blocks: [
          {
            type: "paragraph",
            text:
              "planned: animated system diagram showing perception, planning, navigation, and manipulation loops with live sensor feeds.",
          },
          {
            type: "video",
            src: "/murmure6.mp4",
            caption: "demo clip placeholder; replace with manim or rive overlay.",
          },
        ],
      },
      {
        id: "interaction",
        title: "Human Interaction",
        blocks: [
          {
            type: "paragraph",
            text:
              "this section will visualize the ordering flow and interaction loop with the kiosk using a stepwise animated diagram.",
          },
        ],
      },
    ],
  },
  {
    slug: "slynk",
    title: "slynk: Turning Ads into Experiences",
    description:
      "Reimagining ads with interactive AR avatars. meet and talk with your favorite celebrities with slynk, our AR app offering a new personalized immersive experience for discovering advertisements.",
    longDescription:
      "slynk turns ads into interactive experiences with ar avatars that meet and talk with users, unlocking personalized discovery.",
    date: "2024",
    year: 2024,
    hidden: true,
    tags: ["AR", "Mobile", "Experiential"],
    liveUrl: "https://devpost.com/software/slynk",
    hero: { type: "image", src: "/murmure3.gif", alt: "slynk demo" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "slynk explores how advertising can feel more like a conversation. interactive ar avatars help users meet, talk, and discover products through a personalized lens.",
          },
        ],
      },
      {
        id: "experience",
        title: "Experience Flow",
        blocks: [
          {
            type: "paragraph",
            text:
              "planned: conceptual animation of the avatar interaction loop and the personalization engine.",
          },
          {
            type: "image",
            src: "/murmure3.gif",
            alt: "slynk concept placeholder",
            caption: "placeholder visual; replace with manim or rive animation.",
          },
        ],
      },
    ],
  },
  {
    slug: "skin-ensemble",
    title:
      "Using an Ensemble of GANs and CNNs to More Accurately Generate and Diagnose Skin Condition Datasets in Diverse Skin Types",
    description:
      "Generated and validated synthetic images to address ethical AI bias due to lack of diverse skin condition images.",
    longDescription:
      "An ensemble of GANs and CNNs generates and validates synthetic skin condition images, improving dataset diversity and fairness.",
    date: "2024",
    year: 2024,
    hidden: true,
    tags: ["GANs", "CNNs", "Medical AI", "Bias"],
    hero: { type: "image", src: "/Murmure7.svg", alt: "Skin ensemble graphic" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "skin ensemble uses an ensemble of gans and cnns to generate and diagnose skin condition datasets, focusing on diversity and ethical ai.",
          },
        ],
      },
      {
        id: "approach",
        title: "Approach",
        blocks: [
          {
            type: "list",
            items: [
              "gans generate realistic skin condition images for underrepresented skin types",
              "cnns validate the generated images for accuracy",
              "ensemble methods improve robustness",
            ],
          },
          {
            type: "link",
            label: "View the full project PDF",
            href: "/skin-ensemble.pdf",
            description: "Full research write-up and results.",
          },
        ],
      },
    ],
  },
];

export const socialLinks = [
  { name: "GitHub", url: "https://github.com/zhan4808" },
  { name: "LinkedIn", url: "https://linkedin.com/in/robert05" },
  { name: "X", url: "https://x.com/robdobflob" },
  { name: "Email", url: "mailto:robertzhang930@gmail.com" },
];

export const aboutLinks = [
  { name: "Collaborations", url: "mailto:robertzhang930@gmail.com", icon: "/gmail.svg" },
  { name: "X", url: "https://x.com/robdobflob", icon: "/x.svg" },
  { name: "Instagram", url: "https://instagram.com/robert.zhang_", icon: "/instagram.svg" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/robert05/", icon: "/linkedin.svg" },
  { name: "GitHub", url: "https://github.com/zhan4808", icon: "/github.svg" },
  { name: "Beli", url: "https://beliapp.co/app/robertz", icon: "/beli.svg" },
];


export function getJournalsByYear(): Map<number, JournalPost[]> {
  const postsByYear = new Map<number, JournalPost[]>();
  for (const post of journalPosts) {
    const yearPosts = postsByYear.get(post.year) || [];
    yearPosts.push(post);
    postsByYear.set(post.year, yearPosts);
  }
  return new Map([...postsByYear.entries()].sort((a, b) => b[0] - a[0]));
}

export function getVisibleJournals(): JournalPost[] {
  return journalPosts.filter((post) => !post.hidden);
}

export function getVisibleJournalsByYear(): Map<number, JournalPost[]> {
  const postsByYear = new Map<number, JournalPost[]>();
  for (const post of journalPosts) {
    if (post.hidden) {
      continue;
    }
    const yearPosts = postsByYear.get(post.year) || [];
    yearPosts.push(post);
    postsByYear.set(post.year, yearPosts);
  }
  return new Map([...postsByYear.entries()].sort((a, b) => b[0] - a[0]));
}

export function getProjectsByYear(): Map<number, Project[]> {
  const projectsByYear = new Map<number, Project[]>();
  for (const project of projects) {
    if (project.hidden) continue;
    const yearProjects = projectsByYear.get(project.year) || [];
    yearProjects.push(project);
    projectsByYear.set(project.year, yearProjects);
  }
  return new Map([...projectsByYear.entries()].sort((a, b) => b[0] - a[0]));
}
