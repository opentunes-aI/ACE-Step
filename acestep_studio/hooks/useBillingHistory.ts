import { useState, useEffect } from "react";
import { API_BASE } from "@/utils/api";
import { useStudioStore } from "@/utils/store";
import { supabase } from "@/utils/supabase";

type Transaction = {
    id: string;
    created_at: string;
    amount: number;
    reason: string;
    metadata: any;
};

export function useBillingHistory() {
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        setLoading(true);
        try {
            const user = await supabase?.auth.getUser();
            if (!user?.data?.user?.id) return;

            const res = await fetch(`${API_BASE}/billing/history/${user.data.user.id}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data.history || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return { history, loading, refresh: fetchHistory };
}
