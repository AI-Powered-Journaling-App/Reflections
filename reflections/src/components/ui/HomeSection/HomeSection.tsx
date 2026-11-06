import { useState, useCallback } from "react";
import "../../../styles/ui/HomeSection.css";
import CustomLegend from "../../charts/CustomLegend/CustomLegend";
import MyPieChart from "../../charts/MyPieChart/MyPieChart";
import OtherStatistics from "../../charts/OtherStatistics/OtherStatistics";
import RecentEntriesCard from "../../entries/RecentEntriesCard/RecentEntriesCard";
import type { MoodData, OtherStats } from "../../../types/entry";

type HomeSectionProps = {
    setIsHomeSection: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAddEntrySection: React.Dispatch<React.SetStateAction<boolean>>,
    setIsYourEntriesSection: React.Dispatch<React.SetStateAction<boolean>>
};

const HomeSection: React.FC<HomeSectionProps> = ({ setIsHomeSection, setIsAddEntrySection, setIsYourEntriesSection }) => {
    
    const [moodData, setMoodData] = useState<MoodData[]>([]);
    const [otherStats, setOtherStats] = useState<OtherStats>({
        mostLoggedMood: null,
        totalEntriesCount: 0,
        streak: 0,
    });

    const handleDataLoaded = useCallback((data: MoodData[], stats: OtherStats) => {
        setMoodData(data);
        setOtherStats(stats);
    }, []);

    return (
        <div className="main-home-container">
            
            <div className="analytics-container">

                <div className="piechart-container">
                    <MyPieChart onDataLoaded={handleDataLoaded} />
                </div>

                <div className="legend-container">
                    <CustomLegend data={moodData} />
                </div>

                <div className="other-statistics-container">
                    <OtherStatistics stats={otherStats} />
                </div>

            </div>

            <RecentEntriesCard
                setIsHomeSection={setIsHomeSection}
                setIsAddEntrySection={setIsAddEntrySection}
                setIsYourEntriesSection={setIsYourEntriesSection}
            />

        </div>
    );
}

export default HomeSection;
