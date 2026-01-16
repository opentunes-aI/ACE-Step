import GlobalLayout from "@/components/GlobalLayout";
import { Metadata } from "next";
import StudioGate from "@/components/StudioGate";

export const metadata: Metadata = {
    title: "Opentunes Studio",
    description: "AI Music Generation Platform",
};

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StudioGate>
            <GlobalLayout>
                {children}
            </GlobalLayout>
        </StudioGate>
    );
}
