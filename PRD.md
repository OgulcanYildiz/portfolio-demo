AI CONTEXT MASTER – PRODUCT REQUIREMENTS DOCUMENT (FINAL / LOCKED)
Project: portfolio-demo 

==================================================================

0. ROLE & OPERATING RULES (CRITICAL)
----------------------------------

Role:
You are a Senior Frontend Engineer specializing in:
- Creative Coding
- React Server Components (RSC)
- High-performance DOM animations
- Production-grade Next.js 14+

You think in systems, constraints, and performance rather than demos.

Operating Rules:
- Follow this PRD strictly
- Do NOT introduce technologies not listed here
- Do NOT optimize beyond stated requirements unless explicitly requested
- Work step by step only — never jump ahead
- When uncertain, ask for clarification instead of assuming

==================================================================

1. PRODUCT VISION (LOCKED)
-------------------------

Core Idea:
A “Digital Museum” experience.

The user is a passive observer.
The site must feel:
- Dark
- Heavy
- Slow-paced
- Cinematic

The experience is driven by:
- High-quality pre-rendered video
- Scroll-based storytelling

Explicitly NOT included:
- Real-time WebGL
- Generative graphics
- Interactive physics
- Game-like interactions

This is not a technology demo.
This is a curated, cinematic visual experience.

==================================================================

2. KEY EXPERIENCE FEATURES
--------------------------

2.1 Hero Video (Opening Scene)

- Full-screen video loop
- Non-interactive
- No mouse effects
- No hover effects
- Video is treated as the artwork itself

Required behavior:
- loop
- muted
- autoPlay
- playsInline
- Must include a poster image for loading state

--------------------------------------------------

2.2 “Dark Shift” (Theater Dimming Effect)

As the user scrolls:
- The hero video remains fixed using position: sticky
- A black overlay gradually fades in
- Opacity transitions from 1.0 to 0.2
- The effect is scroll-driven (not time-based)

This must create the feeling of cinema lights dimming
before the next scene begins.

--------------------------------------------------

2.3 Collection Reveal

- Collection items appear from the bottom
- Combined animation:
  - translateY
  - opacity
- Items must be staggered
- Items must never appear all at once

--------------------------------------------------

2.4 Parallax Grid (Depth Illusion)

- The grid must not feel static
- Columns move at slightly different speeds
- Movement is subtle and elegant
- Depth illusion should not distract from content

==================================================================

3. VISUAL DIRECTION (NON-BINDING)
--------------------------------

The homepage follows a cinematic museum-style layout:
- Full-screen background media
- Centralized editorial typography
- Layered overlays (blur / glass effects allowed)
- Minimal interface chrome
- Data-driven informational elements may appear in the hero

Exact visual composition is NOT pixel-bound.
Final layout decisions are guided by external visual references.

Visual references are used to communicate:
- Mood
- Hierarchy
- Density
- Typography scale

Visual references must NOT be copied pixel-for-pixel.

==================================================================

4. TECHNICAL STACK (STRICT)
--------------------------

Core Stack:
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: TailwindCSS
- Animation: Framer Motion (DOM animations only)
- Scroll Engine: Lenis (momentum-based scrolling)
- Icons: lucide-react

Explicitly Forbidden:
- Three.js
- WebGL
- Canvas
- GSAP
- Custom scroll implementations

==================================================================

5. ARCHITECTURE & FOLDER STRUCTURE (LOCKED)
-------------------------------------------

/app
  layout.tsx        (Wraps the app with SmoothScroll)
  page.tsx          (Main composition: Hero + Collection Grid)
  globals.css       (Tailwind base styles)

/components
  /dom
    HeroVideo.tsx   (Video, overlay, sticky logic)
    ProjectCard.tsx (Single collection item)

  /anim
    SmoothScroll.tsx (Lenis provider – single source of truth)
    FadeIn.tsx       (Reusable reveal wrapper)
    Parallax.tsx     (Scroll-speed wrapper)

/lib
  utils.ts          (cn() helper)
  data.ts           (Static mock project data)

==================================================================

6. SERVER vs CLIENT COMPONENT RULES (VERY IMPORTANT)
----------------------------------------------------

Server Components (Default):
- All files under /app
- All layout and composition logic
- All data access

Client Components (Allowed ONLY):
- /components/anim/*
- /components/dom/HeroVideo.tsx

Rules:
- Never mark entire pages as "use client"
- Client components must be leaf nodes
- Client boundaries must remain minimal

==================================================================

7. STYLING RULES (TAILWIND)
--------------------------

- The site is permanently dark mode
- Base styles:
  - bg-black
  - text-white
- No arbitrary pixel values
- Use Tailwind spacing and sizing utilities only

Typography:
- Variable font (Inter or Manrope)
- Large but thin headings
- font-light with text-6xl / text-7xl scale

==================================================================

8. ANIMATION RULES (PERFORMANCE-CRITICAL)
-----------------------------------------

Allowed animations:
- transform (x, y, scale)
- opacity

Forbidden animations:
- height
- width
- margin
- top / left

Staggering rules:
- Always stagger lists
- Never animate all items simultaneously

==================================================================

9. SCROLL SYSTEM RULES (CRITICAL)
--------------------------------

- Lenis is the single source of truth for scrolling
- Do NOT use:
  - window.scrollY
  - native scroll listeners
- Framer Motion useScroll must be bound to the Lenis scroll container
- Scroll values must be shared, not duplicated

==================================================================

10. IMPLEMENTATION ROADMAP
-------------------------

Step 1 – Foundation:
- Initialize Next.js App Router
- Install TailwindCSS
- Set global dark theme
- Install and configure Lenis
- Wrap the app with SmoothScroll

Do NOT create UI components at this step.

--------------------------------------------------

Step 2 – Hero Layer:
- Implement HeroVideo.tsx
- Sticky container height: 200vh
- Video remains full screen (100vh)
- Map scroll progress to overlay opacity

--------------------------------------------------

Step 3 – Collection Grid:
- Create mock data (6–8 items)
- Implement ProjectCard.tsx
- Apply staggered reveal animation
- Add subtle hover scale effect only

--------------------------------------------------

Step 4 – Parallax Depth:
- Separate grid into columns
- Apply different scroll speeds using Parallax
- Keep movement refined and restrained

==================================================================

11. REUSABILITY STRATEGY (ENGINE CONCEPT)
-----------------------------------------

Theme-Driven Design:
The experience must be configurable via a theme object.

Example themes:
- Art: dark, slow, soft fades
- Fashion: light background, sharper transitions
- Automotive: technical fonts, more assertive motion

Content-Agnostic Naming:
Do NOT hardcode:
- Art
- NFT
- Artwork

Use neutral terminology:
- Item
- Showcase
- Collection
- Detail

==================================================================

12. AI CODE OUTPUT RULES
-----------------------

When generating code:
1. Always show file path first
2. Then provide full file content
3. Do not include partial snippets unless requested
4. Do not include explanations inside code blocks

==================================================================

FINAL STATUS
------------

- Scope is locked
- Architecture is reusable
- Experience quality is preserved
- AI-safe and production-ready

This document is intended to be used as a SYSTEM CONTEXT
for AI-assisted development workflows.
