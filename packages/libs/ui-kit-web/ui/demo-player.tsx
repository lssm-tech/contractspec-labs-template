/**
 * DemoPlayer — video player component with PostHog tracking,
 * captions, poster frame, and reduced-motion fallback.
 *
 * Wraps video playback with accessibility and analytics.
 *
 * @spec specs/video-powered-media-pack/implementation_plan.md Phase 0
 * @spec specs/video-powered-media-pack/01-homepage-demo-video.md
 */
'use client';

import * as React from 'react';

import { cn } from './utils';
import { useReducedMotion } from './use-reduced-motion';

export interface DemoPlayerProps {
  /** Video source URL (MP4 or WebM). */
  src: string;
  /** Poster frame image URL. */
  posterUrl?: string;
  /** VTT captions file URL. */
  captionsUrl?: string;
  /** Captions locale label (e.g., "English"). */
  captionsLabel?: string;
  /** Video aspect ratio class. Default: 16:9. */
  aspectRatio?: '16:9' | '9:16' | '1:1';
  /** Called when video starts playing. */
  onPlay?: () => void;
  /** Called at progress milestones (25, 50, 75, 100). */
  onProgress?: (percent: number) => void;
  /** Called when video completes. */
  onComplete?: (durationWatchedS: number) => void;
  /** CTA button config shown at video end. */
  cta?: { text: string; href: string; onClick?: () => void };
  /** Additional class names. */
  className?: string;
  /** Reduced-motion: show transcript instead of video. */
  transcript?: string;
}

const PROGRESS_MILESTONES = [25, 50, 75, 100];

export function DemoPlayer({
  src,
  posterUrl,
  captionsUrl,
  captionsLabel = 'English',
  aspectRatio = '16:9',
  onPlay,
  onProgress,
  onComplete,
  cta,
  className,
  transcript,
}: DemoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [_isPlaying, setIsPlaying] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const firedMilestones = React.useRef(new Set<number>());
  const startTime = React.useRef(0);

  const aspectClass =
    aspectRatio === '9:16'
      ? 'aspect-[9/16]'
      : aspectRatio === '1:1'
        ? 'aspect-square'
        : 'aspect-video';

  const handlePlay = React.useCallback(() => {
    setIsPlaying(true);
    startTime.current = Date.now();
    onPlay?.();
  }, [onPlay]);

  const handleTimeUpdate = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = Math.round((video.currentTime / video.duration) * 100);

    for (const milestone of PROGRESS_MILESTONES) {
      if (percent >= milestone && !firedMilestones.current.has(milestone)) {
        firedMilestones.current.add(milestone);
        onProgress?.(milestone);
      }
    }
  }, [onProgress]);

  const handleEnded = React.useCallback(() => {
    const durationS = Math.round((Date.now() - startTime.current) / 1000);
    setIsComplete(true);
    setIsPlaying(false);
    onComplete?.(durationS);
  }, [onComplete]);

  // Reduced-motion fallback: show poster + transcript
  if (reducedMotion) {
    return (
      <div
        className={cn(
          'bg-muted relative overflow-hidden rounded-lg',
          aspectClass,
          className
        )}
        role="region"
        aria-label="Video content (reduced motion)"
      >
        {posterUrl && (
          <img
            src={posterUrl}
            alt="Video poster"
            className="h-full w-full object-cover"
          />
        )}
        {transcript && (
          <div className="bg-background/90 absolute inset-0 overflow-y-auto p-6">
            <p className="text-foreground text-sm leading-relaxed">
              {transcript}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg', className)}
      role="region"
      aria-label="Video player"
    >
      <video
        ref={videoRef}
        className={cn('w-full rounded-lg', aspectClass)}
        poster={posterUrl}
        controls
        playsInline
        preload="metadata"
        onPlay={handlePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      >
        <source src={src} type="video/mp4" />
        {captionsUrl && (
          <track
            kind="captions"
            src={captionsUrl}
            srcLang="en"
            label={captionsLabel}
            default
          />
        )}
      </video>

      {/* CTA overlay at video end */}
      {isComplete && cta && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <a
            href={cta.href}
            onClick={cta.onClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
          >
            {cta.text}
          </a>
        </div>
      )}
    </div>
  );
}
