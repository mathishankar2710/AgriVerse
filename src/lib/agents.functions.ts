import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPTS: Record<string, string> = {
  crop: "You are an expert agronomist. Given soil type, region, and season, recommend 3-5 well-suited crops. Explain briefly why each is a good fit. Keep the answer concise and practical.",
  weather: "You are a farm weather advisor. Based on the given location (and optionally the current crop), give short, practical, weather-aware farming advice for the coming days. Mention risks (rain, heat, frost) and recommended actions.",
  fertilizer: "You are a soil & fertilizer expert. Given crop type, soil type, and growth stage, recommend specific fertilizers (with NPK ratios or names), application rates and timing. Keep it concise and practical for a smallholder farmer.",
  pest: "You are a plant pathologist. Given a crop and described symptoms, identify the most likely pest(s) or disease(s), explain briefly, and recommend both organic and chemical treatment options with application guidance.",
  irrigation: "You are an irrigation expert. Given crop, soil, region, and season, provide a clear weekly watering schedule (frequency, approximate quantity, best time of day) and any tips (mulching, drip vs. flood). Keep it concise and practical.",
  chatbot: "You are AgriVerse's AI Smart Farming Assistant. You help farmers optimize crops, identify diseases, calculate NPK ratios, and solve agricultural issues. Be highly encouraging and practical. Keep your responses neat, highly structured, and concise (use short bullet points and headings; avoid long paragraphs or essay-like text). IMPORTANT: When mentioning crop names, weeds, pests, or local terms, you MUST include the English name followed by the Tamil translation in parentheses (using Tamil script, e.g., Paddy (நெல்) or Turmeric (மஞ்சள்)). NEVER output Hindi names or Hindi script.",
};

async function callGroq(system: string, user: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{ text: user }]
      }],
      systemInstruction: {
        parts: [{ text: system }]
      },
      generationConfig: {
        temperature: 0.5,
      }
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini error:", res.status, text);
    throw new Error(`Gemini API error (${res.status})`);
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "No response.";
}

export const callAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { agentType: string; inputs: Record<string, string>; language?: string }) => input,
  )
  .handler(async ({ data, context }) => {
    let system = SYSTEM_PROMPTS[data.agentType];
    if (!system) throw new Error("Unknown agent type");

    if (data.language === "tamil") {
      system += " IMPORTANT: You MUST write your entire response in Tamil script. Keep the structure, bold headings, and short bullet points intact, but write all explanations, instructions, recommendations, and local terms in fluent Tamil. Avoid Hindi words or Hindi script under all circumstances.";
    }

    const userMsg = Object.entries(data.inputs)
      .filter(([, v]) => v && v.trim() !== "")
      .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
      .join("\n");

    const output = await callGroq(system, userMsg || "(no inputs provided)");

    const { error } = await context.supabase.from("agent_history").insert({
      user_id: context.userId,
      agent_type: data.agentType,
      input_json: { ...data.inputs, language: data.language },
      output_text: output,
    });
    if (error) console.error("history insert error:", error);

    return { output };
  });

export const fetchHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("agent_history")
      .select("id, agent_type, input_json, output_text, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    return { history: data ?? [] };
  });

async function callGroqVision(system: string, userPrompt: string, base64Image: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [
          { text: userPrompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          }
        ]
      }],
      systemInstruction: {
        parts: [{ text: system }]
      },
      generationConfig: {
        temperature: 0.2,
      }
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini Vision error:", res.status, text);
    throw new Error(`Gemini Vision API error (${res.status})`);
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "No response.";
}

export const detectCropDisease = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { base64Image?: string; problemDescription?: string; cropType: string; language?: string }) => input,
  )
  .handler(async ({ data, context }) => {
    let system = "You are a professional agronomist and plant pathologist specializing in agricultural practices in Tamil Nadu, India. Identify crop diseases and suggest local organic manures (like Panchagavya, neem cake manure, vermicompost, bio-inoculants) and appropriate medicinal treatments (chemical/biological fungicides/pesticides). You MUST follow a strict output format, keep explanations short and bulleted, and avoid long paragraphs or filler text.";
    
    if (data.language === "tamil") {
      system += " IMPORTANT: You MUST write your entire response (except the headers '### Disease Name:', '**How it comes**:', '**Solution to clear this**:', and '**How to prevent for future**:') in Tamil script. The headers must be written exactly as specified in English, but all explanations, details, disease names, treatments, and organic remedies under them must be written in fluent Tamil.";
    }

    const userPrompt = `Identify the crop disease for ${data.cropType || "the crop"}.
${data.problemDescription ? `User's description of symptoms/problem: "${data.problemDescription}"` : ""}
${data.base64Image ? "An image of the plant has been provided." : "No image was provided; diagnose based on the description of symptoms."}

You MUST structure your response exactly like this. Keep it extremely brief and use short bullet points. Do not write essays or long paragraphs:

### Disease Name: [Name of disease]
**How it comes**:
- [Point 1]
- [Point 2]

**Solution to clear this**:
- [Point 1 (Specify chemical medicine, bio-control, or organic manure e.g. Panchagavya, neem cake)]
- [Point 2]

**How to prevent for future**:
- [Point 1]
- [Point 2]`;

    try {
      let output = "";
      if (data.base64Image) {
        output = await callGroqVision(system, userPrompt, data.base64Image);
      } else if (data.problemDescription) {
        output = await callGroq(system, userPrompt);
      } else {
        throw new Error("Either an image or a problem description must be provided.");
      }
      
      const { error } = await context.supabase.from("agent_history").insert({
        user_id: context.userId,
        agent_type: `disease_scan:${data.cropType || "unknown"}`,
        input_json: { crop: data.cropType, hasImage: !!data.base64Image, hasDescription: !!data.problemDescription, language: data.language },
        output_text: output,
      });
      if (error) console.error("history insert error:", error);

      return { output };
    } catch (e) {
      console.error("Vision detection error:", e);
      throw new Error(e instanceof Error ? e.message : "Failed to analyze crop problem");
    }
  });
