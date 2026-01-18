import { getDatabase } from "@/lib/mongodb"

// GET all posts with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")

    const db = await getDatabase()
    const collection = db.collection("posts")

    const query = category && category !== "all" ? { category } : {}
    const skip = (page - 1) * limit

    const posts = await collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    const total = await collection.countDocuments(query)

    return Response.json({
      success: true,
      data: {
        posts: posts.map((post) => ({
          ...post,
          _id: post._id.toString(),
        })),
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST create new post
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, videoUrl, story, category } = body

    if (!title || !description || !imageUrl || !story || !category) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = db.collection("posts")

    const result = await collection.insertOne({
      title,
      description,
      imageUrl,
      videoUrl: videoUrl || null,
      story,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    })

    return Response.json({
      success: true,
      data: { _id: result.insertedId.toString() },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create post" }, { status: 500 })
  }
}
