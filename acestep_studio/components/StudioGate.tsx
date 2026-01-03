"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import LoginCard from "./LoginCard";
import { Loader2 } from "lucide-react";

export default function StudioGate({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [localMode, setLocalMode] = useState(false); // Bypass for dev

    useEffect(() => {
        if (!supabase) {
            // No Supabase configured -> Show LoginCard with Local option
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Local Mode Bypass
    if (localMode) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-zinc-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-mono">Loading Studio...</span>
            </div>
        );
    }

    if (!user) {
        // Not logged in -> Show Login Card
        // Note: The LoginCard handles the "Guest Mode" logic if supabase is null
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-black">
                <LoginCard onLocalHack={() => setLocalMode(true)} />
            </div>
        );
    }

    // Logged in -> Show Studio
    return <>{children}</>;
}
