import React, { useState } from 'react';
import { X, BarChart2, AlertCircle, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { ioiData, q8Data, getNormGroup, getNormStatus, isValInNorm } from '../data/norms';

export const AssessmentModal = ({ patient, onClose, onSave }) => {
    const [scoreInputs, setScoreInputs] = useState(patient.ioiDetails || Array(7).fill(null));
    const [q8Input, setQ8Input] = useState(patient.q8Score || null);

    const handleSave = () => {
        if (!q8Input) {
            alert("Please answer Question 8 (Unaided Difficulty) to proceed with Norms.");
            return;
        }
        if (scoreInputs.some(s => s === null)) {
            alert("Please answer all questions before saving.");
            return;
        }

        onSave(patient.id, scoreInputs, q8Input);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <Card className="w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <CardHeader className="flex justify-between items-center bg-slate-50 shrink-0">
                    <div>
                        <CardTitle>IOI-HA Assessment</CardTitle>
                        <div className="flex gap-2 items-center mt-1">
                            <span className="text-xs text-slate-500">Benchmark Norms: Cox, Alexander, & Beyer (2002)</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </CardHeader>
                <CardContent className="overflow-y-auto">
                    <div className="space-y-8">
                        {/* Question 8 - The Classifier */}
                        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-1">{q8Data.title} <span className="text-xs font-normal text-indigo-600 ml-2">(Required for Norms)</span></h4>
                            <p className="text-sm text-indigo-800 mb-3 italic">"{q8Data.question}"</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                {q8Data.options.map((opt) => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setQ8Input(opt.val)}
                                        className={`
                                            py-2 px-2 rounded-lg text-xs font-medium transition-all border
                                            ${q8Input === opt.val
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                                : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                            }
                                        `}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {q8Input && (
                                <div className="mt-3 text-xs text-indigo-600 flex items-center gap-2">
                                    <BarChart2 size={14} />
                                    Applying Norms for: <strong>{getNormGroup(q8Input) === 'mildModerate' ? 'Mild-Moderate' : 'Moderately-Severe +'}</strong> Difficulty
                                </div>
                            )}
                        </div>

                        {/* Questions 1-7 */}
                        {ioiData.map((item, idx) => {
                            const status = getNormStatus(item.id, scoreInputs[idx], q8Input);

                            return (
                                <div key={item.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{item.title}</h4>
                                            <p className="text-sm text-slate-600 mb-3 italic">"{item.question}"</p>
                                        </div>
                                        {status === 'below' && (
                                            <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                                <AlertCircle size={12} /> Below Norm
                                            </div>
                                        )}
                                        {status === 'within' && (
                                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                                Within Norm
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {item.options.map((opt) => {
                                            const isNorm = isValInNorm(item.id, opt.val, q8Input);
                                            const isSelected = scoreInputs[idx] === opt.val;

                                            return (
                                                <button
                                                    key={opt.val}
                                                    onClick={() => {
                                                        const newScores = [...scoreInputs];
                                                        newScores[idx] = opt.val;
                                                        setScoreInputs(newScores);
                                                    }}
                                                    className={`
                                                        text-left px-4 py-3 rounded-lg text-sm transition-all border relative overflow-hidden
                                                        ${isSelected
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200 ring-offset-1'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                                        }
                                                    `}
                                                >
                                                    {isNorm && (
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSelected ? 'bg-white/50' : 'bg-emerald-400'}`} title="Normative Range"></div>
                                                    )}

                                                    <div className="flex items-center gap-3 pl-2">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0
                                                            ${isSelected ? 'border-white' : 'border-slate-300'}
                                                        `}>
                                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className="flex-1">{opt.label}</span>
                                                        {isNorm && !isSelected && <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">Norm</span>}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <div className="p-6 border-t border-slate-100 mt-auto bg-slate-50 rounded-b-xl flex justify-between items-center shrink-0">
                    <div className="text-sm font-medium text-slate-600">
                        Score: {scoreInputs.filter(s => s !== null).length} / 7 Completed
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            <Save size={18} /> Save Assessment
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
