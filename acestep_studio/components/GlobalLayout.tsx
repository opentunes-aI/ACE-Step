"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ConsoleDrawer from "@/components/ConsoleDrawer";
import FooterPlayer from "@/components/FooterPlayer";

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isStudio = pathname === "/";

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/30">
            <Header />

            <div className="flex-1 flex overflow-hidden relative">
                {/* Main Content Area */}
                {children}

                {/* Global Library Sidebar (Right Panel) */}
                <Sidebar />

                {/* Global Console (Overlay) */}
                <ConsoleDrawer />
            </div>

            {/* Global Audio Element for Persistence */}
            <audio id="global-audio" crossOrigin="anonymous" className="hidden" />

            {/* Persistent Player Bar (Visible on non-studio pages) */}
            {!isStudio && <FooterPlayer />}
        </div>
    );
}
