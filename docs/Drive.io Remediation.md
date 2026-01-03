You are an expert frontend UI/UX designer specializing in sleek, modern, minimalist interfaces for developer-focused productivity tools. Your task is to completely remediate and redesign the UI of https://drive.io — a functional "cloud clipboard" tool for instant, no-account text/image/file sharing across devices (similar to a privacy-focused Pastebin + ephemeral file sharing like file.io or PrivateBin, with features like burn-on-read, link generation, and cross-device paste).

### Current Site Issues (Based on January 2026 State)
- Highly dated, text-heavy, static layout with no modern polish.
- Prominent "DOMAIN FOR SALE" banner and Gmail contact — this must be completely removed.
- Rudimentary elements: Plain headings, basic paste zones ("Paste Text/Image (Ctrl+V)", "Drag or Click" upload), "Copy Link" button, "NO RECENT UPLOADS" section, minimal icons.
- Lacks responsiveness, animations, trust signals, and visual hierarchy.
- Overall feels abandoned and unprofessional.

### Design Goals
- Make it **sleek, modern, and ultra-minimalist** — prioritize function over flair, but with refined aesthetics.
- Primary audience: **No-nonsense developers and technical professionals** (think users of Raycast, Linear, Vercel, Warp terminal, or modern paste tools like Hastebin/PrivateBin/Pastes.io).
- Embrace **2026 minimalist trends**: Functional minimalism, generous whitespace, calm flow, subtle depth (light glassmorphism or borders), high readability, and performance-first feel.
- Default to **dark mode** (with easy light/dark toggle) — deep blacks/grays, low visual noise, subtle accents (e.g., teal or blue for actions).
- No gimmicks: Avoid heavy animations, bold colors, 3D effects, or playful elements. Focus on clarity, speed, and trust.

### Reference Styles and Examples
- **Raycast/Linear aesthetic**: Clean sans-serif typography, subtle shadows/borders for depth, centered/focused layout, minimal navigation, command-bar-like efficiency.
- **Modern dev paste tools**: Hastebin (ultra-simple editor-focused), PrivateBin (privacy-centric minimalism), Pastes.io/Snappify (clean syntax-aware interfaces with dark themes).
- **Trends**: Functional minimalism (everything serves a purpose), adaptive dark modes, modular components, generous whitespace, monospaced/code-friendly fonts for pastes, subtle microinteractions (e.g., smooth fade-ins, hover states).
- Visual inspiration: Sleek dark-mode productivity dashboards (e.g., from Muzli 2026 examples), with frosted-glass cards if needed, but keep it flat and fast-loading.

### Key Layout and Components to Redesign
1. **Hero/Header**:
   - Centered, bold tagline: "Drive.io — Instant Cloud Clipboard" + sub: "Copy on one device. Paste on another. No accounts. No apps."
   - Small elegant logo (stylized "D" or "drive.io" in monospaced/modern font).
   - Dark/light mode toggle (top-right, subtle icon).

2. **Main Interaction Area** (Core Focus — 70-80% of screen):
   - Large, centered editable zone: Full-width textarea or contenteditable div for text pasting (with syntax highlighting if code detected).
   - Seamless image/file preview on paste/upload.
   - Drag-and-drop overlay: Subtle "Drop files here or paste (Ctrl+V)" hint.
   - On paste/upload: Instantly generate shareable link + QR code, options panel (expiration, burn-on-read toggle, password protect).
   - "Generate Link" / "Copy Link" button — prominent but understated.

3. **Recent Uploads/History**:
   - Clean card grid or list below main area (collapsible if empty).
   - Show thumbnails/previews, expiration timers, copy/delete actions.

4. **Footer/Extras**:
   - Minimal: Privacy note ("End-to-end encrypted · No logs"), links to /how-it-works, GitHub if open-source.
   - No clutter — trust signals only.

### Technical/UX Guidelines
- **Typography**: Primary — Inter or system sans-serif; Code/text areas — JetBrains Mono or similar monospaced.
- **Colors**: Dark mode default (#0d1117 background like GitHub, #21262d cards); Accents: Subtle blue/teal (#58a6ff). Light mode: Clean whites/grays.
- **Spacing/Responsiveness**: Ample padding, fully mobile-responsive (stacked on small screens), PWA-ready feel.
- **Microinteractions**: Subtle (e.g., smooth transitions on link generation, hover glow on buttons, success toasts).
- **Accessibility**: High contrast, keyboard navigation (Ctrl+V focus), screen-reader friendly.
- **Performance**: Fast-loading, no heavy assets.

### Output Requirements
- Generate a complete modern HTML/CSS (Tailwind preferred) implementation or detailed Figma/mockup description.
- Provide before/after comparisons.
- Ensure the new UI feels professional, trustworthy, and instantly usable — like a tool serious devs would bookmark and rely on daily.

Redesign this to be the cleanest, most appealing cloud clipboard on the web in 2026.