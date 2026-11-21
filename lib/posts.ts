import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const dir = path.join(process.cwd(), "content");

export function getSlugs() {
    return fs.readdirSync(dir)
        .filter(f => f.endsWith(".md"))
        .map(f => f.replace(/\.md$/, ""));
}

export async function getPost(slug: string) {
    const raw = fs.readFileSync(path.join(dir, `${slug}.md`), "utf8");
    const { data, content } = matter(raw); // data = front matter
    const html = String(
        await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(content)
    );
    return { meta: data, html };
}