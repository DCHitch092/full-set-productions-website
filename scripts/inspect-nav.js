// Inspect Contentful navigation content types and entries
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const BASE = "https://cdn.contentful.com"

async function fetchJSON(path, params = {}) {
  const url = new URL(`/spaces/${SPACE_ID}/environments/master${path}`, BASE)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
  url.searchParams.set("access_token", ACCESS_TOKEN)
  const res = await fetch(url.toString())
  return res.json()
}

async function main() {
  // 1. List all content types
  console.log("=== ALL CONTENT TYPES ===")
  const types = await fetchJSON("/content_types")
  for (const ct of types.items) {
    console.log(`  - ${ct.sys.id}: "${ct.name}" (${ct.fields.length} fields)`)
  }

  // 2. Find navigation-related content types
  const navTypes = types.items.filter(
    (ct) =>
      ct.sys.id.toLowerCase().includes("nav") ||
      ct.name.toLowerCase().includes("nav")
  )
  console.log("\n=== NAVIGATION CONTENT TYPES ===")
  for (const ct of navTypes) {
    console.log(`\nContent Type: ${ct.sys.id} ("${ct.name}")`)
    console.log("Fields:")
    for (const f of ct.fields) {
      const linkType = f.type === "Link" ? ` -> ${f.linkType}` : ""
      const arrayType =
        f.type === "Array" && f.items
          ? ` -> Array<${f.items.type}${f.items.linkType ? ":" + f.items.linkType : ""}>`
          : ""
      console.log(`  - ${f.id} (${f.type}${linkType}${arrayType}) "${f.name}" required=${f.required}`)
      if (f.validations?.length) console.log(`    validations: ${JSON.stringify(f.validations)}`)
      if (f.items?.validations?.length) console.log(`    item validations: ${JSON.stringify(f.items.validations)}`)
    }
  }

  // 3. Fetch all navigation entries with includes
  console.log("\n=== NAVIGATION ENTRIES ===")
  for (const ct of navTypes) {
    const entries = await fetchJSON("/entries", {
      content_type: ct.sys.id,
      include: 3,
    })
    console.log(`\n${ct.sys.id} entries (${entries.total}):`)
    for (const item of entries.items) {
      console.log(`  Entry: ${item.sys.id}`)
      console.log(`  Fields: ${JSON.stringify(item.fields, null, 2)}`)
    }
    if (entries.includes?.Entry?.length) {
      console.log(`\n  Included entries (${entries.includes.Entry.length}):`)
      for (const inc of entries.includes.Entry) {
        console.log(`    ${inc.sys.id} (${inc.sys.contentType.sys.id}): ${JSON.stringify(inc.fields, null, 2)}`)
      }
    }
  }
}

main().catch(console.error)
