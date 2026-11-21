import Link from "next/link";
import { getTree, firstLeafPath } from "@/lib/notebook";

export default function NotebookHome() {
    const notebook = getTree();
    console.log(notebook)
    return (
        <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-yellow-400">Notebook</p>
            <h1 className="bg-gradient-to-b from-white to-blue-200 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
                Learning by sharing, growing by solving.
            </h1>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {notebook.map((s) => (
                    <Link
                        key={s.slug}
                        href={
                            s.children
                                ? firstLeafPath(s.children, `/notebook/${s.slug}`)
                                : `/notebook/${s.slug}`
                        }
                        className="flex items-center justify-center rounded-xl border border-navy-800 bg-navy-900/60 p-5 text-center transition hover:border-yellow-400/60"
                    >
                        <h2 className="text-lg font-medium text-white">{s.title}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
}