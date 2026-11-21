import { Suspense } from "react";
import NotebookSidebar from "@/components/NotebookSidebar";
import { getTree } from "@/lib/notebook";

function SidebarFallback() {
    return (
        <aside className="hidden w-72 shrink-0 border-r border-navy-800 px-3 py-6 lg:block">
            <p className="mb-3 px-3 text-xs uppercase tracking-[0.3em] text-yellow-400">Notebook</p>
            <div className="space-y-2 px-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-5 animate-pulse rounded bg-navy-900" />
                ))}
            </div>
        </aside>
    );
}

export default function NotebookLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col bg-navy-950 text-white lg:flex-row">
            <Suspense fallback={<SidebarFallback />}>
                <NotebookSidebar tree={getTree()} />
            </Suspense>
            <div className="min-w-0 flex-1 px-6 py-10 lg:px-12">{children}</div>
        </div>
    );
}