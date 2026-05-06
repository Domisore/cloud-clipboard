import fs from 'fs';
import path from 'path';
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { DeveloperTabs } from './DeveloperTabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DevelopersPage() {
    // Read SKILL.md from the public folder (or skills/ if preferred)
    // The previous structure had it in public/skill.md
    const skillPath = path.join(process.cwd(), 'public', 'skill.md');
    let skillContent = '';
    
    try {
        if (fs.existsSync(skillPath)) {
            skillContent = fs.readFileSync(skillPath, 'utf8');
        } else {
            skillContent = "Error: Could not load skill.md file.";
        }
    } catch (e) {
        skillContent = "Error reading skill.md";
    }

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-foreground">
            <Header />

            <main className="flex-1 flex flex-col relative pt-32 pb-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground mb-12 transition-colors group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    BACK TO HOME
                </Link>

                <section className="mb-16">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-foreground">
                        Developer <span className="text-accent">Portal.</span>
                    </h1>
                    <p className="text-xl text-foreground-muted leading-relaxed max-w-3xl">
                        Technical specifications, API references, and native agent skills for the Drive.io persistence layer.
                    </p>
                </section>

                <DeveloperTabs skillContent={skillContent} />
            </main>

            <Footer />
        </div>
    );
}
