import React from 'react';
import { Card } from './ui/Card';

export const StatCard = ({ title, mean, factor1Mean, factor2Mean, count, icon: Icon, colorClass }) => (
    <Card className="flex-1 min-w-[240px]">
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h4>
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                    <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-xs text-slate-400">Total IOI-HA Mean</p>
                    <p className="text-2xl font-bold text-slate-800">{mean}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                    <div>
                        <p className="text-xs text-slate-400" title="Factor 1: Technology & Fitting">Tech / Fit</p>
                        <p className="text-lg font-semibold text-slate-700">{factor1Mean || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400" title="Factor 2: Lifestyle & Counseling">Life / Counsel</p>
                        <p className="text-lg font-semibold text-slate-700">{factor2Mean || "N/A"}</p>
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">Based on {count} patients</p>
            </div>
        </div>
    </Card>
);
