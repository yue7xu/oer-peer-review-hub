// Catalog data now lives in Supabase (`public.resources` table), read live by
// every visitor via the anon/publishable key. Only the maintainer writes to
// it (via SQL run directly against the project) — there is no public write
// path, enforced by RLS (see the `create_resources_table` /
// `seed_resources_from_catalog` migrations). This module fetches and shapes
// that data for the frontend; it is no longer the source of truth itself.
//
// `EXAMPLE_RESOURCE` below is the one exception: it's explicitly synthetic
// (`isExample: true`), illustrating the fully-populated card/detail layout,
// and stays hardcoded rather than living in the database.

import { supabase } from "../lib/supabaseClient.js";

export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitList(value) {
  if (!value) return [];
  return value
    .split(/[;,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function materialKind(bookInfo) {
  if (!bookInfo) return "Unspecified";
  const text = bookInfo.toLowerCase();
  if (text.includes("video")) return "Instructional video / guided notes";
  if (text.includes("textbook")) return "Textbook";
  if (text.includes("course")) return "Course";
  return "Unspecified";
}

function platformFromUrl(url) {
  if (!url) return "Not specified";
  if (url.includes("pressbooks") || url.includes("open.maricopa.edu")) return "Pressbooks";
  if (url.includes("docs.google.com")) return "Google Docs";
  if (url.includes("sites.google.com")) return "Google Sites";
  if (url.includes("instructure.com")) return "Instructure LOR";
  if (url.includes("openstax.org")) return "OpenStax";
  return "Other";
}

// Peer-review lifecycle statuses in order, per the Block D PRD's Status
// Inventory (Section 3.1). "unreviewed" is this catalog's own pre-lifecycle
// state (see StatusBadge.jsx) — kept in the inventory for any future
// not-yet-submitted entry, though none of the current catalog uses it.
const CANONICAL_STATUSES = [
  { key: "unreviewed", label: "Not yet reviewed" },
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "peer_reviewed", label: "Peer Reviewed · Not Revised" },
  { key: "peer_reviewed_responded", label: "Peer Reviewed · Responded" },
  { key: "peer_reviewed_revised", label: "Peer Reviewed · Revised" },
];

// The six O4PR single-point rubrics (HubSpot content map, Tab 2; full
// criteria in `6 new rubric md/rubric_*.md` at the project root).
const CANONICAL_RUBRICS = [
  "Accessibility",
  "Copy Editing",
  "Copyright",
  "Disciplinary Appropriateness",
  "eLearning",
  "Universal Design for Learning",
];

// Counts a reviewer's per-criterion ratings into the three rubric buckets.
// Shared by ReviewCoverageTable (rubric-level tally) and ReviewerCard
// (per-reviewer tally shown when its card is collapsed).
export function tallyRatings(criteria) {
  if (!Array.isArray(criteria) || !criteria.length) return null;
  const counts = { exceed: 0, exemplify: 0, "does not meet": 0 };
  for (const c of criteria) {
    const rating = (c.rating || "").toLowerCase();
    if (rating.startsWith("exceed")) counts.exceed += 1;
    else if (rating.startsWith("exemplif")) counts.exemplify += 1;
    else if (rating.startsWith("does not meet")) counts["does not meet"] += 1;
  }
  return counts;
}

// Converts a `public.resources` row (snake_case, as returned by Supabase)
// into the camelCase shape the frontend components consume.
function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    authors: row.authors,
    authorList: row.author_list || [],
    primarySubject: row.primary_subject,
    additionalSubjects: row.additional_subjects,
    additionalSubjectList: row.additional_subject_list || [],
    institution: row.institution,
    bookInfo: row.book_info,
    materialKind: row.material_kind,
    abstract: row.abstract,
    license: row.license,
    publishDate: row.publish_date,
    lastUpdated: row.last_updated,
    year: row.year,
    sourceUrl: row.source_url,
    sourceNote: row.source_note,
    platform: row.platform,
    language: row.language,
    targetLearner: row.target_learner,
    status: row.status,
    statusLabel: row.status_label,
    revisedResourceUrl: row.revised_resource_url,
    rubricReviews: row.rubric_reviews || [],
    // Optional book-cover image URL. Null → ResourceCard shows the placeholder.
    coverUrl: row.cover_url || null,
  };
}

// Fetches the full live catalog. Read-only (RLS grants SELECT to the anon
// key only) — throws on failure so callers can show an error state.
export async function fetchResources() {
  const { data, error } = await supabase.from("resources").select("*").order("title", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function fetchResourceById(id) {
  const { data, error } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

// A single illustrative record — every field populated, including a full
// per-rubric peer-review history — so the ResourceCard and ResourceDetail
// layouts can be seen in their fully-populated state. This is clearly
// marked `isExample: true` rather than presented as a live catalog record,
// and (unlike the rest of the catalog) is not stored in Supabase. The DOI
// uses CrossRef's reserved 10.5555 test prefix — never resolves, an
// intentional placeholder rather than a real link.
const EXAMPLE_RAW = {
  title: "Introduction to Psychology 2e",
  authors: "Julie Lazzara",
  primarySubject: "Psychology",
  additionalSubjects: "Data Science",
  institution: "OpenStax",
  bookInfo: "Textbook",
  abstract:
    "Psychology 2e is designed to meet scope and sequence requirements for the single-semester introduction to psychology course. The book offers a comprehensive treatment of core concepts, grounded in both classic studies and current and emerging research. The text also includes coverage of the DSM-5 in examinations of psychological disorders. Psychology incorporates discussions that reflect the diversity within the discipline, as well as the diversity of cultures and communities across the globe.",
  license: "CC BY 4.0",
  language: "English",
  publishDate: "2020-04-22",
  lastUpdated: "2026-04-23",
  sourceUrl: "https://openstax.org/details/books/psychology-2e",
  doi: "10.5555/oer.example.0001",
};

export const EXAMPLE_RESOURCE = {
  ...EXAMPLE_RAW,
  id: "example-" + slugify(EXAMPLE_RAW.title),
  authorList: splitList(EXAMPLE_RAW.authors),
  additionalSubjectList: splitList(EXAMPLE_RAW.additionalSubjects),
  materialKind: materialKind(EXAMPLE_RAW.bookInfo),
  platform: platformFromUrl(EXAMPLE_RAW.sourceUrl),
  // Hardcoded rather than derived from publishDate/lastUpdated: the hero
  // byline shows the edition year (2025), independent of the "Resource
  // details" sidebar's original-publish/last-updated dates.
  year: "2025",
  isExample: true,
  // OER-level fact: the resource itself was revised/republished. Per the
  // Section 8 aggregation rule, this alone is enough to roll the OER-level
  // status up to "Peer Reviewed · Revised" regardless of any single
  // rubric's own stage.
  revisedResourceUrl: "https://openstax.org/details/books/psychology-2e",
  // Four rubrics at different lifecycle stages — demonstrates that each
  // rubric review progresses independently of the others. Accessibility and
  // eLearning also carry the full multi-reviewer, per-criterion detail (two
  // reviewers apiece) to show the deeper accordion UI; Disciplinary
  // Appropriateness and Copyright stay single-reviewer/lighter-detail to show
  // that the same components degrade gracefully with less data.
  rubricReviews: [
    {
      rubric: "Accessibility",
      rubricId: "accessibility",
      status: "peer_reviewed_revised",
      reviewers: [
        {
          firstName: "Monica",
          lastName: "Xu",
          affiliation: "Carnegie Mellon University",
          status: "peer_reviewed_revised",
          criteria: [
            {
              label: "C1 · Text Structure and Screen Reader Navigation",
              standardDescription:
                "All text content includes proper heading hierarchy (H1–H6), with logical nesting and no skipped levels; lists use proper markup; reading order matches visual layout; page navigation coding supports adaptive technology.",
              rating: "exemplify",
              comment:
                "No structural revisions required; heading hierarchy and reading order were already consistent. We did correct one mis-nested subheading (H3 under H1) in Chapters 9 and 14 during a routine audit.",
            },
            {
              label: "C2 · Visual Design and Color",
              standardDescription:
                "Text and background colors meet WCAG 2.1 AA contrast ratios; information is not conveyed by color alone; font size is minimum 12pt for body text.",
              rating: "exceed",
              comment:
                "No changes made. Contrast ratios and layout were deliberately tested against WCAG 2.1 AA during initial development, and we'll retain this design unless a future review flags a regression.",
            },
            {
              label: "C3 · Alternative Text and Image Accessibility",
              standardDescription:
                "All informative images include descriptive alternative text; decorative images are marked with null alt text; charts and graphs include data tables or detailed descriptions.",
              rating: "does not meet",
              comment:
                "We agree and have made substantial revisions. Alt text was rewritten for all 41 affected figures, distinguishing informative from decorative images, and we published an alt-text style guide in the instructor appendix.",
            },
            {
              label: "C4 · Multimedia Accessibility",
              standardDescription:
                "Videos include accurate closed captions and transcripts; audio content provides complete transcripts; media players are keyboard accessible and compatible with assistive technology.",
              rating: "exemplify",
              comment:
                "No revisions needed; embedded videos already meet captioning and transcript standards. We'll continue requiring captions and transcripts for any new multimedia submitted in future editions.",
            },
            {
              label: "C5 · Interactive Elements and Forms",
              standardDescription:
                "All interactive elements are keyboard accessible; form fields have labels and instructions; error messages are descriptive and actionable; focus indicators are visible and logical.",
              rating: "exemplify",
              comment:
                "Keyboard navigation and focus indicators confirmed adequate. We're not revising quiz error messaging this cycle, as it depends on a third-party plugin outside our editorial control; this is noted as a known limitation.",
            },
            {
              label: "C6 · Table Structure and Data Presentation",
              standardDescription:
                "Data tables include proper header markup and scope attributes; tables are not used for layout; complex tables provide summaries or navigation aids.",
              rating: "does not meet",
              comment:
                "We agree and have added data tables with proper header markup and scope attributes for all Chapter 2 charts, which previously lacked accompanying tables. Text now cross-references these tables instead of repeating content.",
            },
            {
              label: "C7 · Link Quality and Context",
              standardDescription:
                "Link text is descriptive and meaningful out of context; links indicate when opening in new windows or different file formats; link purposes are clear from context or link text alone.",
              rating: "exemplify",
              comment:
                "Link text is generally descriptive. We're retaining current citation-style links (e.g., DOIs) despite a suggestion to reword them, since standard academic citation format serves instructors better than accessibility-driven rephrasing here.",
            },
            {
              label: "C8 · Technical Format and Compatibility",
              standardDescription:
                "Content is available in formats that preserve accessibility features; resources work across multiple devices and platforms; no additional software or plugins are required.",
              rating: "exemplify",
              comment: "No changes made; the resource already works across devices without requiring additional plugins or software.",
            },
          ],
        },
        {
          firstName: "Thoughtful",
          lastName: "Fig",
          anonymous: true,
          status: "peer_reviewed_revised",
          criteria: [
            { label: "C1 · Text Structure and Screen Reader Navigation", rating: "exemplify", comment: "Heading structure and reading order are sound; no further action needed." },
            { label: "C2 · Visual Design and Color", rating: "exemplify", comment: "Contrast and layout meet the standard; consistent with WCAG 2.1 AA." },
            { label: "C3 · Alternative Text and Image Accessibility", rating: "exceed", comment: "Alt text goes beyond description, naming the statistical relationship each figure illustrates." },
            { label: "C4 · Multimedia Accessibility", rating: "exemplify", comment: "Captions and transcripts present and accurate on all reviewed media." },
            { label: "C5 · Interactive Elements and Forms", rating: "exemplify", comment: "Form fields and interactive elements are keyboard accessible with clear labels." },
            { label: "C6 · Table Structure and Data Presentation", rating: "does not meet", comment: "Several data tables still lack header markup and scope attributes; recommend addressing before next edition." },
            { label: "C7 · Link Quality and Context", rating: "exemplify", comment: "Link text is descriptive; purpose is clear from context." },
            { label: "C8 · Technical Format and Compatibility", rating: "exemplify", comment: "Verified across desktop and mobile; no plugins required." },
          ],
        },
      ],
      timeline: [
        {
          title: "Author revised & re-published V2",
          date: "2026-03-14",
          tone: "success",
          description: "All requested accessibility revisions were incorporated and the second edition went live.",
        },
        {
          title: "Author responded to V1 reviews",
          date: "2026-01-22",
          tone: "warning",
          description: "Addressed feedback from Monica Xu and Thoughtful Fig on alternative text and table structure.",
        },
        {
          title: "V1 review completed by Monica Xu",
          date: "2025-12-27",
          tone: "info",
          description: "Full Accessibility rubric evaluation submitted, covering all eight criteria.",
        },
        {
          title: "V1 review completed by Thoughtful Fig",
          date: "2025-12-25",
          tone: "info",
          description: "Second independent Accessibility review submitted.",
        },
        {
          title: "V1 review started by Thoughtful Fig",
          date: "2025-11-16",
          tone: "info",
          description: "Second reviewer began evaluating the resource against the Accessibility rubric.",
        },
        {
          title: "V1 review started by Monica Xu",
          date: "2025-11-12",
          tone: "info",
          description: "First reviewer began evaluating the resource against the Accessibility rubric.",
        },
        {
          title: "V1 request review by Author",
          date: "2025-11-02",
          tone: "error",
          description: "Author submitted the resource for Accessibility peer review.",
        },
      ],
      authorRevision: {
        date: "2026-03-14",
        versionLabel: "Version 1 - 2",
        summary:
          "We agree with the reviewers' findings on alternative text and table structure, and have made substantial revisions to address both. We rewrote alt text for all 41 figures lacking adequate description, distinguishing informative from decorative images, and added data tables with proper header markup to all Chapter 2 charts. We've also published an alt-text style guide in the instructor appendix to guide future contributions. Feedback on link phrasing and quiz error messaging was reviewed but not adopted in this cycle, for reasons noted above; all other criteria required no changes.",
      },
    },
    {
      rubric: "eLearning",
      rubricId: "elearning",
      status: "peer_reviewed",
      reviewers: [
        {
          firstName: "Constructive",
          lastName: "Kiwi",
          anonymous: true,
          status: "peer_reviewed",
          criteria: [
            { label: "C1 · Usability and Technical Functionality", rating: "exemplify", comment: "Interface is intuitive and navigation is consistent; core features work reliably across browsers." },
            { label: "C2 · Technical Support and Documentation", rating: "exemplify", comment: "Support channels and documentation are solid; instructor troubleshooting guidance could go further." },
            { label: "C3 · Mobile Accessibility and Cross-Platform Documentation", rating: "exemplify", comment: "Functions effectively across desktop and mobile with minimal difference in experience." },
            {
              label: "C4 · Learning Management System (LMS) Integration and Interoperability",
              rating: "does not meet",
              comment: "Supplementary quizzes do not support LTI-compliant grade passback and require students to create separate accounts.",
            },
            { label: "C5 · Data Privacy, Security, and Ownership", rating: "exemplify", comment: "Privacy policy is clear and accessible; student data is not shared with third parties." },
            { label: "C6 · Cost, Sustainability, and Resource Requirements", rating: "exceed", comment: "All materials remain free with no hidden costs or required upgrades." },
            { label: "C9 · Pedagogical Effectiveness and Learning Enhancement", rating: "exemplify", comment: "Features align with the resource's learning objectives and support higher-order thinking." },
            { label: "C10 · Learning Analytics and Customization", rating: "exemplify", comment: "Instructors can customize the tool to their course context; engagement data is presented clearly." },
          ],
        },
      ],
      timeline: [
        {
          title: "Author revised & re-published V2",
          date: "2026-03-14",
          tone: "success",
          description: "LMS integration and technical-support revisions were incorporated and the second edition went live.",
        },
        {
          title: "Author responded to V1 review",
          date: "2026-01-22",
          tone: "warning",
          description: "Addressed Constructive Kiwi's feedback on LMS integration and interoperability.",
        },
        {
          title: "V1 review completed by Constructive Kiwi",
          date: "2025-12-30",
          tone: "info",
          description: "Full eLearning rubric evaluation submitted.",
        },
        {
          title: "V1 review started by Constructive Kiwi",
          date: "2025-11-16",
          tone: "info",
          description: "Reviewer began evaluating the resource against the eLearning rubric.",
        },
        {
          title: "V1 request review by Author",
          date: "2025-11-02",
          tone: "error",
          description: "Author submitted the resource for eLearning peer review.",
        },
      ],
      authorRevision: {
        date: "2026-03-14",
        versionLabel: "Version 1 - 2",
        summary:
          "We agree with the reviewer's finding on LMS Integration and Interoperability and have made targeted revisions. The textbook's supplementary quizzes did not support LTI-compliant grade passback, so we partnered with our LMS provider to enable single sign-on and gradebook syncing without requiring students to create separate accounts. We also expanded troubleshooting documentation for instructors following feedback on Technical Support. Cost, Sustainability, and Resource Requirements remains rated Exceeds, as all materials stay free with no hidden fees. Mobile Accessibility, Usability, Data Privacy, Pedagogical Effectiveness, and Learning Analytics required no changes, as reviewers confirmed these already meet standards.",
      },
    },
    {
      rubric: "Disciplinary Appropriateness",
      rubricId: "disciplinary-appropriateness",
      status: "peer_reviewed_responded",
      reviewers: [
        {
          firstName: "Liam",
          lastName: "Bergström",
          affiliation: "Uppsala University · Mathematics Education",
          status: "peer_reviewed_responded",
          criteria: [
            {
              label: "Content Accuracy and Validity",
              standardDescription:
                "All content is factually accurate with reliable, well-supported information; facts and data reflect current disciplinary understanding.",
              rating: "exemplify",
              comment: "Worked examples and definitions check out against current disciplinary references; no factual corrections needed.",
            },
            {
              label: "Currency and Contemporaneity",
              standardDescription:
                "Recent scholarship and current developments in the field sit alongside foundational knowledge, so the material reflects the discipline as it stands today, not just its history.",
              rating: "exemplify",
              comment: "Examples and case studies reference research from the last five years alongside the classic studies; nothing reads as dated.",
            },
            {
              label: "Disciplinary Completeness and Coverage",
              standardDescription:
                "Core topics in the field are covered with appropriate depth, and the connections between concepts are made explicit rather than left implicit.",
              rating: "does not meet",
              comment: "Proportion and ratio notation shifts between Chapters 4 and 9 (\"a:b\" in one, \"a/b\" in the other, for the same relationships), which breaks the conceptual thread for a student reading straight through. Recommend standardizing on one notation before the next edition.",
            },
            {
              label: "Scholarly Rigor and Theoretical Framework",
              standardDescription:
                "Analysis and argumentation rest on sound methods and an explicit theoretical framework recognized within the discipline.",
              rating: "exemplify",
              comment: "The statistical-reasoning chapters build on a consistent, clearly named theoretical framework, and each claim traces back to a cited method.",
            },
            {
              label: "College-Level Appropriateness and Cognitive Demand",
              standardDescription:
                "Demonstrates appropriate intellectual complexity for college students; encourages critical thinking with suitable cognitive demand for the discipline.",
              rating: "exemplify",
              comment: "Problem sets scaffold from procedural to conceptual reasoning at a pace appropriate for an intermediate-level course.",
            },
            {
              label: "Source Quality and Documentation",
              standardDescription:
                "Sources cited are credible and current, and documented to the citation standard expected within the discipline.",
              rating: "exceed",
              comment: "Every dataset and study cited includes a full reference; citation format is consistent with APA 7, the discipline's expected standard.",
            },
            {
              label: "Assessment and Practice Quality",
              standardDescription:
                "Practice opportunities and assessments align with the material's key concepts and vary in form rather than relying on a single question type.",
              rating: "exemplify",
              comment: "Practice sets mix worked examples, open-response prompts, and applied case scenarios, so students are assessed on more than recall.",
            },
          ],
        },
      ],
      timeline: [
        {
          title: "Author responded to review",
          date: "2026-01-22",
          tone: "warning",
          description: "Addressed Liam Bergström's feedback on notation consistency.",
        },
        {
          title: "Disciplinary Appropriateness review completed by Liam Bergström",
          date: "2025-11-09",
          tone: "info",
          description: "Full rubric evaluation submitted; recommended standardizing proportion notation.",
        },
        {
          title: "V1 request review by Author",
          date: "2025-10-20",
          tone: "error",
          description: "Author submitted the resource for Disciplinary Appropriateness peer review.",
        },
      ],
      authorResponse: {
        date: "2026-01-22",
        text: "We agree the proportion notation drifted between chapters and will standardize it in the next revision cycle.",
      },
      // No authorRevision yet — this rubric hasn't progressed to "revised"
      // independently of Accessibility/eLearning above.
    },
    {
      rubric: "Copyright",
      rubricId: "copyright",
      status: "peer_reviewed",
      reviewers: [
        {
          firstName: "Samuel",
          lastName: "Okonkwo",
          affiliation: "Ohio State University · Copyright & Scholarly Communication",
          status: "peer_reviewed",
          criteria: [
            {
              label: "Original Content Licensing",
              standardDescription:
                "All originally created content is clearly licensed under an appropriate open license; the license is prominently displayed and applied consistently throughout.",
              rating: "exemplify",
              comment: "CC BY 4.0 is declared on the copyright page and repeated in the footer of every chapter export.",
            },
            {
              label: "Third-Party Content Documentation",
              standardDescription:
                "Every third-party image, dataset, or excerpt notes its source and the legal basis for including it (license, permission, or fair use).",
              rating: "exemplify",
              comment: "Every borrowed figure includes a source note identifying where it came from and under what license.",
            },
            {
              label: "Attribution Practices",
              standardDescription:
                "Proper attribution is provided for all third-party content, including creator, title, source, license type, and any modifications made.",
              rating: "exceed",
              comment: "Third-party figures carry full TASL attribution (title, author, source, license) in captions, including notes on any cropping or recoloring.",
            },
            {
              label: "Fair Use Application and Documentation",
              standardDescription:
                "Any fair-use claim is narrowly justified, limited in scope, and clearly signaled to downstream adopters who may not be able to rely on the same claim.",
              rating: "exemplify",
              comment: "The two fair-use claims (both short excerpts from copyrighted journal figures) are each accompanied by a rationale paragraph explaining the limited, transformative use.",
            },
            {
              label: "License Compatibility",
              standardDescription:
                "Where multiple licensed components are combined, the licenses do not conflict, and share-alike terms are honored throughout.",
              rating: "exemplify",
              comment: "All third-party CC BY-SA figures are correctly carried forward under a compatible share-alike license for the whole chapter.",
            },
            {
              label: "Public Domain Materials",
              standardDescription:
                "Public-domain status is accurately identified, explained to the reader, and kept distinct from openly licensed content.",
              rating: "exemplify",
              comment: "The two public-domain historical images are labeled as such, distinct from the CC-licensed figures around them.",
            },
            {
              label: "Copyright Status Communication",
              standardDescription: "An adopter can tell, without specialized legal training, what they may reuse and how.",
              rating: "exceed",
              comment: "The copyright page uses plain language (\"you may reuse and adapt this book...\") rather than legal boilerplate, so instructors don't need a lawyer to know what's allowed.",
            },
            {
              label: "Permissions and Documentation Trail",
              standardDescription:
                "Explicit permissions obtained for any non-openly-licensed content are retained on file, with scope, attribution, and limits documented.",
              rating: "exemplify",
              comment: "The one directly-licensed textbook figure has a signed permission on file specifying non-commercial classroom use, matching how it's actually used here.",
            },
          ],
        },
      ],
      timeline: [
        {
          title: "Copyright review completed by Samuel Okonkwo",
          date: "2025-11-15",
          tone: "info",
          description: "Full rubric evaluation submitted; no revisions requested.",
        },
      ],
      // No authorResponse/authorRevision — nothing to respond to yet.
    },
  ],
};

/**
 * getAggregatedStatus(resource) — rolls up an OER's per-rubric review
 * records into a single public-facing lifecycle status. Computed at
 * render/query time, never stored, since it must reflect the OER-level
 * revisedResourceUrl field plus the current state of every rubric record.
 * Falls back to the resource's own flat `status` field when there are no
 * rubricReviews at all, so a resource with only OER-level status data
 * doesn't silently disappear.
 *
 * Returns one of: "peer_reviewed_revised" | "peer_reviewed_responded" |
 * "peer_reviewed" | null (null = does not qualify for public display).
 */
export function getAggregatedStatus(resource) {
  if (resource.revisedResourceUrl) return "peer_reviewed_revised";

  const reviews = resource.rubricReviews;
  if (Array.isArray(reviews) && reviews.length > 0) {
    if (reviews.some((r) => r.status === "peer_reviewed_responded" || r.status === "peer_reviewed_revised")) {
      return "peer_reviewed_responded";
    }
    if (reviews.some((r) => r.status === "peer_reviewed")) return "peer_reviewed";
    return null;
  }

  const flat = resource.status;
  if (flat && flat !== "unreviewed" && flat !== "submitted" && flat !== "under_review") return flat;
  return null;
}

// Builds facet options from real per-resource values, seeded with an optional
// canonical vocabulary so fields with zero current matches still appear in
// the filter (count 0) instead of being silently dropped.
function facetOptions(items, key, canonicalLabels = []) {
  const counts = new Map(canonicalLabels.map((label) => [label, 0]));
  for (const item of items) {
    const value = item[key] || "Not specified";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

// The seven standard Creative Commons OER licences (Block D PRD /
// project metadata map both reference "Licences" without further
// constraining the set) — shown even when the catalog has no example yet.
const CANONICAL_LICENSES = [
  "CC BY 4.0",
  "CC BY-SA 4.0",
  "CC BY-NC 4.0",
  "CC BY-NC-SA 4.0",
  "CC BY-ND 4.0",
  "CC BY-NC-ND 4.0",
  "CC0 / Public Domain",
];

const CANONICAL_MATERIAL_KINDS = ["Textbook", "Course", "Instructional video / guided notes", "Unspecified"];

// Open4PeerReview grant partner institutions (HubSpot content map, Tab 2 —
// "Partners") that have not yet contributed a catalog entry.
const PARTNER_INSTITUTIONS_WITH_NO_OER_YET = [
  "Arizona State University",
  "Carnegie Mellon University",
  "Massachusetts Institute of Technology",
  "OpenStax (Rice University)",
  "Phoenix College",
  "Rio Salado College",
];

// OpenStax is a named O4PR grant partner and a major OER hosting platform,
// but no current catalog entry is hosted there.
const PARTNER_PLATFORMS_WITH_NO_OER_YET = ["OpenStax"];

// Builds the Browse sidebar's filter facets from a live (already-fetched)
// `resources` array. Order matches the Figma sidebar (Discipline → Rubric →
// Material type → Institution → Status → Language); Licence/Platform/Target
// learner have no Figma-visible slot so they're kept (real data shouldn't be
// dropped) but appended after the Figma-confirmed groups.
export function buildFacetGroups(resources) {
  return [
    { key: "primarySubject", label: "Discipline", options: facetOptions(resources, "primarySubject") },
    {
      key: "rubric",
      label: "Rubric",
      options: CANONICAL_RUBRICS.map((label) => ({
        label,
        count: resources.filter((r) => r.rubricReviews.some((rr) => rr.rubric === label)).length,
      })),
    },
    {
      key: "materialKind",
      label: "Material type",
      options: facetOptions(resources, "materialKind", CANONICAL_MATERIAL_KINDS),
    },
    {
      key: "institution",
      label: "Institution",
      options: facetOptions(resources, "institution", PARTNER_INSTITUTIONS_WITH_NO_OER_YET),
    },
    {
      key: "statusLabel",
      label: "Status",
      options: CANONICAL_STATUSES.map(({ key, label }) => ({
        label,
        count: resources.filter((r) => r.status === key).length,
      })),
    },
    // Language and Target learner are part of the project's metadata map, but
    // the source spreadsheet has no such columns — every resource is honestly
    // "Not specified" rather than a guessed value.
    { key: "language", label: "Language", options: facetOptions(resources, "language") },
    { key: "license", label: "Licence", options: facetOptions(resources, "license", CANONICAL_LICENSES) },
    {
      key: "platform",
      label: "Platform",
      options: facetOptions(resources, "platform", PARTNER_PLATFORMS_WITH_NO_OER_YET),
    },
    { key: "targetLearner", label: "Target learner", options: facetOptions(resources, "targetLearner") },
  ];
}

// First paragraph of each rubric's full write-up (see `6 new rubric md/` at
// the repo root) — used as the InfoIcon tooltip wherever a rubric name
// appears (Browse's Rubric filter, ResourceDetail's coverage table).
export const RUBRIC_DESCRIPTIONS = {
  Accessibility:
    "Accessibility is a foundational dimension of OER quality, ensuring that all learners—regardless of ability, technology, or learning context—can perceive, navigate, and engage with course materials.",
  "Copy Editing":
    "Copy editing is a key component of OER quality, ensuring that materials are clear, consistent, and free of errors that can distract or confuse learners.",
  Copyright:
    "Copyright and licensing are essential dimensions of OER quality, ensuring that materials can be legally used, adapted, and shared.",
  "Disciplinary Appropriateness":
    "Disciplinary appropriateness ensures that OER align with the expectations, practices, and ways of knowing within a specific field of study.",
  eLearning:
    "eLearning design focuses on how OER are structured to support learning, guiding learners through content in ways that are clear, engaging, and aligned with learning goals.",
  "Universal Design for Learning":
    "Universal Design for Learning (UDL) focuses on designing learning experiences that are flexible and responsive to the diverse needs of learners.",
};
