"use client";
import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "model";
    content: string;
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "Hello! I'm the PNT Academy Assistant. How can I help you today with our robotics courses, labs, or internships?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen, messages, isLoading]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setIsError(false);
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: userMessage }]
                }),
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: "model", content: data.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setIsError(true);
            setMessages(prev => [...prev, {
                role: "model",
                content: "I'm having a bit of trouble connecting to my brain right now. 🧠✨\n\nFor immediate assistance with admissions, sales, or technical queries, please contact our team directly."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 right-0 z-[100] pointer-events-none">
            {/* Pulsing AI Bubble */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        onClick={toggleChat}
                        className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center pointer-events-auto transition-all group overflow-hidden border border-white/10"
                    >
                        <Bot className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform text-slate-300" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-4 right-4 w-[calc(100vw-32px)] h-[calc(100dvh-32px)] md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] pointer-events-auto flex flex-col z-20"
                    >
                        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 flex items-center justify-between text-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                        <Bot className="w-5 h-5 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-100">PNT Assistant</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={toggleChat} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-slate-50/50 dark:bg-slate-900/50">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "justify-start"}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-slate-700 text-white" : "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
                                            }`}>
                                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-slate-500" />}
                                        </div>
                                        <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === "user"
                                                ? "bg-slate-700 text-white rounded-tr-sm"
                                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700 shadow-sm"
                                            }`}>
                                            <div className="prose prose-sm dark:prose-invert prose-p:my-0.5 max-w-none">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>

                                            {/* Contact Sales Fallback UI */}
                                            {isError && i === messages.length - 1 && (
                                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                                                    <a
                                                        href="https://wa.me/919326014648"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center font-bold transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        Contact via WhatsApp
                                                    </a>
                                                    <a
                                                        href="/contact"
                                                        className="w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-center font-bold transition-colors"
                                                    >
                                                        Talk to Sales Team
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about PNT Academy..."
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-slate-500 transition-all dark:text-white"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-2 p-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-700 transition-all"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
