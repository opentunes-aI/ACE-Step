"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ControlPanel from "@/components/ControlPanel";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import ConsoleDrawer from "@/components/ConsoleDrawer";

export default function Home() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // When a job is created, we track it
  function handleJobCreated(id: string) {
    setActiveJobId(id);
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        {/* Header Bar could go here */}
        <WaveformVisualizer />
      </div>
      <ControlPanel onJobCreated={handleJobCreated} />

      {/* Drawer sits on top */}
      <ConsoleDrawer activeJobId={activeJobId} />
    </div>
  );
}
