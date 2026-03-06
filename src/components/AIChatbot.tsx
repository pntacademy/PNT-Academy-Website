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
    const [messages] = useState<Message[]>([
        { role: "model", content: "### 🛠️ AI Under Maintenance\n\nI am currently undergoing a major upgrade to serve PNT Academy better! \n\nDuring this time, I won't be able to answer questions directly. \n\n**Need immediate help?**\n- 📞 Call us: +91 93260 14648\n- 📧 Email: contact@pntacademy.com\n- 📍 Visit our MIDC Dombivli center!" }
    ]);
    const [input, setInput] = useState("");
    const isMaintenance = true; // Set to true as requested

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen]);

    // Toggle the Chat Interface
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-0 right-0 z-[100] pointer-events-none">

            {/* Pulsing AI Bubble (Closed State) */}
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
                        <span className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* AI Chat Window (Open State) */}
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
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                            <span className="text-[10px] text-amber-500 uppercase font-bold tracking-wider">Under Maintenance</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleChat}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex gap-3 justify-start`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-slate-500" />
                                        </div>

                                        <div className="max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200/50 dark:border-slate-700/50">
                                            <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-1">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Box (Disabled during maintenance) */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Chat is currently disabled for upgrades.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
