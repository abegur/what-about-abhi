// ─────────────────────────────────────────────────────────────────────────────
// lib/data.ts
// Centralised content for every section of the site.
// ─────────────────────────────────────────────────────────────────────────────

// ── Experience ───────────────────────────────────────────────────────────────
export const experiences = [
  {
    id: 1,
    title: "Software Engineer II - Test",
    company: "Early Warning Services",
    period: "June 2025 – Present",
    location: "San Francisco, CA",
    description: "Working on Paze, Early Warning's digital checkout product. I build and maintain a Java-based automation framework, own end-to-end testing for new features, and partner with PMs on checkout optimizations and A/B tests. Recently designed a harness tool to fully automate our optimization release verifications, eliminating a recurring manual process.",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Software Engineer in Test",
    company: "Veeva Systems",
    period: "July 2021 – June 2025",
    location: "Remote / HQ in SF Bay Area",
    description: "Led automation efforts using Java, Cucumber, and Selenium, more than doubling test coverage, while leveraging Jenkins to keep the CI/CD pipeline healthy. Served as the go-to subject matter expert for the Clinical Transfers domain, leading API integrations across internal applications and jumping into design reviews to catch gaps before they became problems. Also built Python scripts to streamline internal workflows and demoed them to the whole department.",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Programmer",
    company: "LEEPS Lab",
    period: "November 2020 – June 2021",
    location: "Santa Cruz, CA",
    description: "Built and maintained full-stack architecture for multiplayer economics research experiments at UC Santa Cruz's LEEPS Lab. Wrote programs to parse and process data from market simulations, and collaborated with graduate researchers and faculty to develop experimental games using HTML5, JavaScript, CSS, and Python.",
    type: "Research",
  },
  {
    id: 4,
    title: "TA Grader",
    company: "UC Santa Cruz",
    period: "January 2021 – April 2021",
    location: "Santa Cruz, CA",
    description: "Helped grade assignments and exams for The Economics of Electronic Commerce, working alongside the professor and two PhD TAs to keep things running smoothly.",
    type: "Academic",
  },
  {
    id: 5,
    title: "Bachelors in Business Management Economics\nMinor in Computer Science",
    company: "University of California, Santa Cruz",
    period: "September 2017 – June 2021",
    location: "Santa Cruz, CA",
    description: "Recipient of the Dean's Honor Award (2017–2021).",
    type: "Education",
  },
];

// ── Skills ────────────────────────────────────────────────────────────────────
export const skills = {
  languages: ["Python", "Java", "SQL"],
  tools: [
    "Jira", "TestRail", "Jenkins", "IntelliJ", "Git", "VirtualBox",
    "Postman", "Selenium", "Cypress", "Figma", "Lucid Chart", "AWS", "Splunk",
  ],
  industryKnowledge: [
    "Agile Method", "Database Design", "Software Development Lifecycle",
    "User Experience (UX)", "API Testing",
  ],
};

// ── Projects ─────────────────────────────────────────────────────────────────
export const projects = [
  {
    id: 1,
    title: "what-about-abhi",
    year: "2025",
    description: "A personal portfolio built with AI: part learning experiment, part product showcase.",
    longDescription:
      "Built using Claude as an AI collaborator from the ground up, this portfolio is both the product and the proof of concept. It explores how AI can be leveraged to ship real, polished software, from design decisions to deployment. Want the full story behind it? Head over to the What Is This page.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Claude AI", "Vercel"],
    status: "Live",
    link: "/what-is-this",
  },
  {
    id: 2,
    title: "BrewMe",
    year: "2023",
    description: "A Yelp-style discovery platform for craft beer enthusiasts to explore and rate nearby breweries.",
    longDescription:
      "Designed and developed a full-stack web application that gives beer lovers a dedicated space to discover, review, and rate nearby breweries. Think Yelp, but built specifically for the craft beer community, with a cleaner experience and zero restaurant noise.",
    tags: ["JavaScript", "HTML", "CSS", "Node.js"],
    status: "Open Source",
    link: "https://github.com/abegur/BrewMe",
  },
  {
    id: 3,
    title: "NBA Forecast Model",
    year: "2021",
    description: "A data-mining pipeline and logistic regression model for predicting NBA game outcomes.",
    longDescription:
      "Designed and built from scratch a data-mining pipeline that pulls live data from the NBA API to train a logistic regression model for game predictions. Covers everything from raw data ingestion and feature engineering to model training and evaluation. A deep personal dive into sports analytics and machine learning.",
    tags: ["Python", "NBA API", "Logistic Regression", "Data Mining", "Machine Learning", "SQL"],
    status: "Open Source",
    link: "#",
  },
  {
    id: 4,
    title: "OTree Visual Markets",
    year: "2021",
    description: "An open-source research tool simulating continuous double auction markets with real-time visualizations.",
    longDescription:
      "Contributed to an open-source oTree application for the LEEPS Lab at UC Santa Cruz that simulates continuous double auction markets. Uses heatmaps, utility grids, and dynamic visualizations to display real-time market activity, built to support behavioral economics research.",
    tags: ["JavaScript", "Python", "oTree", "Data Visualization"],
    status: "Open Source",
    link: "https://github.com/Leeps-Lab/otree_visual_markets",
  },
];

// ── Hobbies ──────────────────────────────────────────────────────────────────
export const hobbies = [
  {
    id: 1,
    title: "Working Out & Being Outdoors",
    icon: "🏃",
    description:
      "Whether it's a gym session, a trail run, or just getting some fresh air, moving is a non-negotiable part of my day. Nothing clears the head quite like tired legs.",
  },
  {
    id: 2,
    title: "Bay Area Sports",
    icon: "🏈",
    description:
      "A loyal (and occasionally heartbroken) fan of the San Francisco 49ers and Golden State Warriors. Go Niners. Go Warriors. We don't talk about recent seasons.",
  },
  {
    id: 3,
    title: "Friends & Family",
    icon: "🤝",
    description:
      "I'm big on creating meaningful experiences with the people I care about. Good food, good conversation, good company. That's the whole thing right there.",
  },
  {
    id: 4,
    title: "Traveling",
    icon: "✈️",
    description:
      "Exploring new places and immersing myself in different cultures is something I genuinely love, and want to do a whole lot more of. Every trip teaches me something I didn't expect.",
  },
];

// ── Currently (home-page widget) ─────────────────────────────────────────────
export const currentlyItems = [
  { label: "Reading",   value: "Red Rising by Pierce Brown",  icon: "📖" },
  { label: "Building",  value: "This portfolio",             icon: "🛠️" },
  { label: "Watching",  value: "The Pitt (Season 2)",        icon: "📺" },
  { label: "Learning",  value: "Something new everyday",     icon: "🌱" },
  { label: "Location",  value: "San Francisco, CA",          icon: "📍" },
];

// ── Travel data ───────────────────────────────────────────────────────────────
// coords format: [latitude, longitude]
export const travelData = {
  visited: [
    { name: "USA",         coords: [ 37.0902,  -95.7129] as [number, number] },
    { name: "Canada",      coords: [ 56.1304, -106.3468] as [number, number] },
    { name: "Mexico",      coords: [ 23.6345, -102.5528] as [number, number] },
    { name: "Germany",     coords: [ 51.1657,   10.4515] as [number, number] },
    { name: "Spain",       coords: [ 40.4637,   -3.7492] as [number, number] },
    { name: "Italy",       coords: [ 41.8719,   12.5674] as [number, number] },
    { name: "India",       coords: [ 20.5937,   78.9629] as [number, number] },
    { name: "Singapore",   coords: [  1.3521,  103.8198] as [number, number] },
    { name: "Netherlands", coords: [ 52.1326,    5.2913] as [number, number] },
    { name: "Japan",       coords: [ 36.2048,  138.2529] as [number, number] },
  ],
  wishlist: [
    { name: "Egypt",     coords: [ 26.8206,   30.8025] as [number, number] },
    { name: "France",    coords: [ 46.2276,    2.2137] as [number, number] },
    { name: "Australia", coords: [-25.2744,  133.7751] as [number, number] },
    { name: "Peru",      coords: [  -9.1900,  -75.0152] as [number, number] },
    { name: "Iceland",  coords: [  64.9631,  -19.0208] as [number, number] },
    { name: "Maldives", coords: [   3.2028,   73.2207] as [number, number] },
  ],
};

// ── Fun fact (for the hidden easter egg button) ───────────────────────────────
export const funFacts = [
  "The first computer bug was an actual bug — a moth trapped in a relay at Harvard in 1947. 🐛",
  "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs. 🍯",
  "A group of flamingos is called a flamboyance. 🦩",
  "Octopuses have three hearts and blue blood. 🐙",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid. 🏛️",
  "The longest word you can type using only the top row of a keyboard is 'typewriter'. ⌨️",
];
