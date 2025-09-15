const express = require("express");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// File upload config
const upload = multer({ dest: "uploads/" });

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "512x512"
    });
    res.json({ url: response.data[0].url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 DAMITEX AI running on http://localhost:${port}`);
});