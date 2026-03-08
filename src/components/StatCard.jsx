import React from 'react';
import { Card } from './ui/Card';

export const StatCard = ({ title, mean, median, count, icon: Icon, colorClass }) => (
    <Card className="flex-1 min-w-[240px]">
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h4>
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                    <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-slate-400">Mean Score</p>
                    <p className="text-2xl font-bold text-slate-800">{mean}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Median Score</p>
                    <p className="text-2xl font-bold text-slate-800">{median}</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">Based on {count} patients</p>
            </div>
        </div>
    </Card>
);
