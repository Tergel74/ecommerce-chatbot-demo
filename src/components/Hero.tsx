"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="relative h-[90vh] flex items-center justify-center">
            <div className="absolute inset-0 z-0">
                {/* <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    src="/hero-image.jpg"
                    alt="Classic Mode Fashion"
                    className="w-full h-full object-cover"
                /> */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 text-center text-white"
            >
                <h1 className="text-6xl font-bold mb-4">Classic Mode</h1>
                <p className="text-xl mb-8">
                    Timeless Fashion for the Modern You
                </p>
                <Button
                    size="lg"
                    variant="secondary"
                    className="hover:scale-105 transition"
                >
                    Shop Now
                </Button>
            </motion.div>
        </section>
    );
}
