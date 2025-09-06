export const personal = {
  name: "Preetham Devulapally",
  role: "First Class BEng (Hons) Software Engineering Graduate",
  summary:
    "Software Engineering graduate from the University of Westminster with a strong foundation in full-stack development, cloud infrastructure, and real-time systems. Passionate about building scalable, impactful, and secure software across industries such as AI, defence, and critical infrastructure.",
  location: "London, UK",
  email: "preethamdevulapally@gmail.com",
  phone: "+44 7340 752163",
  linkedin: "https://linkedin.com/in/preethamdevulapally",
  resumeUrl: "resume/PreethamDevulapallyCV.pdf",
  profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/407336793_6833926710054844_1424313180351365942_n.jpg-rQyDcOudtZtxVEZqeJi8Mc7L8a1owU.jpeg"
};

export const skills = [
  { group: "Languages", items: ["JavaScript/TypeScript", "Python", "Java", "Kotlin"] },
  { group: "Frontend", items: ["React", "HTML5", "CSS3"] },
  { group: "Backend", items: ["Node.js", "Express.js", "REST APIs"] },
  { group: "Cloud & DevOps", items: ["AWS EC2", "AWS S3", "AWS Lambda", "Firebase (Auth + Firestore)", "GitHub Actions (CI/CD)", "Docker"] },
  { group: "Databases", items: ["Firestore", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis"] },
  { group: "Practices & Tools", items: ["Agile", "Git & GitHub", "OOP", "Maven", "VS Code", "NetBeans", "IntelliJ IDEA", "Postman"] }
];

export const projects = [
  {
    title: "Football Database App",
    period: "2024 — 2025",
    tagline: "Android application for browsing football leagues and clubs with local storage.",
    stack: ["Kotlin", "Jetpack Compose", "Room DB", "Android", "REST API"],
    highlights: [
      "Developed with Kotlin and Jetpack Compose for modern UI.",
      "Implemented Room database for offline data persistence.",
      "Integrated TheSportsDB API for comprehensive football data.",
      "Created intuitive search and filtering functionality."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/pdevulapally/Mobile-Application" }
    ],
    image: "/Images/FootballDBapp.png"
  },
  {
    title: "FakeVerifier",
    period: "2024 — 2025",
    tagline: "AI-powered news verification platform that detects fake news and provides real-time credibility scores.",
    stack: ["Next.js", "TypeScript", "Firebase", "OpenAI GPT-4", "Tailwind CSS", "Vercel"],
    highlights: [
      "Built comprehensive AI-powered fake news detection system with 99.2% accuracy rate.",
      "Implemented multi-tier AI model system with OpenRouter and OpenAI integration.",
      "Created real-time chat interface with advanced analytics and user authentication."
    ],
    links: [
      { label: "Live Demo", href: "https://www.fakeverifier.co.uk/" },
      { label: "GitHub", href: "https://github.com/pdevulapally/fakeverifier.co.uk" }
    ],
    image: "/Images/fakeverifier.png"
  },
  {
    title: "Westminster Shopping Manager",
    period: "2024",
    tagline: "Java Swing application for product management and checkout.",
    stack: ["Java", "Swing", "OOP", "MVC", "File Persistence"],
    highlights: [
      "Custom table model for dynamic listings and searches.",
      "Applied inheritance, encapsulation, and polymorphism."
    ],
    links: [],
    image: "/Images/westminstershoppingmanager.png"
  },
  {
    title: "Inventory Management System",
    period: "2023",
    tagline: "Stock management system with responsive UI and CRUD operations.",
    stack: ["Django", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    highlights: [
      "Designed relational schema and implemented full CRUD.",
      "Agile workflow via Trello and GitHub."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/pdevulapally/Software-Group-Project" }
    ],
    image: "/Images/Item List-2.jpg"
  },
  {
    title: "Python Progress Tracker",
    period: "2022",
    tagline: "CLI tool to predict student outcomes from input parameters.",
    stack: ["Python"],
    highlights: [
      "Hands‑on with control flow, data handling, and UX for CLI."
    ],
    links: [],
    image: "/Images/pythonprogresstracker.png"
  }
];

export const experience = [
  {
    title: "FANS Representative",
    org: "University of Westminster",
    period: "Sep 2023 — Oct 2023",
    bullets: [
      "Welcomed and supported new students and improved onboarding journeys.",
      "Helped them navigate university systems and resources."
    ]
  },
  {
    title: "Admin Assistant (Work Experience)",
    org: "PwC",
    period: "Jul 2021",
    bullets: [
      "Conducted tech research and delivered presentations.",
      "Early exposure to consulting mindset and stakeholder comms."
    ]
  },
  {
    title: "Student Union Representative",
    org: "University of Westminster",
    period: "Oct 2021 — Jun 2022",
    bullets: [
      "Collected and synthesised student feedback for programme improvements."
    ]
  },
  {
    title: "NCS Volunteer",
    org: "National Citizen Service",
    period: "Jul 2019 — Aug 2019",
    bullets: [
      "Contributed to a community initiative and presented outcomes."
    ]
  }
];

export const education = [
  {
    school: "University of Westminster",
    degree: "BEng (Hons) Software Engineering — First Class Honours",
    period: "2022 — 2025"
  },
  {
    school: "NewVic Sixth Form College",
    degree: "BTEC Level 3 IT — DDD",
    period: "2019 — 2022"
  },
  {
    school: "Eastlea Community School",
    degree: "GCSEs",
    period: "2015 — 2019"
  }
];

export const achievements = [
  "Graduated with First Class Honours in BEng (Hons) Software Engineering.",
  "Leadership & teamwork awards; Student Union roles.",
  {
    title: "FANS Representative",
    org: "University of Westminster",
    date: "Sep 2023 — Oct 2023",
    description: "Supported onboarding for new students and improved their first-month experience.",
    skills: ["Leadership", "Communication"],
    type: "award",
    endorsements: 12,
  }
];
