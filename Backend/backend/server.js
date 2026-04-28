const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
    const item = await prisma.portfolio.create({ data: { url, type } });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save portfolio item" });
  }
});

app.get("/api/portfolio", async (req, res) => {
  try {
    const items = await prisma.portfolio.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

app.delete("/api/portfolio/:id", async (req, res) => {
  try {
    await prisma.portfolio.delete({ where: { id: req.params.id } });
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