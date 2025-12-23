import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/data";
import DetailView from "@/components/dom/DetailView";

// Generate static params for all projects
export function generateStaticParams() {
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
    const project = getProjectBySlug(slug);

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
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return <DetailView project={project} />;
}
