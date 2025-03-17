import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import ChatBot from "@/components/ChatBot";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Hero />
            <FeaturedProducts />
            <ChatBot />
        </main>
    );
}
