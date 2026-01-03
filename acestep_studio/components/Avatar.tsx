import Image from 'next/image';
import { User } from 'lucide-react';

interface AvatarProps {
    url?: string | null;
    size?: number;
    alt?: string;
    className?: string;
}

export default function Avatar({ url, size = 40, alt = "Avatar", className = "" }: AvatarProps) {
    if (url && (url.startsWith('http') || url.startsWith('/'))) {
        return (
            <div
                className={`relative rounded-full overflow-hidden bg-gray-800 border border-white/10 ${className}`}
                style={{ width: size, height: size }}
            >
                <Image
                    src={url}
                    alt={alt}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={`flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold border border-white/10 ${className}`}
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {/* Fallback to Icon if no alt text for initials */}
            {alt && alt !== "Avatar" ? alt.charAt(0).toUpperCase() : <User size={size * 0.6} />}
        </div>
    );
}
