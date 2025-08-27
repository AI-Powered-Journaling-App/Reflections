import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPen,
    faBook,
    faBookOpen,
    faFeather,
    faLightbulb,
    faCalendar,
    faClock,
    type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

type IconPosition = {
    id: number;
    icon: IconDefinition;
    top: number;
    left: number;
    size: number;
    rotation: number;
}

import "../../../styles/ui/ScatteredIcons.css";
import { useEffect, useState } from "react";

const icons = [faPen, faBook, faBookOpen, faFeather, faLightbulb, faCalendar, faClock];

const ScatteredIcons = () => {

    const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);


    useEffect(() => {
        const generatePositions = () => {
            return Array.from({ length: 100 }).map((_, i) => ({
                id: i,
                icon: icons[Math.floor(Math.random() * icons.length)],
                top: Math.random() * 1620,
                left: Math.random() * 2880,
                size: 12 + Math.random() * 10,
                rotation: Math.random() * 360,
            }));
        };

        setIconPositions(generatePositions());
    }, []);

    return (
        <div className="scattered-icons">

            {iconPositions.map((iconData) => (
                <FontAwesomeIcon
                    key={iconData.id}
                    icon={iconData.icon}
                    style={{
                        position: "absolute",
                        top: `${iconData.top}px`,
                        left: `${iconData.left}px`,
                        fontSize: `${iconData.size}px`,
                        transform: `rotate(${iconData.rotation}deg)`,
                        opacity: 0.15,
                        color: "var(--txt-secondary)",
                        pointerEvents: "none",
                        transition: "none"
                    }}
                />
            ))}
            
        </div>
    );
}

export default ScatteredIcons;
