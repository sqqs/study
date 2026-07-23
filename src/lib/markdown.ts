import type { Pattern, PatternCategory, Mastery } from "./types";

export function patternsToMarkdown(patterns: Pattern[]): string {
  const blocks = patterns.map((p) => {
    const lines: string[] = [];
    lines.push(`### ${p.id} | ${p.category} | ${p.title}`);
    lines.push(`- subject: ${p.subject}`);
    lines.push(`- problemType: ${p.problemType}`);
    lines.push(`- tags: ${p.tags.join(", ")}`);
    lines.push(`- mastery: ${p.mastery}`);
    lines.push(`- createdAt: ${p.createdAt}`);
    if (p.source) lines.push(`- source: ${p.source}`);
    lines.push(`- content:`);
    for (const [k, v] of Object.entries(p.content)) {
      lines.push(`  - ${k}: ${v}`);
    }
    return lines.join("\n");
  });
  return `# 学习飞轮记录 (Learning Registry)\n\n> 由 LearnMentor 网页版维护。\n\n## 已掌握模式 (Patterns Mastered)\n\n${blocks.join(
    "\n\n"
  )}\n`;
}

export function markdownToPatterns(md: string): Pattern[] {
  const lines = md.split(/\r?\n/);
  const patterns: Pattern[] = [];
  let cur: Pattern | null = null;

  for (const line of lines) {
    const header = line.match(/^###\s+(P-\d+)\s*\|\s*(\S+)\s*\|\s*(.+)$/);
    if (header) {
      if (cur) patterns.push(cur);
      cur = {
        id: header[1],
        category: (header[2] as PatternCategory) || "effective-approach",
        title: header[3].trim(),
        subject: "",
        problemType: "",
        tags: [],
        mastery: "consolidated",
        createdAt: new Date().toISOString().slice(0, 10),
        content: {},
      };
      continue;
    }
    if (!cur) continue;

    const kv = line.match(/^- ([a-zA-Z]+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const val = kv[2];
      if (key === "subject") cur.subject = val;
      else if (key === "problemType") cur.problemType = val;
      else if (key === "tags")
        cur.tags = val.split(",").map((s) => s.trim()).filter(Boolean);
      else if (key === "mastery") cur.mastery = (val as Mastery) || "consolidated";
      else if (key === "createdAt") cur.createdAt = val;
      else if (key === "source") cur.source = val;
      continue;
    }

    const contentItem = line.match(/^\s+- (.+?):\s*(.*)$/);
    if (contentItem) {
      cur.content[contentItem[1]] = contentItem[2];
    }
  }
  if (cur) patterns.push(cur);

  return patterns.filter((p) => p.id && p.title);
}
