const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const { v2: cloudinary } = require("cloudinary");

const app = express();
const prisma = new PrismaClient();

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ── Upload helper: saves base64 data URL to Cloudinary ────────────────────
const uploadToCloudinary = async (dataUrl, folder) => {
  // If it's already a Cloudinary URL or a plain URL, return as-is
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
    return dataUrl;
  }

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: `uzma/${folder}`,
    resource_type: "auto",
    transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto:good", fetch_format: "auto" },
    ],
  });

  return result.secure_url;
};

// ── Delete from Cloudinary ────────────────────────────────────────────────
const deleteFromCloudinary = async (url) => {
  if (typeof url !== "string" || !url.includes("cloudinary.com")) return;
  try {
    // Extract public_id from URL
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return;
    // Remove version segment if present (v1234567890)
    const pathParts = parts.slice(uploadIndex + 1);
    if (pathParts[0]?.match(/^v\d+$/)) pathParts.shift();
    const publicIdWithExt = pathParts.join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.error("Failed to delete from Cloudinary:", err);
  }
};

// ─────────────────────────────────────────
// BOOKING ROUTES
// ─────────────────────────────────────────

app.post("/api/book", async (req, res) => {
  const { name, phone, service, date, timeSlot } = req.body;
  try {
    const existing = await prisma.booking.findFirst({
      where: { date: new Date(date), timeSlot },
    });
    if (existing)
      return res.json({ error: "Slot already booked. Please choose another time." });

    const booking = await prisma.booking.create({
      data: { name, phone, service, date: new Date(date), timeSlot },
    });
    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────
// PORTFOLIO ROUTES
// ─────────────────────────────────────────

app.post("/api/portfolio", async (req, res) => {
  const { url, type } = req.body;
  if (!url || !type) return res.status(400).json({ error: "url and type are required" });
  try {
    const storedUrl = await uploadToCloudinary(url, "portfolio");
    const item = await prisma.portfolio.create({ data: { url: storedUrl, type } });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save portfolio item" });
  }
});

app.get("/api/portfolio", async (req, res) => {
  try {
    const items = await prisma.portfolio.findMany({ orderBy: { createdAt: "desc" } });

    // Migrate any old base64 data URLs still in DB to Cloudinary
    const normalizedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.url?.startsWith("data:")) return item;
        try {
          const storedUrl = await uploadToCloudinary(item.url, "portfolio");
          await prisma.portfolio.update({
            where: { id: item.id },
            data: { url: storedUrl },
          });
          return { ...item, url: storedUrl };
        } catch {
          return item;
        }
      })
    );

    res.json(normalizedItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

app.delete("/api/portfolio/:id", async (req, res) => {
  try {
    const item = await prisma.portfolio.delete({ where: { id: req.params.id } });
    await deleteFromCloudinary(item.url);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// ─────────────────────────────────────────
// BLOG ROUTES
// ─────────────────────────────────────────

app.post("/api/blog", async (req, res) => {
  const { title, content, mediaUrl, mediaType } = req.body;
  if (!title || !content) return res.status(400).json({ error: "title and content required" });
  try {
    let finalMediaUrl = mediaUrl || null;
    if (finalMediaUrl && finalMediaUrl.startsWith("data:")) {
      finalMediaUrl = await uploadToCloudinary(finalMediaUrl, "blog");
    }
    const post = await prisma.blog.create({
      data: { title, content, mediaUrl: finalMediaUrl, mediaType: mediaType || null },
    });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save blog post" });
  }
});

app.get("/api/blog", async (req, res) => {
  try {
    const posts = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.put("/api/blog/:id", async (req, res) => {
  const { title, content, mediaUrl, mediaType } = req.body;
  try {
    let finalMediaUrl = mediaUrl || null;
    if (finalMediaUrl && finalMediaUrl.startsWith("data:")) {
      finalMediaUrl = await uploadToCloudinary(finalMediaUrl, "blog");
    }
    const post = await prisma.blog.update({
      where: { id: req.params.id },
      data: { title, content, mediaUrl: finalMediaUrl, mediaType: mediaType || null },
    });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

app.delete("/api/blog/:id", async (req, res) => {
  try {
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// ─────────────────────────────────────────
// START
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});