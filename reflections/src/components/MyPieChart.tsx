import { useEffect, useState } from "react";
import { getUserMoodData } from "../utils/HomeSectionUtils";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import "../styles/MyPieChart.css";

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

type MyPieChartProps = {
    onDataLoaded?: (data: MoodData[], stats: OtherStats) => void;
};

const MyPieChart: React.FC<MyPieChartProps> = ({ onDataLoaded }) => {

    const isMobile = window.innerWidth < 768;

    const [moodData, setMoodData] = useState<MoodData[]>([]);

    const [otherStats, setOtherStats] = useState<OtherStats>({
        mostLoggedMood: null,
        totalEntriesCount: 0,
        streak: 0,
    });

    useEffect(() => {
        const unsub = getUserMoodData(
            (data: MoodData[]) => setMoodData(data),
            (stats: OtherStats) => setOtherStats(stats)
        );

        return () => unsub();
    }, []);

    useEffect(() => {
        if (onDataLoaded) {
            onDataLoaded(moodData, otherStats);
        }
    }, [moodData, otherStats, onDataLoaded]);

    return (
        <div className="chart-card">
            <h3 className="chart-title">Mood Distribution</h3>

            {moodData.length === 0 ? (
                <div className="no-entries">
                    <p>No entries yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
                    <PieChart>
                        <Pie
                            data={moodData}
                            dataKey="value"
                            nameKey="mood"
                            cx="50%"
                            cy="50%"
                            outerRadius={isMobile ? 90 : 120}
                            innerRadius={isMobile ? 50 : 60}
                            paddingAngle={1}
                            label={!isMobile ? renderCustomLabel : false}
                            labelLine={!isMobile ? renderCustomLabelLine : false}
                        >
                            {moodData.map((mood, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={mood.color}
                                    stroke="var(--bg-primary)"
                                    style={{
                                        cursor: "default",
                                        outline: "none",
                                        boxShadow: "none",
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--accent-primary)",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "var(--txt-primary)" }}
                            labelStyle={{ color: "var(--txt-primary)" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default MyPieChart;

const renderCustomLabelLine = ({ points }: any) => {
    return (
        <polyline
            points={points.map((p: any) => `${p.x},${p.y}`).join(" ")}
            stroke="var(--txt-primary)"
            strokeWidth={1}
            fill="none"
        />
    );
};

const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, name } = props;

    if (!name) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // place label outside
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="var(--txt-primary)" // consistent color
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={14}
        >
            {`${name}: ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


