import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calculator, Calendar, User, Activity, FileText, ChevronDown, ChevronUp, Trash2, Save, X, AlertCircle, BarChart2 } from 'lucide-react';

// --- Card Components ---
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
    </div>
);

const CardHeader = ({ children, className = "" }) => (
    <div className={`px-6 py-4 border-b border-slate-100 ${className}`}>
    {children}
    </div>
);

const CardTitle = ({ children, className = "" }) => (
    <h3 className="text-lg font-semibold text-slate-800">{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>
    {children}
    </div>
);

// --- Stat Card ---
const StatCard = ({ title, mean, median, count, icon: Icon, colorClass }) => (
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

// --- Main Application ---
export default function IOIHATracker() {
    // --- State ---
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        fitDate: new Date().toISOString().split('T')[0],
                                             model: '',
                                             userType: 'New'
    });

    // --- Norms Data (Cox, Alexander, & Beyer, 2002) ---
    // Ranges represent the "middle 50%" of individual clients
    const NORMS = {
        // Group A: Subjective problems = none, mild, moderate
        mildModerate: {
            1: [3, 5], // Use
            2: [3, 4], // Benefit
            3: [3, 4], // RAL
            4: [2, 4], // Satisfaction
            5: [3, 4], // RPR
            6: [3, 5], // Impact on Others
            7: [3, 4]  // Quality of Life
        },
        // Group B: Subjective problems = moderately-severe, severe
        modSevere: {
            1: [4, 5],
            2: [3, 4],
            3: [2, 4],
            4: [3, 5],
            5: [3, 4],
            6: [2, 4],
            7: [3, 4]
        }
    };

    // Full IOI-HA Questions and Answers
    const ioiData = [
        {
            id: 1,
            title: "1. Daily Use",
            question: "Think about how much you used your present hearing aid(s) over the past two weeks. On an average day, how many hours did you use the hearing aid(s)?",
            options: [
                { val: 1, label: "None" },
                { val: 2, label: "Less than 1 hour a day" },
                { val: 3, label: "1 to 4 hours a day" },
                { val: 4, label: "4 to 8 hours a day" },
                { val: 5, label: "More than 8 hours a day" }
            ]
        },
        {
            id: 2,
            title: "2. Benefit",
            question: "Think about the situation where you most wanted to hear better, before you got your present hearing aid(s). Over the past two weeks, how much has the hearing aid helped in those situations?",
            options: [
                { val: 1, label: "Helped not at all" },
                { val: 2, label: "Helped slightly" },
                { val: 3, label: "Helped moderately" },
                { val: 4, label: "Helped quite a lot" },
                { val: 5, label: "Helped very much" }
            ]
        },
        {
            id: 3,
            title: "3. Residual Activity Limitation",
            question: "Think again about the situation where you most wanted to hear better. When you use your present hearing aid(s), how much difficulty do you still have in that situation?",
            options: [
                { val: 1, label: "Very much difficulty" },
                { val: 2, label: "Quite a lot of difficulty" },
                { val: 3, label: "Moderate difficulty" },
                { val: 4, label: "Slight difficulty" },
                { val: 5, label: "No difficulty" }
            ]
        },
        {
            id: 4,
            title: "4. Satisfaction",
            question: "Considering everything, do you think your present hearing aid(s) is worth the trouble?",
            options: [
                { val: 1, label: "Not at all worth it" },
                { val: 2, label: "Slightly worth it" },
                { val: 3, label: "Moderately worth it" },
                { val: 4, label: "Quite a lot worth it" },
                { val: 5, label: "Very much worth it" }
            ]
        },
        {
            id: 5,
            title: "5. Residual Participation Restriction",
            question: "Over the last two weeks, with your present hearing aid(s), how much have your hearing difficulties affected the things you can do or the places you can go?",
            options: [
                { val: 1, label: "Affected very much" },
                { val: 2, label: "Affected quite a lot" },
                { val: 3, label: "Affected moderately" },
                { val: 4, label: "Affected slightly" },
                { val: 5, label: "Affected not at all" }
            ]
        },
        {
            id: 6,
            title: "6. Impact on Others",
            question: "Over the last two weeks, with your present hearing aid(s), how much do you think other people were bothered by your hearing difficulties?",
            options: [
                { val: 1, label: "Bothered very much" },
                { val: 2, label: "Bothered quite a lot" },
                { val: 3, label: "Bothered moderately" },
                { val: 4, label: "Bothered slightly" },
                { val: 5, label: "Bothered not at all" }
            ]
        },
        {
            id: 7,
            title: "7. Quality of Life",
            question: "Considering everything, how much has your present hearing aid(s) changed your enjoyment of life?",
            options: [
                { val: 1, label: "Worse" },
                { val: 2, label: "No change" },
                { val: 3, label: "Slightly better" },
                { val: 4, label: "Quite a lot better" },
                { val: 5, label: "Very much better" }
            ]
        }
    ];

    // Question 8 Data (The Classifier)
    const q8Data = {
        id: 8,
        title: "8. Unaided Difficulty",
        question: "How much hearing difficulty do you have when you are not wearing a hearing aid?",
        options: [
            { val: 1, label: "None", group: 'mildModerate' },
            { val: 2, label: "Mild", group: 'mildModerate' },
            { val: 3, label: "Moderate", group: 'mildModerate' },
            { val: 4, label: "Moderately-severe", group: 'modSevere' },
            { val: 5, label: "Severe", group: 'modSevere' }
        ]
    };

    // State for the scoring modal
    // scoreInputs: indices 0-6 correspond to Q1-7
    const [scoreInputs, setScoreInputs] = useState(Array(7).fill(null));
    // q8Input: holds the value (1-5) of question 8
    const [q8Input, setQ8Input] = useState(null);

    // --- Helpers ---
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

    const calculateStats = (subset) => {
        const scoredPatients = subset.filter(p => p.ioiScore !== null);
        if (scoredPatients.length === 0) return { mean: "N/A", median: "N/A", count: 0 };

        const scores = scoredPatients.map(p => p.ioiScore).sort((a, b) => a - b);

        // Mean
        const sum = scores.reduce((a, b) => a + b, 0);
        const mean = (sum / scores.length).toFixed(1);

        // Median
        const mid = Math.floor(scores.length / 2);
        const median = scores.length % 2 !== 0
        ? scores[mid]
        : ((scores[mid - 1] + scores[mid]) / 2).toFixed(1);

        return { mean, median, count: scores.length };
    };

    // Determine which norm group applies
    const getNormGroup = (q8Val) => {
        if (!q8Val) return null;
        return q8Val <= 3 ? 'mildModerate' : 'modSevere';
    };

    // Check if a specific score is within norms
    const getNormStatus = (qId, val, q8Val) => {
        if (!q8Val || !val) return 'unknown';
        const group = getNormGroup(q8Val);
        const range = NORMS[group][qId];
        if (val < range[0]) return 'below';
        if (val > range[1]) return 'above'; // Rarely used as "bad", but "outside norm"
        return 'within';
    };

    const isValInNorm = (qId, val, q8Val) => {
        if (!q8Val) return false;
        const group = getNormGroup(q8Val);
        const range = NORMS[group][qId];
        return val >= range[0] && val <= range[1];
    }

    // --- Stats Calculation ---
    const stats = useMemo(() => {
        return {
            all: calculateStats(patients),
                          new: calculateStats(patients.filter(p => p.userType === 'New')),
                          experienced: calculateStats(patients.filter(p => p.userType === 'Experienced')),
        };
    }, [patients]);

    // --- Handlers ---
    const handleAddPatient = (e) => {
        e.preventDefault();
        const newPatient = {
            id: Date.now(),
            ...formData,
            ioiScore: null,
            ioiDetails: null, // Array of 7 scores
            q8Score: null,
            pdsaNotes: ''
        };
        setPatients([newPatient, ...patients]);
        setFormData({
            firstName: '',
            lastName: '',
            fitDate: new Date().toISOString().split('T')[0],
                    model: '',
                    userType: 'New'
        });
    };

    const openScoreModal = (patient) => {
        setCurrentPatientId(patient.id);
        setScoreInputs(patient.ioiDetails || Array(7).fill(null));
        setQ8Input(patient.q8Score || null);
        setIsModalOpen(true);
    };

    const saveScores = () => {
        if (!q8Input) {
            alert("Please answer Question 8 (Unaided Difficulty) to proceed with Norms.");
            return;
        }
        if (scoreInputs.some(s => s === null)) {
            alert("Please answer all questions before saving.");
            return;
        }

        const sum = scoreInputs.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        const average = parseFloat((sum / 7).toFixed(1));

        setPatients(patients.map(p =>
        p.id === currentPatientId
        ? { ...p, ioiScore: average, ioiDetails: [...scoreInputs], q8Score: q8Input }
        : p
        ));
        setIsModalOpen(false);
    };

    const deletePatient = (id) => {
        setPatients(patients.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
        <Activity className="text-blue-600" />
        Outcome Tracker (PDSA)
        </h1>
        <p className="text-slate-500 mt-1">Monitor IOI-HA benchmarks & patient follow-ups</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
        Population Count: {patients.length}
        </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
        title="All Patients"
        mean={stats.all.mean}
        median={stats.all.median}
        count={stats.all.count}
        icon={User}
        colorClass="bg-slate-500 text-slate-600"
        />
        <StatCard
        title="New Users"
        mean={stats.new.mean}
        median={stats.new.median}
        count={stats.new.count}
        icon={User}
        colorClass="bg-emerald-500 text-emerald-600"
        />
        <StatCard
        title="Exp. Users"
        mean={stats.experienced.mean}
        median={stats.experienced.median}
        count={stats.experienced.count}
        icon={User}
        colorClass="bg-indigo-500 text-indigo-600"
        />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 h-fit">
        <CardHeader>
        <CardTitle>Add New Patient</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleAddPatient} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">First Name</label>
        <input
        required
        type="text"
        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={formData.firstName}
        onChange={e => setFormData({...formData, firstName: e.target.value})}
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Last Name</label>
        <input
        required
        type="text"
        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={formData.lastName}
        onChange={e => setFormData({...formData, lastName: e.target.value})}
        />
        </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Fit Date</label>
        <input
        required
        type="date"
        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={formData.fitDate}
        onChange={e => setFormData({...formData, fitDate: e.target.value})}
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">User Type</label>
        <select
        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={formData.userType}
        onChange={e => setFormData({...formData, userType: e.target.value})}
        >
        <option value="New">New User</option>
        <option value="Experienced">Experienced</option>
        </select>
        </div>
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Hearing Aid Model</label>
        <input
        required
        type="text"
        placeholder="e.g. Phonak Lumity 90"
        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={formData.model}
        onChange={e => setFormData({...formData, model: e.target.value})}
        />
        </div>

        <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
        <Plus size={18} /> Add Patient
        </button>
        </form>
        </CardContent>
        </Card>

        {/* Patient List */}
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
                        onClick={() => openScoreModal(patient)}
                        className="flex items-center gap-2 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors"
                        >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${patient.ioiScore >= 4 ? 'bg-emerald-500' : patient.ioiScore >= 3 ? 'bg-amber-500' : 'bg-red-500'}`}>
                        {patient.ioiScore}
                        </div>
                        <span className="text-xs text-slate-500 hidden group-hover:inline">Edit</span>
                        </button>
                    ) : (
                        <button
                        onClick={() => openScoreModal(patient)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                        >
                        <Calculator size={14} /> Add Score
                        </button>
                    )}
                    </td>
                    <td className="px-6 py-4 text-right">
                    <button
                    onClick={() => deletePatient(patient.id)}
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
        </div>
        </div>

        {/* IOI-HA Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <Card className="w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <CardHeader className="flex justify-between items-center bg-slate-50 shrink-0">
            <div>
            <CardTitle>IOI-HA Assessment</CardTitle>
            <div className="flex gap-2 items-center mt-1">
            <span className="text-xs text-slate-500">Benchmark Norms: Cox, Alexander, & Beyer (2002)</span>
            </div>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                <BarChart2 size={14}/>
                Applying Norms for: <strong>{getNormGroup(q8Input) === 'mildModerate' ? 'Mild-Moderate' : 'Moderately-Severe +'}</strong> Difficulty
                </div>
            )}
            </div>

            {/* Questions 1-7 */}
            {ioiData.map((item, idx) => {
                // Determine status for current score if selected
                const status = getNormStatus(item.id, scoreInputs[idx], q8Input);

                return (
                    <div key={item.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                    <div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600 mb-3 italic">"{item.question}"</p>
                    </div>
                    {/* Validation Badge */}
                    {status === 'below' && (
                        <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                        <AlertCircle size={12}/> Below Norm
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
                        // Check if this specific option is within the norm range
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
                                {/* Norm Indicator Bar */}
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
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
            >
            Cancel
            </button>
            <button
            onClick={saveScores}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
            <Save size={18} /> Save Assessment
            </button>
            </div>
            </div>
            </Card>
            </div>
        )}
        </div>
    );
}
