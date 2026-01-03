import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useStore } from './store';

export interface Profile {
    id: string;
    username: string | null;
    avatar_url: string | null;
    website: string | null;
    full_name: string | null;
}

export function useProfile() {
    const { session } = useStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            const { user } = session!;

            const { data, error, status } = await supabase!
                .from('profiles')
                .select(`*`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error loading user data!', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({ username, website, avatar_url }: Partial<Profile>) {
        try {
            setLoading(true);
            const { user } = session!;

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase!.from('profiles').upsert(updates);
            if (error) throw error;

            // Reload
            await getProfile();
            alert('Profile updated!');
        } catch (error: any) {
            alert('Error updating profile: ' + (error.message || error.error_description || JSON.stringify(error)));
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function uploadAvatar(file: File) {
        try {
            if (!session?.user) throw new Error('No user');

            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase!.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase!.storage.from('avatars').getPublicUrl(filePath);
            return data.publicUrl;

        } catch (error) {
            alert('Error uploading avatar!');
            console.error(error);
            return null;
        }
    }

    return { profile, loading, updateProfile, uploadAvatar };
}
