import HeroVideo from "@/components/dom/HeroVideo";
import CollectionGrid from "@/components/dom/CollectionGrid";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <HeroVideo />
      <CollectionGrid />
    </main>
  );
}
