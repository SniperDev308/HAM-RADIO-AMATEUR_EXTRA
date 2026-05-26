// ============================================================
// Cloudflare Worker – Ham Radio Extra Class API
// Deploy: wrangler deploy
// Secrets: OPENAI_API_KEY (wrangler secret put OPENAI_API_KEY)
// ============================================================

const ALLOWED_ORIGIN = "https://sniperdev308.github.io";

const CORS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    // ── /explain ──────────────────────────────────────────
    if (url.pathname === "/explain" && request.method === "POST") {
      try {
        const { question, answers, correct } = await request.json();

        const prompt = `Eres un instructor experto de radioaficionados para el examen FCC Amateur Extra Class. 
Explica en español (3-4 oraciones, estilo técnico pero claro) por qué la respuesta correcta es "${correct}: ${answers[correct]}".

Pregunta: ${question}
Opciones: ${Object.entries(answers).map(([k,v]) => `${k}: ${v}`).join(" | ")}

No repitas la pregunta. Ve directo a la explicación técnica.`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 200,
            temperature: 0.4,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
        const data = await res.json();
        const explanation = data.choices?.[0]?.message?.content?.trim() || "Explicación no disponible.";

        return new Response(JSON.stringify({ explanation }), {
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ explanation: "Error al obtener explicación. Intenta de nuevo." }), {
          status: 200,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }
    }

    // ── /tts ──────────────────────────────────────────────
    if (url.pathname === "/tts" && request.method === "POST") {
      try {
        const { text } = await request.json();
        if (!text || text.length > 1000) throw new Error("Invalid text");

        const res = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "tts-1",
            voice: "nova",
            input: text,
            speed: 0.95,
          }),
        });

        if (!res.ok) throw new Error(`TTS error: ${res.status}`);
        const audioBuffer = await res.arrayBuffer();

        return new Response(audioBuffer, {
          headers: {
            ...CORS,
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }
    }

    // ── Health check ──────────────────────────────────────
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", service: "ham-radio-extra-api" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404, headers: CORS });
  },
};
