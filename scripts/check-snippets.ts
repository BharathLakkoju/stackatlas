import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import ts from "typescript";
import { loadAllDocuments } from "../lib/content/load";

const FENCE = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;

function checkTs(code: string, filename: string): string | null {
  const kind = filename.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const file = filename.endsWith("js") ? ts.ScriptKind.JS : kind;
  const transpile = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      strict: false,
    },
    reportDiagnostics: true,
    fileName: filename,
  });
  void file;
  const diagnostics = transpile.diagnostics ?? [];
  const fatal = diagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (!fatal.length) return null;
  return ts.formatDiagnostics(fatal, {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => "\n",
  });
}

function checkPython(code: string): string | null {
  const file = path.join(os.tmpdir(), `sa-${Date.now()}-${Math.random().toString(16).slice(2)}.py`);
  fs.writeFileSync(file, code);
  const result = spawnSync("python3", ["-c", "import ast,sys; ast.parse(open(sys.argv[1]).read())", file], {
    encoding: "utf8",
  });
  fs.rmSync(file, { force: true });
  if (result.status === 0) return null;
  return result.stderr || result.stdout || "python parse failed";
}

function javaBraceCheck(code: string): string | null {
  const opens = (code.match(/{/g) ?? []).length;
  const closes = (code.match(/}/g) ?? []).length;
  if (opens !== closes) return "unbalanced braces in Java snippet";
  if (!/\bclass\s+[A-Za-z_]/.test(code)) return "Java snippet is missing a class";
  return null;
}

function checkJava(code: string): string | null {
  const thirdParty = /import\s+(org\.|jakarta\.|com\.google\.)/.test(code);
  const publicClasses = [...code.matchAll(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/g)].map((m) => m[1]);
  if (thirdParty || publicClasses.length > 1) return javaBraceCheck(code);
  const className = publicClasses[0] ?? code.match(/class\s+([A-Za-z_][A-Za-z0-9_]*)/)?.[1] ?? "Snippet";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sa-java-"));
  const file = path.join(dir, `${className}.java`);
  fs.writeFileSync(file, code);
  const javac = spawnSync("javac", [file], { encoding: "utf8" });
  fs.rmSync(dir, { recursive: true, force: true });
  if (javac.status === 0) return null;
  const stderr = javac.stderr || "";
  if (/cannot find symbol|package .* does not exist/.test(stderr)) {
    return javaBraceCheck(code);
  }
  return stderr || "javac failed";
}

function checkBash(code: string): string | null {
  const file = path.join(os.tmpdir(), `sa-${Date.now()}.sh`);
  fs.writeFileSync(file, code);
  const result = spawnSync("bash", ["-n", file], { encoding: "utf8" });
  fs.rmSync(file, { force: true });
  if (result.status === 0) return null;
  return result.stderr || "bash -n failed";
}

function checkDockerfile(code: string): string | null {
  if (!/^\s*FROM\s+\S+/m.test(code)) return "Dockerfile snippets must include a FROM instruction";
  return null;
}

function looksLikeJsx(code: string): boolean {
  return /<[A-Za-z][\w.:]*[\s/>]/.test(code) || /<\/[A-Za-z]/.test(code);
}

function checkFence(lang: string, code: string): string | null {
  const normalized = lang.toLowerCase();
  if (["ts", "typescript"].includes(normalized)) {
    return checkTs(code, looksLikeJsx(code) ? "snippet.tsx" : "snippet.ts");
  }
  if (["tsx"].includes(normalized)) return checkTs(code, "snippet.tsx");
  if (["js", "javascript", "mjs"].includes(normalized)) return checkTs(code, "snippet.js");
  if (["py", "python"].includes(normalized)) return checkPython(code);
  if (normalized === "java") return checkJava(code);
  if (["bash", "sh", "shell", "zsh"].includes(normalized)) return checkBash(code);
  if (["dockerfile", "docker"].includes(normalized)) return checkDockerfile(code);
  return null;
}

const errors: string[] = [];
for (const doc of loadAllDocuments()) {
  const rel = path.relative(process.cwd(), doc.filePath);
  for (const match of doc.body.matchAll(FENCE)) {
    const lang = match[1];
    if (!lang) continue;
    const issue = checkFence(lang, match[2]);
    if (issue) errors.push(`${rel} (${lang}): ${issue.trim()}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("All checked code fences parsed.");
void execFileSync;
