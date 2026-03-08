import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceArea,
    ResponsiveContainer,
    Scatter
} from 'recharts';

export const RunChart = ({ patients }) => {
    const chartData = useMemo(() => {
        // We want chronological order (oldest to newest) to show a run chart
        // Assuming the patients array is newest-first (from usePatients addPatient prepending),
        // we should reverse it for chronological display.
        const chronologicalPatients = [...patients].reverse();

        let cumulativeSum = 0;
        let count = 0;

        return chronologicalPatients.map((p, index) => {
            // Only include patients who have a score
            if (p.ioiScore != null) {
                count++;
                cumulativeSum += p.ioiScore;
            }
            return {
                patientNumber: index + 1,
                individualScore: p.ioiScore,
                runningAverage: count > 0 ? parseFloat((cumulativeSum / count).toFixed(2)) : null,
            };
        }).filter(data => data.individualScore != null); // remove patients with no score from plot
    }, [patients]);

    if (!chartData || chartData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center h-[300px]">
                <p className="text-slate-500">Add patients with IOI-HA scores to view the running average.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Cumulative Average IOI-HA Score</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="patientNumber"
                            tick={{ fill: '#64748B' }}
                            axisLine={{ stroke: '#CBD5E1' }}
                            tickLine={false}
                            label={{ value: 'Patient Count n', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis
                            domain={[1, 5]}
                            ticks={[1, 2, 3, 4, 5]}
                            tick={{ fill: '#64748B' }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'IOI-HA Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value, name) => [value, name === 'runningAverage' ? 'Running Avg' : 'Individual Score']}
                            labelFormatter={(label) => `Patient #${label}`}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            formatter={(value) => <span style={{ color: '#334155', fontWeight: 500 }}>{value}</span>}
                        />

                        {/* Normative Data Reference Area (General Approximate Range 2.8 - 4.3 for mixed domains) */}
                        <ReferenceArea
                            y1={2.8}
                            y2={4.3}
                            fill="#ccfbf1"
                            fillOpacity={0.5}
                            strokeOpacity={0}
                            ifOverflow="visible"
                        />
                        <ReferenceArea
                            y1={2.8}
                            y2={4.3}
                            fill="transparent"
                            stroke="#14b8a6"
                            strokeOpacity={0.6}
                            strokeDasharray="3 3"
                            ifOverflow="visible"
                        />

                        <Line
                            type="monotone"
                            dataKey="runningAverage"
                            stroke="#2563EB"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                            name="Running Average"
                        />

                        {/* We can use Line with stroke "none" and dots to act like a scatter plot for individual items if we want, or just a scatter */}
                        <Line
                            type="monotone"
                            dataKey="individualScore"
                            stroke="none"
                            dot={{ r: 4, fill: '#94A3B8', strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#64748B', strokeWidth: 0 }}
                            name="Individual Score"
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-teal-50 border border-teal-500 border-dashed"></div>
                    <span>Normative Target Range (2.8 - 4.3)</span>
                </div>
            </div>
        </div>
    );
};
