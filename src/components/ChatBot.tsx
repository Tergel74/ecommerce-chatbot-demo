"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Call on initial render

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};

export default function ChatBot() {
    const { width } = useWindowSize();
    const isMobile = width < 768;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [sessionId, setSessionId] = useState<string>("");

    useEffect(() => {
        const storedSessionId = localStorage.getItem("chatSessionId");
        if (storedSessionId) {
            setSessionId(storedSessionId);
        } else {
            const newSessionId = uuidv4();
            localStorage.setItem("chatSessionId", newSessionId);
            setSessionId(newSessionId);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                chatContainerRef.current &&
                !chatContainerRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest("button[data-chat-toggle]")
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            content: inputMessage.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        const messageToSend = inputMessage.trim();
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const { data } = await axios.post(
                process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!,
                {
                    message: messageToSend,
                    sessionId: sessionId,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer || "direct",
                    page: window.location.pathname,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response:", data);

            const botResponse =
                data.output || "I apologize, I couldn't process that request.";

            const botMessage: Message = {
                content: botResponse,
                isUser: false,
                timestamp: new Date(),
            };

            await new Promise((resolve) => setTimeout(resolve, 500));
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = {
                content: "Sorry, there was an error processing your message.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const TypingAnimation = () => (
        <div className="flex space-x-2 items-center p-4 bg-gray-100 rounded-2xl max-w-[80%]">
            <div className="flex space-x-2">
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDuration: "0.8s" }}
                />
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{
                        animationDuration: "0.8s",
                        animationDelay: "0.2s",
                    }}
                />
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{
                        animationDuration: "0.8s",
                        animationDelay: "0.4s",
                    }}
                />
            </div>
        </div>
    );

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800 z-50"
                variant="default"
                data-chat-toggle="true"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatContainerRef}
                        initial={{ opacity: 0, y: isMobile ? "100%" : 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: isMobile ? "100%" : 100 }}
                        className={`fixed bg-white shadow-2xl border border-gray-100 z-50
                            ${
                                isMobile
                                    ? "inset-0 h-full w-full rounded-none"
                                    : "bottom-24 right-6 w-[380px] h-[600px] rounded-2xl"
                            }`}
                    >
                        <div className="flex flex-col h-full">
                            <div
                                className={`flex justify-between items-center border-b border-gray-100
                                ${isMobile ? "p-4" : "p-6"}`}
                            >
                                <div>
                                    <h3 className="font-bold text-xl">
                                        Classic Mode
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Fashion Assistant
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-gray-100 rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div
                                className={`flex-1 overflow-y-auto custom-scrollbar
                                ${isMobile ? "p-4" : "p-6"}`}
                            >
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <MessageCircle className="h-8 w-8 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">
                                                Welcome to Classic Mode
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                How can we assist you today?
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${
                                                    message.isUser
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-4 rounded-2xl ${
                                                        message.isUser
                                                            ? "bg-black text-white"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {message.content}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex justify-start"
                                            >
                                                <TypingAnimation />
                                            </motion.div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            <div
                                className={`border-t border-gray-100
                                ${isMobile ? "p-3" : "p-4"}`}
                            >
                                <form
                                    onSubmit={sendMessage}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        value={inputMessage}
                                        onChange={(e) =>
                                            setInputMessage(e.target.value)
                                        }
                                        placeholder="Type your message..."
                                        className="flex-1 rounded-full border-gray-200 focus:border-black focus:ring-black h-10"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="rounded-full w-10 h-10 p-0 bg-black hover:bg-gray-800 flex items-center justify-center shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
