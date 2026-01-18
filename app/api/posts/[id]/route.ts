import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET single post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection("posts")

    const post = await collection.findOne({ _id: new ObjectId(id) })

    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    // Increment views
    await collection.updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })

    return Response.json({
      success: true,
      data: { ...post, _id: post._id.toString() },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch post" }, { status: 500 })
  }
}

// PUT update post
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const db = await getDatabase()
    const collection = db.collection("posts")

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update post" }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection("posts")

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete post" }, { status: 500 })
  }
}
