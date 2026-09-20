export const EXAMPLE_IDEAS = [
  {
    label: "Café stock tracker",
    idea: "An app that helps small restaurant owners track ingredient stock and reduce food waste by predicting reorder points from past usage.",
  },
  {
    label: "Freelance talent marketplace",
    idea: "A marketplace that matches freelance designers with early-stage startups for short, fixed-scope project sprints instead of open-ended contracts.",
  },
  {
    label: "Apartment community board",
    idea: "A hyperlocal app where residents of one apartment complex can share tools, request small favors, and post community updates.",
  },
];

// Static fixtures so the full UI (questions + result screens) can be
// previewed without a Groq API key — useful when you're checking layout
// and styling before wiring up the real API.
export const SAMPLE_IDEA = EXAMPLE_IDEAS[0].idea;

export const SAMPLE_QUESTIONS = [
  { id: "q1", question: "Which restaurants first — single location or small chains?" },
  { id: "q2", question: "What's the one metric that tells you this is working?" },
  { id: "q3", question: "Where does today's inventory data live, if anywhere?" },
  { id: "q4", question: "Mobile app, web dashboard, or both?" },
  { id: "q5", question: "Any hard constraint — budget, timeline, integration?" },
];

export const SAMPLE_PRD = {
  title: "Smart Reorder",
  oneLiner:
    "Predicts ingredient reorder points from past usage so small restaurants waste less food and never run out mid-service.",
  sections: [
    { id: "problem", title: "Problem statement", body: "Small restaurant owners track inventory by memory or a whiteboard, so they over-order perishables that get thrown out, or under-order and run out mid-service. There's no easy way to see usage patterns without hiring a full ops team." },
    { id: "goals", title: "Goals & success metrics", body: "Reduce reported food waste by 20% within 3 months of use.\nCut emergency same-day supplier orders by half.\nGet 100 restaurants actively logging stock weekly within the first quarter." },
    { id: "nongoals", title: "Non-goals", body: "This is not a full POS or accounting system, and it will not handle supplier payments or contracts in v1." },
    { id: "users", title: "Target users & personas", body: "Owner-operators of single-location restaurants who currently manage inventory on paper or spreadsheets, and have no dedicated ops staff." },
    { id: "stories", title: "User stories", body: "- As an owner, I want to log stock in under 2 minutes so I actually keep doing it.\n- As an owner, I want a reorder alert before I run out, so service isn't disrupted.\n- As an owner, I want to see which ingredients I waste most, so I can adjust portions or menu." },
    { id: "requirements", title: "Functional requirements", body: "- Quick-entry stock count screen, optimized for one-handed mobile use.\n- Automatic reorder-point calculation from rolling usage history.\n- Push alert when an ingredient crosses its reorder threshold.\n- Weekly waste summary by ingredient." },
    { id: "nfr", title: "Non-functional requirements", body: "- Stock entry must work offline and sync when back online (kitchens have poor wifi).\n- Page loads under 2 seconds on a 3-year-old Android phone." },
    { id: "scope", title: "Scope: MVP vs. later", body: "MVP: manual stock entry, reorder alerts, waste summary, single location.\nLater: POS integration for automatic usage tracking, multi-location roll-up, supplier ordering built in." },
    { id: "risks", title: "Risks & assumptions", body: "- Assumes owners will log stock consistently without a POS integration — may not hold.\n- Risk: reorder predictions are noisy with too little history; need a sensible cold-start default." },
    { id: "timeline", title: "Timeline & milestones", body: "- Weeks 1-2: stock entry + manual reorder thresholds.\n- Weeks 3-4: usage history + automatic threshold suggestions.\n- Weeks 5-6: alerts + waste summary, pilot with 5 restaurants." },
    { id: "open", title: "Open questions", body: "- Do we need barcode/scale integration for entry speed, or is manual counting acceptable for MVP?\n- Who owns onboarding for non-technical owners — in-app or human-assisted?" },
  ],
};

