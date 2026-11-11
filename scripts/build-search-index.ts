import { writeSearchIndex } from "../lib/content/search-index";

const out = writeSearchIndex();
console.log(`Wrote search index to ${out}`);
