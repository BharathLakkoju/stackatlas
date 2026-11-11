import { assertValidContent, validateContent } from "../lib/content/validate";

const issues = validateContent();
for (const issue of issues) {
  const prefix = issue.level === "error" ? "ERROR" : "WARN";
  console.log(`${prefix}\t${issue.message}`);
}
assertValidContent();
console.log(`Validated ${issues.length === 0 ? "with no issues" : "after writing cache"}.`);
