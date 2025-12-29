import HeroVideo from "@/components/dom/HeroVideo";
import CollectionGrid from "@/components/dom/CollectionGrid";
import Navigation from "@/components/dom/Navigation";
import FooterSocial from "@/components/dom/FooterSocial";
import { prisma } from "@/lib/prisma";

export default async function Home() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="bg-black text-white">
            <Navigation />
            <HeroVideo />
            <CollectionGrid projects={projects} />
            <FooterSocial />

        </main>
    );
}
