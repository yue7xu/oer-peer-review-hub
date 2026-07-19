import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Review Console demo for the How It Works hero.
 *
 * ASSET SLOT
 * ----------
 * Drop files into:  public/how-it-works/
 *   review-console-demo.mp4   ← required (H.264 + AAC, ambient loop)
 *   review-console-poster.jpg ← optional still; if omitted we capture frame 0
 *
 * Paths below are served from `public/` (leading slash, no `public` prefix).
 * Rounded bordered frame only — no fake browser chrome.
 */
const DEMO_MEDIA = {
  src: "/how-it-works/review-console-demo.mp4",
  poster: "/how-it-works/review-console-poster.jpg", // optional — 404 is fine
  alt: "O4PR Review Console — annotate OER text with evidence bound to a rubric criterion",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ConsoleMock({ play }) {
  return (
    <div
      className={`hiw-demo-mock${play ? " hiw-demo-mock--play" : ""}`}
      aria-hidden="true"
    >
      <div className="hiw-demo-mock__pane hiw-demo-mock__pane--oer">
        <div className="hiw-demo-mock__pane-label">Resource</div>
        <p className="hiw-demo-mock__passage">
          Learners need materials they can{" "}
          <mark className="hiw-demo-mock__hl hiw-demo-mock__hl--1">
            perceive and navigate
          </mark>{" "}
          without barriers. Clear structure, readable contrast, and{" "}
          <mark className="hiw-demo-mock__hl hiw-demo-mock__hl--2">
            descriptive alternatives for images
          </mark>{" "}
          keep open resources usable as they are shared and remixed.
        </p>
      </div>
      <div className="hiw-demo-mock__pane hiw-demo-mock__pane--notes">
        <div className="hiw-demo-mock__pane-label">Criterion</div>
        <div className="hiw-demo-mock__criterion">
          Accessibility · Alternative text &amp; images
        </div>
        <div className="hiw-demo-mock__bank">
          <div className="hiw-demo-mock__note hiw-demo-mock__note--1">
            <div className="hiw-demo-mock__note-tag">Evidence</div>
            <p>
              “perceive and navigate” — tied to how assistive tech follows the passage.
            </p>
          </div>
          <div className="hiw-demo-mock__note hiw-demo-mock__note--2">
            <div className="hiw-demo-mock__note-tag">Evidence</div>
            <p>
              “descriptive alternatives for images” — bound to this criterion’s standard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function capturePosterFromVideo(video) {
  try {
    if (!video.videoWidth || !video.videoHeight) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.86);
  } catch {
    return null;
  }
}

/**
 * @param {object} props
 * @param {string} [props.mediaSrc]
 * @param {string|null} [props.posterSrc]
 * @param {string} [props.mediaAlt]
 */
export function ReviewConsoleDemo({
  mediaSrc = DEMO_MEDIA.src,
  posterSrc = DEMO_MEDIA.poster,
  mediaAlt = DEMO_MEDIA.alt,
}) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [mode, setMode] = useState("loading"); // loading | video | poster | mock
  const [mockPlay, setMockPlay] = useState(false);
  const [poster, setPoster] = useState(posterSrc || null);
  const [ratio, setRatio] = useState(null); // { w, h }
  const reduceMotion = prefersReducedMotion();

  const fallbackToMock = useCallback(() => {
    setMode("mock");
  }, []);

  // Probe optional poster; ignore 404
  useEffect(() => {
    if (!posterSrc) return undefined;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setPoster(posterSrc);
    };
    img.onerror = () => {
      /* keep null — we'll derive from video */
    };
    img.src = posterSrc;
    return () => {
      cancelled = true;
    };
  }, [posterSrc]);

  // Mock enter animation when used as fallback
  useEffect(() => {
    if (mode !== "mock") return undefined;
    if (reduceMotion) {
      setMockPlay(true);
      return undefined;
    }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMockPlay(true);
      return undefined;
    }
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (fired) return;
        if (entries.some((e) => e.isIntersecting)) {
          fired = true;
          setMockPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode, reduceMotion]);

  // Video: metadata, first-frame poster; stays mounted until we fall back to mock
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaSrc) {
      fallbackToMock();
      return undefined;
    }

    let cancelled = false;
    let posterCaptured = false;

    const onError = () => {
      if (!cancelled) fallbackToMock();
    };

    const onLoadedMetadata = () => {
      if (cancelled) return;
      if (video.videoWidth && video.videoHeight) {
        setRatio({ w: video.videoWidth, h: video.videoHeight });
      }
      if (reduceMotion) {
        setMode("poster");
        try {
          video.currentTime = 0.05;
        } catch {
          /* ignore */
        }
        return;
      }
      setMode("video");
    };

    const onSeeked = () => {
      if (cancelled || posterCaptured) return;
      const dataUrl = capturePosterFromVideo(video);
      if (dataUrl) {
        posterCaptured = true;
        setPoster((prev) => prev || dataUrl);
      }
    };

    const onLoadedData = () => {
      if (cancelled || posterCaptured) return;
      if (video.readyState >= 2) {
        const dataUrl = capturePosterFromVideo(video);
        if (dataUrl) {
          posterCaptured = true;
          setPoster((prev) => prev || dataUrl);
        } else {
          try {
            video.currentTime = 0.05;
          } catch {
            /* ignore */
          }
        }
      }
    };

    video.addEventListener("error", onError);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("seeked", onSeeked);
    video.load();

    return () => {
      cancelled = true;
      video.removeEventListener("error", onError);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [fallbackToMock, mediaSrc, reduceMotion]);

  // Play only while in view (ambient loop)
  useEffect(() => {
    if (mode !== "video") return undefined;
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root || typeof IntersectionObserver === "undefined") {
      video?.play?.().catch(() => fallbackToMock());
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          video.play().catch(() => fallbackToMock());
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [mode, fallbackToMock]);

  const stageStyle = ratio
    ? { aspectRatio: `${ratio.w} / ${ratio.h}` }
    : undefined;

  const keepVideoMounted = mode !== "mock";
  const showVideoVisually = mode === "video";
  const showPosterStill =
    (mode === "poster" || mode === "loading") && Boolean(poster);
  const showMock = mode === "mock" || (mode === "poster" && !poster);

  return (
    <div
      className="hiw-demo"
      ref={rootRef}
      role="img"
      aria-label={mediaAlt}
      style={stageStyle}
    >
      {keepVideoMounted && mediaSrc ? (
        <video
          ref={videoRef}
          className={`hiw-demo__media${showVideoVisually ? "" : " hiw-demo__media--hidden"}`}
          src={mediaSrc}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster || undefined}
          controls={false}
          disablePictureInPicture
          aria-hidden={!showVideoVisually}
        />
      ) : null}

      {showPosterStill ? (
        <img className="hiw-demo__media" src={poster} alt="" />
      ) : null}

      {showMock ? <ConsoleMock play={mockPlay} /> : null}
    </div>
  );
}
