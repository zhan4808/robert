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
    };

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
  externalUrl?: string;
  liveUrl?: string;
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
    subtitle: "a worklog",
    date: "December 2022",
    year: 2022,
    tracks: [],
    blocks: [
      {
        type: "paragraph",
        text: "In this post, I'll iteratively optimize an implementation of matrix multiplication written in CUDA. My goal is not to build a cuBLAS replacement, but to deeply understand the most important performance characteristics of the GPUs that are used for modern deep learning. This includes coalescing global memory accesses, shared memory caching and occupancy optimizations, among others. You can download the code for all kernels from Github. Also checkout wangzyon's repo from which I copied the benchmarking setup. This post is less polished than my normal uploads, and includes many more sidenotes. I used it as notepad for ideas and scribbles while writing the kernels. That's why I called it a worklog :)",
      },
      {
        type: "paragraph",
        text: "Matrix multiplication on GPUs may currently be the most important algorithm that exists, considering it makes up almost all the FLOPs during the training and inference of large deep-learning models. So how much work is it to write a performant CUDA SGEMM from scratch? I'll start with a naive kernel and step-by-step apply optimizations until we get within 95% (on a good day) of the performance of cuBLAS (NVIDIA's official matrix library).",
      },
      {
        type: "paragraph",
        text: "In the CUDA programming model, computation is ordered in a three-level hierarchy. Each invocation of a CUDA kernel creates a new grid, which consists of multiple blocks. Each block consists of up to 1024 individual threads. Threads that are in the same block have access to the same shared memory region (SMEM).",
      },
      {
        type: "paragraph",
        text: "The number of threads in a block can be configured using a variable normally called blockDim, which is a vector consisting of three ints. The entries of that vector specify the sizes of blockDim.x, blockDim.y and blockDim.z, as visualized below:",
      },
      {
        type: "image",
        src: "/cuda-mmm/CUDA_thread_hierarchy.png",
        alt: "CUDA thread hierarchy diagram showing blockDim and threadIdx relationships",
        caption: "The CUDA thread hierarchy: grids contain blocks, blocks contain threads.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "Similarly, the number of blocks in a grid is configurable using the gridDim variable. When we launch a new kernel from the host, it creates a single grid, containing the blocks and threads as specified. From here on I'll only be talking about 2D grids and blocks, partly because the 3D-structure is seldom used and because drawing in 3D is too hard. It's important to keep in mind that the thread hierarchy we just talked about mostly concerns program correctness. For program performance, as we'll see later, it's not a good idea to treat all threads in the same block as equals.",
      },
      // Kernel 1
      {
        type: "heading",
        level: 2,
        text: "Kernel 1: Naive Implementation",
      },
      {
        type: "paragraph",
        text: "For our first kernel, we'll use the grid, block and thread hierarchy to assign each thread a unique entry in the result matrix C. Then that thread will compute the dot product of the corresponding row of A and column of B, and write the result to C. Due to each location of C being written to by only one thread, we have to do no synchronization.",
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
        text: "CUDA code is written from a single-thread perspective. In the code of the kernel, we access the blockIdx and threadIdx built-in variables. These will return different values based on the thread that's accessing them. In our example, threadIdx.x and threadIdx.y will vary from 0 to 31 based on the position of the thread in the grid. Same for blockIdx.x and blockIdx.y.",
      },
      {
        type: "paragraph",
        text: "If the size of the matrix is not divisible by the size of the block, we'll have to launch extra blocks to process the remainder. This artifact is called tile quantization, and appears whenever we try to map a fixed-sized volume across a variable-sized input.",
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
        text: "Lower Bounding the Fastest Possible Runtime",
      },
      {
        type: "paragraph",
        text: "This kernel takes about 0.5s to process three 4092² fp32 matrices on an A6000 GPU. Let's do some non-implementation-specific calculations. For a matrix multiplication of two 4092² matrices, followed by an addition of a 4092² matrix (to make the GEMM):",
      },
      {
        type: "list",
        items: [
          "Total FLOPS: For each of the 4092² entries of C, we perform a dot product of two vectors of size 4092, involving a multiply and an add at each step. 2*4092³ + 4092² = 137 GFLOPS.",
          "Total data to read (minimum): 3 * 4092² * 4B = 201MB.",
          "Total data to store: 4092² * 4B = 67MB.",
        ],
      },
      {
        type: "paragraph",
        text: "So 268MB is the absolute minimum of memory that any implementation would have to transfer from/to global GPU memory, assuming it has a big enough cache. The cuBLAS kernel loads a total of 500MB of GMEM during the whole calculation. The GPU is advertised with 30TFLOPs/s of fp32 compute throughput and 768GB/s of global memory bandwidth. If we achieved those numbers, we'd need 4.5ms for the calculation and 0.34ms for the memory transfers. So in our napkin math, the calculation takes ~10x more time than the memory accesses. This means our final optimized kernel will be compute-bound.",
      },
      {
        type: "heading",
        level: 3,
        text: "Memory Access Pattern of the Naive Kernel",
      },
      {
        type: "paragraph",
        text: "In our kernel, two threads in the same block with ThreadIds (0, 0) and (0, 1) will load the same column of B but different rows of A. If we assume the worst case of zero caching, then each thread has to load 2*4092+1 floats from global memory. As we have 4092² threads total, this would result in 548GB of memory traffic.",
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
        text: "So to recap, when this kernel runs on an A6000 GPU it achieves ~300GFLOPs when multiplying two 4092x4092 float32 matrices. Pretty bad, considering that the A6000 is advertised as being able to achieve almost 30 TFLOPs. 300 GFLOPs is also roughly the performance achieved by the optimized BLAS library on a 2015 Haswell CPU. So how can we start to make this faster? One way is to optimize the memory access pattern of our kernel such that global memory accesses can be coalesced (=combined) into fewer accesses.",
      },
      // Kernel 2
      {
        type: "heading",
        level: 2,
        text: "Kernel 2: Global Memory Coalescing",
      },
      {
        type: "paragraph",
        text: "Before we get into global memory coalescing, we need to learn about the concept of a warp. For execution, the threads of a block are grouped into so-called warps, consisting of 32 threads. A warp is then assigned to a warp scheduler, which is the physical core that executes the instructions. Before the Volta architecture, all threads of a warp were fed from the same instruction stream. However, since Volta, it's no longer a good idea to rely on this 'warp-synchronous' behaviour, as instructions from different branches may be interleaved even for the same threads within a warp.",
      },
      {
        type: "paragraph",
        text: "The grouping into warps happens based on a consecutive threadId. If we set the blockDim to be multi-dimension, then the threadId is calculated like so: threadId = threadIdx.x + blockDim.x*(threadIdx.y + blockDim.y*threadIdx.z). Then, threads with neighbouring threadId become part of the same warp.",
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
        text: "The concept of a warp is relevant for this second kernel, as sequential memory accesses by threads that are part of the same warp can be grouped and executed as one. This is referred to as global memory coalescing. It's the most important thing to keep in mind when optimizing a kernel's GMEM memory accesses toward achieving the peak bandwidth.",
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
        text: "In reality, the GPU supports 32B, 64B and 128B memory accesses. So, if each thread is loading a 32bit float from global memory, the warp scheduler can coalesce this 32*4B=128B load into a single transaction. This is only possible if the floats loaded are consecutive in memory, and if access is aligned. Interestingly, to allow coalescing the threads within a warp have to access consecutive addresses, but the accesses don't have to be consecutive within-warp.",
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
        text: "Looking back at the previous kernel, we assigned threads their entry of C such that threads of the same warp (those with consecutive threadIdx.x) were loading the rows of A non-consecutively from memory. The naive kernel's memory access pattern for A looked like this:",
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
        text: "To enable coalescing, we can change how we assign positions of the result matrix C to threads. This change in the global memory access pattern is illustrated below:",
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
        text: "This wasn't immediately obvious, but enabling GMEM coalescing changes nothing in the assembly. Access coalescing is done at kernel runtime by the hardware. This makes sense since coalescing requires aligned access, which cannot be guaranteed at compile time as we pass the matrix pointers as function arguments.",
      },
      {
        type: "paragraph",
        text: "Global memory coalescing increases memory throughput from 15GB/s to 110GB/s. Performance reaches 2000 GFLOPS, a big improvement compared to the 300 GFLOPS of the first, naive kernel. For the next kernel, we'll use the GPU's fast on-chip memory, called shared memory, to cache data that will be re-used.",
      },
      // Kernel 3
      {
        type: "heading",
        level: 2,
        text: "Kernel 3: Shared Memory Cache-Blocking",
      },
      {
        type: "paragraph",
        text: "Next to the large global memory, a GPU has a much smaller region of memory that is physically located on the chip, called shared memory (SMEM). Physically, there's one shared memory per SM. Logically, this shared memory is partitioned among the blocks. This means that a thread can communicate with the other threads in its block via the shared memory chunk. On an A6000 GPU, each block has access to a maximum of 48KB of shared memory. As the shared memory is located on-chip, it has a much lower latency and higher bandwidth than global memory — benchmarks for Volta report 750GiB/s of global memory bandwidth vs. 12,080GiB/s of shared memory bandwidth.",
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
        text: "So for this next kernel, we'll load a chunk of A and a chunk of B from global memory into shared memory. Then we'll perform as much work as possible on the two chunks, with each thread still being assigned one entry of C. We'll move the chunks along the columns of A and the rows of B performing partial sums on C until the result is computed.",
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
        text: "This kernel achieves ~2200 GFLOPS, a 50% improvement over the previous version. There's only a 50% improvement partly because our previous kernel already had pretty good L1 cache hit rates. We're still far away from hitting the ~30 TFLOPs that the GPU can provide. This is obvious from the roofline plot below — notice how we're achieving a higher memory bandwidth than cuBLAS, but because we're doing much less work per byte loaded from memory (lower arithmetic intensity), overall performance is worse.",
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
        text: "Occupancy Calculation for Kernel 3",
      },
      {
        type: "paragraph",
        text: "At a CHUNKSIZE of 32, this uses 2*32*32*4B=8KB of shared memory space. The A6000 GPU has a maximum of 48KB of shared memory space available for each block, so we're far away from hitting that limit. Each multiprocessor (SM) has a maximum of 100KB of SMEM available. This means that if we modified our kernel to use the full 48KB of SMEM, each SM could only keep two blocks loaded at the same time. Increasing per-block SMEM utilization can decrease occupancy.",
      },
      {
        type: "paragraph",
        text: "Occupancy is defined as the ratio between the number of active warps per SM and the maximum possible number of active warps per SM. High occupancy allows us to hide the high latency of our operations, by having a bigger pool of issue-able instructions available. There are three main limits to keeping more active blocks loaded on an SM: register count, warp count and SMEM capacity. For this kernel, occupancy works out to ~66%, limited primarily by thread count — not bad, so this doesn't explain why our kernel runs so slow.",
      },
      {
        type: "heading",
        level: 3,
        text: "Areas of Improvement: Arithmetic Intensity",
      },
      {
        type: "paragraph",
        text: "Looking at the profiler, most instructions are memory loads (LDS = shared memory loads, FMA = fused multiply-add, IADD3 = three-input integer addition for pointer arithmetic). We're stalling on SMEM accesses rather than making progress on compute. The solution is to have each thread compute more than one output element, which allows us to perform more work in registers and rely less on SMEM.",
      },
      // Kernel 4
      {
        type: "heading",
        level: 2,
        text: "Kernel 4: 1D Blocktiling for Calculating Multiple Results per Thread",
      },
      {
        type: "paragraph",
        text: "The optimization strategy involves having each thread compute multiple output elements instead of just one, which increases register usage while reducing shared memory pressure. Each thread will compute a column of TM output elements, keeping a thread-local register array for partial sums across the outer loop.",
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
        text: "Sidenote on Compiler Optimizations",
      },
      {
        type: "paragraph",
        text: "The key insight of this kernel is reordering the inner loops so that the dot-product dimension (dotIdx) is the outermost inner loop. This allows the compiler to cache the Btmp value in a register and reuse it across all TM output elements. The compiler also performs automatic loop unrolling, eliminating redundant shared memory loads.",
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
        text: "This kernel achieves approximately 8,600 GFLOPs — a 2.2x improvement over the shared-memory-only approach. Profiler data shows substantially fewer stall cycles caused by memory pipeline congestion compared to Kernel 3.",
      },
      // Kernel 5
      {
        type: "heading",
        level: 2,
        text: "Kernel 5: Increasing Arithmetic Intensity via 2D Blocktiling",
      },
      {
        type: "paragraph",
        text: "The fundamental optimization: computing a square grid of output elements per thread rather than a linear column improves data reuse and reduces memory operations. Each thread now computes a grid of TM×TN elements of C, enabling shared inputs across both dimensions.",
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
        text: "This kernel achieves ~16 TFLOPs — another 2x improvement over Kernel 4. Memory efficiency gains are substantial: we now perform K/64 GMEM and K/4 SMEM accesses per computed result, demonstrating the power of increased arithmetic intensity.",
      },
      // Kernel 6
      {
        type: "heading",
        level: 2,
        text: "Kernel 6: Vectorize SMEM and GMEM Accesses",
      },
      {
        type: "paragraph",
        text: "Vectorization strategy: transpose matrix As in shared memory during the GMEM-to-SMEM transfer, enabling automatic 128-bit load operations instead of 32-bit. Previously sequential SMEM loads become a 128b LDS.128 load, improving throughput.",
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
        text: "Global memory vectorization requires promising alignment to the compiler through reinterpret_cast<float4 *> operations on input pointers. The compiler cannot verify 128-bit alignment of user-provided pointers, necessitating explicit type casts to trigger vectorized GMEM loads. This converts 32-bit LDG.E instructions into 128-bit LDG.E.128 equivalents.",
      },
      {
        type: "paragraph",
        text: "Performance improvement from Kernel 5 to Kernel 6: approximately 500 GFLOPs gain, reaching ~18,200 GFLOPs. Profiler analysis identified remaining bottlenecks: shared-memory bank conflicts, occupancy higher than necessary, and no double buffering yet.",
      },
      // Kernel 9
      {
        type: "heading",
        level: 2,
        text: "Kernel 9: Autotuning",
      },
      {
        type: "paragraph",
        text: "The kernel accumulated five template parameters: BM, BN, BK for shared memory caching, and TM, TN for register caching. Initial settings were BM=BN=128, BK=TM=TN=8. A bash script systematically searched sensible parameter combinations and benchmarked performance.",
      },
      {
        type: "paragraph",
        text: "Implementation required ensuring parameter combinations were valid and that the kernel performed correctly across approximately 400 different hyperparameter configurations. For example, vectorized SMEM loads required BM * BK divisibility by 4 * NUM_THREADS.",
      },
      {
        type: "paragraph",
        text: "Optimal parameters varied significantly by GPU model. On the A6000, settings of BM=BN=128, BK=16, TM=TN=8 improved performance by 5%, reaching ~20 TFLOPs from 19. Different hardware yielded different optimal configurations. Understanding why specific parameters produce optimal results remains unclear, despite autotuning's effectiveness in high-performance libraries.",
      },
      // Kernel 10
      {
        type: "heading",
        level: 2,
        text: "Kernel 10: Warptiling",
      },
      {
        type: "paragraph",
        text: "Kernel 10 adds another tiling hierarchy between blocktiling and threadtiling: warptiling. Unlike blocks and threads which appear explicitly in CUDA code, warps don't show up anywhere explicitly — they're hardware features calculable as warpId = threadIdx.x / warpSize.",
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
        text: "Warps matter for performance in multiple ways: they're the scheduling units mapped to warp-schedulers (four per SM on A6000), shared-memory bank conflicts occur within warps, and recent GPUs have register caches that benefit from tighter threadtiling. Warptiling elegantly exposes all parallelism levels: blocktiling allows different blocks on different SMs, warptiling allows different warps on different schedulers concurrently, and threadtiling provides instruction-level parallelism.",
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
        text: "After autotuning, performance improved from 19.7 TFLOPs to 21.7 TFLOPs. cuBLAS contains hundreds of SGEMM implementations, selecting at runtime based on dimensions. Testing revealed 16 different kernels for square matrices up to 4096, which explains cuBLAS's superior small-matrix performance.",
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
        text: "Writing this worklog paralleled optimizing SGEMM on CPU in educational value. Iterative SGEMM optimization deeply revealed hardware performance characteristics. Visualization proved surprisingly effective for implementation once kernel designs were clarified.",
      },
      {
        type: "paragraph",
        text: "Power laws appeared throughout the optimization process: reaching 80% of peak FLOPs required two weekends across initial kernels; four additional weekends achieved 94% through autotuning and warptiling. Learning gains diminished with each optimization step. All code is available on GitHub.",
      },
      {
        type: "heading",
        level: 2,
        text: "Further Resources and References",
      },
      {
        type: "list",
        items: [
          "wangzyon's GitHub repository and NVIDIA's CUTLASS library blog post — the benchmarking setup and initial inspiration.",
          "Official CUDA documentation: Toolkit Programming Guide, Best Practices Guide, and Kernel Profiling Guide.",
          "Onur Mutlu's YouTube lectures on Computer Architecture and Heterogeneous Systems acceleration.",
          "Lei Mao's CUDA blog content covering error handling and best practices.",
          "'Understanding Latency Hiding on GPUs' PhD thesis by V. Volkov — examining workload design for full hardware utilization.",
          "NVIDIA's CUDA binary utilities documentation and open-source SASS assemblers like turingas.",
          "Readable optimized CUDA implementations from ONNX Runtime's CUDA provider and NVIDIA's CUTLASS library, including double-buffering prefetching techniques.",
        ],
      },
      {
        type: "link",
        label: "Original article by Simon Boehm",
        href: "https://siboehm.com/articles/22/CUDA-MMM",
        description: "Reproduced with permission from the author.",
      },
    ],
  },
  // ─── CPU Matrix Multiplication ───────────────────────────────────────────────
  {
    slug: "cpu-mmm",
    month: "Fast Multidimensional Matrix Multiplication on CPU from Scratch",
    subtitle: "loop reordering, tiling, and multithreading",
    date: "August 2022",
    year: 2022,
    tracks: [],
    blocks: [
      {
        type: "paragraph",
        text: "Numpy can multiply two 1024x1024 matrices on a 4-core Intel CPU in ~8ms. This is incredibly fast, considering this boils down to 18 FLOPs / core / cycle, with a cycle taking a third of a nanosecond.",
      },
      {
        type: "paragraph",
        text: "Numpy does this using a highly optimized BLAS implementation. BLAS is short for Basic Linear Algebra Subprograms. These are libraries providing fast implementations of e.g. matrix multiplications or dot-products. They are sometimes tailored to one specific (family of) CPUs, like Intel's MKL or Apple's accelerate. However, non-vendor specific implementations like OpenBLAS are also available.",
      },
      {
        type: "paragraph",
        text: "How hard is it to recreate performance that's roughly similar using plain C++?",
      },
      // Section: Calculating total FLOPs
      {
        type: "heading",
        level: 2,
        text: "Calculating total FLOPs",
      },
      {
        type: "paragraph",
        text: "For simplicity, let's assume both matrices are square. For each entry of our NxN result matrix, we have to perform a dot product between a row vector and a column vector, both of length N.",
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
        text: "This results in N(=rows) * N(=columns) * N(=dot product) * 2(mul + add) = 2N³ FLOPs.",
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
        text: "Running on a physical machine",
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
        text: "When run on a dedicated server equipped with an Intel i7-6700 (a quad-core Haswell CPU) it takes 8ms. Total FLOPs: 2 Billion. Total memory (LOAD): 8MB using fp32. Total cycles: 8ms × 3.4GHz = 27 Million. That's 18 FLOPS / core / cycle, or ~250GFLOP/s, on hardware released in 2015.",
      },
      {
        type: "paragraph",
        text: "On a Haswell server, Numpy uses Intel's MKL implementation of BLAS. Particularly we care about how the SGEMM function is implemented, which is called for matrix multiplications. SGEMM is short for single-precision general matrix multiply. GEMM performs: C = α*A*B + β*C. A, B, C are matrices and α, β are scalars.",
      },
      // Section: How can a single core do 18 FLOPs in a cycle?
      {
        type: "heading",
        level: 2,
        text: "How can a single core do 18 FLOPs in a cycle?",
      },
      {
        type: "paragraph",
        text: "Looking closely at the relevant sgemm_kernel_HASWELL, the speed comes from using vectorized instructions. A vectorized / SIMD instruction performs the same instruction on all entries of the vector input at once:",
      },
      {
        type: "image",
        src: "/cpu-mmm/Scalar_vs_Vectorized.png",
        alt: "Scalar vs vectorized operations comparison",
        caption: "SIMD instructions operate on multiple floats simultaneously, multiplying throughput.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "FMA stands for Fused Multiply Add — performing A = A + B*C using a single (fused) instruction. It operates on three 256-bit YMM registers, calculating (YMM1 * YMM2) + YMM3, allowing the CPU to perform 16 single-precision FLOPs in one instruction.",
      },
      {
        type: "paragraph",
        text: "Checking Agner Fog's instruction tables and uops.info, VFMADD has a throughput of 0.5 cycles. This means our theoretical upper limit should be 2 × VFMADD instructions per cycle, or 32 FLOPS/cycle. At a latency of 5 cycles, this means we need to find 10 × 16 FLOPs that we can schedule independently, fully exploiting instruction-level parallelism (ILP).",
      },
      {
        type: "paragraph",
        text: "So to conclude, Intel's BLAS library achieves 18 FLOPs/core/cycle, where the theoretical upper bound is 32 FLOPs/core/cycle. Note how even though the matrices aren't that big, we're strongly compute bound already. Loading 8MB from RAM takes maybe 200μs at 40GB/s bandwidth. If the matrices get bigger, we become more compute-bound since we perform 2n³ FLOPs for 2n² loads.",
      },
      // Section: Trying to recreate from scratch
      {
        type: "heading",
        level: 2,
        text: "Trying to recreate this performance from scratch",
      },
      {
        type: "paragraph",
        text: "To spoiler the outcome: we'll end up with an implementation that performs 9 FLOPS/core/cycle, but only works for matrices of a specific size. The goal is not to write a competitive BLAS implementation, but to learn about common performance optimizations. For comparison, the MMM implementation in OpenBLAS is ~7K LOC of handwritten assembly.",
      },
      {
        type: "paragraph",
        text: "Running on a quad-core Intel i7-6700 CPU @ 3.40GHz with 32KiB per-core L1d cache, 256KiB of per-core L2 cache, and a shared 8MB L3 cache. Compiler: clang v14.0. Benchmarking via Google Benchmark. After each benchmark, the result is compared to PyTorch's MMM implementation for correctness.",
      },
      {
        type: "paragraph",
        text: "Let's start with a basic nested for-loop:",
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
        text: "Compiled with clang and default flags, this takes 4.4s. With -O3 -march=native -ffast-math the runtime drops to 1.6s. Another improvement is to accumulate the inner dot-product in a register and only write the result once finished:",
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
        text: "This brings runtime down to 1.5s. It's better to write the register accumulation by hand rather than relying on the compiler to optimize it.",
      },
      // Section: Cache-aware implementation
      {
        type: "heading",
        level: 2,
        text: "Cache-aware implementation",
      },
      {
        type: "paragraph",
        text: "Multidimensional matrices are represented in memory using a strided representation. In most programming languages the matrix is row-continuous, meaning that iterating through a single row by incrementing the column results in sequential memory access.",
      },
      {
        type: "image",
        src: "/cpu-mmm/stride_matrix_representation.png",
        alt: "Strided matrix memory layout",
        caption: "Row-major memory layout: rows are contiguous, columns stride across memory.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "This makes it clear why the inner, most important loop of our matrix multiplication is very cache unfriendly. When iterating over the row of A, we incur a cache miss on the first entry, but the cache-line fetch holds the next 15 floats — good. However, for matrix B, we walk down the rows, incurring a cache miss at every step. At 1024 rows × 64 byte cache lines, we load 64KB from memory for each column — far exceeding a 32KB L1d cache.",
      },
      {
        type: "image",
        src: "/cpu-mmm/cache-unaware-dot-product.png",
        alt: "Cache-unfriendly access pattern for matrix B",
        caption: "The naive loop order accesses B column-by-column, thrashing the L1 cache.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "To fix this, we reorder the two inner-most loops:",
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
        caption: "After loop reordering: B and C are accessed sequentially, enabling vectorization.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "The improvement is quite spectacular, bringing runtime down to 89ms — a 16x improvement! Our inner loops now iterate through B and C in a memory-sequential manner. The loop reordering also enabled the compiler to use vectorized VFMADD instructions:",
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
        text: "Tiling",
      },
      {
        type: "paragraph",
        text: "We just saw how reordering loops made the caches happy. Next we'll cover a technique called tiling, sometimes also called cache blocking. Consider multiplying two 6×6 matrices with an L1d cache that fits 36 floats. When we reach the end of our middle for-loop, our cache is full and early rows of B have been evicted, causing cache misses when we restart.",
      },
      {
        type: "image",
        src: "/cpu-mmm/Basic_tiling_inner.png",
        alt: "Cache tiling concept visualization",
        caption: "Tiling splits the middle loop, ensuring the working set stays in cache across iterations.",
        invert: true,
      },
      {
        type: "paragraph",
        text: "To solve this, we tile on the middle for-loop by introducing an additional outer loop. By splitting the middle-loop into two parts, we ensure no cache misses in the middle loop after the first iteration:",
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
        caption: "Tiling the inner loop: colored arrows show two iterations over the same tile of B.",
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
        text: "At an L1d cache size of 32KB, the theoretical optimal tile size is ~3.5. Grid searching all reasonable values, the optimal tile sizes ended up being significantly bigger. At a tile size of 16, runtime went to 70ms. The optimal tile size is also influenced by loop overhead and prefetcher behavior.",
      },
      // Section: Tiling on multiple dimensions
      {
        type: "heading",
        level: 2,
        text: "Tiling on multiple dimensions",
      },
      {
        type: "paragraph",
        text: "Similar to tiling on the inner dimension, we can also tile on the rows, and eventually on the columns. There are diminishing returns for our small-sized matrices, but for larger matrices this makes sense. Each new dimension tiled allows a smaller inner working set while introducing extra overhead.",
      },
      {
        type: "image",
        src: "/cpu-mmm/full_tiling.png",
        alt: "Multi-dimensional tiling visualization",
        caption: "Tiling on all three dimensions: each tile fits in L1, L2, or L3 cache as appropriate.",
        invert: true,
      },
      // Section: Multithreaded
      {
        type: "heading",
        level: 2,
        text: "Multithreaded matrix multiplication",
      },
      {
        type: "paragraph",
        text: "As the last step, we'll enable multithreading using OpenMP. To pick a good strategy it's important to consider the dependencies of each entry in the result matrix C. We want to avoid having to do partial summing between threads, which would require atomics or locking.",
      },
      {
        type: "image",
        src: "/cpu-mmm/tiled_MMM_dependecies.png",
        alt: "Thread dependency partitioning for matrix multiplication",
        caption: "Dependency analysis: partitioning by output rows and columns avoids inter-thread communication.",
        invert: true,
      },
      {
        type: "image",
        src: "/cpu-mmm/Thread_partitioning.png",
        alt: "Work distribution across threads",
        caption: "Each thread independently computes its chunk of C — no synchronization needed.",
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
        text: "The runtime of the final implementation is around 16ms. Each half of A and B needs to be read by two threads, but each thread computes its chunk of the output matrix C independently. We split both rows and columns into chunks of 4, giving 16 pieces of work divided among 8 hyperthreads.",
      },
      // Conclusion
      {
        type: "heading",
        level: 2,
        text: "Conclusion",
      },
      {
        type: "paragraph",
        text: "Optimizing matrix multiplication is a fun exercise. It touches upon loop reordering, cache-aware programming and proper work distribution during multithreading. A BLAS implementation will also implement tiling for registers, and multi-dimensional tiling for all caches of the L1-L2-L3 hierarchy.",
      },
      {
        type: "paragraph",
        text: "While writing this code it became apparent how easy it is to get lost while optimizing even a simple algorithm like matrix multiplication. You really need to have a strong mental model of the workings of your CPU, and a well-oiled benchmarking and testing setup to iterate quickly.",
      },
      {
        type: "link",
        label: "Original article by Simon Boehm",
        href: "https://siboehm.com/articles/22/Fast-MMM-on-CPU",
        description: "Reproduced with permission from the author.",
      },
    ],
  },
  // ─── Pipeline Parallelism ────────────────────────────────────────────────────
  {
    slug: "pipeline-parallel",
    month: "Pipeline Parallelism",
    subtitle: "distributed training via model partitioning",
    date: "October 2022",
    year: 2022,
    tracks: [],
    blocks: [
      {
        type: "paragraph",
        text: "Pipeline parallelism makes it possible to train large models that don't fit into a single GPU's memory. Example: Huggingface's BLOOM model is a 175B parameter Transformer model. Storing the weights as bfloat16 requires 350GB, but the GPUs used to train BLOOM 'only' have 80GB of memory, and training requires much more memory than just loading the model weights. Their final training was distributed across 384 GPUs, made possible by assigning different layers of the model to different GPUs — a process called model partitioning.",
      },
      {
        type: "paragraph",
        text: "Implemented naively, model partitioning results in low GPU utilization. In this post, we'll first discuss the naive implementation of pipeline parallelism and some of its problems. Then, we'll talk about GPipe and PipeDream, two more recent algorithms that alleviate some of the issues with naive pipeline parallelism.",
      },
      // Section: Naive model parallelism
      {
        type: "heading",
        level: 2,
        text: "Naive Model Parallelism",
      },
      {
        type: "paragraph",
        text: "Naive model parallelism is the most straightforward way of implementing pipeline-parallel training. We split our model into multiple parts, and assign each one to a GPU. Then we run regular training on minibatches, inserting communication steps at the boundaries where we've split the model.",
      },
      {
        type: "paragraph",
        text: "For a 4-layer sequential model, we split computation among two GPUs: GPU1 computes intermediate activations through layers L1 and L2; GPU2 completes the forward pass through L3 and L4. To complete a forward pass, we compute intermediate on GPU1 and transfer the resulting tensor to GPU2. For the backward pass, we send the gradients w.r.t. intermediate from GPU2 to GPU1, which completes the backward pass. This makes naive model-parallel training bit-equal to sequential training.",
      },
      {
        type: "paragraph",
        text: "The pebble graph below illustrates naive model parallelism. GPU1 performs its forward pass and caches the activations. Then it uses MPI to send the outputs of L2 to GPU2. GPU2 finishes the forward pass, calculates the loss, and starts the backward pass. Notice how we only use node-to-node communication (MPI.Send and MPI.Recv) and don't need any collective communication primitives.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/PP_pebble_graph.gif",
        alt: "Pebble graph illustrating naive model parallelism with GPU1 forward caching and MPI communication",
        caption: "Naive model parallelism: GPU1 runs forward and waits while GPU2 runs backward. One GPU is always idle.",
      },
      {
        type: "paragraph",
        text: "By looking at the pebble graph, we can observe some inefficiencies:",
      },
      {
        type: "list",
        items: [
          "Low GPU utilization: at any given time, only one GPU is busy. If we added more GPUs, each would be busy only (1/#GPUs)% of the time.",
          "No interleaving of communication and computation: while sending intermediate outputs (FWD) and gradients (BWD) over the network, no GPU is doing anything.",
          "High memory demand: GPU1 holds all activations for the whole minibatch cached until the very end. Large batch sizes can cause memory problems.",
        ],
      },
      // Section: GPipe
      {
        type: "heading",
        level: 2,
        text: "The GPipe Algorithm: Splitting Minibatches into Microbatches",
      },
      {
        type: "paragraph",
        text: "GPipe increases efficiency by splitting each minibatch into even smaller, equal-sized microbatches. We can then compute the forward and backward pass independently for each microbatch. If we sum up the gradients for each microbatch, we get back the gradient over the whole batch — because the gradient of a sum is the sum of the gradients of each term. This process is called gradient accumulation. The local gradient accumulation is equal to sequential training mathematically speaking.",
      },
      {
        type: "heading",
        level: 3,
        text: "GPipe: Interleaving of Computation and Communication",
      },
      {
        type: "image",
        src: "/pipeline-parallel/interleaved-GPipe.png",
        alt: "Sketch of interleaved GPipe showing dependency arrows",
        caption: "Interleaved GPipe: arrows show dependencies for the first half of the first microbatch.",
      },
      {
        type: "paragraph",
        text: "Unfortunately, there is not a lot of opportunity to interleave communication and compute if the forward and backward passes take the same amount of time for each GPU. Each GPU cannot start processing a given microbatch before the previous GPU has finished processing that same microbatch. If all stages take the same amount of time, we'll still get distinct phases of communication and computation.",
      },
      {
        type: "heading",
        level: 3,
        text: "GPipe: Pipeline Bubbles",
      },
      {
        type: "paragraph",
        text: "Bubbles are spots in the pipeline where no useful work is being done, caused by dependencies between operations. For example, GPU4 cannot execute F1 until GPU3 has executed F1 and transmitted the result. The fraction of time wasted on the bubble depends on the pipeline depth n and the number of microbatches m:",
      },
      {
        type: "math",
        latex: "\\text{bubble fraction} = 1 - \\frac{m}{m + n - 1}",
        display: true,
      },
      {
        type: "paragraph",
        text: "So increasing the size of minibatches (which increases m) is necessary for making the bubble fraction small. Large minibatch sizes require careful learning rate scaling and increase the memory demand for caching activations.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/Gpipe_bubbles.png",
        alt: "Demonstration of pipeline bubble inefficiencies caused by data dependencies",
        caption: "Pipeline bubbles: GPUs sit idle waiting for the previous stage to finish.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/Gpipe_bubble_fractions.png",
        alt: "Example calculations comparing single vs 4-microbatch bubble fractions",
        caption: "Bubble fraction comparison: 4 microbatches cuts wasted time dramatically vs. 1 microbatch.",
      },
      {
        type: "heading",
        level: 3,
        text: "GPipe: Memory demand",
      },
      {
        type: "paragraph",
        text: "Increasing the batch size increases the memory demand for cached activations linearly. In GPipe, we cache activations for each microbatch from the time it was forwarded until the corresponding backward. In the GPipe paper, the authors use gradient checkpointing: instead of caching all activations, they recompute them on the fly during the backward pass. This lowers memory demand at the cost of extra computation.",
      },
      {
        type: "paragraph",
        text: "The memory demand for caching activations without gradient checkpointing is O(batchsize · (#total layers / #GPUs)) for each GPU. With gradient checkpointing, caching only inputs at layer boundaries, the peak memory demand becomes:",
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
        caption: "Gradient checkpointing: only layer boundary activations are cached; others are recomputed during backward.",
      },
      // Section: PipeDream
      {
        type: "heading",
        level: 2,
        text: "The PipeDream Algorithm: Interleaving Forwards- and Backwards-Passes for Different Microbatches",
      },
      {
        type: "paragraph",
        text: "PipeDream starts the backward pass for a microbatch as soon as the final pipeline stage has completed the corresponding forward pass. We can discard the cached activation for the mth microbatch as soon as we perform the corresponding backward pass. With PipeDream, this backward pass happens earlier than in GPipe, which lessens the memory demand.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/PipeDream_schedule.png",
        alt: "PipeDream schedule with 4 GPUs and 8 microbatches showing 1F1B pattern",
        caption: "PipeDream 1F1B schedule: blue = forward passes, green = backward passes, numbered by microbatch.",
      },
      {
        type: "paragraph",
        text: "For both GPipe and PipeDream, the memory demand for caching activations can be formalized as (without gradient checkpointing):",
      },
      {
        type: "math",
        latex: "O\\left(\\#\\text{max microbatches in flight} \\cdot \\text{microbatch-size} \\cdot \\frac{\\#\\text{total layers}}{\\#\\text{GPUs}}\\right)",
        display: true,
      },
      {
        type: "paragraph",
        text: "With the PipeDream schedule, we have at most as many microbatches in flight as the pipeline is deep. This becomes obvious when looking at GPU1 in the above plot: during the steady state, GPU1 forwards a new microbatch only after completing a backward pass.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/Pipedream_steady_state.png",
        alt: "PipeDream steady state showing GPU1 alternating forward and backward passes",
        caption: "PipeDream steady state: GPU1 alternates 1F1B after the warmup phase, keeping at most n microbatches in flight.",
      },
      {
        type: "paragraph",
        text: "Contrast this with GPipe, where all microbatches are in flight at some point during the schedule, resulting in higher memory demand. Using the above example, with PipeDream we'd have a maximum of 4 microbatches in flight, while with GPipe it'd be 8 — doubling the memory demand for cached activations. In terms of bubble fraction, there is no difference between PipeDream and GPipe. Visually, if you shift the blue forward passes left and the green backward passes right in the PipeDream plot, you get GPipe.",
      },
      {
        type: "heading",
        level: 3,
        text: "Pipeline parallelism: Communication Volume",
      },
      {
        type: "paragraph",
        text: "For simplicity, assume a model with only dense layers of equal dimension N. During the forward pass, each GPU will send and receive data of size (batchsize × N). The same holds for the backward pass, bringing total communication volume to (#GPUs - 1) × 2 × batchsize × N floats. In data parallelism using Ring AllReduce, each GPU transfers roughly 2 × (#layers × N² / #GPUs) floats. Depending on configuration, data parallelism may be more communication intensive — but as we saw, data-parallel communication can be interleaved with computation, which is harder for pipeline parallelism.",
      },
      // Section: Combining DP and PP
      {
        type: "heading",
        level: 2,
        text: "Combining Data and Pipeline Parallelism",
      },
      {
        type: "paragraph",
        text: "Data and pipeline parallelism are orthogonal and can both be used at the same time, as long as the batchsize is big enough to result in a sensible microbatch size. For pipeline parallelism, each GPU needs to communicate with the next pipeline stage (during FWD) and the previous stage (during BWD). For data parallelism, each GPU needs to AllReduce gradients among all GPUs assigned the same model layers. We can interleave the AllReduce with the backward pass of the final microbatch to reduce training time.",
      },
      {
        type: "image",
        src: "/pipeline-parallel/DP_and_PP.png",
        alt: "Illustration of orthogonal communication partners in combined data and pipeline parallelism",
        caption: "Data + pipeline parallelism: orthogonal MPI communicators handle each communication pattern independently.",
      },
      {
        type: "paragraph",
        text: "In practice, orthogonal communication partners for pipeline and data parallelism are implemented using MPI Communicators — subgroups that allow collective communication only within the subgroup. Any given GPU-X is part of two communicators: one containing all GPUs that hold the same layer slice as GPU-X (data parallelism), and one containing the GPUs that hold the other layer slices of GPU-X's model replica (pipeline parallelism).",
      },
      // Section: Implementation
      {
        type: "heading",
        level: 2,
        text: "Pipeline Parallelism: Implementation of GPipe",
      },
      {
        type: "paragraph",
        text: "Contrary to data parallelism, pipeline parallelism requires no collective communication and therefore no explicit synchronization between workers. Microsoft's DeepSpeed library uses a design where each GPU contains a single worker processing instructions given by a static schedule. Before starting the processing of a minibatch, we first zero out the current gradients. Once done, we update the weights through an optimizer step.",
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
      // Section: Hardware appendix
      {
        type: "heading",
        level: 3,
        text: "General Hardware Setting",
      },
      {
        type: "image",
        src: "/pipeline-parallel/distributed-computing-hardware.png",
        alt: "Hardware hierarchy showing multi-node GPU clusters with PCIe, NVLink, InfiniBand",
        caption: "Distributed training hardware: NVLink (~900GB/s) connects GPUs within a node; InfiniBand (~10-50GB/s) connects nodes.",
        invert: true,
      },
      {
        type: "image",
        src: "/pipeline-parallel/strong-vs-weak-scaling.png",
        alt: "Visual comparison of strong vs weak scaling strategies",
        caption: "Strong scaling: fixed problem size across more GPUs. Weak scaling: problem size grows with GPU count.",
        invert: true,
      },
      // Conclusion
      {
        type: "heading",
        level: 2,
        text: "Conclusion and Summary",
      },
      {
        type: "paragraph",
        text: "That concludes the introduction to pipeline parallelism. Pipeline parallelism is a way of training large models that do not fit into a single GPU's memory, by partitioning the model's layers across GPUs. We perform GPU-to-GPU communication between model partitions during the forward pass (to send activations) and the backward pass (to send gradients).",
      },
      {
        type: "paragraph",
        text: "We saw how naive model parallelism suffers from poor GPU utilization. This is alleviated by GPipe, which splits minibatches into smaller microbatches, keeping multiple GPUs busy at any given time. We saw how PipeDream achieves a smaller memory footprint than GPipe by starting backward passes earlier. Pipeline parallelism can be combined with data parallelism to further decrease the memory demand for each worker.",
      },
      {
        type: "link",
        label: "Original article by Simon Boehm",
        href: "https://siboehm.com/articles/22/pipeline-parallel-training",
        description: "Reproduced with permission from the author.",
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
            caption: "first time on horseback in years, feeling the ocean breeze",
          },
          {
            src: "/IMG_1760.JPG",
            alt: "Coastal landscape at sunset",
            caption: "sea ranch views that remind me to slow down",
          },
          {
            src: "/IMG_1887.JPG",
            alt: "Rocky shoreline at golden hour",
            caption: "finding beauty in the rugged coastline",
          },
          {
            src: "/IMG_2767.JPG",
            alt: "Mountain camping at dawn",
            caption: "backpacking for the first time in years",
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
    slug: "tiny-gemm",
    title: "Tiny-GEMM",
    description:
      "Optimized Triton GEMM + fused transformer kernels for small-batch inference.",
    longDescription:
      "Tiny-GEMM is a collection of fused Triton kernels that make decode-time transformer inference fast on resource-constrained GPUs by minimizing memory traffic and fusing sublayers.",
    date: "2025",
    year: 2025,
    tags: [
      "Triton",
      "Kernel Fusion",
      "INT4",
      "Transformer Inference",
      "Profiling",
    ],
    featured: true,
    githubUrl: "https://github.com/zhan4808/gemmopt",
    hero: { type: "image", src: "/Qyyy.gif", alt: "Tiny-GEMM hero visual" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "modern transformer inference is often bottlenecked not by flops, but by memory traffic, kernel launch overhead, and poor cache utilization--especially in the small-batch, low-latency regime (batch = 1-8).",
          },
          {
            type: "paragraph",
            text:
              "tiny-gemm targets the two most dominant transformer compute paths: multi-head attention and feed-forward networks (mlps / ffns). the goal is to make decode-time inference fast by fusing operations, maximizing reuse in sram/cache, and exploiting packed int4 weights.",
          },
        ],
      },
      {
        id: "why-small-batch",
        title: "Why small-batch inference is hard",
        blocks: [
          {
            type: "paragraph",
            text:
              "most optimized gpu kernels are tuned for training-like throughput: large batch sizes, long steady-state compute, and high arithmetic intensity. real deployment looks different: batch size ~ 1, decode steps are sequential, memory dominates compute, and launch overhead matters.",
          },
          {
            type: "list",
            items: [
              "fusing whole transformer sublayers",
              "io-aware tiling",
              "weight-only quantization",
              "cache-aligned layouts",
            ],
          },
          {
            type: "visualization",
            title: "Figure 1 — Transformer Inference Bottleneck Map",
            prompt:
              "Show an attention + MLP block with arrows labeled 'HBM traffic dominates'. Emphasize memory movement and launch overhead over compute.",
            caption:
              "Small-batch inference is constrained less by compute and more by memory movement and kernel launch overhead.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-01.svg",
              alt: "Transformer inference bottleneck map",
            },
          },
        ],
      },
      {
        id: "fused-attention",
        title: "Fused multi-head attention kernel",
        blocks: [
          {
            type: "paragraph",
            text:
              "transformer attention is conceptually: Attn(Q,K,V) = Softmax((QK^T) / sqrt(d_k)) V. naively, this pipeline allocates large intermediate matrices (QK^T, masked scores, softmax probabilities).",
          },
          {
            type: "paragraph",
            text:
              "tiny-gemm computes attention in one fused triton kernel using a flashattention-style tiling approach. attention must be io-aware, minimizing reads/writes to hbm by keeping working tiles inside sram/registers.",
          },
          {
            type: "list",
            items: [
              "block tiling for batch=1 decode workloads",
              "fused causal masking (autoregressive safe)",
              "locality-aware q/k/v access",
              "optional dropout support",
            ],
          },
          {
            type: "visualization",
            title: "Figure 2 — Naive vs Fused Attention Pipeline",
            prompt:
              "Left: QK^T -> mask -> softmax -> V with four kernel boxes. Right: single fused block. Use minimal arrows and labels.",
            caption:
              "Tiny-GEMM computes attention in one fused Triton kernel, avoiding intermediate writes.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-02.svg",
              alt: "Naive vs fused attention pipeline",
            },
          },
          {
            type: "visualization",
            title: "Figure 3 — FlashAttention-Style Tiling in SRAM",
            prompt:
              "Block matrix tiles inside GPU SRAM with arrows showing on-chip reuse. Emphasize 'on-chip' vs 'HBM'.",
            caption:
              "IO-aware tiling keeps score computation and softmax normalization on-chip, reducing HBM reads/writes.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-03.svg",
              alt: "FlashAttention-style tiling in SRAM",
            },
          },
        ],
      },
      {
        id: "fused-ffn",
        title: "Fused feed-forward network (ffn)",
        blocks: [
          {
            type: "paragraph",
            text:
              "the transformer mlp block is typically: Y = sigma(XW1 + B1) W2 + B2. standard implementations launch gemm, bias add, activation, gemm, bias add. tiny-gemm fuses the full pipeline to reduce kernel boundaries, intermediate writes, and memory bandwidth.",
          },
          {
            type: "visualization",
            title: "Figure 4 — FFN Fusion: GEMM -> Act -> GEMM",
            prompt:
              "Show two GEMMs with activation between, crossed-out intermediate buffers, and a single fused box on the right.",
            caption:
              "FFN fusion eliminates bandwidth-heavy intermediate activations.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-04.svg",
              alt: "FFN fusion diagram",
            },
          },
        ],
      },
      {
        id: "int4",
        title: "Packed INT4 quantization framework",
        blocks: [
          {
            type: "paragraph",
            text:
              "for inference, weights dominate memory footprint. tiny-gemm implements per-channel int4 weight packing, custom dequantization in kernel, and packed int4 gemm primitives. int4 provides ~8x compression vs fp32 and boosts throughput in memory-bound regimes.",
          },
          {
            type: "visualization",
            title: "Figure 5 — Packed INT4 Weight Layout",
            prompt:
              "Diagram showing two INT4 packed into one byte. Use a simple 8-bit box split into two 4-bit halves.",
            caption:
              "Packed INT4 weights reduce memory footprint and improve cache residency, enabling faster weight-only inference.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-05.svg",
              alt: "Packed INT4 layout",
            },
          },
        ],
      },
      {
        id: "pytorch",
        title: "PyTorch operator integration",
        blocks: [
          {
            type: "paragraph",
            text:
              "tiny-gemm registers fused attention + ffn as first-class pytorch ops using torch.library. this enables integration into torch.compile graphs, transformer backends, and higher-level inference runtimes.",
          },
          {
            type: "code",
            code:
              "import tiny_gemm.ops\n\nout = torch.ops.tiny_gemm.fused_attention(q, k, v, causal=True)",
          },
          {
            type: "visualization",
            title: "Figure 7 — PyTorch Op Registration Stack",
            prompt:
              "Stacked diagram: torch.compile -> torch.library -> Triton kernel. Show flow arrows.",
            caption:
              "Custom operator registration makes fused kernels composable inside modern PyTorch inference graphs.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-07.svg",
              alt: "PyTorch op registration stack",
            },
          },
        ],
      },
      {
        id: "profiling",
        title: "Profiling + bottleneck discovery",
        blocks: [
          {
            type: "paragraph",
            text:
              "optimization work is only meaningful when guided by measurement. tiny-gemm includes pytorch profiler integration, tensorboard traces, and kernel-level bottleneck surfacing.",
          },
          {
            type: "list",
            items: [
              "profile -> identify io wall -> fuse -> retile -> benchmark -> repeat",
            ],
          },
        ],
      },
      {
        id: "benchmarks",
        title: "Benchmark highlights",
        blocks: [
          {
            type: "paragraph",
            text:
              "benchmarks compare baseline pytorch attention/ffn, fused triton kernels, and int4 quantized weights. gains are largest for batch=1-4, sequence length <= 2k, decode-style inference workloads.",
          },
          {
            type: "visualization",
            title: "Figure 6 — Benchmark Plot",
            prompt:
              "Line chart: PyTorch FP16 baseline, Tiny-GEMM fused, Tiny-GEMM INT4. Emphasize batch=1 decode gains.",
            caption:
              "Fused kernels + INT4 quantization provide the largest speedups in batch=1 decode workloads.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-06.svg",
              alt: "Benchmark plot",
            },
          },
        ],
      },
      {
        id: "structure",
        title: "Project structure",
        blocks: [
          {
            type: "list",
            items: [
              "triton_fused_transformer.py -- fused attention + ffn kernels",
              "triton_gemm.py -- packed int4 gemm",
              "quantize_utils.py -- quant/dequant utilities",
              "benchmark_fused_transformer.py -- benchmarking harness",
              "tiny_gemm/ops.py -- torch.library op registration",
              "docker/ -- reproducible cuda runtime",
            ],
          },
        ],
      },
      {
        id: "future",
        title: "Future work",
        blocks: [
          {
            type: "list",
            items: [
              "flashattention-2 style scheduling improvements",
              "additional fused blocks: layernorm + residual",
              "broader int4 support across hidden dimension patterns",
              "compiler-level integration into full transformer runtimes",
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
    const yearProjects = projectsByYear.get(project.year) || [];
    yearProjects.push(project);
    projectsByYear.set(project.year, yearProjects);
  }
  return new Map([...projectsByYear.entries()].sort((a, b) => b[0] - a[0]));
}
