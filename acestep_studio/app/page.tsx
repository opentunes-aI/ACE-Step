"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap, Bot, Coins, Waves, Globe } from "lucide-react";
import HomeShowcase from '@/components/HomeShowcase';
import HomePricing from '@/components/HomePricing';
import Footer from '@/components/Footer';

export default function LandingPage() {
    const [prompt, setPrompt] = useState("");
    const router = useRouter();

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        // Redirect to studio with prompt query param (to be handled by studio)
        const url = prompt ? `/studio?initialPrompt=${encodeURIComponent(prompt)}` : '/studio';
        router.push(url);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
            {/* Background Image */}
            {/* Aurora Background (CSS Only, Reliable & Premium) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/10 blur-[120px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 relative">
                            <Image src="/logo.png" alt="Opentunes Logo" fill className="object-contain rounded-lg" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Opentunes<span className="text-purple-500">.ai</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#showcase" className="hover:text-white transition-colors">Showcase</Link>
                        <Link href="/community" className="hover:text-white transition-colors">Community</Link>
                        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/studio" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href="/studio" className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-transform shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                            Launch Studio
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 pt-40 pb-0 px-6 container mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold mb-8 relative overflow-hidden group hover:scale-105 transition-transform backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-shimmer" />
                    <Sparkles className="w-4 h-4 text-purple-400 relative z-10" />
                    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200 tracking-wide">
                        The Future of Decentralized Music Creation
                    </span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black font-heading tracking-tight mb-8 leading-tight drop-shadow-2xl">
                    Your Agentic <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 animate-gradient-x">AI Music Studio</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                    Direct a team of AI Agents to compose, write, and produce.
                    <br className="hidden md:block" />
                    Then <strong>Mint on Chain</strong> to own your royalties forever.
                </p>

                {/* Interactive Input */}
                <form onSubmit={handleStart} className="max-w-xl mx-auto mb-24 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative flex items-center bg-black rounded-full border border-white/10 p-2 shadow-2xl">
                        <input
                            type="text"
                            placeholder="Describe your dream track (e.g., 'Chill lofi beat with rain sounds')"
                            className="flex-1 bg-transparent border-none outline-none text-white px-6 py-3 placeholder:text-gray-600"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button type="submit" className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                {/* Feature Grid */}
                <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto text-left mb-20 pointer-events-none">
                    {/* Card 1: Agents */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group pointer-events-auto backdrop-blur-md">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold font-heading mb-3 text-white">Agentic Co-Creation</h3>
                        <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                            Don't just prompt. Direct a team of specialized agents:
                            <span className="text-purple-300 font-semibold"> The Producer</span>,
                            <span className="text-cyan-300 font-semibold"> The Lyricist</span>.
                        </p>
                    </div>

                    {/* Card 2: Web3 */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group pointer-events-auto backdrop-blur-md">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                            <Coins className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold font-heading mb-3 text-white">On-Chain Ownership</h3>
                        <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                            Stop renting your creativity. Mint your AI generated tracks as NFTs to
                            enable instant monetization.
                        </p>
                    </div>

                    {/* Card 3: Quality */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group pointer-events-auto backdrop-blur-md">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                            <Waves className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold font-heading mb-3 text-white">Studio Fidelity</h3>
                        <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                            Powered by Our Advanced AI Music Gen Engine. Generate 48kHz stereo mastery with
                            granular control.
                        </p>
                    </div>

                    {/* Card 4: Community */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group pointer-events-auto backdrop-blur-md">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold font-heading mb-3 text-white">Community Showcase</h3>
                        <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                            Discover trending tracks, remix community hits, and collaborate with producers
                            worldwide.
                        </p>
                    </div>
                </div>

                {/* New Components */}
                <div id="showcase" className="scroll-mt-24 mb-20">
                    <HomeShowcase />
                </div>
                <HomePricing />

            </main>


            {/* Footer */}
            <Footer />
        </div>
    );
}
