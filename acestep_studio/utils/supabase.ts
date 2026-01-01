
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

import { getTrackMetadata } from "./api";

export async function syncTrackToCloud(filename: string) {
    if (!supabase) return;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const meta = await getTrackMetadata(filename);
        if (!meta) {
            console.warn("No metadata found for:", filename);
            return;
        }

        const { error } = await supabase.from('songs').insert({
            user_id: user.id,
            title: meta.prompt.substring(0, 50) || "Untitled",
            prompt: meta.prompt,
            lyrics: meta.lyrics,
            duration: meta.duration,
            seed: meta.seed || 0,
            local_filename: filename,
            status: 'completed',
            meta: meta
        });

        if (error) console.error("Cloud Sync Failed:", error);
        else console.log("Cloud Sync Success:", filename);
    } catch (e) {
        console.error("Sync Exception:", e);
    }
}
