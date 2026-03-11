const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  console.error("Missing Contentful credentials")
  process.exit(1)
}

const API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master`

async function fetchEntries(contentType) {
  const url = `${API_URL}/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=${contentType}`
  const response = await fetch(url)
  const data = await response.json()
  return data.items || []
}

async function main() {
  console.log("=== COMPLETE SITEMAP WITH SLUGS ===\n")

  try {
    const [projects, services, industries] = await Promise.all([
      fetchEntries("project"),
      fetchEntries("service"),
      fetchEntries("industry"),
    ])

    console.log("PROJECTS")
    console.log("--------")
    projects.forEach((p) => {
      const title = p.fields.title
      const slug = p.fields.slug
      console.log(`${title} | /projects/${slug}`)
    })

    console.log("\nSERVICES")
    console.log("--------")
    services.forEach((s) => {
      const title = s.fields.title
      const slug = s.fields.slug
      console.log(`${title} | /services/${slug}`)
    })

    console.log("\nINDUSTRIES")
    console.log("---------")
    industries.forEach((i) => {
      const title = i.fields.title
      const slug = i.fields.slug
      console.log(`${title} | /industry/${slug}`)
    })
  } catch (error) {
    console.error("Error fetching from Contentful:", error.message)
    process.exit(1)
  }
}

main()
