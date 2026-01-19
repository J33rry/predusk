import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export interface ProfileLinks {
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  other?: string[];
}

export interface ProjectLinks {
  demo?: string | null;
  repo?: string | null;
  docs?: string | null;
  other?: string[];
}

export interface EducationEntry {
  school: string;
  degree?: string;
  area?: string;
  startYear?: string;
  endYear?: string;
}

export interface WorkHighlight {
  bullet: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  links: ProjectLinks;
  skills: string[];
  createdAt?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  summary?: string | null;
  highlights: WorkHighlight[];
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  summary?: string | null;
  education: EducationEntry[];
  skills: string[];
  links: ProfileLinks;
  projects: Project[];
  work: WorkExperience[];
  createdAt: string;
  updatedAt: string;
}

export interface TopSkill {
  skill: string;
  count: number;
}

export interface SearchResults {
  query: string;
  results: {
    profiles: Array<{
      id: string;
      name: string;
      email: string;
      summary?: string | null;
      skills: string[];
    }>;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      skills: string[];
    }>;
    work: Array<{
      id: string;
      role: string;
      company: string;
      summary?: string | null;
    }>;
  };
  counts: {
    profiles: number;
    projects: number;
    work: number;
    total: number;
  };
}

export async function fetchProfile(): Promise<Profile | null> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${BASE_URL}/api/profile`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export async function fetchProjects(skill?: string): Promise<{ projects: Project[]; count: number }> {
  try {
    const cookieStore = await cookies();
    const url = new URL(`${BASE_URL}/api/projects`);
    if (skill) url.searchParams.set("skill", skill);
    
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    if (!res.ok) return { projects: [], count: 0 };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { projects: [], count: 0 };
  }
}

export async function fetchTopSkills(): Promise<{ topSkills: TopSkill[]; totalUniqueSkills: number }> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${BASE_URL}/api/skills/top`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    if (!res.ok) return { topSkills: [], totalUniqueSkills: 0 };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch top skills:", error);
    return { topSkills: [], totalUniqueSkills: 0 };
  }
}

export async function searchContent(query: string): Promise<SearchResults | null> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to search:", error);
    return null;
  }
}
