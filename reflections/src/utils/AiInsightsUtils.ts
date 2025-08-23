
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
                        content: `You are an assistant that analyzes journal entries. 
                            Return ONLY a valid JSON object with the following keys:
                            - mood (string) → short mood description like "Calm", "Happy", "Grateful".
                            - moodColor (object) → with "background" (hex color) and "text" (hex color) that matches the mood semantically.
                            - tags (array of strings).
                            - tagColors (array of objects) → each with {"background": hex, "text": hex}, one color for each tag. 
                                Use soft, minimal, pastel-like colors (no bright/neon/plain primary colors).
                            - insights (string).
                            Example:
                            {
                                "mood": "Calm",
                                "moodColor": { "background": "#D1FAE5", "text": "#065F46" },
                                "tags": ["morning", "peaceful"],
                                "tagColors": [
                                    { "background": "#E0F2FE", "text": "#075985" },
                                    { "background": "#FDE68A", "text": "#92400E" }
                                ],
                                "insights": "You are feeling calm and refreshed. (25 - 100 words)"
                            }
                            NO explanations, no extra text. Only valid JSON.`

                    },
                    {
                        role: "user",
                        content: `Analyze the following journal entry: """${textarea}""" 
            and respond ONLY in JSON: {"mood": "...", "moodColor": {"background":"...","text":"..."}, "tags": ["..."], "tagColors": [{"background":"...","text":"..."}], "insights": "..."}.`
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

            setMood(insights.mood);
            setMoodColor(insights.moodColor);
            setTags(insights.tags || []);
            setInsight(insights.insights);
            setTagColors(insights.tagColors);

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