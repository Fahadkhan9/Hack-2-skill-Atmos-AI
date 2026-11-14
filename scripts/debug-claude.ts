import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function debug() {
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const res = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: "user", content: "Tell me your model name and max tokens limit" }]
  });
  console.log("Stop reason:", res.stop_reason);
  console.log("Usage:", res.usage);
  const textBlock = res.content.find(b => b.type === "text");
  console.log("Content:", textBlock && "text" in textBlock ? textBlock.text : "");
}

debug().catch(console.error);
