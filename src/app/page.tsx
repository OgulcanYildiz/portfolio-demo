import HeroVideo from "@/components/dom/HeroVideo";
import CollectionGrid from "@/components/dom/CollectionGrid";
import Navigation from "@/components/dom/Navigation";
import FooterSocial from "@/components/dom/FooterSocial";

export default function Home() {
    return (
        <main className="bg-black text-white">
            <Navigation />
            <HeroVideo />
            <FooterSocial />

        </main>
    );
}
