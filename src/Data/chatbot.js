const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: "YOUR_API_KEY" });

router.post("/", async (req, res) => {
  const userMessage = req.body.message;
  const reply = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userMessage }],
  });

  res.json({ reply: reply.choices[0].message.content });
});

module.exports = router;
