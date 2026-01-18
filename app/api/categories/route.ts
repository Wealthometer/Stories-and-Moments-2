import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection("posts")

    const categories = await collection.distinct("category")

    return Response.json({
      success: true,
      data: categories.sort(),
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}
