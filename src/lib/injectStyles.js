// Shared CSS-injection mechanics for the codebase's per-component
// CSS-in-JS convention (see CLAUDE.md § Component-scoped CSS pattern).
// Components still own their own CSS template string — this only
// consolidates the "have I already appended a <style> tag for this key"
// bookkeeping that was previously duplicated verbatim (a module-level
// `injected` boolean + manual DOM append) in every component, which risked
// drift between copies and made the pattern harder to audit in one place.
const injectedKeys = new Set();

export function injectStyles(key, css) {
  if (injectedKeys.has(key) || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.setAttribute("data-oer", key);
  el.textContent = css;
  document.head.appendChild(el);
  injectedKeys.add(key);
}
