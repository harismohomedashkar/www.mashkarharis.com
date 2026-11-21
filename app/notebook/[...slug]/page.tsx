import "highlight.js/styles/github-dark.css";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { findByPath, getTree, getNote, getNotePaths } from "@/lib/notebook";

export function generateStaticParams() {
    return getNotePaths().map((p) => ({ slug: p.split("/") }));
}

export default async function NotePage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const note = getNote(slug.join("/"));
    const found = findByPath(getTree(), slug);
    if (!note || !found) notFound();

    const { node, trail } = found;
    return (
        <article className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-yellow-400">
                {trail.slice(0, -1).map((t) => t.title).join(" / ")}
            </p>
            {!note.hasH1 && <h1 className="mb-6 text-3xl font-semibold text-white sm:text-4xl">{node.title}</h1>}
            <div className="prose prose-invert max-w-none prose-p:text-justify prose-li:text-justify prose-img:mx-auto prose-headings:text-white prose-a:text-yellow-400 prose-strong:text-white prose-code:text-yellow-300 prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-navy-800 prose-pre:bg-navy-900 prose-img:rounded-lg prose-hr:border-navy-800 prose-th:text-white prose-td:border-navy-800">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: false, ignoreMissing: true }]]}
                >
                    {note.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}