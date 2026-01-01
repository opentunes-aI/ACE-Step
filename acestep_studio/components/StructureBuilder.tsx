"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronUp, ChevronDown, GripVertical } from "lucide-react";

interface Block {
    id: string;
    type: string;
    content: string;
}

interface StructureBuilderProps {
    value: string;
    onChange: (text: string) => void;
}

const SECTIONS = ["Verse", "Chorus", "Bridge", "Intro", "Outro", "Pre-Chorus", "Instrumental"];

export default function StructureBuilder({ value, onChange }: StructureBuilderProps) {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const isInternalUpdate = useRef(false);

    // Initial Parse
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        const parsed: Block[] = [];
        const regex = /\[(.*?)\]([^\[]*)/g;
        let match;
        let found = false;

        // Check for starting text without tag
        const firstBracket = value.indexOf('[');
        if (firstBracket > 0) {
            const content = value.substring(0, firstBracket).trim();
            if (content) parsed.push({ id: 'init', type: 'Intro', content });
        } else if (firstBracket === -1 && value.trim()) {
            parsed.push({ id: 'init', type: 'Verse', content: value.trim() });
        }

        while ((match = regex.exec(value)) !== null) {
            found = true;
            parsed.push({
                id: Math.random().toString(36).substr(2, 9),
                type: match[1], // e.g., 'verse'
                content: match[2].trim()
            });
        }

        if (parsed.length === 0 && !value.trim()) {
            setBlocks([]);
        } else if (parsed.length > 0) {
            setBlocks(parsed);
        }
    }, [value]);

    function updateParent(newBlocks: Block[]) {
        isInternalUpdate.current = true;
        const text = newBlocks.map(b => `[${b.type}]\n${b.content}`).join("\n\n");
        onChange(text);
    }

    function addBlock(type: string) {
        const newBlocks = [...blocks, { id: Math.random().toString(36).substr(2, 9), type, content: "" }];
        setBlocks(newBlocks);
        updateParent(newBlocks);
    }

    function removeBlock(index: number) {
        const newBlocks = [...blocks];
        newBlocks.splice(index, 1);
        setBlocks(newBlocks);
        updateParent(newBlocks);
    }

    function moveBlock(index: number, direction: -1 | 1) {
        if (index + direction < 0 || index + direction >= blocks.length) return;
        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        setBlocks(newBlocks);
        updateParent(newBlocks);
    }

    function updateContent(index: number, text: string) {
        const newBlocks = [...blocks];
        newBlocks[index].content = text;
        setBlocks(newBlocks);
        updateParent(newBlocks); // Sync on every keystroke might be heavy? React handles it fine.
    }

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {blocks.map((block, i) => (
                    <div key={block.id} className="bg-secondary/30 rounded border border-border p-2 group relative">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-1.5 rounded">{block.type}</span>
                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="p-1 hover:bg-background rounded disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                                <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="p-1 hover:bg-background rounded disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                                <button onClick={() => removeBlock(i)} className="p-1 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 rounded"><X className="w-3 h-3" /></button>
                            </div>
                        </div>
                        <textarea
                            className="w-full bg-background/50 border border-transparent hover:border-border focus:border-primary rounded text-xs p-2 resize-none h-16 transition-colors focus:outline-none"
                            value={block.content}
                            onChange={(e) => updateContent(i, e.target.value)}
                            placeholder="Lyrics..."
                        />
                    </div>
                ))}
                {blocks.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded opacity-50">
                        No blocks yet. Add one below.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-1 pt-2 border-t border-border">
                {SECTIONS.map(s => (
                    <button
                        key={s}
                        onClick={() => addBlock(s)}
                        className="text-[10px] bg-secondary hover:bg-primary hover:text-white transition-colors rounded py-1 px-1 truncate font-medium border border-transparent"
                    >
                        + {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
