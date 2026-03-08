import React, { useState } from 'react';
import { KeyRound, X, AlertCircle, Save } from 'lucide-react';

export const ChangePasswordModal = ({ onClose, onChangePassword, currentEncryptionKey }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }

        if (currentPassword !== currentEncryptionKey) {
            setError('Current password is incorrect.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (newPassword === currentPassword) {
            setError('New password must be different from current password.');
            return;
        }

        // Pass validation, trigger change up in App.jsx
        onChangePassword(newPassword);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <KeyRound size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Change Master Password</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Update the key used to encrypt your local database. Your data will be instantly re-encrypted.
                    </p>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm border border-red-100">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form id="change-password-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                placeholder="Enter current master key"
                            />
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                placeholder="Enter new master key"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                placeholder="Confirm new master key"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 font-medium rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="change-password-form"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Save size={18} />
                        Update & Re-encrypt
                    </button>
                </div>

            </div>
        </div>
    );
};
