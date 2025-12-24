export interface Project {
    id: string;
    slug: string;
    title: string;
    category: string;
    year: string;
    thumbnail: string;
    description: string;
}

export const projects: Project[] = [
    {
        id: "01",
        slug: "ethereal-forms",
        title: "Ethereal Forms",
        category: "Collection",
        year: "2024",
        thumbnail: "https://picsum.photos/seed/01/600/800",
        description:
            "An exploration of weightless structures suspended in darkness. Forms emerge and dissolve, questioning the boundaries between presence and absence.",
    },
    {
        id: "02",
        slug: "silent-geometry",
        title: "Silent Geometry",
        category: "Showcase",
        year: "2024",
        thumbnail: "https://picsum.photos/seed/02/600/800",
        description:
            "Geometric compositions in muted tones. Each shape exists in quiet conversation with empty space, creating rhythms of visual silence.",
    },
    {
        id: "03",
        slug: "dark-matter",
        title: "Dark Matter",
        category: "Collection",
        year: "2023",
        thumbnail: "https://picsum.photos/seed/03/600/800",
        description:
            "Studies in the invisible. These works examine what lies between — the unseen forces that shape form without revealing themselves.",
    },
    {
        id: "04",
        slug: "void-symphony",
        title: "Void Symphony",
        category: "Detail",
        year: "2023",
        thumbnail: "https://picsum.photos/seed/04/600/800",
        description:
            "A meditation on emptiness as composition. The void becomes the primary instrument, orchestrating moments of visual resonance.",
    },
    {
        id: "05",
        slug: "obsidian-dreams",
        title: "Obsidian Dreams",
        category: "Showcase",
        year: "2023",
        thumbnail: "https://picsum.photos/seed/05/600/800",
        description:
            "Deep blacks and glinting edges. These pieces explore the reflective nature of darkness and the dreams that emerge from it.",
    },
    {
        id: "06",
        slug: "frozen-light",
        title: "Frozen Light",
        category: "Collection",
        year: "2022",
        thumbnail: "https://picsum.photos/seed/06/600/800",
        description:
            "Light captured in stillness. A study of luminescence suspended in time, where photons become sculpture.",
    },
    {
        id: "07",
        slug: "abstract-echoes",
        title: "Abstract Echoes",
        category: "Detail",
        year: "2022",
        thumbnail: "https://picsum.photos/seed/07/600/800",
        description:
            "Reverberations of form across space. Each echo slightly altered, creating visual conversations between iterations.",
    },
    {
        id: "08",
        slug: "temporal-shift",
        title: "Temporal Shift",
        category: "Collection",
        year: "2022",
        thumbnail: "https://picsum.photos/seed/08/600/800",
        description:
            "Time made visible. These works compress and expand temporal experience, revealing the elasticity of moments.",
    },
    {
        id: "09",
        slug: "neon-horizons",
        title: "Neon Horizons",
        category: "Showcase",
        year: "2021",
        thumbnail: "https://picsum.photos/seed/09/600/800",
        description:
            "A study of artificial light in natural spaces. Where the digital glow meets the organic dark.",
    },
    {
        id: "10",
        slug: "chrome-echo",
        title: "Chrome Echo",
        category: "Collection",
        year: "2021",
        thumbnail: "https://picsum.photos/seed/10/600/800",
        description:
            "Reflections upon reflections. An infinite regress of metallic surfaces exploring the concept of the self.",
    },
    {
        id: "11",
        slug: "liquid-metal",
        title: "Liquid Metal",
        category: "Detail",
        year: "2021",
        thumbnail: "https://picsum.photos/seed/11/600/800",
        description:
            "Fluid dynamics frozen in time. The moment of transition between solid and liquid states.",
    },
    {
        id: "12",
        slug: "digital-artifacts",
        title: "Digital Artifacts",
        category: "Showcase",
        year: "2020",
        thumbnail: "https://picsum.photos/seed/12/600/800",
        description:
            "Errors as aesthetic. Celebrating the glitch, the noise, and the unintended beauty of corruption.",
    },
    {
        id: "13",
        slug: "glass-constructs",
        title: "Glass Constructs",
        category: "Collection",
        year: "2020",
        thumbnail: "https://picsum.photos/seed/13/600/800",
        description:
            "Transparency and distortion. Viewing the world through manufactured lenses.",
    },
    {
        id: "14",
        slug: "prism-depth",
        title: "Prism Depth",
        category: "Detail",
        year: "2020",
        thumbnail: "https://picsum.photos/seed/14/600/800",
        description:
            "Refraction of light through complex geometries. Splitting white light into its emotional spectrum.",
    },
    {
        id: "15",
        slug: "velvet-void",
        title: "Velvet Void",
        category: "Showcase",
        year: "2019",
        thumbnail: "https://picsum.photos/seed/15/600/800",
        description:
            "Texture in the absence of light. A tactile exploration of absolute darkness.",
    },
    {
        id: "16",
        slug: "carbon-cycle",
        title: "Carbon Cycle",
        category: "Collection",
        year: "2019",
        thumbnail: "https://picsum.photos/seed/16/600/800",
        description:
            "From dust to structure and back again. The cyclical nature of form in a digital age.",
    },
];

// Helper to find project by slug
export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}
