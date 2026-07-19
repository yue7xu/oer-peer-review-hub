import React from "react";

const CSS = `
.oer-marquee {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
}
.oer-marquee:focus-visible {
  outline: 2px solid var(--interactive-focus);
  outline-offset: 2px;
}
.oer-marquee__edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 72px;
  z-index: 1;
  pointer-events: none;
}
.oer-marquee__edge--left { left: 0; background: linear-gradient(to right, var(--surface-subtle), transparent); }
.oer-marquee__edge--right { right: 0; background: linear-gradient(to left, var(--surface-subtle), transparent); }

.oer-marquee__track {
  display: flex;
  width: max-content;
  animation: oer-marquee-scroll var(--oer-marquee-duration, 32s) linear infinite;
}
.oer-marquee--hoverpause:hover .oer-marquee__track { animation-play-state: paused; }
.oer-marquee:focus-within .oer-marquee__track,
.oer-marquee:focus-visible .oer-marquee__track {
  animation-play-state: paused;
}

@keyframes oer-marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.oer-marquee__group {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 0 14px;
  flex: none;
}

.oer-marquee__logo {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: 168px;
  padding: 12px 22px;
  box-sizing: border-box;
  background: var(--surface-default);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
.oer-marquee__logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

@media (max-width: 900px) {
  .oer-marquee__logo { height: 52px; width: 136px; padding: 10px 16px; }
  .oer-marquee__group { gap: 20px; padding: 0 10px; }
  .oer-marquee__edge { width: 48px; }
}

@media (max-width: 640px) {
  .oer-marquee__logo { height: 44px; width: 112px; padding: 8px 12px; }
  .oer-marquee__group { gap: 14px; padding: 0 8px; }
  .oer-marquee__edge { width: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .oer-marquee__track {
    animation: none;
    width: 100%;
    flex-wrap: wrap;
  }
  .oer-marquee__group {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .oer-marquee__group--duplicate { display: none; }
  .oer-marquee__edge { display: none; }
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "partnerlogomarquee");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * PartnerLogoMarquee — a continuously scrolling row of partner logos.
 * The rendered sequence is duplicated once (not the source `partners` data)
 * so the CSS translateX(-50%) loop is seamless regardless of logo count.
 * Pauses on hover and on keyboard focus; falls back to a static wrapping
 * row under prefers-reduced-motion.
 */
export function PartnerLogoMarquee({ partners, duration = 32, pauseOnHover = true, className = "", ...rest }) {
  useStyles();
  return (
    <div
      className={`oer-marquee ${pauseOnHover ? "oer-marquee--hoverpause" : ""} ${className}`.trim()}
      tabIndex={0}
      role="region"
      aria-label="Partner organizations"
      {...rest}
    >
      <span className="oer-marquee__edge oer-marquee__edge--left" aria-hidden="true" />
      <span className="oer-marquee__edge oer-marquee__edge--right" aria-hidden="true" />
      <div className="oer-marquee__track" style={{ "--oer-marquee-duration": `${duration}s` }}>
        <div className="oer-marquee__group">
          {partners.map((partner) => (
            <div className="oer-marquee__logo" key={partner.name}>
              <img src={partner.logo} alt={partner.alt || partner.name} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="oer-marquee__group oer-marquee__group--duplicate" aria-hidden="true">
          {partners.map((partner) => (
            <div className="oer-marquee__logo" key={`dup-${partner.name}`}>
              <img src={partner.logo} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
