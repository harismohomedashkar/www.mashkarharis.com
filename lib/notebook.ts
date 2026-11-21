import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Server-side only (reads the content folder at build time / in dev).
// Client components must use:  import type { NoteNode } from "@/lib/notebook";

export type NoteNode = { title: string; slug: string; children?: NoteNode[] };

const ROOT = path.join(process.cwd(), "content", "note");
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

const bare = (name: string) => name.replace(/\.md$/i, "");
const slugify = (name: string) => bare(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// keeps your own casing ("Primary and Qualifier"); only ALL-CAPS words are fixed (JAVA -> Java, GOF -> GoF)
const prettify = (name: string) =>
    bare(name)
        .replace(/[-_]+/g, " ")
        .trim()
        .split(/\s+/)
        .join(" ");

const readMd = (file: string) => matter(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
const isPage = (name: string) => /\.md$/i.test(name) && name.toLowerCase() !== "_index.md";

/** Hugo-style ordering value: `weight` in the file's (or folder's _index.md) front matter */
function weightOf(dir: string, e: fs.Dirent): number {
    try {
        const file = e.isDirectory() ? path.join(dir, e.name, "_index.md") : path.join(dir, e.name);
        return readMd(file).data.weight ?? Infinity;
    } catch {
        return Infinity;
    }
}

/** every page as a relative path without extension, in sidebar order, e.g. "JAVA/Concurrency/Common-Issues" */
function getSlugs(dir = ROOT): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => !e.name.startsWith(".") && (e.isDirectory() || isPage(e.name)))
        .filter((e) => e.isDirectory() || readMd(path.join(dir, e.name)).data.draft !== true)
        .map((e) => ({ e, weight: weightOf(dir, e) }))
        .sort((a, b) => (a.weight === b.weight ? 0 : a.weight < b.weight ? -1 : 1) || collator.compare(prettify(a.e.name), prettify(b.e.name)))
        .flatMap(({ e }) =>
            e.isDirectory()
                ? getSlugs(path.join(dir, e.name)).map((s) => `${e.name}/${s}`)
                : [bare(e.name)]
        );
}

/** builds the sidebar tree + url->file map from the slug list */
function scan() {
    const tree: NoteNode[] = [];
    const files: Record<string, string> = {}; // "java/concurrency/common-issues" -> file path

    for (const raw of getSlugs()) {
        const parts = raw.split("/");
        files[parts.map(slugify).join("/")] = path.join(ROOT, ...parts) + ".md";

        let level = tree;
        parts.forEach((part, i) => {
            const slug = slugify(part);
            let node = level.find((n) => n.slug === slug);
            if (!node) {
                node = { title: prettify(part), slug };
                level.push(node);
            }
            if (i < parts.length - 1) {
                node.children ??= [];
                level = node.children;
            }
        });
    }
    return { tree, files };
}

let cache: ReturnType<typeof scan> | undefined;
const load = () => {
    if (process.env.NODE_ENV === "development" || !cache) cache = scan(); // dev: always fresh
    return cache;
};

// ---- public API ----
export const getTree = () => load().tree;
export const getNotePaths = () => Object.keys(load().files);

export function getNote(key: string) {
    const file = load().files[key];
    if (!file) return null;
    const { content } = readMd(file); // front matter removed
    return { content, hasH1: /^#\s+\S/m.test(content) };
}

export function findByPath(tree: NoteNode[], pathSegs: string[]) {
    let level: NoteNode[] | undefined = tree;
    const trail: NoteNode[] = [];
    for (const seg of pathSegs) {
        const next: NoteNode | undefined = level?.find((n) => n.slug === seg);
        if (!next) return null;
        trail.push(next);
        level = next.children;
    }
    return trail.length ? { node: trail[trail.length - 1], trail } : null;
}

export function firstLeafPath(nodes: NoteNode[], parent: string): string {
    const first = nodes[0];
    const href = `${parent}/${first.slug}`;
    return first.children ? firstLeafPath(first.children, href) : href;
}