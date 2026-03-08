import React from 'react';
import { User } from 'lucide-react';
import { StatCard } from './StatCard';
import { RunChart } from './RunChart';
import { QuestionNormsChart } from './QuestionNormsChart';

export const StatsDashboard = ({ stats, patients }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="All Patients"
                    mean={stats.all.mean}
                    factor1Mean={stats.all.factor1Mean}
                    factor2Mean={stats.all.factor2Mean}
                    count={stats.all.count}
                    icon={User}
                    colorClass="bg-slate-500 text-slate-600"
                />
                <StatCard
                    title="New Users"
                    mean={stats.new.mean}
                    factor1Mean={stats.new.factor1Mean}
                    factor2Mean={stats.new.factor2Mean}
                    count={stats.new.count}
                    icon={User}
                    colorClass="bg-teal-600 text-teal-700"
                />
                <StatCard
                    title="Exp. Users"
                    mean={stats.experienced.mean}
                    factor1Mean={stats.experienced.factor1Mean}
                    factor2Mean={stats.experienced.factor2Mean}
                    count={stats.experienced.count}
                    icon={User}
                    colorClass="bg-indigo-500 text-indigo-600"
                />
            </div>
            {/* Run Chart for Cumulative Averages */}
            <RunChart patients={patients} />

            {/* Norms Chart for Individual Question Averages */}
            <QuestionNormsChart patients={patients} />
        </div>
    );
};
