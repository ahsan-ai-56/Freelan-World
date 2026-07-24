const GROQ_KEY = "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";

export async function geminiGenerate(prompt: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
