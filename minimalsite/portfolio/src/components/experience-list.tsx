"use client";

import { useMemo, useState } from "react";
import type { Experience } from "@/lib/data";

interface ExperienceListProps {
  experiences: Experience[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const ordered = useMemo(() => experiences, [experiences]);

  return (
    <ul className="flex flex-col gap-4">
      {ordered.map((experience) => {
        const isOpen = openId === experience.id;
        const hasDetails = experience.highlights && experience.highlights.length > 0;
        return (
          <li
            key={experience.id}
            className="group rounded-md border border-border px-4 py-3 transition-colors hover:bg-secondary/40"
          >
            <button
              type="button"
              onClick={() => {
                if (!hasDetails) return;
                setOpenId((current) => (current === experience.id ? null : experience.id));
              }}
              className={`flex w-full items-center justify-between gap-6 text-left ${
                hasDetails ? "cursor-pointer" : "cursor-default"
              }`}
              aria-expanded={isOpen}
              disabled={!hasDetails}
            >
              <div className="flex items-center gap-4">
                {experience.logo ? (
                  <img
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    className="h-10 w-10 rounded-full object-contain"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                    {getInitials(experience.company)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{experience.title}</p>
                  <p className="text-sm text-muted-foreground">{experience.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{experience.period}</span>
                {hasDetails && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-all ${
                      isOpen
                        ? "rotate-90 text-foreground"
                        : "translate-x-0.5 opacity-60 group-hover:translate-x-1 group-hover:opacity-100"
                    }`}
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </div>
            </button>
            {hasDetails && isOpen && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {experience.highlights?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
