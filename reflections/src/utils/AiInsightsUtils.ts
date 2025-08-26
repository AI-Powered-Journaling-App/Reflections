import { MOOD_COLORS } from "./MoodColors";

type getAiInsightsProps = {
    textarea: string,
    setTags: React.Dispatch<React.SetStateAction<never[]>>,
    setTagColors: React.Dispatch<React.SetStateAction<{ background: string; text: string; }[]>>,
    setMood: React.Dispatch<React.SetStateAction<string>>,
    setMoodColor: React.Dispatch<React.SetStateAction<{ background: string; text: string; } | undefined>>,
    setInsight: React.Dispatch<React.SetStateAction<string>>,
    showNotification: (text: string) => void,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export const getAiInsights = async ({ textarea, setTags, setTagColors, setMood, setMoodColor, setInsight, showNotification, setIsLoading }: getAiInsightsProps) => {

    setIsLoading(true);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "system",
                        content: `You are a journaling assistant that analyzes journal entries and must return ONLY valid JSON. 
                        You must strictly follow these instructions:

                        - The "mood" MUST be chosen ONLY from this exact list:
                        ["Happy", "Excited", "Grateful", "Peaceful", "Loved", "Thoughtful", "Tired", "Sad", "Anxious", "Angry"]

                        - Do NOT invent new moods.
                        - Also Do NOT use "FRUSTRATED" instead use "ANGRY".
                        - If the entry does not perfectly match, pick the CLOSEST option from the list above.
                        - NEVER output a mood outside of this set.

                        RESPONSE FORMAT:
                        {
                            "mood": "one of the moods above",
                            "tags": ["2-4 relevant tags"],
                            "tagColors": (array of objects) → each with {"background": hex, "text": hex}, (have relevent pastel-y colors
                            and try to give a good combination of background + text color which is readable, aesthetically good and somewhat dark-ish
                            so it doesn't blend in with the background)
                            "insights": "25–75 word response that:
                                1. Briefly reflects what the user is feeling (so they feel understood),
                                2. Offers gentle validation or condolence,
                                3. Suggests a practical way to regulate or cope with the emotion."
                        }

                        Example:
                            {
                                "mood": "Anxious",
                                "tags": ["overthinking", "stress"],
                                "tagColors": [
                                    { "background": "#FECACA", "text": "#7F1D1D" },
                                    { "background": "#E0F2FE", "text": "#075985" }
                                ],
                                "insights": "You seem worried and caught up in your thoughts. It makes sense to feel this way when things feel uncertain. Try grounding yourself with a few slow breaths or a short walk. You are not alone in this feeling, and calming your body can help ease your mind."
                            }
                        

                        RULES:
                        - Choose mood from the list above only.
                        - Tags must be short, simple, relevant
                        - Tag colors must be readable pastel-like combinations
                        - Insights must feel warm, supportive, and therapeutic
                        - Return ONLY the JSON, no other text`
                    },
                    {
                        role: "user",
                        content: `Analyze this journal entry: """${textarea}"""
                        and respond ONLY in JSON: { "mood": "...", "moodColor": { "background": "...", "text": "..." }, "tags": ["..."], "tagColors": [{ "background": "...", "text": "..." }], "insights": "..." }.`
                    },
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        const aiText = data.choices?.[0]?.message?.content ?? "";
        if (!aiText) {
            showNotification("AI did not return a response");
            return null;
        }

        try {
            const insights = JSON.parse(aiText);

            const detectedMood = insights.mood;
            if (MOOD_COLORS[detectedMood]) {
                setMood(detectedMood);
                setMoodColor(MOOD_COLORS[detectedMood]);
            } else {
                // Fallback to "Calm" if mood not recognized
                setMood("Calm");
                setMoodColor(MOOD_COLORS["Calm"]);
            }

            setTags(insights.tags || []);
            setInsight(insights.insights);
            setTagColors(insights.tagColors);

            return insights;
        } catch (err) {
            console.log(err);
            showNotification("Error parsing json file");
        }

    } catch (err) {
        console.log(err);
        showNotification("Error getting insights");
    } finally {
        setIsLoading(false);
    }
};

export const generateTitle = async (textarea: string, showNotification: (text: string) => void) => {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "system",
                        content: `You generate journal entry titles.  

                        RULES:
                        - Keep it very short: 2–3 words.  
                        - If absolutely needed, max 4–5 words.  
                        - Must be relevant and simple, not poetic or overcomplicated.  
                        - Return ONLY the title text, no punctuation, no quotes, no emojis.`
                    },
                    {
                        role: "user",
                        content: `Entry: """${textarea}"""  
                        Generate the best title following the rules.`
                    }
                ],
                temperature: 0.6,
            }),
        });

        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content?.trim() ?? "";

        if (!aiText) {
            showNotification("AI did not generate a title");
            return "";
        }

        return aiText;
    } catch (err) {
        console.error(err);
        showNotification("Error generating title");
        return "";
    }
};
