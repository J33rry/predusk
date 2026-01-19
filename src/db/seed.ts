import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

async function seed() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is required");
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });

    console.log("🌱 Seeding database...");

    // Clear existing data
    await db.delete(schema.workExperiences);
    await db.delete(schema.projects);
    await db.delete(schema.profiles);

    // Insert profile for the candidate
    const [profile] = await db
        .insert(schema.profiles)
        .values({
            name: "Rajanti Mehra",
            email: "rajanti.mehra@example.com",
            summary:
                "Full-stack engineer with experience in building scalable web applications. Passionate about clean code, developer experience, and solving complex problems with elegant solutions.",
            education: [
                {
                    school: "Stanford University",
                    degree: "M.S.",
                    area: "Computer Science",
                    startYear: "2020",
                    endYear: "2022",
                },
                {
                    school: "University of California, Berkeley",
                    degree: "B.S.",
                    area: "Electrical Engineering & Computer Science",
                    startYear: "2016",
                    endYear: "2020",
                },
            ],
            skills: [
                "TypeScript",
                "JavaScript",
                "Python",
                "Go",
                "React",
                "Next.js",
                "Node.js",
                "PostgreSQL",
                "Redis",
                "Docker",
                "Kubernetes",
                "AWS",
                "GraphQL",
                "REST APIs",
                "CI/CD",
            ],
            links: {
                github: "https://github.com/rajantimehra",
                linkedin: "https://linkedin.com/in/rajantimehra",
                portfolio: "https://rajantimehra.dev",
            },
        })
        .returning();

    console.log(`✅ Created profile for ${profile.name}`);

    // Insert projects
    const projectsData: schema.NewProject[] = [
        {
            profileId: profile.id,
            title: "CloudSync",
            description:
                "A distributed file synchronization platform supporting real-time collaboration across multiple devices. Built with event-driven architecture and conflict resolution algorithms.",
            links: {
                repo: "https://github.com/rajantimehra/cloudsync",
                demo: "https://cloudsync.rajantimehra.dev",
            },
            skills: [
                "TypeScript",
                "Node.js",
                "PostgreSQL",
                "Redis",
                "WebSockets",
                "AWS S3",
            ],
        },
        {
            profileId: profile.id,
            title: "MLOps Pipeline",
            description:
                "End-to-end machine learning pipeline automating model training, evaluation, and deployment. Features experiment tracking, A/B testing infrastructure, and model versioning.",
            links: {
                repo: "https://github.com/rajantimehra/mlops-pipeline",
                docs: "https://mlops.rajantimehra.dev/docs",
            },
            skills: [
                "Python",
                "Docker",
                "Kubernetes",
                "MLflow",
                "FastAPI",
                "PostgreSQL",
            ],
        },
        {
            profileId: profile.id,
            title: "TaskFlow",
            description:
                "Kanban-style project management tool with drag-and-drop interface, real-time updates, and team collaboration features. Includes time tracking and analytics dashboard.",
            links: {
                repo: "https://github.com/rajantimehra/taskflow",
                demo: "https://taskflow.rajantimehra.dev",
            },
            skills: [
                "React",
                "Next.js",
                "TypeScript",
                "GraphQL",
                "PostgreSQL",
                "Prisma",
            ],
        },
        {
            profileId: profile.id,
            title: "API Gateway",
            description:
                "High-performance API gateway with rate limiting, authentication, request routing, and observability. Handles 10k+ RPS with sub-millisecond latency.",
            links: {
                repo: "https://github.com/rajantimehra/api-gateway",
            },
            skills: ["Go", "Redis", "Docker", "Prometheus", "Grafana"],
        },
        {
            profileId: profile.id,
            title: "DevPortfolio",
            description:
                "Personal portfolio site generator for developers. Parses resume/CV data and generates a modern, responsive portfolio with blog support.",
            links: {
                repo: "https://github.com/rajantimehra/devportfolio",
                demo: "https://rajantimehra.dev",
            },
            skills: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
        },
    ];

    await db.insert(schema.projects).values(projectsData);
    console.log(`✅ Created ${projectsData.length} projects`);

    // Insert work experiences
    const workData: schema.NewWorkExperience[] = [
        {
            profileId: profile.id,
            role: "Senior Software Engineer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            startDate: "2022-06",
            endDate: null,
            summary: "Leading backend development for core platform services.",
            highlights: [
                {
                    bullet: "Designed and implemented microservices architecture reducing latency by 40%",
                },
                {
                    bullet: "Led migration from monolith to event-driven architecture serving 2M+ daily users",
                },
                {
                    bullet: "Mentored 4 junior engineers and established code review best practices",
                },
            ],
        },
        {
            profileId: profile.id,
            role: "Software Engineer",
            company: "StartupXYZ",
            location: "Remote",
            startDate: "2020-08",
            endDate: "2022-05",
            summary: "Full-stack development for B2B SaaS platform.",
            highlights: [
                {
                    bullet: "Built real-time collaboration features using WebSockets and CRDTs",
                },
                {
                    bullet: "Implemented CI/CD pipeline reducing deployment time from hours to minutes",
                },
                {
                    bullet: "Developed REST API serving 500k+ requests daily with 99.9% uptime",
                },
            ],
        },
        {
            profileId: profile.id,
            role: "Software Engineering Intern",
            company: "BigTech Co.",
            location: "Mountain View, CA",
            startDate: "2019-06",
            endDate: "2019-08",
            summary: "Contributed to internal developer tools team.",
            highlights: [
                {
                    bullet: "Created automated testing framework adopted by 50+ engineering teams",
                },
                {
                    bullet: "Reduced test suite execution time by 60% through parallelization",
                },
            ],
        },
    ];

    await db.insert(schema.workExperiences).values(workData);
    console.log(`✅ Created ${workData.length} work experiences`);

    console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
