import type { Metadata } from "next";
import { getVisibleJournals, projects } from "@/lib/data";
import Link from "next/link";

const visibleProjects = projects.filter((p) => !p.hidden);
const visibleJournals = getVisibleJournals();

export default function Home() {
  return (
    <div className="mx-auto mt-10 mb-24 flex max-w-[680px] flex-col gap-8 px-6 md:mt-16">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-sm font-normal underline underline-offset-2">
          Robert Zhang
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Applied AI @{" "}
          <a
            href="https://www.asteralabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Astera Labs
          </a>
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Electrical Engineering @ Purdue University
        </p>
      </header>

      <main className="flex flex-col gap-10 text-sm leading-relaxed">
        {/* About */}
        <details open>
          <summary className="text-sm font-bold mb-4">About</summary>
          <div className="text-[hsl(var(--muted-foreground))] space-y-4">
            <p>
              I&apos;m an undergraduate studying electrical engineering at Purdue
              University. I&apos;m broadly interested in the intersection of
              compilers, ML systems, and hardware — the stack that turns models
              into fast, usable systems at scale.
            </p>
            <p>
              Most of my recent work has been in GPU kernel engineering: writing
              Triton and CUDA kernels for LLM inference, profiling with NCU and
              rocprof, and figuring out when quantization actually helps versus
              when it doesn&apos;t. I think a lot about memory hierarchies,
              arithmetic intensity boundaries, and the gap between roofline
              predictions and real hardware behavior.
            </p>
            <p>
              I grew up in the Bay Area and am currently based in Santa Clara for
              the summer. Outside of engineering I love jazz, being outdoors, and
              all things sports.
            </p>
          </div>
        </details>

        {/* Experience */}
        <details open>
          <summary className="text-sm font-bold mb-4">Experience</summary>
          <div className="text-[hsl(var(--muted-foreground))] space-y-4">
            <p>
              I&apos;m currently at{" "}
              <a
                href="https://www.asteralabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Astera Labs
              </a>{" "}
              working on applied AI. Before this, I spent seven months at{" "}
              <a
                href="https://www.westerndigital.com/brand/sandisk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                SanDisk
              </a>{" "}
              as an Advanced Memory Intern, where I built an ML trim
              optimization platform using XGBoost and configurable DNNs to
              predict read-window outcomes across process corners. I scaled the
              data pipelines to 48TB+ and integrated agentic LLM orchestration
              to automate experiments and synthesize metrics into reports.
            </p>
            <p>
              I&apos;ve been a researcher at{" "}
              <a
                href="https://engineering.purdue.edu/SoC-Team"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Purdue SoCET
              </a>{" "}
              since 2024. I led hardware-software codesign for the Atalla ML
              accelerator — building the kernel library (FlashAttention, fused
              GEMM, implicit im2col conv, layernorm), the compiler pipeline
              (loop unrolling, scheduling, packetization), and a PyTorch graph
              backend with tiling and fusion optimizations for end-to-end ViT
              and GPT-2 inference. I also implemented an instruction
              packetization pass for the Cardinal GPU compiler.
            </p>
            <p>
              In the summer of 2024, I designed and taped out a wireless
              messaging ASIC in SKY130 through Purdue&apos;s{" "}
              <a
                href="https://engineering.purdue.edu/STARS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                STARS
              </a>{" "}
              program — GPIO, Wishbone bus control, maskable interrupts, timing
              closure at 10 MHz using OpenLane, validated via FPGA prototyping.
            </p>
            <p>
              At{" "}
              <a
                href="https://endian.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Endian
              </a>{" "}
              (backed by Susa Ventures), I built an automation platform
              orchestrating 20 concurrent browser agents with a security-first
              credential flow, saving users 6+ hours per week.
            </p>
            <p>
              I&apos;m a{" "}
              <a
                href="https://commacapital.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Comma Capital
              </a>{" "}
              Fellow focused on frontier systems and AI infrastructure. Earlier,
              I spent time at the{" "}
              <a
                href="https://cornfieldlab.stanford.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Stanford Cornfield Lab
              </a>{" "}
              and{" "}
              <a
                href="https://research.ibm.com/labs/almaden"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                IBM Almaden
              </a>{" "}
              as a research intern.
            </p>
          </div>
        </details>

        {/* Projects */}
        <details open>
          <summary className="text-sm font-bold mb-4">Projects</summary>
          <div className="text-[hsl(var(--muted-foreground))] space-y-2">
            {visibleProjects.map((project) => (
              <p key={project.slug}>
                <Link
                  href={project.externalUrl ?? `/projects/${project.slug}`}
                  target={project.externalUrl ? "_blank" : undefined}
                  rel={
                    project.externalUrl ? "noopener noreferrer" : undefined
                  }
                  className="inline-link"
                >
                  {project.title}
                </Link>
              </p>
            ))}
          </div>
        </details>

        {/* Writing */}
        <details open>
          <summary className="text-sm font-bold mb-4">Writing</summary>
          <div className="text-[hsl(var(--muted-foreground))] space-y-2">
            {visibleJournals.map((post) => (
              <p key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="inline-link">
                  {post.month}
                </Link>
              </p>
            ))}
          </div>
        </details>

        {/* Contact */}
        <details open>
          <summary className="text-sm font-bold mb-4">Contact</summary>
          <div className="text-[hsl(var(--muted-foreground))] space-y-4">
            <p>
              Reach me at{" "}
              <a
                href="mailto:robertzhang930@gmail.com"
                className="inline-link"
              >
                robertzhang930@gmail.com
              </a>{" "}
              for anything. I&apos;m also on{" "}
              <a
                href="https://github.com/zhan4808"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                GitHub
              </a>
              ,{" "}
              <a
                href="https://linkedin.com/in/robert05"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                LinkedIn
              </a>
              , and{" "}
              <a
                href="https://x.com/robdobflob"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                X
              </a>
              .
            </p>
          </div>
        </details>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "robert zhang",
};
