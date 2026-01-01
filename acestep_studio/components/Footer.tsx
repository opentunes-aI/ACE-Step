export default function Footer() {
    return (
        <footer className="h-8 border-t border-border bg-card flex items-center justify-between px-6 shrink-0 text-[10px] text-muted-foreground uppercase tracking-widest">
            <div>
                © 2024 Opentunes AI Inc.
            </div>
            <div className="flex gap-4">
                <a href="#" className="hover:text-foreground">Terms</a>
                <a href="#" className="hover:text-foreground">Privacy</a>
                <a href="#" className="hover:text-foreground">Status</a>
            </div>
        </footer>
    );
}
