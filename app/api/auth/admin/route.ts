import crypto from "crypto"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    if (password !== ADMIN_PASSWORD) {
      return Response.json({ success: false, error: "Invalid password" }, { status: 401 })
    }

    // Generate a simple token (in production, use proper JWT)
    const token = crypto.randomBytes(32).toString("hex")

    return Response.json({
      success: true,
      token,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
