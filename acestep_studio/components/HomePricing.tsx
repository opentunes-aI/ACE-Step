"use client";
import { Check } from "lucide-react";

const PLANS = [
    {
        name: "Starter",
        price: "$0",
        desc: "For hobbyists and experimenters.",
        features: ["500 Credits / Month", "Standard Quality Generation", "Public Profile", "Personal License"],
        cta: "Start Free",
        popular: false
    },
    {
        name: "Producer",
        price: "$19",
        desc: "For serious creators.",
        features: ["5,000 Credits / Month", "High Fidelity (48kHz)", "Stem Separation", "Commercial License", "Priority Generation"],
        cta: "Get Started",
        popular: true
    },
    {
        name: "Studio",
        price: "$49",
        desc: "For power users and labels.",
        features: ["Unlimited Generation", "Custom Fine-Tuning", "API Access", "White-label Sharing", "24/7 Support"],
        cta: "Contact Sales",
        popular: false
    }
];

export default function HomePricing() {
    return (
        <section id="pricing" className="py-24 bg-white/5 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400">Start for free, upgrade for power.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto align-start">
                    {PLANS.map((plan, i) => (
                        <div key={i} className={`relative p-8 rounded-3xl border flex flex-col ${plan.popular ? 'bg-white/10 border-purple-500/50 shadow-2xl shadow-purple-900/20' : 'bg-black/40 border-white/10'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-200">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className="ml-2 text-gray-400">/mo</span>
                                </div>
                                <p className="mt-4 text-sm text-gray-400 leading-relaxed">{plan.desc}</p>
                            </div>

                            <ul className="mb-8 space-y-4 flex-1">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-black hover:scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
