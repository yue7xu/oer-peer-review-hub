/**
 * Distilled rubric panels for How It Works disclosure.
 * Source: `6 new rubric md/*.md` — compressed to summary / titles+gloss / philosophy note.
 */
export const RUBRIC_PANELS = [
  {
    id: "accessibility",
    label: "Accessibility",
    summary:
      "Accessibility makes sure every learner — whatever their ability, device, or setting — can perceive, navigate, and engage with the material. Because OER are shared, reused, and remixed widely, designing for access from the start keeps resources usable as they spread.",
    covers: [
      {
        title: "Text structure & screen-reader navigation",
        gloss: "Proper headings, lists, and reading order for assistive tech.",
      },
      {
        title: "Visual design & color",
        gloss: "Sufficient contrast; information never carried by color alone.",
      },
      {
        title: "Alternative text & images",
        gloss: "Descriptive alt text for informative images; decorative ones skipped.",
      },
      {
        title: "Multimedia",
        gloss: "Captions, transcripts, and keyboard-accessible players.",
      },
      {
        title: "Interactive elements & forms",
        gloss: "Keyboard-operable controls with clear labels and visible focus.",
      },
      {
        title: "Table structure & data",
        gloss: "Real data-table markup with headers, not tables for layout.",
      },
      {
        title: "Link quality & context",
        gloss: "Descriptive link text that makes sense out of context.",
      },
      {
        title: "Technical format & compatibility",
        gloss: "Works across devices and preserves accessibility features.",
      },
    ],
    note: "These criteria guide constructive, improvement-focused feedback. They complement formal accessibility checkers by focusing on how access is experienced by learners, not replace them.",
  },
  {
    id: "copy-editing",
    label: "Copy Editing",
    summary:
      "Copy editing keeps materials clear, consistent, and free of errors that distract or confuse learners. In OER, mistakes can travel with every reuse and remix, so careful editing protects both comprehension and credibility.",
    covers: [
      {
        title: "Grammar & syntax",
        gloss: "Sound sentence construction, agreement, and readable variety.",
      },
      {
        title: "Spelling & typographical accuracy",
        gloss: "Correct spelling of general, technical, and proper terms.",
      },
      {
        title: "Punctuation & mechanics",
        gloss: "Consistent punctuation, capitalization, and number style.",
      },
      {
        title: "Style guide consistency",
        gloss: "One recognized style applied uniformly across the resource.",
      },
      {
        title: "Internal consistency & usage",
        gloss: "Stable terminology, correct word choice, and parallel structure.",
      },
      {
        title: "Clarity & readability",
        gloss: "Concise prose suited to the audience, with jargon defined.",
      },
      {
        title: "Formatting & visual consistency",
        gloss: "Uniform headings, type, lists, and spacing throughout.",
      },
      {
        title: "Citations, references & attributions",
        gloss: "Accurate citations and properly formatted credit for borrowed work.",
      },
      {
        title: "Cross-references & navigational elements",
        gloss: "Working links and accurate internal references to figures and sections.",
      },
      {
        title: "Inclusive & accessible language",
        gloss: "Bias-aware wording that serves diverse and multilingual readers.",
      },
    ],
    note: "These criteria guide constructive, improvement-focused feedback. They complement formal editorial checks by focusing on how clarity is experienced by learners, not replace them.",
  },
  {
    id: "copyright",
    label: "Copyright",
    summary:
      "Copyright and licensing make sure materials can be legally used, adapted, and shared. Clear rights let educators adopt, revise, and redistribute OER with confidence instead of guessing at permissions.",
    covers: [
      {
        title: "Original content licensing",
        gloss: "An appropriate open license is stated clearly and applied consistently.",
      },
      {
        title: "Third-party content documentation",
        gloss: "Every incorporated element notes source and legal basis for inclusion.",
      },
      {
        title: "Attribution practices",
        gloss: "Required credit is complete, correctly placed, and verifiable.",
      },
      {
        title: "Fair use application & documentation",
        gloss: "Fair-use claims are justified, limited, and signaled for downstream users.",
      },
      {
        title: "License compatibility",
        gloss: "Combined licenses do not conflict; share-alike terms are honored.",
      },
      {
        title: "Public domain materials",
        gloss: "Public-domain status is accurate, explained, and distinct from open licenses.",
      },
      {
        title: "Copyright status communication",
        gloss: "Adopters can tell what they may reuse without specialized legal training.",
      },
      {
        title: "Permissions & documentation trail",
        gloss: "Explicit permissions are retained with scope, attribution, and limits.",
      },
    ],
    note: "These criteria guide constructive, improvement-focused feedback. They complement formal legal review by focusing on clarity and openness for everyday educators, not replace it.",
  },
  {
    id: "disciplinary",
    label: "Disciplinary Appropriateness",
    summary:
      "Disciplinary appropriateness checks that an OER matches the expectations, practices, and ways of knowing in its field. Accurate content, apt terminology, and relevant examples help faculty trust the resource in real courses.",
    covers: [
      {
        title: "Content accuracy & validity",
        gloss: "Facts are reliable, current, and suited to a college-level audience.",
      },
      {
        title: "Currency & contemporaneity",
        gloss: "Recent scholarship sits alongside foundational knowledge.",
      },
      {
        title: "Disciplinary completeness & coverage",
        gloss: "Core topics are covered with depth and clear conceptual links.",
      },
      {
        title: "Scholarly rigor & theoretical framework",
        gloss: "Analysis rests on sound methods and disciplinary theory.",
      },
      {
        title: "College-level appropriateness & cognitive demand",
        gloss: "Complexity supports critical thinking with enough scaffolding.",
      },
      {
        title: "Source quality & documentation",
        gloss: "Credible sources are cited to disciplinary standards.",
      },
      {
        title: "Assessment & practice quality",
        gloss: "Practice and assessment align with key concepts and vary in form.",
      },
    ],
    note: "These criteria guide constructive, improvement-focused feedback. They complement formal disciplinary review by focusing on how well the resource supports learning in the field, not replace it.",
  },
  {
    id: "elearning",
    label: "eLearning",
    summary:
      "eLearning design looks at how OER are structured to support learning — clear goals, usable navigation, and chances to practice. Strong design keeps accurate content usable across courses, modalities, and teaching approaches.",
    covers: [
      {
        title: "Usability & technical functionality",
        gloss: "Intuitive interface that works reliably across devices and browsers.",
      },
      {
        title: "Technical support & documentation",
        gloss: "Clear help, training, and reasonable support channels for users.",
      },
      {
        title: "Mobile & cross-platform access",
        gloss: "Core features stay available on phones, tablets, and desktops.",
      },
      {
        title: "LMS integration & interoperability",
        gloss: "Standard integration (e.g. LTI) without forcing separate student accounts.",
      },
      {
        title: "Data privacy, security & ownership",
        gloss: "Privacy policies, user ownership of work, and exportable data.",
      },
      {
        title: "Cost, sustainability & resources",
        gloss: "Transparent costs and tools that do not require exotic equipment.",
      },
      {
        title: "Accessibility",
        gloss: "Meets accessibility guidelines and works with assistive technology.",
      },
      {
        title: "Pedagogical effectiveness",
        gloss: "Features add real learning value, engagement, and timely feedback.",
      },
      {
        title: "Learning analytics & customization",
        gloss: "Instructors can interpret progress data and adapt the tool to their course.",
      },
    ],
    note: "These criteria guide constructive, improvement-focused feedback. They complement formal technical audits by focusing on how the learning experience holds up for instructors and students, not replace them.",
  },
  {
    id: "udl",
    label: "UDL",
    summary:
      "Universal Design for Learning builds flexibility so learners can access content, engage with it, and show what they know in more than one way. Because OER reach diverse populations and settings, UDL helps materials stay inclusive and adaptable.",
    covers: [
      {
        title: "Multiple options for representation",
        gloss: "Content offered in varied formats and sensory modes.",
      },
      {
        title: "Learner choice in expression",
        gloss: "Flexible ways to demonstrate understanding without changing the goal.",
      },
      {
        title: "Engagement, relevance & cultural responsiveness",
        gloss: "Real-world connection, meaningful choice, and authentic diversity.",
      },
      {
        title: "Transparent expectations & actionable feedback",
        gloss: "Clear goals, models, and formative feedback that support improvement.",
      },
      {
        title: "Collaboration, communication & community",
        gloss: "Options for solo and group work with equitable participation structures.",
      },
      {
        title: "Metacognition & self-regulation",
        gloss: "Support for goal-setting, reflection, and strategic learning.",
      },
      {
        title: "Equity, bias awareness & inclusive environments",
        gloss: "Design that reduces exclusion and makes space for multiple perspectives.",
      },
      {
        title: "OER-specific UDL considerations",
        gloss: "Open formats and licensing that enable adaptation for diverse needs.",
      },
    ],
    note: "These criteria guide constructive, improvement-focused feedback. They complement formal inclusion reviews by focusing on flexible design for diverse learners, not replace them.",
  },
];
