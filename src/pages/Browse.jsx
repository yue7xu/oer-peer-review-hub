import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../components/forms/Input.jsx";
import { Button } from "../components/forms/Button.jsx";
import { Select } from "../components/forms/Select.jsx";
import { Checkbox } from "../components/forms/Checkbox.jsx";
import { FilterChip } from "../components/forms/FilterChip.jsx";
import { FilterGroup } from "../components/forms/FilterGroup.jsx";
import { ResourceCard } from "../components/content/ResourceCard.jsx";
import { RubricInfoPopover } from "../components/content/RubricInfoPopover.jsx";
import { HighlightText } from "../components/content/HighlightText.jsx";
import { EmptyState } from "../components/content/EmptyState.jsx";
import { Badge } from "../components/feedback/Badge.jsx";
import { fetchResources, buildFacetGroups, RUBRIC_DESCRIPTIONS, EXAMPLE_RESOURCE, getAggregatedStatus } from "../data/resources.js";

const container = { maxWidth: 1280, margin: "0 auto" };

const SORTS = {
  default: { label: "Default order", compare: null },
  title: { label: "Title (A–Z)", compare: (a, b) => a.title.localeCompare(b.title) },
  updated: {
    label: "Most recently updated",
    compare: (a, b) => (b.year || "0").localeCompare(a.year || "0"),
  },
  institution: { label: "Institution (A–Z)", compare: (a, b) => a.institution.localeCompare(b.institution) },
};

function emptySelection() {
  return {};
}

export function Browse() {
  const [query, setQuery] = useState("");
  const [pendingSelected, setPendingSelected] = useState(emptySelection);
  const [appliedSelected, setAppliedSelected] = useState(emptySelection);
  const [sort, setSort] = useState("default");
  const [resources, setResources] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    let cancelled = false;
    fetchResources()
      .then((data) => {
        if (cancelled) return;
        setResources(data);
        setLoadState("ready");
      })
      .catch((err) => {
        console.error("Failed to load resources from Supabase:", err);
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const facetGroups = useMemo(() => buildFacetGroups(resources), [resources]);

  const togglePending = (groupKey, label) => {
    setPendingSelected((prev) => {
      const current = new Set(prev[groupKey] || []);
      if (current.has(label)) current.delete(label);
      else current.add(label);
      return { ...prev, [groupKey]: current };
    });
  };

  const applyFilters = () => setAppliedSelected(pendingSelected);

  const clearAll = () => {
    setPendingSelected(emptySelection());
    setAppliedSelected(emptySelection());
    setQuery("");
  };

  const clearGroup = (groupKey) => {
    setPendingSelected((prev) => ({ ...prev, [groupKey]: new Set() }));
    setAppliedSelected((prev) => ({ ...prev, [groupKey]: new Set() }));
  };

  const pendingCount = Object.values(pendingSelected).reduce((n, s) => n + (s ? s.size : 0), 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = resources.filter((r) => {
      if (getAggregatedStatus(r) == null) return false;
      for (const group of facetGroups) {
        const active = appliedSelected[group.key];
        if (active && active.size > 0) {
          if (group.key === "rubric") {
            if (!r.rubricReviews.some((rr) => active.has(rr.rubric))) return false;
          } else {
            const value = r[group.key] || "Not specified";
            if (!active.has(value)) return false;
          }
        }
      }
      if (!q) return true;
      const haystack = [r.title, r.authors, r.abstract, r.primarySubject, r.additionalSubjects, r.institution]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    const compare = SORTS[sort].compare;
    if (compare) list = [...list].sort(compare);
    return list;
  }, [resources, facetGroups, query, appliedSelected, sort]);

  const activeGroups = facetGroups.map((group) => {
    const values = [...(appliedSelected[group.key] || [])];
    return { group, values };
  }).filter(({ values }) => values.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Search bar */}
      <div style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "24px 32px", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search by title, author, discipline, or institution…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search resources"
            />
          </div>
          <Button variant="primary" size="lg">
            Search
          </Button>
        </div>
      </div>

      {/* Body: sidebar + results */}
      <div
        style={{
          ...container,
          padding: 32,
          display: "grid",
          gridTemplateColumns: "264px 1fr",
          gap: 40,
          width: "100%",
        }}
      >
        {/* Filter sidebar */}
        <aside style={{ alignSelf: "start" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 16,
              marginBottom: 20,
              borderBottom: "1px solid var(--border-default)",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 16, color: "var(--text-default)", margin: 0 }}>
              Filter by
            </h2>
            <button
              type="button"
              onClick={clearAll}
              style={{
                fontFamily: "var(--font-label)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-brand)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear all
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {facetGroups.map((group) => {
              // Discipline/Rubric/Material-type get a right-aligned bare count
              // (Figma's primary facets); everything else keeps the count
              // inline in parens next to the label.
              const rightAlignCount = ["primarySubject", "rubric", "materialKind"].includes(group.key);
              const maxVisible = group.key === "rubric" ? group.options.length : group.key === "institution" ? 10 : 5;
              return (
                <FilterGroup
                  key={group.key}
                  label={group.label}
                  options={group.options}
                  searchable={group.key === "primarySubject"}
                  maxVisible={maxVisible}
                  selectedCount={(pendingSelected[group.key] || new Set()).size}
                  renderOption={(opt, search) => (
                    <Checkbox
                      key={opt.label}
                      id={`${group.key}-${opt.label}`}
                      label={
                        group.key === "rubric" && RUBRIC_DESCRIPTIONS[opt.label] ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            {opt.label}
                            <RubricInfoPopover title={opt.label} description={RUBRIC_DESCRIPTIONS[opt.label]} />
                          </span>
                        ) : (
                          <HighlightText text={opt.label} query={search} />
                        )
                      }
                      count={opt.count}
                      countPosition={rightAlignCount ? "right" : "inline"}
                      checked={(pendingSelected[group.key] || new Set()).has(opt.label)}
                      onChange={() => togglePending(group.key, opt.label)}
                    />
                  )}
                />
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid var(--border-default)", marginTop: 24, paddingTop: 20 }}>
            <Button variant="primary" size="md" onClick={applyFilters} style={{ width: "100%", marginBottom: 12 }}>
              Apply filters{pendingCount > 0 ? ` · ${pendingCount}` : ""}
            </Button>
            <button
              type="button"
              onClick={clearAll}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                fontFamily: "var(--font-label)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              ↺ Clear all filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <main style={{ borderTop: "1px solid var(--border-default)", paddingTop: 24 }}>
          {/* Example resource — illustrates the fully-reviewed card + detail
              page. Pinned above the real catalog, clearly labeled; not part
              of the count or filters below. */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Badge variant="solid">Example</Badge>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "var(--text-subtle)" }}>
                Shows what a fully peer-reviewed resource looks like — not part of the live catalog.
              </span>
            </div>
            <ResourceCard
              title={EXAMPLE_RESOURCE.title}
              href={`/resource/${EXAMPLE_RESOURCE.id}`}
              authors={EXAMPLE_RESOURCE.authors}
              abstract={EXAMPLE_RESOURCE.abstract}
              discipline={EXAMPLE_RESOURCE.primarySubject}
              license={EXAMPLE_RESOURCE.license}
              status={getAggregatedStatus(EXAMPLE_RESOURCE)}
              reviewCount={EXAMPLE_RESOURCE.rubricReviews.length}
              sourceHref={EXAMPLE_RESOURCE.sourceUrl}
              variant="browse"
              updated={EXAMPLE_RESOURCE.lastUpdated}
              rubricReviews={EXAMPLE_RESOURCE.rubricReviews}
            />
            <div style={{ borderTop: "1px solid var(--border-default)", marginTop: 32 }} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 24, color: "var(--text-default)", margin: "0 0 4px" }}>
                {filtered.length} resource{filtered.length === 1 ? "" : "s"}
              </h1>
              {query.trim() && (
                <div style={{ fontFamily: "var(--font-label)", fontSize: 14, color: "var(--text-subtle)" }}>
                  matching &ldquo;{query.trim()}&rdquo;
                </div>
              )}
            </div>
            <div style={{ minWidth: 220 }}>
              <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Active filters — reflects applied (not pending) selections, so
              the user always knows what's narrowing the list right now,
              independent of whatever's checked-but-not-applied in the sidebar */}
          {activeGroups.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 24 }}>
              {activeGroups.map(({ group, values }) => {
                const joined = values.join(", ");
                const display = values.length > 1 && joined.length > 20 ? `${values[0]} +${values.length - 1}` : joined;
                return (
                  <FilterChip
                    key={group.key}
                    label={
                      <>
                        <span style={{ color: "var(--text-subtle)" }}>{group.label}</span>{" "}
                        <span style={{ color: "var(--text-default)", fontWeight: "var(--weight-semibold)" }}>{display}</span>
                      </>
                    }
                    selected
                    onRemove={() => clearGroup(group.key)}
                  />
                );
              })}
              <button
                type="button"
                onClick={clearAll}
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  padding: "0 4px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results list */}
          {loadState === "loading" ? (
            <p style={{ fontSize: 15, color: "var(--text-subtle)" }}>Loading resources…</p>
          ) : loadState === "error" ? (
            <EmptyState
              title="Couldn't load the catalog"
              message="The resource list couldn't be reached right now. Please try refreshing the page."
            />
          ) : filtered.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filtered.map((r) => (
                <ResourceCard
                  key={r.id}
                  title={r.title}
                  href={`/resource/${r.id}`}
                  authors={r.authors}
                  abstract={r.abstract}
                  discipline={r.primarySubject}
                  license={r.license}
                  status={getAggregatedStatus(r)}
                  reviewCount={r.rubricReviews.length}
                  sourceHref={r.sourceUrl}
                  variant="browse"
                  updated={r.lastUpdated}
                  rubricReviews={r.rubricReviews}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No OERs match your filters"
              message="Try removing a filter, or clear them all."
              action={
                <Button variant="secondary" size="md" onClick={clearAll}>
                  ↺ Clear filters
                </Button>
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
