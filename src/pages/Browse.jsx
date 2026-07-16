import React, { useMemo, useState } from "react";
import { Input } from "../components/forms/Input.jsx";
import { Button } from "../components/forms/Button.jsx";
import { Select } from "../components/forms/Select.jsx";
import { Checkbox } from "../components/forms/Checkbox.jsx";
import { FilterChip } from "../components/forms/FilterChip.jsx";
import { ResourceCard } from "../components/content/ResourceCard.jsx";
import { Badge } from "../components/feedback/Badge.jsx";
import { RESOURCES, FACET_GROUPS, EXAMPLE_RESOURCE, getAggregatedStatus } from "../data/resources.js";

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

export function Browse() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});
  const [sort, setSort] = useState("default");

  const toggleFacet = (groupKey, label) => {
    setSelected((prev) => {
      const current = new Set(prev[groupKey] || []);
      if (current.has(label)) current.delete(label);
      else current.add(label);
      return { ...prev, [groupKey]: current };
    });
  };

  const clearAll = () => {
    setSelected({});
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = RESOURCES.filter((r) => {
      if (getAggregatedStatus(r) == null) return false;
      for (const group of FACET_GROUPS) {
        const active = selected[group.key];
        if (active && active.size > 0) {
          const value = r[group.key] || "Not specified";
          if (!active.has(value)) return false;
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
  }, [query, selected, sort]);

  const activeChips = Object.entries(selected).flatMap(([groupKey, values]) =>
    [...values].map((label) => ({ groupKey, label }))
  );

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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 16, color: "var(--text-default)", margin: 0 }}>
              Filters
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
              }}
            >
              Clear all
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {FACET_GROUPS.map((group) => (
              <div key={group.key}>
                <div
                  style={{
                    fontFamily: "var(--font-label)",
                    fontSize: 13,
                    fontWeight: "var(--weight-medium)",
                    color: "var(--text-default)",
                    marginBottom: 10,
                  }}
                >
                  {group.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {group.options.map((opt) => (
                    <Checkbox
                      key={opt.label}
                      id={`${group.key}-${opt.label}`}
                      label={opt.label}
                      count={opt.count}
                      checked={(selected[group.key] || new Set()).has(opt.label)}
                      onChange={() => toggleFacet(group.key, opt.label)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Results */}
        <main>
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

          {/* Active filters */}
          {activeChips.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {activeChips.map(({ groupKey, label }) => (
                <FilterChip
                  key={`${groupKey}-${label}`}
                  label={label}
                  selected
                  onRemove={() => toggleFacet(groupKey, label)}
                />
              ))}
            </div>
          )}

          {/* Results list */}
          {filtered.length > 0 ? (
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
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                background: "var(--surface-subtle)",
                borderRadius: "var(--radius-lg)",
                color: "var(--text-muted)",
                fontSize: 15,
              }}
            >
              No resources match these filters. Try clearing a filter or broadening your search.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
