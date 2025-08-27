import { useState } from "react";
import "../styles/HomeSection.css";
import CustomLegend from "./CutomLegend";
import MyPieChart from "./MyPieChart";
import OtherStatistics from "./OtherStatistics";
import RecentEntriesCard from "./RecentEntriesCard";

type MoodData = {
    mood: string,
    value: number,
    color: string,
};

type OtherStats = {
    mostLoggedMood: { mood: string, value: number } | null;
    totalEntriesCount: number;
    streak: number;
};

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

    return (
        <div className="main-home-container">
            
            <div className="analytics-container">

                <div className="piechart-container">
                    <MyPieChart
                        onDataLoaded={(data, stats) => {
                            setMoodData(data);
                            setOtherStats(stats);
                        }}
                    />
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