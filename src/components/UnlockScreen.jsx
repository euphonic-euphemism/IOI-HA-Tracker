import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Database, AlertCircle } from 'lucide-react';

export const UnlockScreen = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [isExisting, setIsExisting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if a database already exists in localStorage
        const storedData = localStorage.getItem('pdsa_patients_db');
        if (storedData) {
            setIsExisting(true);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!password.trim()) {
            setError('Please enter a password.');
            return;
        }

        // Pass the password up. The parent App / hook will attempt decryption
        // and return true if successful, false otherwise.
        const success = onUnlock(password);

        if (!success) {
            setError(isExisting ? 'Incorrect password or corrupted database.' : 'Failed to initialize database.');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
                <div className="bg-slate-50 p-6 border-b border-slate-100 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isExisting ? <Lock size={32} /> : <Database size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {isExisting ? 'Unlock Database' : 'Initialize Database'}
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">
                        {isExisting
                            ? 'Enter the AES-256 encryption key to decrypt your clinic records.'
                            : 'Create a master password to encrypt your new patient database. Do not lose this password!'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {isExisting ? 'Master Password' : 'New Master Password'}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            placeholder="••••••••••••"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        {isExisting ? <Unlock size={18} /> : <Lock size={18} />}
                        {isExisting ? 'Decrypt & Open' : 'Encrypt & Initialize'}
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                            <Lock size={12} /> Securely encrypted via local AES-256
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
