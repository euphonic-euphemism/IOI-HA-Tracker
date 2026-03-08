import React from 'react';
import { Calendar, AlertCircle, Calculator, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/Card';

export const PatientList = ({ patients, onDelete, onOpenModal }) => {
    const calculateMailDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 30);
        return date.toISOString().split('T')[0];
    };

    const isDueForMail = (fitDate) => {
        const today = new Date();
        const mailDate = new Date(calculateMailDate(fitDate));
        const diffTime = mailDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 5;
    };

    return (
        <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader>
                <CardTitle>Patient Roster</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Patient</th>
                            <th className="px-6 py-3">Fit Date</th>
                            <th className="px-6 py-3">Follow-up</th>
                            <th className="px-6 py-3">IOI-HA</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {patients.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    No patients added yet. Add a patient to start tracking outcomes.
                                </td>
                            </tr>
                        ) : (
                            patients.map(patient => {
                                const mailDate = calculateMailDate(patient.fitDate);
                                const due = isDueForMail(patient.fitDate);

                                return (
                                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{patient.lastName}, {patient.firstName}</div>
                                            <div className="text-xs text-slate-500">{patient.model} • {patient.userType}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {patient.fitDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full w-fit ${due ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                <Calendar size={14} />
                                                {mailDate}
                                                {due && <AlertCircle size={14} />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {patient.ioiScore ? (
                                                <button
                                                    onClick={() => onOpenModal(patient)}
                                                    className="flex items-center gap-2 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${patient.ioiScore >= 4 ? 'bg-emerald-500' : patient.ioiScore >= 3 ? 'bg-amber-500' : 'bg-red-500'}`}>
                                                        {patient.ioiScore}
                                                    </div>
                                                    <span className="text-xs text-slate-500 hidden group-hover:inline">Edit</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onOpenModal(patient)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    <Calculator size={14} /> Add Score
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onDelete(patient.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
