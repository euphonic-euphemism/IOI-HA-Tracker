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
                    count={stats.all.count}
                    icon={User}
                    colorClass="bg-slate-500 text-slate-600"
                />
                <StatCard
                    title="New Users"
                    mean={stats.new.mean}
                    count={stats.new.count}
                    icon={User}
                    colorClass="bg-emerald-500 text-emerald-600"
                />
                <StatCard
                    title="Exp. Users"
                    mean={stats.experienced.mean}
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
