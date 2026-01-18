export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // For demo purposes, generate a data URL
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    return Response.json({
      success: true,
      url: dataUrl,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
 