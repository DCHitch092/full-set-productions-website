import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * On-demand revalidation endpoint for Contentful webhooks.
 * 
 * To use this:
 * 1. Set REVALIDATION_SECRET in your Vercel environment variables
 * 2. In Contentful, go to Settings > Webhooks
 * 3. Create a new webhook with:
 *    - URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET
 *    - Triggers: Entry publish, Entry unpublish
 * 
 * The webhook will intelligently revalidate only the affected pages based on content type.
 */

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")

  // Validate the secret to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: "Invalid secret" },
      { status: 401 }
    )
  }

  try {
    // Parse the Contentful webhook payload
    const payload = await request.json().catch(() => ({}))
    const contentType = payload?.sys?.contentType?.sys?.id
    const entryId = payload?.sys?.id

    console.log(`[Revalidate] Triggered for ${contentType || "unknown"} (${entryId || "no id"})`)

    // Revalidate based on content type - this is much more efficient than full site revalidation
    if (contentType === "page" || contentType === "modularBlock") {
      // For pages and modular blocks, invalidate the Contentful API cache tag
      revalidateTag("contentful-api")
      console.log("[Revalidate] Cleared contentful-api tag")
    } else if (contentType === "person" || contentType === "caseStudy") {
      // These are referenced within pages, so clear the API cache
      revalidateTag("contentful-api")
      console.log("[Revalidate] Cleared contentful-api tag for", contentType)
    }

    // Also revalidate any hardcoded paths that might have changed
    revalidatePath("/", "layout")

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      contentType,
      entryId,
    })
  } catch (error) {
    console.error("[Revalidate] Error:", error)
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    )
  }
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: "Invalid secret" },
      { status: 401 }
    )
  }

  try {
    revalidateTag("contentful-api")
    revalidatePath("/", "layout")
    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      message: "Contentful API cache cleared",
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    )
  }
}
