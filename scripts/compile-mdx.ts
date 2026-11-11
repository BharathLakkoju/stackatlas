import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { loadAllDocuments } from "../lib/content/load";

async function main() {
  const errors: string[] = [];
  for (const doc of loadAllDocuments()) {
    try {
      await compile(doc.body, { remarkPlugins: [remarkGfm] });
    } catch (error) {
      errors.push(`${doc.filePath}: ${error instanceof Error ? error.message.split("\n")[0] : error}`);
    }
  }
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("All MDX compiled.");
}

void main();
