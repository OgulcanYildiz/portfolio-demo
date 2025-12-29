import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DetailView from "@/components/dom/DetailView";

// Generate static params for all projects
export async function generateStaticParams() {
    const projects = await prisma.project.findMany({
        select: { slug: true },
    });
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

// Generate metadata for each project
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await prisma.project.findUnique({
        where: { slug },
    });

    if (!project) {
        return { title: "Not Found" };
    }

    return {
        title: `${project.title} — Portfolio`,
        description: project.description,
    };
}

export default async function WorkDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // In dev mode or for new projects not built statically, we fetch on demand
    const project = await prisma.project.findUnique({
        where: { slug },
    });

    if (!project) {
        notFound();
    }

    return <DetailView project={project} />;
}
