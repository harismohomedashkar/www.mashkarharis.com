"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NoteNode } from "@/lib/notebook";

const BASE = "/notebook";

function Leaf({ node, href, onNavigate }: { node: NoteNode; href: string; onNavigate?: () => void }) {
    const pathname = usePathname();
    const active = pathname.replace(/\/$/, "") === href;
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={`block rounded-md px-3 py-1.5 text-sm transition ${active
                ? "bg-navy-800 font-medium text-yellow-400"
                : "text-blue-100/70 hover:bg-navy-900 hover:text-white"
                }`}
        >
            {node.title}
        </Link>
    );
}

function Group({ node, href, onNavigate }: { node: NoteNode; href: string; onNavigate?: () => void }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(pathname.startsWith(href + "/"));
    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm text-blue-100/90 transition hover:bg-navy-900 hover:text-white"
            >
                <span
                    className={`flex w-4 shrink-0 justify-center text-base leading-none text-yellow-400 transition-transform ${open ? "rotate-90" : ""
                        }`}
                >
                    {"▸"}
                </span>
                {node.title}
            </button>
            {open && (
                <div className="ml-4 border-l border-navy-800 pl-2">
                    <Tree nodes={node.children!} parent={href} onNavigate={onNavigate} />
                </div>
            )}
        </div>
    );
}

function Tree({ nodes, parent, onNavigate }: { nodes: NoteNode[]; parent: string; onNavigate?: () => void }) {
    return (
        <>
            {nodes.map((n) => {
                const href = `${parent}/${n.slug}`;
                return n.children ? (
                    <Group key={href} node={n} href={href} onNavigate={onNavigate} />
                ) : (
                    <Leaf key={href} node={n} href={href} onNavigate={onNavigate} />
                );
            })}
        </>
    );
}

export default function NotebookSidebar({ tree }: { tree: NoteNode[] }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile */}
            <div className="border-b border-navy-800 lg:hidden">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-expanded={mobileOpen}
                    aria-label="Toggle notebook menu"
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-blue-100/90 hover:text-yellow-400"
                >
                    <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
                </button>
                {mobileOpen && (
                    <nav className="max-h-[60vh] overflow-y-auto px-3 pb-4">
                        <Tree nodes={tree} parent={BASE} onNavigate={() => setMobileOpen(false)} />
                    </nav>
                )}
            </div>

            {/* Desktop */}
            <aside className="sticky top-0 hidden max-h-screen w-72 shrink-0 self-start overflow-y-auto border-r border-navy-800 px-3 py-6 lg:block">
                <p className="mb-3 px-3 text-xs uppercase tracking-[0.3em] text-yellow-400">Notebook</p>
                <nav>
                    <Tree nodes={tree} parent={BASE} />
                </nav>
            </aside>
        </>
    );
}