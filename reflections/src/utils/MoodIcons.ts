import { faSmile, faBolt, faHeart, faSpa, faHandsPraying, faLightbulb, faBed, faFaceFrown, faFaceFlushed, faAngry } from "@fortawesome/free-solid-svg-icons";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const MOOD_ICONS: {
    [mood: string]: IconDefinition;
} = {
    Happy: faSmile,
    Excited: faBolt,
    Grateful: faHandsPraying,
    Peaceful: faSpa,
    Loved: faHeart,
    Thoughtful: faLightbulb,
    Tired: faBed,
    Sad: faFaceFrown,
    Anxious: faFaceFlushed,
    Angry: faAngry,
};
