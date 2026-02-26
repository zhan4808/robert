"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function ImageLightbox({ src, alt, caption, className }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset state when opening
  const openLightbox = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setOpen(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeLightbox]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      return Math.min(Math.max(s * delta, 0.5), 8);
    });
  }, []);

  // Mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }, [offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x),
      y: dragStart.current.oy + (e.clientY - dragStart.current.y),
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  // Touch support
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      lastTouchCenter.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / lastTouchDist.current;
      setScale((s) => Math.min(Math.max(s * ratio, 0.5), 8));
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1 && lastTouchCenter.current) {
      const dx = e.touches[0].clientX - lastTouchCenter.current.x;
      const dy = e.touches[0].clientY - lastTouchCenter.current.y;
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
      lastTouchCenter.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = null;
    lastTouchCenter.current = null;
  }, []);

  // Double-click to reset
  const handleDoubleClick = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <>
      {/* Thumbnail */}
      <figure className="flex flex-col gap-2 group">
        <button
          type="button"
          onClick={openLightbox}
          className="cursor-zoom-in focus:outline-none rounded-lg overflow-hidden"
          aria-label="Expand image"
        >
          <img
            src={src}
            alt={alt}
            className={`w-full rounded-lg transition-opacity group-hover:opacity-90${className ? ` ${className}` : ""}`}
          />
        </button>
        {caption && (
          <figcaption className="text-xs text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox overlay */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors text-sm select-none"
            aria-label="Close"
          >
            esc ✕
          </button>

          {/* Reset hint */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs select-none pointer-events-none">
            scroll to zoom · drag to pan · double-click to reset
          </p>

          {/* Image container — stop propagation so clicks here don't close overlay */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: dragging ? "grabbing" : "grab" }}
          >
            <img
              src={src}
              alt={alt}
              className={`max-w-[90vw] max-h-[90vh] object-contain select-none rounded-lg shadow-2xl transition-transform duration-100 ease-out${className ? ` ${className}` : ""}`}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
