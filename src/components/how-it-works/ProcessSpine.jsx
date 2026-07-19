import React, { useEffect, useRef, useState } from "react";
import { ProcessStatusPill } from "./ProcessStatusPill.jsx";

const STEPS = [
  {
    id: "01",
    role: "reviewer",
    side: "left",
    title: "Reviewers qualify first",
    desc: "Reviewers earn their place. Before reviewing anything, they complete a course on the six rubrics and on giving feedback that's specific, constructive, and actionable.",
    bullets: [
      "Reviewers earn a recognized qualification, with their contributions credited to their profile",
      "Every review comes from someone trained to give it — not an anonymous drive-by",
    ],
  },
  {
    id: "02",
    role: "author",
    side: "right",
    title: "Submit the resource",
    desc: "An author brings an open resource they've already published and picks the dimensions it should be reviewed on.",
    bullets: [
      "Works with what you already use — OpenStax, Pressbooks, OLI Torus, or any learning material in PDF, slides, or doc",
      "The author picks which of the six dimensions the review should cover",
    ],
  },
  {
    id: "03",
    role: "reviewer",
    side: "left",
    title: "Review against the rubrics",
    desc: "In the O4PR Review Console, a qualified reviewer works through the resource criterion by criterion — everything in one place, instead of juggling scattered tools or tabs.",
    bullets: [
      "Annotate right on the OER and collect the evidence into a note bank tied to each rubric criterion",
      "Every comment carries its location and evidence, so authors know exactly what to act on",
    ],
    jumpToRubrics: true,
  },
  {
    id: "04",
    role: "author",
    side: "right",
    title: "Respond to the review",
    desc: "The author receives a single review report that gathers every comment in one place, and replies to each one in the O4PR Revision Console.",
    status: "Peer Reviewed",
    statusKey: "peer_reviewed",
    bullets: [
      "The report anchors back to the OER, so the author sees exactly where each annotation was left",
      "Replying point by point earns the Peer Reviewed badge — a real conversation, not a rubber stamp",
    ],
  },
  {
    id: "05",
    role: "author",
    side: "left",
    title: "Revise if needed",
    desc: "When the feedback points to changes worth making, the author revises in the O4PR Revision Console, with the review kept alongside.",
    status: "Peer Reviewed · Revised",
    statusKey: "peer_reviewed_revised",
    bullets: [
      "The Peer Reviewed · Revised badge marks the resources an author improved in response",
      "Every change and its rationale carry forward, so a second-round reviewer sees the full context",
    ],
  },
  {
    id: "06",
    role: "author",
    side: "right",
    title: "Publish the result",
    desc: "The author decides when to make a review public, and can unpublish or republish at any time.",
    bullets: [
      "Visibility is the author's choice, and always reversible",
      "Publishing changes who can see the review, never what it says",
    ],
  },
  {
    id: "07",
    role: "public",
    side: "left",
    title: "Discover and adopt",
    desc: "Adopters browse published resources and read the full review before deciding.",
    bullets: [
      "The full rubric breakdown, comment by comment, laid out to scan fast",
      "The badge is the starting point; the evidence behind it is right there to judge",
    ],
  },
];

const ROLE_LABEL = {
  author: "Author",
  reviewer: "Reviewer",
  public: "Public",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Seven-step vertical spine with scroll progress, card reveals, and role filter.
 */
function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function ProcessSpine({ filterRole }) {
  const spineRef = useRef(null);
  const progressRef = useRef(null);
  const progressDotRef = useRef(null);
  const rowRefs = useRef([]);
  const focusCurrent = useRef(STEPS.map(() => 0));
  const [anim, setAnim] = useState(false);
  const [go, setGo] = useState(false);
  const [inIds, setInIds] = useState(() => new Set());

  useEffect(() => {
    const reduce = prefersReducedMotion();
    setAnim(!reduce);

    if (reduce) {
      setInIds(new Set(STEPS.map((s) => s.id)));
      if (progressRef.current) {
        progressRef.current.style.height = "100%";
      }
      // Resting state only — no lift/scale focus
      rowRefs.current.forEach((row) => {
        const card = row?.querySelector(".hiw-card");
        card?.style.setProperty("--hiw-focus", "0");
      });
      return undefined;
    }

    const rows = rowRefs.current.filter(Boolean);
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("data-step-id");
            if (!id) return;
            setInIds((prev) => {
              if (prev.has(id)) return prev;
              const next = new Set(prev);
              next.add(id);
              return next;
            });
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
      );
      rows.forEach((r) => io.observe(r));
    } else {
      setInIds(new Set(STEPS.map((s) => s.id)));
    }

    let ticking = false;
    let lerpRaf = 0;

    const updateFocusTargets = () => {
      const vh = window.innerHeight;
      const centerY = vh * 0.5;
      const range = vh * (window.innerWidth <= 820 ? 0.5 : 0.42);
      const amp = window.innerWidth <= 820 ? 0.55 : 1;

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const card = row.querySelector(".hiw-card");
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height * 0.5;
        const dist = Math.abs(cardCenter - centerY);
        const target = smoothstep(1 - dist / range);

        const prev = focusCurrent.current[i] ?? 0;
        const next = prev + (target - prev) * 0.16;
        focusCurrent.current[i] = next;

        card.style.setProperty("--hiw-focus", next.toFixed(4));
        card.style.setProperty("--hiw-focus-amp", String(amp));
        card.style.zIndex = String(1 + Math.round(next * 10));
      });
    };

    const draw = () => {
      const spine = spineRef.current;
      const prog = progressRef.current;
      const dot = progressDotRef.current;
      if (spine && prog && dot) {
        const r = spine.getBoundingClientRect();
        const h = spine.offsetHeight;
        let p = (window.innerHeight * 0.55 - r.top) / h;
        p = Math.max(0, Math.min(1, p));
        const y = p * (h - 16);
        prog.style.height = `${y}px`;
        dot.style.top = `${8 + y}px`;
        setGo(p > 0.001 && p < 0.999);
      }

      updateFocusTargets();

      // Keep lerping a few frames after scroll so focus eases to rest
      const stillMoving = focusCurrent.current.some((v, i) => {
        const row = rowRefs.current[i];
        if (!row) return false;
        const card = row.querySelector(".hiw-card");
        if (!card) return false;
        const rect = card.getBoundingClientRect();
        const centerY = window.innerHeight * 0.5;
        const range = window.innerHeight * (window.innerWidth <= 820 ? 0.5 : 0.42);
        const target = smoothstep(
          1 - Math.abs(rect.top + rect.height * 0.5 - centerY) / range,
        );
        return Math.abs(v - target) > 0.002;
      });

      ticking = false;
      if (stillMoving) {
        lerpRaf = requestAnimationFrame(draw);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        cancelAnimationFrame(lerpRaf);
        lerpRaf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    draw();

    return () => {
      io?.disconnect();
      cancelAnimationFrame(lerpRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const filterClass =
    filterRole === "author"
      ? "filter-author"
      : filterRole === "reviewer"
        ? "filter-reviewer"
        : "";

  return (
    <div
      ref={spineRef}
      className={["hiw-spine", anim ? "anim" : "", go ? "go" : "", filterClass]
        .filter(Boolean)
        .join(" ")}
    >
      <div ref={progressRef} className="hiw-progress" aria-hidden="true" />
      <div ref={progressDotRef} className="hiw-progress-dot" aria-hidden="true" />

      {STEPS.map((step, i) => {
        const isIn = inIds.has(step.id) || !anim;
        return (
          <div
            key={step.id}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            data-step-id={step.id}
            className={[
              "hiw-row",
              `hiw-row--${step.side}`,
              `hiw-row--${step.role}`,
              isIn ? "in" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="hiw-node" aria-hidden="true" />
            <article className="hiw-card">
              <div className="hiw-c-head">
                <span className="hiw-rolepill">
                  <span className={`hiw-rd hiw-rd--${step.role}`} aria-hidden="true" />
                  {ROLE_LABEL[step.role]}
                </span>
                <span className="hiw-num">{step.id}</span>
              </div>
              <h3>{step.title}</h3>
              <p className="hiw-desc">{step.desc}</p>
              {step.status ? (
                <div className="hiw-status-wrap">
                  <ProcessStatusPill label={step.status} status={step.statusKey} />
                </div>
              ) : null}
              <div className="hiw-divider" />
              <ul className="hiw-list">
                {step.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              {step.jumpToRubrics ? (
                <a className="hiw-jump" href="#rubrics">
                  See the six rubrics <span className="hiw-jump__ar">↓</span>
                </a>
              ) : null}
            </article>
          </div>
        );
      })}
    </div>
  );
}
