export const MOOD_COLORS: {
    [mood: string]: { background: string; text: string };
} = {
    // Positive
    Happy:     { background: "#FDE68A", text: "#374151" }, // pastel yellow, cheerful & readable
    Excited:   { background: "#FDBA74", text: "#374151" }, // peachy orange, vibrant but soft
    Grateful:  { background: "#A7F3D0", text: "#065F46" }, // mint green, fresh & balanced
    Peaceful:  { background: "#BFDBFE", text: "#1E3A8A" }, // light sky blue, calm and gentle
    Loved:     { background: "#FBCFE8", text: "#831843" }, // soft pink, affectionate warmth

    // Neutral / Reflective
    Thoughtful:{ background: "#E9D5FF", text: "#4B0082" }, // lavender, reflective and subtle
    Tired:     { background: "#E5E7EB", text: "#374151" }, // pale gray, quiet & subdued

    // Challenging
    Sad:       { background: "#C7D2FE", text: "#1E3A8A" }, // pastel indigo, melancholic but soft
    Anxious:   { background: "#FDE2E2", text: "#7F1D1D" }, // muted rose, tense but not harsh
    Angry:     { background: "#FCA5A5", text: "#7F1D1D" }, // pastel red, emotional but not piercing
};
