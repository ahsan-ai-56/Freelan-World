const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
];

export async function geminiGenerate(prompt: string, temperature = 0.8): Promise<string> {
  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      console.log(`[Gemini] Trying model: ${model}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature, maxOutputTokens: 2048 },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data?.error?.message || `HTTP ${response.status}`;
        console.error(`[Gemini] Model ${model} failed:`, errMsg, data);
        lastError = new Error(errMsg);

        // Don't retry on auth errors
        if (response.status === 400 || response.status === 401 || response.status === 403) {
          throw lastError;
        }
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) {
        console.error(`[Gemini] Model ${model} returned empty text:`, data);
        lastError = new Error("Empty response");
        continue;
      }

      console.log(`[Gemini] Success with model: ${model}`);
      return text;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error(`[Gemini] Model ${model} threw:`, error.message);
      lastError = error;

      // Don't retry on hard errors
      if (error.message.includes("API key") || error.message.includes("401") || error.message.includes("403")) {
        throw error;
      }
    }
  }

  throw lastError || new Error("All Gemini models failed");
}
