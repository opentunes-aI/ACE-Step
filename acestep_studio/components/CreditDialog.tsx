import { useState } from "react";
import { API_BASE } from "@/utils/api";
import { useCredits } from "@/hooks/useCredits";
import { X, CreditCard, Star, Zap, Crown, Repeat, PlusCircle } from "lucide-react";
import { supabase } from "@/utils/supabase";

type Pack = {
    id: string; // Stripe Price ID
    name: string;
    credits: number;
    price: number;
    popular?: boolean;
    color: string;
    disabled?: boolean;
    desc?: string;
};

const SUBSCRIPTIONS: Pack[] = [
    { id: "free", name: "Free Tier", credits: 50, price: 0, color: "from-gray-500 to-slate-500", disabled: true, desc: "One-time signup bonus" },
    { id: "price_starter_sub", name: "Starter", credits: 500, price: 5, color: "from-blue-500 to-cyan-500", desc: "Monthly credits" },
    { id: "price_creator_sub", name: "Creator", credits: 1200, price: 10, popular: true, color: "from-purple-500 to-pink-500", desc: "Unlock Pro features" },
    { id: "price_studio_sub", name: "Studio", credits: 3000, price: 20, color: "from-amber-500 to-orange-500", desc: "Max rendering power" },
];

const TOPUPS: Pack[] = [
    { id: "price_pack_500", name: "Refill 500", credits: 500, price: 5, color: "from-emerald-500 to-green-500", desc: "One-time top-up" },
    { id: "price_pack_1200", name: "Refill 1200", credits: 1200, price: 10, color: "from-emerald-600 to-teal-500", desc: "Best value refill" },
];

export default function CreditDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { credits } = useCredits();
    const [loading, setLoading] = useState<string | null>(null);
    const [mode, setMode] = useState<'subscription' | 'topup'>('subscription');

    const ITEMS = mode === 'subscription' ? SUBSCRIPTIONS : TOPUPS;

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
                    price_id: pack.id,
                    is_subscription: mode === 'subscription'
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
            <div className="w-[850px] h-[600px] bg-[#0c0c12] rounded-2xl border border-white/10 shadow-2xl flex relative overflow-hidden ring-1 ring-white/10">

                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20">
                    <X size={24} />
                </button>

                {/* Left Side: Pitch */}
                <div className="w-[300px] bg-white/5 border-r border-white/10 p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>

                    <div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                            <Crown className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Upgrade Studio</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {mode === 'subscription'
                                ? "Subscribe to save on credits and unlock professional features."
                                : "Running low? Top up your balance instantly."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="p-1.5 bg-green-500/20 rounded-full text-green-400"><Zap size={14} /></div>
                            <span>Instant Generation</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="p-1.5 bg-blue-500/20 rounded-full text-blue-400"><Star size={14} /></div>
                            <span>Commercial License</span>
                        </div>
                    </div>

                    <div className="mt-8 bg-black/40 p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Current Balance</div>
                        <div className="text-3xl font-mono font-bold text-white">{credits} ¢</div>
                    </div>
                </div>

                {/* Right Side: Packs */}
                <div className="flex-1 p-8 bg-black/20 flex flex-col gap-6">

                    {/* Toggle */}
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 self-center">
                        <button
                            onClick={() => setMode('subscription')}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mode === 'subscription' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Repeat size={14} /> Monthly Plans
                        </button>
                        <button
                            onClick={() => setMode('topup')}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mode === 'topup' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <PlusCircle size={14} /> Top Up
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {ITEMS.map(pack => (
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
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-white text-lg">{pack.name}</div>
                                            {pack.disabled && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400">Current</span>}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">
                                            {pack.credits} Credits • {pack.desc}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white">
                                            {pack.price === 0 ? "Free" : `$${pack.price}`}
                                            {mode === 'subscription' && pack.price > 0 && <span className="text-sm text-gray-500 font-normal">/mo</span>}
                                        </div>
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

                    <p className="text-xs text-center text-gray-600">
                        {mode === 'subscription' ? "Cancel anytime. Credits roll over." : "One-time payment. Credits never expire."}
                    </p>
                </div>
            </div>
        </div>
    );
}
