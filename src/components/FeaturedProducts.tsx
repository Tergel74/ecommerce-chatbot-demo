"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "./ui/card";

const products = [
    {
        id: 1,
        name: "Classic Blazer",
        price: "$189.99",
        image: "/public/images/blazer.jpg",
    },
    {
        id: 2,
        name: "Elegant Dress",
        price: "$159.99",
        image: "/images/dress.jpg",
    },
    {
        id: 3,
        name: "Tailored Pants",
        price: "$99.99",
        image: "/images/pants.jpg",
    },
    {
        id: 4,
        name: "Silk Blouse",
        price: "$129.99",
        image: "/images/blouse.jpg",
    },
    {
        id: 5,
        name: "Classic Coat",
        price: "$249.99",
        image: "/images/coat.jpg",
    },
    {
        id: 6,
        name: "Evening Gown",
        price: "$299.99",
        image: "/images/gown.jpg",
    },
];

export default function FeaturedProducts() {
    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover our carefully curated selection of timeless pieces
                    that blend classic elegance with modern sophistication.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-0 relative">
                                <div className="overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                            </CardContent>
                            <CardFooter className="p-4 bg-white">
                                <div className="w-full flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-900 font-medium">
                                        {product.price}
                                    </p>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
