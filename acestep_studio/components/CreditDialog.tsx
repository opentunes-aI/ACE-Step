import { useState } from "react";
import { API_BASE } from "@/utils/api";
import { useCredits } from "@/hooks/useCredits";
import { X, CreditCard, Star, Zap, Crown } from "lucide-react";
import { supabase } from "@/utils/supabase";

type Pack = {
    id: string; // Stripe Price ID (simulated)
    name: string;
    credits: number;
    price: number;
    popular?: boolean;
    color: string;
    disabled?: boolean; // For Free Tier
};

const PACKS: Pack[] = [
    { id: "free", name: "Free Tier", credits: 50, price: 0, color: "from-gray-500 to-slate-500", disabled: true },
    { id: "price_basic", name: "Starter", credits: 500, price: 5, color: "from-blue-500 to-cyan-500" },
    { id: "price_creator", name: "Creator", credits: 1200, price: 10, popular: true, color: "from-purple-500 to-pink-500" },
    { id: "price_studio", name: "Studio", credits: 3000, price: 20, color: "from-amber-500 to-orange-500" },
];

export default function CreditDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { credits } = useCredits();
    const [loading, setLoading] = useState<string | null>(null);

    if (!isOpen) return null;

    async function handleBuy(pack: Pack) {
        if (pack.disabled) return;
        setLoading(pack.id);

        try {
            const user = await supabase?.auth.getUser();
            if (!user?.data?.user) {
                alert("Please log in first!");
                return;
            }

            const res = await fetch(`${API_BASE}/billing/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.data.user.id,
                    email: user.data.user.email,
                    price_id: pack.id
                })
            });

            if (!res.ok) throw new Error("Checkout Failed");

            const { url } = await res.json();
            window.location.href = url;

        } catch (e) {
            alert("Checkout Error: " + e);
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-[800px] h-[500px] bg-[#0c0c12] rounded-2xl border border-white/10 shadow-2xl flex relative overflow-hidden ring-1 ring-white/10">

                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20">
                    <X size={24} />
                </button>

                {/* Left Side: Pitch */}
                <div className="w-1/3 bg-white/5 border-r border-white/10 p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>

                    <div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                            <Crown className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Recharge Studio</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Generate professional tracks, unlock stems, and train custom LoRAs.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="p-1.5 bg-green-500/20 rounded-full text-green-400"><Zap size={14} /></div>
                            <span>5 Credits / Song</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="p-1.5 bg-blue-500/20 rounded-full text-blue-400"><Star size={14} /></div>
                            <span>Support the Devs</span>
                        </div>
                    </div>

                    <div className="mt-8 bg-black/40 p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Current Balance</div>
                        <div className="text-3xl font-mono font-bold text-white">{credits} ¢</div>
                    </div>
                </div>

                {/* Right Side: Packs */}
                <div className="flex-1 p-8 bg-black/20 flex flex-col justify-center gap-4">
                    <h3 className="text-lg font-bold text-white mb-2">Select a Pack</h3>

                    <div className="grid grid-cols-1 gap-3">
                        {PACKS.map(pack => (
                            <div
                                key={pack.id}
                                onClick={() => handleBuy(pack)}
                                className={`
                                    relative group p-4 rounded-xl border flex items-center justify-between transition-all duration-300
                                    ${pack.disabled
                                        ? 'bg-white/5 border-white/5 opacity-50 cursor-default'
                                        : pack.popular
                                            ? 'bg-gradient-to-r from-purple-900/40 to-black border-purple-500/50 shadow-lg shadow-purple-900/20 hover:border-purple-400 scale-[1.02] cursor-pointer'
                                            : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20 cursor-pointer'
                                    }
                                `}
                            >
                                {pack.popular && (
                                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-bold text-white shadow-lg">
                                        BEST VALUE
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${pack.color} flex items-center justify-center shadow-lg`}>
                                        <CreditCard className="text-white w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg">{pack.name}</div>
                                        <div className="text-xs text-gray-400 font-mono">{pack.credits} Credits</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-xl font-bold text-white">
                                        {pack.price === 0 ? "Free" : `$${pack.price}`}
                                    </div>

                                    {pack.disabled ? (
                                        <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                            Active
                                        </div>
                                    ) : (
                                        loading === pack.id ? (
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white text-white/50 group-hover:text-black transition-colors`}>
                                                →
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-center text-gray-600 mt-6">
                        Secure payment via Stripe. Credits never expire.
                    </p>
                </div>
            </div>
        </div>
    );
}
