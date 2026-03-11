const spaceId = process.env.CONTENTFUL_SPACE_ID;
const token = process.env.CONTENTFUL_ACCESS_TOKEN;
const BASE = `https://cdn.contentful.com/spaces/${spaceId}/environments/master`;

async function cfFetch(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("access_token", token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  return res.json();
}

async function main() {
  // 1. Get all content types to find the modular block types
  console.log("=== CONTENT TYPES ===");
  const types = await cfFetch("/content_types");
  for (const t of types.items) {
    console.log(`\n--- ${t.name} (${t.sys.id}) ---`);
    for (const f of t.fields) {
      const link = f.linkType || (f.items?.linkType) || "";
      const validations = JSON.stringify(f.validations || f.items?.validations || []);
      console.log(`  ${f.id} [${f.type}${link ? ":" + link : ""}] ${f.required ? "REQUIRED" : ""} ${validations !== "[]" ? validations : ""}`);
    }
  }

  // 2. Get Page entries that match our target pages
  console.log("\n\n=== PAGE ENTRIES ===");
  const pages = await cfFetch("/entries", { content_type: "page", include: "3" });
  for (const p of pages.items) {
    console.log(`\n--- Page: "${p.fields.title}" (slug: ${p.fields.slug}) ---`);
    console.log("Fields:", JSON.stringify(Object.keys(p.fields)));
    // Show key fields
    for (const [k, v] of Object.entries(p.fields)) {
      if (k === "body" || k === "reusableSnippets") {
        if (Array.isArray(v)) {
          console.log(`  ${k}: [${v.length} items]`);
          for (const item of v) {
            if (item?.sys?.type === "Link") {
              console.log(`    -> Link to ${item.sys.linkType} ${item.sys.id}`);
            } else {
              console.log(`    -> Entry: ${item?.sys?.contentType?.sys?.id || "unknown"}`);
            }
          }
        } else if (typeof v === "object" && v !== null) {
          console.log(`  ${k}: ${JSON.stringify(v).substring(0, 200)}`);
        } else {
          console.log(`  ${k}: ${v}`);
        }
      } else if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        if (v.sys) {
          console.log(`  ${k}: Link -> ${v.sys.linkType || v.sys.type} ${v.sys.id}`);
        } else {
          console.log(`  ${k}: ${JSON.stringify(v).substring(0, 200)}`);
        }
      } else if (Array.isArray(v)) {
        console.log(`  ${k}: [${v.length} items] ${JSON.stringify(v).substring(0, 200)}`);
      } else {
        console.log(`  ${k}: ${v}`);
      }
    }
  }

  // 3. Show included entries (modular blocks)
  console.log("\n\n=== INCLUDED ENTRIES (modular blocks etc) ===");
  const included = pages.includes?.Entry ?? [];
  for (const e of included) {
    const ctId = e.sys.contentType?.sys?.id || "unknown";
    console.log(`\n--- ${ctId}: "${e.fields.title || e.fields.label || e.fields.name || 'untitled'}" ---`);
    for (const [k, v] of Object.entries(e.fields)) {
      if (typeof v === "string") {
        console.log(`  ${k}: ${v.substring(0, 150)}`);
      } else if (typeof v === "object" && v !== null) {
        console.log(`  ${k}: ${JSON.stringify(v).substring(0, 200)}`);
      } else {
        console.log(`  ${k}: ${v}`);
      }
    }
  }
}

main().catch(console.error);
