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
        thumbnail: "/thumbnails/01.jpg",
        description:
            "An exploration of weightless structures suspended in darkness. Forms emerge and dissolve, questioning the boundaries between presence and absence.",
    },
    {
        id: "02",
        slug: "silent-geometry",
        title: "Silent Geometry",
        category: "Showcase",
        year: "2024",
        thumbnail: "/thumbnails/02.jpg",
        description:
            "Geometric compositions in muted tones. Each shape exists in quiet conversation with empty space, creating rhythms of visual silence.",
    },
    {
        id: "03",
        slug: "dark-matter",
        title: "Dark Matter",
        category: "Collection",
        year: "2023",
        thumbnail: "/thumbnails/03.jpg",
        description:
            "Studies in the invisible. These works examine what lies between — the unseen forces that shape form without revealing themselves.",
    },
    {
        id: "04",
        slug: "void-symphony",
        title: "Void Symphony",
        category: "Detail",
        year: "2023",
        thumbnail: "/thumbnails/04.jpg",
        description:
            "A meditation on emptiness as composition. The void becomes the primary instrument, orchestrating moments of visual resonance.",
    },
    {
        id: "05",
        slug: "obsidian-dreams",
        title: "Obsidian Dreams",
        category: "Showcase",
        year: "2023",
        thumbnail: "/thumbnails/05.jpg",
        description:
            "Deep blacks and glinting edges. These pieces explore the reflective nature of darkness and the dreams that emerge from it.",
    },
    {
        id: "06",
        slug: "frozen-light",
        title: "Frozen Light",
        category: "Collection",
        year: "2022",
        thumbnail: "/thumbnails/06.jpg",
        description:
            "Light captured in stillness. A study of luminescence suspended in time, where photons become sculpture.",
    },
    {
        id: "07",
        slug: "abstract-echoes",
        title: "Abstract Echoes",
        category: "Detail",
        year: "2022",
        thumbnail: "/thumbnails/07.jpg",
        description:
            "Reverberations of form across space. Each echo slightly altered, creating visual conversations between iterations.",
    },
    {
        id: "08",
        slug: "temporal-shift",
        title: "Temporal Shift",
        category: "Collection",
        year: "2022",
        thumbnail: "/thumbnails/08.jpg",
        description:
            "Time made visible. These works compress and expand temporal experience, revealing the elasticity of moments.",
    },
];

// Helper to find project by slug
export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}
