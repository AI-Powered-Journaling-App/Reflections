import { useEffect, useState } from "react";
import { getUserMoodData } from "../../../utils/HomeSectionUtils";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { easeInOut, motion } from "framer-motion";
import type { MoodData, OtherStats } from "../../../types/entry";

import "../../../styles/charts/MyPieChart.css";

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

            <motion.h3
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1, scale: 1,
                    transition: { duration: 1, type: "spring", stiffness: 250, damping: 30, ease: easeInOut}
                }}
                className="chart-title"
            >
                Mood Distribution
            </motion.h3>

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

// helper functions
interface CustomLabelLineProps {
    points?: Array<{ x: number; y: number }>;
}

const renderCustomLabelLine = ({ points }: CustomLabelLineProps) => {
    if (!points || points.length === 0) {
        return <polyline points="" stroke="none" fill="none" />;
    }
    return (
        <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            stroke="var(--txt-primary)"
            strokeWidth={1}
            fill="none"
        />
    );
};

interface CustomLabelProps {
    cx?: number;
    cy?: number;
    midAngle?: number;
    outerRadius?: number;
    percent?: number;
    name?: string;
}

const renderCustomLabel = (props: CustomLabelProps) => {
    const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0, name } = props;

    if (!name) {
        return <text />;
    }

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="var(--txt-primary)"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={14}
        >
            {`${name}: ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


