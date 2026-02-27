import fs from "node:fs";
import path from "node:path";
import process from "node:process";

type ResultEntry = Results["results"][number];

function getLatestYear(resultsDir: string): string {
  const entries = fs
    .readdirSync(resultsDir)
    .filter(e => /^\d{4}$/.test(e))
    .sort()
    .reverse();
  if (entries.length === 0)
    throw new Error("No year folders found in /results/");
  return entries[0];
}

function loadData(year: string) {
  const base = path.resolve(process.cwd(), "results", year, "data");
  const qPath = path.join(base, "questions.json");
  const rPath = path.join(base, "results.json");

  if (!fs.existsSync(qPath))
    throw new Error(`questions.json not found for year ${year}`);
  if (!fs.existsSync(rPath))
    throw new Error(`results.json not found for year ${year}`);

  const questions = JSON.parse(fs.readFileSync(qPath, "utf-8")) as QuestionMap;
  const { results } = JSON.parse(fs.readFileSync(rPath, "utf-8")) as { results: ResultEntry[] };
  return { questions, results };
}

function resolveQuestion(arg: string, questions: QuestionMap): string[] {
  // Exact ID match
  if (arg in questions)
    return [arg];

  // Pattern match: section-q-n
  if (/^\w+-q-\d+$/.test(arg))
    return []; // matched pattern but not found

  // Case-insensitive label substring search
  const lower = arg.toLowerCase();
  return Object.entries(questions)
    .filter(([, q]) => q.label.toLowerCase().includes(lower))
    .map(([id]) => id);
}

function resolveFilter(raw: string, questions: QuestionMap): { questionId: string; choiceIndex: number } {
  const eq = raw.indexOf("=");
  if (eq === -1) {
    console.error(`Error: invalid filter "${raw}" — expected format: question=choice`);
    process.exit(1);
  }
  const qPart = raw.slice(0, eq);
  const cPart = raw.slice(eq + 1);

  const qMatches = resolveQuestion(qPart, questions);
  if (qMatches.length === 0) {
    console.error(`Error: no question found matching filter "${qPart}"`);
    process.exit(1);
  }
  if (qMatches.length > 1) {
    console.error(`Error: ambiguous filter question "${qPart}" — matches:\n`);
    for (const id of qMatches) console.error(`  ${id}  →  ${questions[id].label}`);
    process.exit(1);
  }

  const questionId = qMatches[0];
  const meta = questions[questionId];

  // Numeric string → treat as choice index
  if (/^\d+$/.test(cPart))
    return { questionId, choiceIndex: Number(cPart) };

  const idx = meta.choices.findIndex(c => c.toLowerCase().includes(cPart.toLowerCase()));
  if (idx === -1) {
    console.error(`Error: no choice found matching "${cPart}" in question "${meta.label}"`);
    console.error(`  choices: ${meta.choices.map((c, i) => `${i}: ${c}`).join(" | ")}`);
    process.exit(1);
  }
  return { questionId, choiceIndex: idx };
}

function computeStats(id: string, meta: Question, results: ResultEntry[], filteredCount: number) {
  const choices = meta.choices.map((label, i) => ({ label, index: i, count: 0 }));
  let total = 0;

  for (const entry of results) {
    const val = entry[id];
    if (val === null || val === undefined)
      continue;
    total++;
    const indices = Array.isArray(val) ? val : [val];
    for (const idx of indices) {
      if (typeof idx === "number" && choices[idx])
        choices[idx].count++;
    }
  }

  return {
    id,
    question: meta.label,
    multiple: meta.multiple,
    total,
    skipped: filteredCount - total,
    choices: choices.map(({ label, count }) => ({
      label,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0
    }))
  };
}

interface FilterInfo { question: string; choice: string }

function formatText(
  stats: ReturnType<typeof computeStats>,
  year: string,
  filters: FilterInfo[]
) {
  const lines: string[] = [];
  if (filters.length > 0) {
    lines.push(`Filtered by: ${filters.map(f => `${f.question} = ${f.choice}`).join(", ")}`);
  }
  lines.push(
    `[${year}] ${stats.question} (${stats.id})`,
    `Total: ${stats.total} answered, ${stats.skipped} skipped`,
    "",
    ...stats.choices.map(
      c => `  ${c.label.padEnd(40)} ${String(c.count).padStart(5)}  ${c.percentage.toFixed(1)}%`
    )
  );
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: pnpm query-results <question|id> [--year=YYYY] [--format=text|json] [--filter=question=choice]");
    process.exit(1);
  }

  let query = "";
  let year = "";
  let format = "json";
  const filterArgs: string[] = [];

  for (const arg of args) {
    if (arg.startsWith("--year="))
      year = arg.slice(7);
    else if (arg.startsWith("--format="))
      format = arg.slice(9);
    else if (arg.startsWith("--filter="))
      filterArgs.push(arg.slice(9));
    else query = arg;
  }

  if (!query) {
    console.error("Error: missing question argument");
    process.exit(1);
  }

  const resultsDir = path.resolve(process.cwd(), "results");
  if (!year)
    year = getLatestYear(resultsDir);

  const { questions, results: rawResults } = loadData(year);
  const matches = resolveQuestion(query, questions);

  if (matches.length === 0) {
    console.error(`No question found matching "${query}" in ${year}`);
    process.exit(1);
  }

  if (matches.length > 1) {
    console.error(`Multiple matches for "${query}" — narrow down with one of:\n`);
    for (const id of matches) {
      console.error(`  ${id}  →  ${questions[id].label}`);
    }
    process.exit(1);
  }

  const id = matches[0];

  // Apply filters by pre-filtering the results array
  const resolvedFilters = filterArgs.map(f => resolveFilter(f, questions));
  let results = rawResults;
  for (const f of resolvedFilters) {
    results = results.filter((entry) => {
      const val = entry[f.questionId];
      if (val === null || val === undefined)
        return false;
      const selected = Array.isArray(val) ? (val as number[]) : [val as number];
      return selected.includes(f.choiceIndex);
    });
  }

  const filters: FilterInfo[] = resolvedFilters.map(f => ({
    question: questions[f.questionId].label,
    choice: questions[f.questionId].choices[f.choiceIndex]
  }));

  const stats = computeStats(id, questions[id], results, results.length);

  if (format === "text") {
    console.log(formatText(stats, year, filters));
  }
  else {
    const output = {
      ...stats,
      year: Number(year),
      ...(filters.length > 0 && { filters })
    };
    console.log(JSON.stringify(output, null, 2));
  }
}

main();
