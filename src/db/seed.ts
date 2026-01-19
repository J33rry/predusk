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
            name: "Anil Kumar Meena",
            email: "anilm7017@gmail.com",
            summary:
                "Electrical Engineering student (AI/ML minor) building full-stack and cross-platform products. Focused on scalable systems, real-time apps, and polished user experiences.",
            education: [
                {
                    school: "National Institute of Technology Delhi",
                    degree: "Bachelor of Technology",
                    area: "Electrical Engineering (Minor in AI/ML)",
                    startYear: "2023",
                    endYear: "2027",
                },
                {
                    school: "Alwar Public School, Alwar",
                    degree: "Senior Secondary Education",
                    area: "Percentage: 84.6%",
                    startYear: "2021",
                    endYear: "2022",
                },
                {
                    school: "Royal Academy, Alwar",
                    degree: "Secondary Education",
                    area: "Percentage: 85.4%",
                    startYear: "2019",
                    endYear: "2020",
                },
            ],
            skills: [
                "C++",
                "Python",
                "JavaScript",
                "SQL",
                "Next.js",
                "React",
                "Tailwind CSS",
                "Material UI",
                "GSAP",
                "Node.js",
                "Express.js",
                "MongoDB",
                "HTML5",
                "CSS3",
                "REST APIs",
                "WebSockets",
                "React Native",
                "Git",
                "GitHub",
                "VS Code",
                "Vercel",
                "Render",
                "Cloudinary",
                "Supabase",
                "NeonDB",
                "Clerk",
                "Nodemailer",
                "Data Structures & Algorithms",
                "DBMS",
                "System Design (basic)",
            ],
            links: {
                github: "https://github.com/J33rry",
            },
        })
        .returning();

    console.log(`✅ Created profile for ${profile.name}`);

    // Insert projects
    const projectsData: schema.NewProject[] = [
        {
            profileId: profile.id,
            title: "Justoo Delivery Platform",
            description:
                "Architecting a cross-platform delivery ecosystem within a monorepo. Built a unified Express.js API gateway serving mobile and web clients, with React Native apps and Next.js admin dashboards.",
            links: {},
            skills: [
                "React Native",
                "Next.js",
                "Express.js",
                "Drizzle ORM",
                "PostgreSQL",
            ],
        },
        {
            profileId: profile.id,
            title: "Social Platform for Coding Profiles",
            description:
                "Built a platform to aggregate and visualize coding profiles (GitHub, LeetCode, Codeforces). Implemented daily cron jobs for real-time sync from multiple APIs.",
            links: {},
            skills: ["Next.js", "Supabase", "CRON Jobs", "APIs"],
        },
        {
            profileId: profile.id,
            title: "DigiLocker for Digital Passwords",
            description:
                "Developed a secure UI for digital asset inheritance with robust auth (Clerk) and 2FA via Nodemailer. Focused on scalability and sensitive credential management UX.",
            links: {},
            skills: ["Next.js", "Supabase", "Clerk", "Nodemailer"],
        },
        {
            profileId: profile.id,
            title: "Fullstack Chat App",
            description:
                "Built a real-time chat app using WebSockets with secure user authentication. Deployed on Render with Cloudinary for asset hosting.",
            links: {},
            skills: [
                "React",
                "Node.js",
                "Express.js",
                "MongoDB",
                "WebSockets",
                "Cloudinary",
                "Render",
            ],
        },
        {
            profileId: profile.id,
            title: "Zentry & Rejoice Apps (UI/UX)",
            description:
                "Developed interactive, animated web experiences with GSAP and responsive UI design.",
            links: {},
            skills: ["React", "Tailwind CSS", "GSAP"],
        },
    ];

    await db.insert(schema.projects).values(projectsData);
    console.log(`✅ Created ${projectsData.length} projects`);

    // Insert work experiences
    const workData: schema.NewWorkExperience[] = [];

    if (workData.length > 0) {
        await db.insert(schema.workExperiences).values(workData);
        console.log(`✅ Created ${workData.length} work experiences`);
    } else {
        console.log("ℹ️ No work experiences to seed (skipped)");
    }

    console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
