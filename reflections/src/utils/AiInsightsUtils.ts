import { MOOD_COLORS } from "./MoodColors";
import type { TagColor, MoodColor } from "../types/entry";

type GetAiInsightsProps = {
    textarea: string;
    setTags: React.Dispatch<React.SetStateAction<string[] | never[]>>;
    setTagColors: React.Dispatch<React.SetStateAction<TagColor[]>>;
    setMood: React.Dispatch<React.SetStateAction<string>>;
    setMoodColor: React.Dispatch<React.SetStateAction<MoodColor | undefined>>;
    setInsight: React.Dispatch<React.SetStateAction<string>>;
    showNotification: (text: string) => void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface AiInsightsResult {
    mood: string;
    moodColor: MoodColor;
    tags: string[];
    tagColors: TagColor[];
    insights: string;
}

// Default models to try in order of priority
const getCandidateModels = (): string[] => {
    const customModel = import.meta.env.VITE_GROQ_MODEL;
    const defaults = [
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "qwen/qwen3.8-27b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
    ];

    if (customModel && !defaults.includes(customModel)) {
        return [customModel, ...defaults];
    }
    return defaults;
};

// Curated aesthetic pastel palette with high-contrast, accessible dark text
export const FALLBACK_TAG_PALETTE: TagColor[] = [
    { background: "#FEE2E2", text: "#991B1B" }, // Rose / Warm Red
    { background: "#E0F2FE", text: "#075985" }, // Sky Blue
    { background: "#D1FAE5", text: "#065F46" }, // Mint / Emerald Green
    { background: "#FEF3C7", text: "#92400E" }, // Soft Amber / Gold
    { background: "#EDE9FE", text: "#5B21B6" }, // Lavender / Deep Violet
    { background: "#FCE7F3", text: "#9D174D" }, // Soft Pink / Magenta
    { background: "#CCFBF1", text: "#115E59" }, // Fresh Teal
    { background: "#FFEDD5", text: "#9A3412" }, // Peachy Orange
];

const isValidHex = (val: unknown): boolean =>
    typeof val === "string" && /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val.trim());

// Helper to normalize tag colors into expected { background, text } shape
// Strictly iterates over tags so EVERY tag gets a valid color, matching 1:1 by index
export const normalizeTagColors = (rawColors: unknown, tags: string[]): TagColor[] => {
    return tags.map((tag, idx) => {
        const fallback = FALLBACK_TAG_PALETTE[idx % FALLBACK_TAG_PALETTE.length];

        // 1. If rawColors is an array and has an item at index idx
        if (Array.isArray(rawColors) && rawColors[idx]) {
            const item = rawColors[idx];
            if (item && typeof item === "object") {
                const bg = (item as { background?: unknown }).background;
                const txt = (item as { text?: unknown }).text;
                if (isValidHex(bg) && isValidHex(txt)) {
                    return { background: String(bg).trim(), text: String(txt).trim() };
                }
                if (isValidHex(bg)) {
                    return { background: String(bg).trim(), text: fallback.text };
                }
            }
            if (isValidHex(item)) {
                return { background: String(item).trim(), text: fallback.text };
            }
        }

        // 2. If rawColors is an object/map keyed by tag name e.g. { "conflict": { background, text } } or { "conflict": "#hex" }
        if (rawColors && typeof rawColors === "object" && !Array.isArray(rawColors)) {
            const map = rawColors as Record<string, unknown>;
            const match = map[tag] || map[tag.toLowerCase()];
            if (match && typeof match === "object") {
                const bg = (match as { background?: unknown }).background;
                const txt = (match as { text?: unknown }).text;
                if (isValidHex(bg) && isValidHex(txt)) {
                    return { background: String(bg).trim(), text: String(txt).trim() };
                }
                if (isValidHex(bg)) {
                    return { background: String(bg).trim(), text: fallback.text };
                }
            }
            if (isValidHex(match)) {
                return { background: String(match).trim(), text: fallback.text };
            }
        }

        // 3. Fallback to curated aesthetic palette
        return fallback;
    });
};

interface GroqResponseData {
    choices: Array<{
        message?: {
            content?: string;
        };
    }>;
    error?: {
        message?: string;
        code?: string;
    };
}

// Helper to make a Groq chat completion call with automatic model fallback
const callGroqWithFallback = async (
    payloadGenerator: (model: string) => object,
    apiKey: string
): Promise<{ ok: boolean; data?: GroqResponseData; error?: string }> => {
    const candidateModels = getCandidateModels();
    let lastError = "Unable to connect to Groq API";

    for (const model of candidateModels) {
        try {
            const body = payloadGenerator(model);
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify(body),
            });

            const data: GroqResponseData = await response.json();

            if (response.ok && data.choices?.[0]?.message?.content) {
                return { ok: true, data };
            }

            if (data?.error?.code === "model_decommissioned" || response.status === 404 || data?.error?.message?.includes("does not exist")) {
                console.warn(`Groq model ${model} unavailable, trying fallback model...`);
                lastError = data?.error?.message || `Model ${model} unavailable`;
                continue;
            }

            // If it's a rate limit or another standard error, log and continue
            lastError = data?.error?.message || `Request failed with status ${response.status}`;
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Network error";
            console.error(`Error requesting Groq with model ${model}:`, err);
            lastError = errMsg;
        }
    }

    return { ok: false, error: lastError };
};

export const getAiInsights = async ({
    textarea,
    setTags,
    setTagColors,
    setMood,
    setMoodColor,
    setInsight,
    showNotification,
    setIsLoading,
}: GetAiInsightsProps): Promise<AiInsightsResult | null> => {
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
        showNotification("Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.");
        setIsLoading(false);
        return null;
    }

    try {
        const result = await callGroqWithFallback((model) => ({
            model: model,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an emotional intelligence and journaling assistant that analyzes journal entries and returns STRICT, VALID JSON ONLY.

MANDATORY RULES:
1. "mood": MUST be chosen ONLY from this exact list:
["Happy", "Excited", "Grateful", "Peaceful", "Loved", "Thoughtful", "Tired", "Sad", "Anxious", "Angry"]
Never invent other moods.

2. "tags": 2 to 4 concise, meaningful emotional or situational tags (1-2 words each, lowercase, e.g. ["conflict", "friendship", "regret"]).

3. "tagColors": An array of objects with "background" (hex) and "text" (hex).
- STRICT REQUIREMENT: The array "tagColors" MUST HAVE THE EXACT SAME LENGTH AS "tags".
- If there are 3 tags, there MUST be exactly 3 color objects in "tagColors", one for each tag in corresponding order.
- "background": MUST be a soft, light pastel tone (e.g. #FEE2E2, #E0F2FE, #D1FAE5, #FEF3C7, #EDE9FE, #FCE7F3, #CCFBF1, #FFEDD5).
- "text": MUST be a dark, high-contrast readable color that pairs cleanly with the background (e.g. #991B1B, #075985, #065F46, #92400E, #5B21B6, #9D174D, #115E59, #9A3412).

4. "insights": A 25–75 word empathetic, therapeutic response that:
   - Reflects what the user is experiencing,
   - Validates their feelings with kindness,
   - Suggests a grounded, practical way to cope or regulate.

RESPONSE FORMAT (JSON ONLY, NO MARKDOWN, NO CODE FENCES):
{
    "mood": "Sad",
    "tags": ["conflict", "friendship", "regret"],
    "tagColors": [
        { "background": "#FEE2E2", "text": "#991B1B" },
        { "background": "#E0F2FE", "text": "#075985" },
        { "background": "#D1FAE5", "text": "#065F46" }
    ],
    "insights": "25-75 words of reflection and therapeutic support."
}`
                },
                {
                    role: "user",
                    content: `Analyze this journal entry: """${textarea}"""`
                },
            ],
            temperature: 0.7,
        }), apiKey);

        if (!result.ok || !result.data || !result.data.choices?.[0]) {
            console.error("Groq API Error:", result.error);
            showNotification(result.error || "AI did not return a response");
            return null;
        }

        const rawText = result.data.choices[0].message?.content || "";
        const cleanedText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

        try {
            const parsed = JSON.parse(cleanedText);

            // Normalize mood to match known list
            let detectedMood = typeof parsed.mood === "string" ? parsed.mood.trim() : "";
            const matchedKey = Object.keys(MOOD_COLORS).find(
                (k) => k.toLowerCase() === detectedMood.toLowerCase()
            );

            if (matchedKey) {
                detectedMood = matchedKey;
            } else {
                // Fallback to Peaceful if not recognized
                detectedMood = "Peaceful";
            }

            const activeMoodColor = MOOD_COLORS[detectedMood] || MOOD_COLORS["Peaceful"];

            const rawTags = Array.isArray(parsed.tags) ? parsed.tags.map(String) : [];
            const activeTags = rawTags.length > 0 ? rawTags : ["Reflection"];
            const activeTagColors = normalizeTagColors(parsed.tagColors, activeTags);

            const activeInsight = Array.isArray(parsed.insights)
                ? parsed.insights.join(" ")
                : (typeof parsed.insights === "string" ? parsed.insights : "Thank you for reflecting today. Keep taking care of yourself.");

            // Update UI state
            setMood(detectedMood);
            setMoodColor(activeMoodColor);
            setTags(activeTags);
            setTagColors(activeTagColors);
            setInsight(activeInsight);

            return {
                mood: detectedMood,
                moodColor: activeMoodColor,
                tags: activeTags,
                tagColors: activeTagColors,
                insights: activeInsight,
            };
        } catch (parseErr) {
            console.error("Error parsing AI JSON output:", parseErr, rawText);
            showNotification("Error parsing AI response");
            return null;
        }
    } catch (err) {
        console.error("Unexpected error in getAiInsights:", err);
        showNotification("Error getting AI insights");
        return null;
    } finally {
        setIsLoading(false);
    }
};

export const generateTitle = async (
    textarea: string,
    showNotification: (text: string) => void
): Promise<string> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
        showNotification("Groq API Key is missing.");
        return "";
    }

    try {
        const result = await callGroqWithFallback((model) => ({
            model: model,
            messages: [
                {
                    role: "system",
                    content: `You generate journal entry titles.  

RULES:
- Keep it very short: 2–3 words.  
- If absolutely needed, max 4–5 words.  
- Must be relevant and simple, not poetic or overcomplicated.  
- Return ONLY the title text, no punctuation, no quotes, no emojis, no labels.`
                },
                {
                    role: "user",
                    content: `Entry: """${textarea}"""\nGenerate the best title following the rules.`
                }
            ],
            temperature: 0.6,
        }), apiKey);

        if (!result.ok || !result.data) {
            console.error("Groq Title Error:", result.error);
            showNotification("AI did not generate a title");
            return "";
        }

        let aiText = result.data.choices[0]?.message?.content?.trim() ?? "";
        // Clean quotes and "Title:" prefixes if any
        aiText = aiText.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();
        aiText = aiText.replace(/^title:\s*/i, "").trim();

        return aiText;
    } catch (err) {
        console.error("Error in generateTitle:", err);
        showNotification("Error generating title");
        return "";
    }
};
