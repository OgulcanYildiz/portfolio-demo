export interface Project {
    id: string;
    title: string;
    category: string;
    year: string;
    thumbnail: string;
}

export const projects: Project[] = [
    {
        id: "01",
        title: "Ethereal Forms",
        category: "Collection",
        year: "2024",
        thumbnail: "/thumbnails/01.jpg",
    },
    {
        id: "02",
        title: "Silent Geometry",
        category: "Showcase",
        year: "2024",
        thumbnail: "/thumbnails/02.jpg",
    },
    {
        id: "03",
        title: "Dark Matter",
        category: "Collection",
        year: "2023",
        thumbnail: "/thumbnails/03.jpg",
    },
    {
        id: "04",
        title: "Void Symphony",
        category: "Detail",
        year: "2023",
        thumbnail: "/thumbnails/04.jpg",
    },
    {
        id: "05",
        title: "Obsidian Dreams",
        category: "Showcase",
        year: "2023",
        thumbnail: "/thumbnails/05.jpg",
    },
    {
        id: "06",
        title: "Frozen Light",
        category: "Collection",
        year: "2022",
        thumbnail: "/thumbnails/06.jpg",
    },
    {
        id: "07",
        title: "Abstract Echoes",
        category: "Detail",
        year: "2022",
        thumbnail: "/thumbnails/07.jpg",
    },
    {
        id: "08",
        title: "Temporal Shift",
        category: "Collection",
        year: "2022",
        thumbnail: "/thumbnails/08.jpg",
    },
];
