export type Category =
  | "SEO"
  | "PPC"
  | "Social"
  | "Content"
  | "Email";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavData {
  logo: string;
  logoImage?: string;
  links: NavLink[];
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroData {
  title: string;
  role: string;
  subtitle: string;
  stats: HeroStat[];
  cta_primary: string;
  cta_secondary: string;
  image: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  achievements: string[];
}

export interface AboutData {
  headline: string;
  bio: string;
  philosophy: string;
  image: string;
  expertise: string[];
  experience: ExperienceItem[];
  certifications: string[];
  tools: string[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  price: string;
  image?: string;
  features: string[];
}

export interface CaseStudyMetric {
  label: string;
  value: string;
  before: string;
  after: string;
}

export interface ChartPoint {
  date: string;
  value: number;
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: Category;
  client: string;
  industry: string;
  challenge: string;
  strategy: string;
  results: {
    traffic_growth: string;
    conversion_rate: string;
    roi: string;
  };
  metrics: CaseStudyMetric[];
  chart_data: ChartPoint[];
  published_date: string;
  featured_image: string;
  executive_summary: string;
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    company: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_date: string;
  read_time: string;
  category: string;
  featured_image: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface SiteContent {
  nav: NavData;
  hero: HeroData;
  about: AboutData;
  services: ServiceItem[];
  portfolio: CaseStudy[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  contact: ContactData;
}
