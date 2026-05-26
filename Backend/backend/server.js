const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const app = express();
const prisma = new PrismaClient();
const UPLOAD_ROOT = path.join(__dirname, "uploads");
const PORTFOLIO_UPLOAD_DIR = path.join(UPLOAD_ROOT, "portfolio");

fs.mkdirSync(PORTFOLIO_UPLOAD_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  "/uploads",
  express.static(UPLOAD_ROOT, {
    immutable: true,
    maxAge: "30d",
  })
);

const MIME_EXTENSIONS = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogg",
  "video/quicktime": "mov",
};

const saveDataUrlToFile = async (dataUrl, folder, publicPrefix) => {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return dataUrl;

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return dataUrl;

  const [, mimeType, base64Data] = match;
  const isImage = mimeType.startsWith("image/");
  const extension = isImage ? "webp" : MIME_EXTENSIONS[mimeType] || "bin";
  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${extension}`;
  const filePath = path.join(folder, fileName);
  const fileBuffer = Buffer.from(base64Data, "base64");

  if (isImage) {
    await sharp(fileBuffer)
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(filePath);

    return `${publicPrefix}/${fileName}`;
  }

  fs.writeFileSync(filePath, fileBuffer);
  return `${publicPrefix}/${fileName}`;
};

const removeLocalUpload = url => {
  if (typeof url !== "string" || !url.startsWith("/uploads/portfolio/")) return;

  const filePath = path.resolve(__dirname, `.${url}`);
  if (!filePath.startsWith(PORTFOLIO_UPLOAD_DIR)) return;

  fs.rm(filePath, { force: true }, err => {
    if (err) console.error("Failed to remove uploaded file:", err);
  });
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
    if (existing) return res.json({ error: "Slot already booked. Please choose another time." });

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
    const storedUrl = await saveDataUrlToFile(url, PORTFOLIO_UPLOAD_DIR, "/uploads/portfolio");
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
    const normalizedItems = await Promise.all(
      items.map(async item => {
        if (!item.url?.startsWith("data:")) return item;

        const storedUrl = await saveDataUrlToFile(item.url, PORTFOLIO_UPLOAD_DIR, "/uploads/portfolio");
        await prisma.portfolio.update({
          where: { id: item.id },
          data: { url: storedUrl },
        });

        return { ...item, url: storedUrl };
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
    removeLocalUpload(item.url);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// ─────────────────────────────────────────
// BLOG ROUTES  (/api/blog — matches AdminDashboard)
// ─────────────────────────────────────────

app.post("/api/blog", async (req, res) => {
  const { title, content, mediaUrl, mediaType } = req.body;
  if (!title || !content) return res.status(400).json({ error: "title and content required" });
  try {
    const post = await prisma.blog.create({
      data: {
        title,
        content,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
      },
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
    const post = await prisma.blog.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
      },
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
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
