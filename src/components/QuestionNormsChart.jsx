import React, { useState, useMemo } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Scatter
} from 'recharts';
import { NORMS, q8Data } from '../data/norms';

export const QuestionNormsChart = ({ patients }) => {
    const [filterMode, setFilterMode] = useState('all'); // 'all', 'mildModerate', 'modSevere'

    const chartData = useMemo(() => {
        // 1. Filter patients based on selected group and if they have an IOI assessment
        const validPatients = patients.filter(p => p.ioiDetails && p.ioiDetails.length === 7);

        const filteredPatients = validPatients.filter(p => {
            if (filterMode === 'all') return true;
            if (!p.q8Score) return false;
            const isMildMod = p.q8Score <= 3;
            return filterMode === 'mildModerate' ? isMildMod : !isMildMod;
        });

        if (filteredPatients.length === 0) return [];

        // 2. Calculate average score for each of the 7 questions
        const qAverages = [1, 2, 3, 4, 5, 6, 7].map(qNum => {
            const sum = filteredPatients.reduce((acc, p) => acc + parseInt(p.ioiDetails[qNum - 1]), 0);
            return parseFloat((sum / filteredPatients.length).toFixed(2));
        });

        // 3. Map to Recharts data format, including the corresponding norm ranges
        return [1, 2, 3, 4, 5, 6, 7].map((qNum, index) => {

            // Determine normative target range for this question based on the active filter
            let normMin = 1;
            let normMax = 5;

            if (filterMode === 'mildModerate') {
                normMin = NORMS.mildModerate[qNum][0];
                normMax = NORMS.mildModerate[qNum][1];
            } else if (filterMode === 'modSevere') {
                normMin = NORMS.modSevere[qNum][0];
                normMax = NORMS.modSevere[qNum][1];
            } else {
                // 'all' combines both into the absolute widest acceptable range for that question
                normMin = Math.min(NORMS.mildModerate[qNum][0], NORMS.modSevere[qNum][0]);
                normMax = Math.max(NORMS.mildModerate[qNum][1], NORMS.modSevere[qNum][1]);
            }

            return {
                question: `Q${qNum}`,
                averageScore: qAverages[index],
                rawScores: filteredPatients.map(p => parseInt(p.ioiDetails[qNum - 1])), // for scatter if needed
                normTarget: [normMin, normMax] // The Area chart will use an array for start/end points
            };
        });

    }, [patients, filterMode]);

    // Handle the tooltip display format cleanly
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Find payload items based on their dataKey
            const avgData = payload.find(p => p.dataKey === 'averageScore');
            const normData = payload.find(p => p.dataKey === 'normTarget');

            return (
                <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                    <p className="font-semibold text-slate-800 mb-1">{label} Average</p>
                    {avgData && <p className="text-blue-600 font-medium">Score: {avgData.value}</p>}
                    {normData && <p className="text-teal-700 text-sm mt-1">Norm Range: {normData.value[0]} - {normData.value[1]}</p>}
                </div>
            );
        }
        return null;
    };


    if (patients.filter(p => p.ioiDetails).length === 0) {
        return null; // Don't show chart if no one has an assessment yet
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Item Clinic Averages vs Norms</h3>
                    <p className="text-sm text-slate-500">Comparing individual IOI-HA questions against normative targets.</p>
                </div>

                {/* Filter Selection */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilterMode('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterMode === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    >
                        All Clients
                    </button>
                    <button
                        onClick={() => setFilterMode('mildModerate')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterMode === 'mildModerate' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    >
                        Mild/Moderate Diff.
                    </button>
                    <button
                        onClick={() => setFilterMode('modSevere')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterMode === 'modSevere' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    >
                        Mod-Severe Diff.
                    </button>
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-slate-500">No patients found in this group with completed assessments.</p>
                </div>
            ) : (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="question"
                                tick={{ fill: '#64748B' }}
                                axisLine={{ stroke: '#CBD5E1' }}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[1, 5]}
                                ticks={[1, 2, 3, 4, 5]}
                                tick={{ fill: '#64748B' }}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                formatter={(value) => <span style={{ color: '#334155', fontWeight: 500 }}>{value}</span>}
                            />

                            {/* Shaded Area for Normative Range */}
                            <Area
                                type="step"
                                dataKey="normTarget"
                                stroke="none"
                                fill="#0d9488"
                                fillOpacity={0.25}
                                name="Normative Range Target"
                                activeDot={false}
                            />

                            {/* Line for Actual Clinic Averages */}
                            <Line
                                type="monotone"
                                dataKey="averageScore"
                                stroke="#2563EB"
                                strokeWidth={3}
                                dot={{ r: 5, fill: '#2563EB', strokeWidth: 0 }}
                                activeDot={{ r: 7, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                                name="Clinic Average"
                            />

                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
