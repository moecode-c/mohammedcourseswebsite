"use client";

import { useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { Mail, Phone, Send } from "lucide-react";

interface ContactSectionProps {
    source: "tutorial" | "courses" | string;
    title?: string;
    subtitle?: string;
}

export function ContactSection({
    source,
    title = "CONTACT ME",
    subtitle = "Got a question or want to collaborate? Drop a message below.",
}: ContactSectionProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const validate = () => {
        if (name.trim().length < 2) {
            setErrorMessage("Name must be at least 2 characters.");
            return false;
        }
        const phoneRegex = /^[0-9+() -]{8,20}$/;
        if (!phoneRegex.test(phone.trim())) {
            setErrorMessage("Please enter a valid phone number.");
            return false;
        }
        if (message.trim().length < 5) {
            setErrorMessage("Message must be at least 5 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (!validate()) {
            setStatus("error");
            return;
        }

        setStatus("sending");
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, message, source }),
            });

            if (!res.ok) throw new Error("Failed to send");

            setName("");
            setPhone("");
            setMessage("");
            setStatus("sent");
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to send message. Please try again later.");
            setStatus("error");
        }
    };

    return (
        <section className="w-full bg-slate-900 py-24 border-y border-slate-800">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-heading text-white mb-4">{title}</h2>
                        <p className="text-slate-400 font-mono leading-relaxed">{subtitle}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded p-4">
                            <Phone className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-slate-500 font-mono uppercase">Phone</p>
                                <p className="text-slate-200 font-mono">01022138836</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded p-4">
                            <Mail className="w-5 h-5 text-secondary" />
                            <div>
                                <p className="text-xs text-slate-500 font-mono uppercase">Email</p>
                                <p className="text-slate-200 font-mono">mohammedessameldincs@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-start pt-4">
                        <img
                            src="/gifs/letter.gif"
                            alt="Letter"
                            className="w-48 h-48 md:w-64 md:h-64 object-contain animate-bounce-slow"
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase mb-2">Name</label>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                            placeholder="01022138836"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary min-h-[140px]"
                            placeholder="Write your message..."
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <GameButton type="submit" disabled={status === "sending"} className="px-8">
                            <Send className="w-4 h-4 mr-2" />
                            {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
                        </GameButton>
                        {status === "sent" && (
                            <span className="text-green-400 text-sm font-mono">Message sent successfully.</span>
                        )}
                        {status === "error" && (
                            <span className="text-red-400 text-sm font-mono">{errorMessage || "Please fill all fields correctly."}</span>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}
