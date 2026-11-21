"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
    { href: "/", label: "Home" },
    { href: "/notebook", label: "Notebook" },
    // { href: "/writing", label: "Writing" },
    // { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="border-b border-navy-800 bg-navy-950/90 text-white backdrop-blur">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo + Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Haris Space"
                            width={40}
                            height={40}
                            className="rounded-full ring-1 ring-yellow-400"
                        />

                        <span className="text-sm uppercase leading-none tracking-[0.3em] text-blue-200/70">
                            Haris <span className="text-yellow-400">Space</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden items-center space-x-8 text-blue-100/80 md:flex">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="transition hover:text-yellow-400"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Button */}
                    <button
                        className="text-2xl text-white transition hover:text-yellow-400 md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="flex flex-col gap-4 border-t border-navy-800 bg-navy-900 px-4 py-4 text-blue-100/80 md:hidden">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setIsOpen(false)}
                            className="transition hover:text-yellow-400"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}