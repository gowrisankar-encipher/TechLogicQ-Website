import {
  BookOpen,
  BriefcaseBusiness,
  Brain,
  Cloud,
  Code2,
  Compass,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  GraduationCap,
  Hammer,
  Handshake,
  Layers,
  LayoutTemplate,
  Lightbulb,
  MonitorSmartphone,
  RefreshCw,
  Rocket,
  Server,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
};

export const coreOfferings: Feature[] = [
  {
    icon: Code2,
    title: "Technical Skills & Development Training",
    description: "Build practical technical skills through structured, hands-on learning.",
    href: "/training",
  },
  {
    icon: Globe,
    title: "Web Development Services",
    description: "Build modern, responsive and scalable websites and web applications.",
    href: "/services",
  },
  {
    icon: GraduationCap,
    title: "Academy & Career-Focused Learning",
    description: "Learn industry-relevant technologies through practical projects.",
    href: "/training", // was /academy (Academy page hidden for now)
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate Hiring & Job Updates",
    description: "Discover career opportunities, hiring updates and industry openings.",
    href: "/careers",
  },
];

export const philosophySteps: Feature[] = [
  { icon: BookOpen, title: "Learn", description: "Gain new technical and professional skills." },
  { icon: Hammer, title: "Build", description: "Apply your knowledge through real-world projects." },
  { icon: TrendingUp, title: "Grow", description: "Turn your skills into career opportunities." },
];

export const whyPoints: Feature[] = [
  {
    icon: Wrench,
    title: "Practical learning",
    description: "Sessions centre on writing code and solving problems, not just theory.",
  },
  {
    icon: Rocket,
    title: "Real-world projects",
    description: "Put each concept to work in projects modelled on everyday industry tasks.",
  },
  {
    icon: Layers,
    title: "Industry-oriented technologies",
    description: "Work with tools and frameworks that teams use in production today.",
  },
  {
    icon: Target,
    title: "Career-focused approach",
    description: "Learning paths are shaped around the skills entry-level roles ask for.",
  },
  {
    icon: UserRound,
    title: "Mentor guidance",
    description: "Get guidance and feedback as you learn, build and review your work.",
  },
  {
    icon: RefreshCw,
    title: "Continuous learning",
    description: "Keep up with a field that changes quickly through ongoing learning.",
  },
  {
    icon: Sparkles,
    title: "Professional development",
    description: "Build the communication and workplace habits that go with technical skill.",
  },
];

export const aboutFocus: Feature[] = [
  {
    icon: Code2,
    title: "Industry-ready technical skills",
    description: "Skills that match what technology teams work with day to day.",
  },
  {
    icon: Hammer,
    title: "Practical project experience",
    description: "Hands-on projects that turn concepts into working software.",
  },
  {
    icon: Compass,
    title: "Career-focused learning",
    description: "Learning paths designed with your first professional role in mind.",
  },
  {
    icon: Globe,
    title: "Web development",
    description: "Modern websites and web applications for businesses and individuals.",
  },
  {
    icon: TrendingUp,
    title: "Professional growth",
    description: "Support for the habits and skills that help careers move forward.",
  },
  {
    icon: Handshake,
    title: "Connecting graduates with opportunities",
    description: "Sharing job openings, internships and hiring updates as we find them.",
  },
];

export const values: Feature[] = [
  { icon: Wrench, title: "Practical Learning", description: "We learn by doing." },
  { icon: RefreshCw, title: "Continuous Improvement", description: "Every day is a chance to get better." },
  { icon: Lightbulb, title: "Innovation", description: "We stay curious about new ideas and tools." },
  { icon: TrendingUp, title: "Professional Growth", description: "Skills and mindset grow together." },
  { icon: Users, title: "Collaboration", description: "We build and learn as a team." },
  { icon: Target, title: "Career Readiness", description: "Preparing for the professional world." },
];

export type TechCategory = {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
};

export const techCategories: TechCategory[] = [
  {
    icon: FileCode2,
    title: "Programming",
    description: "Core languages and problem-solving fundamentals.",
    items: ["Java", "Python", "JavaScript", "TypeScript"],
  },
  {
    icon: Server,
    title: "Backend",
    description: "Server-side development and API design.",
    items: ["Spring Boot", "REST APIs", "Node.js"],
  },
  {
    icon: MonitorSmartphone,
    title: "Frontend",
    description: "Responsive, accessible user interfaces.",
    items: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
  },
  {
    icon: Database,
    title: "Database",
    description: "Relational and document data modelling and queries.",
    items: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Version control, containers and delivery pipelines.",
    items: ["AWS", "Docker", "Git", "CI/CD"],
  },
  {
    icon: Brain,
    title: "AI & Modern Technologies",
    description: "Building practical applications with modern AI.",
    items: ["Generative AI", "LLMs", "RAG", "AI Applications"],
  },
];

export type Course = {
  title: string;
  description: string;
  topics: string[];
  level: "Beginner" | "Intermediate" | "Beginner to Intermediate";
  duration: string;
};

// Durations are placeholders until the course schedule is finalised.
const DURATION_TBA = "[Duration TBA]";

export const courses: Course[] = [
  {
    title: "Java Backend Development",
    description: "Learn to build reliable server-side applications with Java.",
    topics: ["Core Java & OOP", "Collections & Streams", "JDBC", "REST APIs"],
    level: "Beginner to Intermediate",
    duration: DURATION_TBA,
  },
  {
    title: "Full Stack Development",
    description: "Connect frontend, backend and database into complete applications.",
    topics: ["React", "Node.js / Spring Boot", "Databases", "Deployment"],
    level: "Intermediate",
    duration: DURATION_TBA,
  },
  {
    title: "Web Development",
    description: "Create responsive, accessible websites from the ground up.",
    topics: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    level: "Beginner",
    duration: DURATION_TBA,
  },
  {
    title: "Database & SQL",
    description: "Design data models and write efficient queries.",
    topics: ["SQL Fundamentals", "Joins & Indexes", "MySQL / PostgreSQL", "MongoDB Basics"],
    level: "Beginner",
    duration: DURATION_TBA,
  },
  {
    title: "Spring Boot",
    description: "Build production-style REST services with Spring Boot.",
    topics: ["Spring Core", "Spring Data JPA", "REST Controllers", "Validation & Testing"],
    level: "Intermediate",
    duration: DURATION_TBA,
  },
  {
    title: "AI & Generative AI",
    description: "Understand LLMs and build practical AI-powered applications.",
    topics: ["Generative AI Basics", "Prompting", "RAG", "AI Application Design"],
    level: "Beginner to Intermediate",
    duration: DURATION_TBA,
  },
  {
    title: "Git & GitHub",
    description: "Version control and collaboration workflows used by real teams.",
    topics: ["Git Basics", "Branching & Merging", "Pull Requests", "GitHub Workflows"],
    level: "Beginner",
    duration: DURATION_TBA,
  },
  {
    title: "Cloud & DevOps",
    description: "Ship and run applications with modern cloud and DevOps tools.",
    topics: ["AWS Fundamentals", "Docker", "CI/CD Pipelines", "Monitoring Basics"],
    level: "Intermediate",
    duration: DURATION_TBA,
  },
];

export const services: Feature[] = [
  {
    icon: Globe,
    title: "Business Websites",
    description: "Professional websites that present your business clearly and build trust.",
  },
  {
    icon: UserRound,
    title: "Portfolio Websites",
    description: "Personal sites that showcase your work, skills and experience.",
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    description: "Focused, fast pages built for a single campaign, product or event.",
  },
  {
    icon: MonitorSmartphone,
    title: "Web Applications",
    description: "Interactive, responsive web apps built with modern frameworks.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Websites",
    description: "Online stores with product catalogues, carts and checkout flows.",
  },
  {
    icon: Server,
    title: "REST API Development",
    description: "Secure, well-structured APIs that power web and mobile apps.",
  },
  {
    icon: Wrench,
    title: "Website Maintenance",
    description: "Updates, fixes and improvements to keep your site running smoothly.",
  },
  {
    icon: GitBranch,
    title: "Custom Software Solutions",
    description: "Software tailored to the specific way your team works.",
  },
];
