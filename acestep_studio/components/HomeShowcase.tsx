"use client";
import { Play } from "lucide-react";

const TRACKS = [
    { id: 1, title: "Midnight in Tokyo", artist: "@neo_jazz", genre: "Lofi Jazz", color: "from-pink-500 to-rose-500" },
    { id: 2, title: "Cyberpunk Chase", artist: "@runner_2049", genre: "Synthwave", color: "from-purple-500 to-indigo-500" },
    { id: 3, title: "Ethereal Dreams", artist: "@sky_walker", genre: "Ambient", color: "from-cyan-500 to-blue-500" },
    { id: 4, title: "Bass Heavy", artist: "@drop_king", genre: "Dubstep", color: "from-emerald-500 to-green-500" },
];

export default function HomeShowcase() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Made with Opentunes</h2>
                    <p className="text-gray-400">Listen to what our community is creating right now.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {TRACKS.map((track) => (
                        <div key={track.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-white/10 hover:border-white/30 transition-all">
                            {/* Gradient Placeholder for Art */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <h3 className="font-bold text-lg leading-tight mb-1">{track.title}</h3>
                                    <p className="text-xs text-gray-400 mb-4">{track.artist}</p>

                                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                                        <span className="text-[10px] uppercase tracking-wider font-bold bg-white/10 px-2 py-1 rounded text-white/70">{track.genre}</span>
                                        <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                                            <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest border-b border-purple-400/30 pb-1">
                        View Global Feed
                    </button>
                </div>
            </div>
        </section>
    );
}
