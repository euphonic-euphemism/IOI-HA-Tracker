import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export const PatientForm = ({ onAddPatient }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        fitDate: new Date().toISOString().split('T')[0],
        model: '',
        userType: 'New'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPatient = {
            id: Date.now(),
            ...formData,
            ioiScore: null,
            ioiDetails: null, // Array of 7 scores
            q8Score: null,
            pdsaNotes: ''
        };
        onAddPatient(newPatient);

        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            fitDate: new Date().toISOString().split('T')[0],
            model: '',
            userType: 'New'
        });
    };

    return (
        <Card className="lg:col-span-1 h-fit">
            <CardHeader>
                <CardTitle>Add New Patient</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">First Name</label>
                            <input
                                required
                                type="text"
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Last Name</label>
                            <input
                                required
                                type="text"
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
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
                                onChange={e => setFormData({ ...formData, fitDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">User Type</label>
                            <select
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.userType}
                                onChange={e => setFormData({ ...formData, userType: e.target.value })}
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
                            onChange={e => setFormData({ ...formData, model: e.target.value })}
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
    );
};
