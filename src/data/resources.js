// Real OER catalog data, sourced from the Hub's tracking spreadsheet
// (https://docs.google.com/spreadsheets/d/1oki7MGPVL5MH2J1_p_CUcmY0TamZ3U0v1ctSdFHzdgc).
// Each entry has since been assigned a peer-review status of "peer_reviewed"
// and a set of rubrics it was reviewed against (product-owner supplied
// mapping — see REAL_RUBRIC_ASSIGNMENTS below). The reviewer identities
// attached to those rubric reviews are realistic PLACEHOLDERS — no reviewer
// has actually been assigned to these submissions yet; replace with real
// reviewer-assignment data once it exists (see PLACEHOLDER_REVIEWER_POOL).

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

function leadYear(...texts) {
  for (const text of texts) {
    const match = text && text.match(/\b(19|20)\d{2}\b/);
    if (match) return match[0];
  }
  return null;
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
  // open.maricopa.edu is Maricopa's Pressbooks-based OER repository, running
  // under a custom domain rather than *.pressbooks.pub.
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

function statusLabelFor(key) {
  const match = CANONICAL_STATUSES.find((s) => s.key === key);
  return match ? match.label : key;
}

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

// Placeholder reviewer identities for the real catalog's rubric reviews.
// No reviewer has actually been assigned to these submissions yet — these
// are realistic stand-ins (per product-owner direction) so the per-rubric
// UI has something to render, NOT a record of who actually reviewed these
// resources. Replace once real reviewer-assignment data exists.
const PLACEHOLDER_REVIEWER_POOL = [
  { firstName: "Priya", lastName: "Raman", affiliation: "Georgia Institute of Technology · Instructional Design" },
  { firstName: "Marcus", lastName: "Bellweather", affiliation: "University of Michigan · Accessible Media" },
  { firstName: "Elena", lastName: "Vasquez", affiliation: "University of Texas at Austin · Curriculum & Instruction" },
  { firstName: "Samuel", lastName: "Okonkwo", affiliation: "Ohio State University · Copyright & Scholarly Communication" },
  { firstName: "Grace", lastName: "Lindqvist", affiliation: "University of Washington · Learning Sciences" },
  { firstName: "Daniel", lastName: "Reyes", affiliation: "Portland Community College · Editorial Services" },
  { firstName: "Naomi", lastName: "Whitfield", affiliation: "Colorado State University · Universal Design for Learning" },
  { firstName: "Tobias", lastName: "Klein", affiliation: "Indiana University · Disciplinary Review Board" },
];

let placeholderReviewerCursor = 0;
function nextPlaceholderReviewer() {
  const reviewer = PLACEHOLDER_REVIEWER_POOL[placeholderReviewerCursor % PLACEHOLDER_REVIEWER_POOL.length];
  placeholderReviewerCursor += 1;
  return reviewer;
}

function buildRealRubricReviews(rubricNames) {
  return rubricNames.map((rubric) => ({
    rubric,
    rubricId: slugify(rubric),
    status: "peer_reviewed",
    reviewers: [nextPlaceholderReviewer()],
    // No criteria/reviewReportUrl/timeline/authorResponse/authorRevision yet —
    // none of that detail exists for real submissions.
  }));
}

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

// Product-owner supplied mapping of which rubric(s) each real catalog entry
// has been reviewed against ("Discipline" in the source instruction is
// shorthand for the canonical "Disciplinary Appropriateness").
const REAL_RUBRIC_ASSIGNMENTS = {
  "Introduction to Psychology 2e": [
    "Accessibility",
    "Copyright",
    "Copy Editing",
    "Disciplinary Appropriateness",
    "Universal Design for Learning",
  ],
  "Psychology Through the Lifespan": [
    "Accessibility",
    "Copyright",
    "Disciplinary Appropriateness",
    "Universal Design for Learning",
  ],
  "The Connected Mind": ["Accessibility", "Copyright", "Disciplinary Appropriateness", "Universal Design for Learning"],
  "Psychology of Parenting": ["Disciplinary Appropriateness"],
  "Lifespan Development": ["Accessibility", "Copyright"],
  "Social Psychology": ["Copy Editing", "Disciplinary Appropriateness"],
  "Human Biology": ["Accessibility", "Universal Design for Learning"],
  "Attenuated Democracy: A Critical Introduction to U.S. Government and Politics": ["Disciplinary Appropriateness"],
  "Making Statistics Come Alive with Desmos Scientific Calculator & Stats Calculator": ["Disciplinary Appropriateness"],
  "Comparing Functions through Different Representations using Desmos Graphing Calculator": [
    "Disciplinary Appropriateness",
  ],
  "Equity in Mathematics through Desmos Graphing Calculator": ["Disciplinary Appropriateness"],
  "Just in Time — Math Lessons for Chemistry (Summer/Fall 2025 Project)": ["Disciplinary Appropriateness"],
  "MAT 12X — Intermediate Algebra": ["Accessibility", "Disciplinary Appropriateness"],
  "Health Information Literacy": ["Accessibility", "Copyright", "Copy Editing"],
};

const RAW = [
  {
    title: "Introduction to Psychology 2e",
    authors: "Julie Lazzara",
    primarySubject: "Psychology",
    additionalSubjects: null,
    institution: "Chandler-Gilbert Community College",
    bookInfo: "Textbook; remixed version of OpenStax Psychology 2e",
    abstract:
      "Remixed version of OpenStax Psychology 2e, realigned to MCCCD's PSY101 course outline and competencies; chapter numbers omitted for instructor flexibility.",
    license: "CC BY 4.0",
    publishDate: "2020 (original upload); 1st Maricopa Edition April 2021",
    lastUpdated: "January 2025",
    sourceUrl: "https://open.maricopa.edu/intropsych2me/",
  },
  {
    title: "Psychology Through the Lifespan",
    authors: "Julie Lazzara; Alisa Beyer",
    primarySubject: "Psychology",
    additionalSubjects: null,
    institution: "Chandler-Gilbert Community College",
    bookInfo: "Textbook; age-based approach to lifespan developmental psychology",
    abstract:
      "Derivative of Lifespan Development: A Psychological Perspective (Lally & Valentine-French), Lifespan Psychology (Overstreet), Adolescent Development (Lansford), Emerging Adulthood (Arnett), and The Developing Parent (Diener).",
    license: "CC BY-NC-SA 4.0",
    publishDate: "2020 (3rd edition, June 2020)",
    lastUpdated: "January 2025 (major update)",
    sourceUrl: "https://open.maricopa.edu/psy240mm/",
  },
  {
    title: "The Connected Mind",
    authors: "Julie Lazzara",
    primarySubject: "Psychology",
    additionalSubjects: "Culture",
    institution: "Chandler-Gilbert Community College",
    bookInfo: "Textbook and course; Psychology and Culture",
    abstract:
      "Comprehensive, openly licensed Psychology and Culture book/course adapted from existing OER, incorporating updated research and culturally relevant pedagogy; cross-disciplinary examples for non-psychology majors; adapted from Rio Salado College's PSY132 course.",
    license: "CC BY-NC-SA 4.0",
    publishDate: "2025",
    lastUpdated: null,
    sourceUrl: "https://open.maricopa.edu/psy132/",
  },
  {
    title: "Psychology of Parenting",
    authors: "Alisa Beyer",
    primarySubject: "Psychology",
    additionalSubjects: null,
    institution: "Chandler-Gilbert Community College",
    bookInfo: "Textbook",
    abstract:
      "Created for students and professionals working with children/families (educators, caregivers, direct support workers); adapted from Lang's ‘Parenting and Family Diversity Issues’ and sections of Beyer & Lazzara's Lifespan Development OER.",
    license: null,
    publishDate: null,
    lastUpdated: null,
    sourceUrl: "https://open.maricopa.edu/psyparent/",
  },
  {
    title: "Lifespan Development",
    authors: "Alisa Beyer and multiple contributors",
    primarySubject: "Psychology",
    additionalSubjects: null,
    institution: "Chandler-Gilbert Community College",
    bookInfo: "Textbook",
    abstract:
      "Aligns to topics/objectives of most intro developmental psychology courses; covers physical, cognitive, social, emotional development across the lifespan.",
    license: "CC BY 4.0",
    publishDate: "2020",
    lastUpdated: null,
    sourceUrl: "https://open.maricopa.edu/devpsych/",
    sourceNote:
      "The source spreadsheet flags this link as possibly incorrect — it may actually point to open.maricopa.edu/psy240mm/.",
  },
  {
    title: "Social Psychology",
    authors: "Ashley Biddle",
    primarySubject: "Social Psychology",
    additionalSubjects: null,
    institution: "Leeward Community College",
    bookInfo: null,
    abstract:
      "Course site by Ashley Biddle (Leeward CC instructor teaching PSY 250 Social Psychology, among other courses).",
    license: null,
    publishDate: null,
    lastUpdated: null,
    sourceUrl: "https://sites.google.com/view/social-psychology-travel/home",
  },
  {
    title: "Human Biology",
    authors: "Janet Wang-Lee",
    primarySubject: "Human Biology",
    additionalSubjects: null,
    institution: "Leeward Community College",
    bookInfo: "Textbook",
    abstract:
      "Full human biology textbook covering cell structure, energy/metabolism, reproduction, osmoregulation, DNA replication, and related topics.",
    license: "CC BY-NC-SA 4.0",
    publishDate: null,
    lastUpdated: null,
    sourceUrl: "https://pressbooks-dev.oer.hawaii.edu/janetwanglee/",
  },
  {
    title: "Attenuated Democracy: A Critical Introduction to U.S. Government and Politics",
    authors: "David Hubert",
    primarySubject: "Political Science",
    additionalSubjects: null,
    institution: "Salt Lake Community College",
    bookInfo: "Textbook",
    abstract:
      "OER textbook for U.S. Government & Politics courses; author is Associate Provost for Learning Advancement at SLCC.",
    license: "CC BY-NC-SA",
    publishDate: null,
    lastUpdated: null,
    sourceUrl: "https://slcc.pressbooks.pub/attenuateddemocracy/",
  },
  {
    title: "Making Statistics Come Alive with Desmos Scientific Calculator & Stats Calculator",
    authors: "Melina Priewe",
    primarySubject: "Mathematics",
    additionalSubjects: "Statistics",
    institution: "Mesa Community College",
    bookInfo: "Instructional video series / guided notes",
    abstract:
      "Videos teaching students to use the Desmos Scientific Calculator and Stats Calculator, created to support online students lacking equivalent in-person demonstrations; part of Open Maricopa OER Grant Final Products.",
    license: "CC BY-NC 4.0",
    publishDate: null,
    lastUpdated: null,
    sourceUrl:
      "https://docs.google.com/document/d/1T5eh-vrsqCZnEWt9uA9R828zez_W_bYrScCArdqymO8/edit?usp=sharing",
  },
  {
    title: "Comparing Functions through Different Representations using Desmos Graphing Calculator",
    authors: "Melina Priewe",
    primarySubject: "Mathematics",
    additionalSubjects: "Functions (Introductory & Intermediate Algebra)",
    institution: "Mesa Community College",
    bookInfo: null,
    abstract: null,
    license: null,
    publishDate: null,
    lastUpdated: null,
    sourceUrl:
      "https://docs.google.com/document/d/1LB1o_wnad4cGJAPavZC8GiZTxe4quBSbxX3SYlyw5tA/edit?usp=sharing",
  },
  {
    title: "Equity in Mathematics through Desmos Graphing Calculator",
    authors: "Melina Priewe",
    primarySubject: "Mathematics",
    additionalSubjects: "Exponential & Quadratic Functions (Intermediate Algebra)",
    institution: "Mesa Community College",
    bookInfo: "Instructional video series / guided notes",
    abstract:
      "Videos parallel to Scottsdale CC's TI-84 MAT 12X videos, created to give online students a Desmos Graphing Calculator alternative to reduce textbook costs; part of Open Maricopa OER Grant Final Products.",
    license: "CC BY-NC 4.0",
    publishDate: null,
    lastUpdated: null,
    sourceUrl:
      "https://docs.google.com/document/d/1vYXAiIQmE-wyjPAqoL8lAilDoXFodgUeT3mQD3OqI5c/edit?usp=sharing",
  },
  {
    title: "Just in Time — Math Lessons for Chemistry (Summer/Fall 2025 Project)",
    authors: "Melina Priewe",
    primarySubject: "Mathematics",
    additionalSubjects: "Chemistry — Just in Time Math Lessons",
    institution: "Mesa Community College",
    bookInfo: null,
    abstract:
      "Math-skills-review lessons designed to support students in chemistry courses (aligns with MCC's developmental Chemistry prep course).",
    license: null,
    publishDate: null,
    lastUpdated: null,
    sourceUrl:
      "https://docs.google.com/document/d/1G6vqVe-cp55jtQu7ExChOB2Jt4aGLrlZ8AnsZY6_7dE/edit?usp=sharing",
  },
  {
    title: "MAT 12X — Intermediate Algebra",
    authors: "Melina Priewe",
    primarySubject: "Mathematics",
    additionalSubjects: "Intermediate Algebra",
    institution: "Mesa Community College",
    bookInfo: null,
    abstract:
      "References Scottsdale Community College's existing MAT 12X (Intermediate Algebra) TI-84 instructional video library as its base; extends it with Desmos Graphing Calculator parallel videos.",
    license: null,
    publishDate: null,
    lastUpdated: null,
    sourceUrl:
      "https://docs.google.com/document/d/1B4BTO--fxQSC40FvOBy2_aajMZBeFzz8R3YfL6iuM6o/edit?usp=sharing",
  },
  {
    title: "Health Information Literacy",
    authors: "Serene Rock",
    primarySubject: "Information Literacy",
    additionalSubjects: "Fitness / Nutrition",
    institution: "Scottsdale Community College",
    bookInfo: null,
    abstract:
      "Serene Rock is a librarian at Scottsdale Community College Library, involved in information literacy instruction.",
    license: null,
    publishDate: null,
    lastUpdated: null,
    sourceUrl:
      "https://lor.instructure.com/resources/19c8fb8cea1545afaa3aefcb5c43fa5e?shared",
  },
];

export const RESOURCES = RAW.map((r) => ({
  ...r,
  id: slugify(r.title),
  authorList: splitList(r.authors),
  additionalSubjectList: splitList(r.additionalSubjects),
  materialKind: materialKind(r.bookInfo),
  platform: platformFromUrl(r.sourceUrl),
  year: leadYear(r.publishDate, r.lastUpdated),
  status: "peer_reviewed",
  statusLabel: statusLabelFor("peer_reviewed"),
  rubricReviews: buildRealRubricReviews(REAL_RUBRIC_ASSIGNMENTS[r.title] || []),
}));

// A single illustrative record — every field populated, including a full
// per-rubric peer-review history — so the ResourceCard and ResourceDetail
// layouts can be seen in their fully-populated state. None of the sheet's
// real entries have this level of detail yet (see RAW above), so this is
// clearly marked `isExample: true` rather than presented as a live catalog
// record. The DOI uses CrossRef's reserved 10.5555 test prefix (never
// resolves); reviewReportUrl values use example.com, the IANA-reserved
// documentation domain (RFC 2606, never resolves) — both intentionally
// non-resolving placeholders, not real links.
const EXAMPLE_RAW = {
  title: "Introductory Statistics with Applications",
  authors: "Rachel Chen; Ngozi Okafor",
  primarySubject: "Mathematics",
  additionalSubjects: "Statistics",
  institution: "Metro State University",
  bookInfo: "Textbook",
  abstract:
    "This calculus-optional first course in statistics covers descriptive statistics, probability, sampling distributions, estimation, and hypothesis testing. Each chapter builds from a real question drawn from public-health, education, or social-science data, so students meet inference as a tool for answering questions rather than as a set of formulas.\n\nThe second edition adds a reproducible-analysis appendix, expanded exercises on study design, and accessibility improvements to every figure. It is suitable for a one-semester general-education or service course, and pairs with openly licensed companion datasets and a slide deck.",
  license: "CC BY 4.0",
  publishDate: "2020 (original upload); 2nd edition March 2026",
  lastUpdated: "14 March 2026",
  sourceUrl: "https://openstax.org/",
  doi: "10.5555/oer.example.0001",
};

// Reviewer comment text below is a PLACEHOLDER pending a real example from
// the product owner — do not treat as final copy.
const PENDING_COMMENT = "Pending — awaiting a real reviewer-comment example from the product owner.";

export const EXAMPLE_RESOURCE = {
  ...EXAMPLE_RAW,
  id: "example-" + slugify(EXAMPLE_RAW.title),
  authorList: splitList(EXAMPLE_RAW.authors),
  additionalSubjectList: splitList(EXAMPLE_RAW.additionalSubjects),
  materialKind: materialKind(EXAMPLE_RAW.bookInfo),
  platform: platformFromUrl(EXAMPLE_RAW.sourceUrl),
  year: leadYear(EXAMPLE_RAW.publishDate, EXAMPLE_RAW.lastUpdated),
  isExample: true,
  // OER-level fact: the resource itself was revised/republished. Per the
  // Section 8 aggregation rule, this alone is enough to roll the OER-level
  // status up to "Peer Reviewed · Revised" regardless of any single
  // rubric's own stage.
  revisedResourceUrl: "https://openstax.org/details/books/introductory-statistics-2e-v2",
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
      reviewReportUrl: "https://example.com/o4pr/reviews/example-intro-statistics/accessibility",
      timeline: [
        { text: "Author revised & re-published V2", date: "2026-03-14", tone: "success" },
        { text: "Monica Xu and Thoughtful Fig reviews on V1 responded by Author", date: "2026-01-22", tone: "warning" },
        { text: "V1 review completed by Monica Xu", date: "2025-12-27", tone: "info" },
        { text: "V1 review completed by Thoughtful Fig", date: "2025-12-25", tone: "info" },
        { text: "V1 review started by Thoughtful Fig", date: "2025-11-16", tone: "info" },
        { text: "V1 review started by Monica Xu", date: "2025-11-12", tone: "info" },
        { text: "V1 request review by Author", date: "2025-11-02", tone: "error" },
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
      reviewReportUrl: "https://example.com/o4pr/reviews/example-intro-statistics/elearning",
      timeline: [
        { text: "Author revised & re-published V2", date: "2026-03-14", tone: "success" },
        { text: "Constructive Kiwi review on V1 responded by Author", date: "2026-01-22", tone: "warning" },
        { text: "V1 review completed by Constructive Kiwi", date: "2025-12-30", tone: "info" },
        { text: "V1 review started by Constructive Kiwi", date: "2025-11-16", tone: "info" },
        { text: "V1 request review by Author", date: "2025-11-02", tone: "error" },
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
              comment: PENDING_COMMENT,
            },
            {
              label: "College-Level Appropriateness and Cognitive Demand",
              standardDescription:
                "Demonstrates appropriate intellectual complexity for college students; encourages critical thinking with suitable cognitive demand for the discipline.",
              rating: "exemplify",
              comment: PENDING_COMMENT,
            },
          ],
        },
      ],
      reviewReportUrl: "https://example.com/o4pr/reviews/example-intro-statistics/disciplinary-appropriateness",
      timeline: [
        { text: "Author responded to review", date: "2026-01-22", tone: "warning" },
        { text: "Disciplinary Appropriateness review completed by Liam Bergström", date: "2025-11-09", tone: "info" },
        { text: "V1 request review by Author", date: "2025-10-20", tone: "error" },
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
              comment: PENDING_COMMENT,
            },
            {
              label: "Attribution Practices",
              standardDescription:
                "Proper attribution is provided for all third-party content, including creator, title, source, license type, and any modifications made.",
              rating: "exceed",
              comment: PENDING_COMMENT,
            },
          ],
        },
      ],
      reviewReportUrl: "https://example.com/o4pr/reviews/example-intro-statistics/copyright",
      timeline: [{ text: "Copyright review completed by Samuel Okonkwo", date: "2025-11-15", tone: "info" }],
      // No authorResponse/authorRevision — nothing to respond to yet.
    },
  ],
};

export function getResourceById(id) {
  if (id === EXAMPLE_RESOURCE.id) return EXAMPLE_RESOURCE;
  return RESOURCES.find((r) => r.id === id) || null;
}

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

// Order matches the Figma sidebar (Discipline → Rubric → Material type →
// Institution → Status → Language); Licence/Platform/Target learner have no
// Figma-visible slot so they're kept (real data shouldn't be dropped) but
// appended after the Figma-confirmed groups.
export const FACET_GROUPS = [
  { key: "primarySubject", label: "Discipline", options: facetOptions(RESOURCES, "primarySubject") },
  {
    key: "rubric",
    label: "Rubric",
    options: CANONICAL_RUBRICS.map((label) => ({
      label,
      count: RESOURCES.filter((r) => r.rubricReviews.some((rr) => rr.rubric === label)).length,
    })),
  },
  {
    key: "materialKind",
    label: "Material type",
    options: facetOptions(RESOURCES, "materialKind", CANONICAL_MATERIAL_KINDS),
  },
  {
    key: "institution",
    label: "Institution",
    options: facetOptions(RESOURCES, "institution", PARTNER_INSTITUTIONS_WITH_NO_OER_YET),
  },
  {
    key: "statusLabel",
    label: "Status",
    options: CANONICAL_STATUSES.map(({ key, label }) => ({
      label,
      count: RESOURCES.filter((r) => r.status === key).length,
    })),
  },
  // Language and Target learner are part of the project's metadata map, but
  // the source spreadsheet has no such columns — every resource is honestly
  // "Not specified" rather than a guessed value.
  { key: "language", label: "Language", options: facetOptions(RESOURCES, "language") },
  { key: "license", label: "Licence", options: facetOptions(RESOURCES, "license", CANONICAL_LICENSES) },
  {
    key: "platform",
    label: "Platform",
    options: facetOptions(RESOURCES, "platform", PARTNER_PLATFORMS_WITH_NO_OER_YET),
  },
  { key: "targetLearner", label: "Target learner", options: facetOptions(RESOURCES, "targetLearner") },
];

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
