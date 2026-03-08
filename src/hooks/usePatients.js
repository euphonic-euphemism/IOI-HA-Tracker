import { useState, useMemo, useEffect } from 'react';
import { encryptData, decryptData } from '../utils/crypto';

const DB_KEY = 'pdsa_patients_db';

export function usePatients(encryptionKey) {
    const [patients, setPatients] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load & Decrypt
    useEffect(() => {
        if (!encryptionKey) return;

        try {
            const storedEncrypted = localStorage.getItem(DB_KEY);
            if (storedEncrypted) {
                const decrypted = decryptData(storedEncrypted, encryptionKey);
                if (decrypted) {
                    setPatients(decrypted);
                } else {
                    console.error("Failed to decrypt database on load.");
                }
            }
        } catch (err) {
            console.error("Error reading database:", err);
        } finally {
            setIsLoaded(true);
        }
    }, [encryptionKey]);

    // Save & Encrypt whenever patients change (only after initial load)
    useEffect(() => {
        if (!encryptionKey || !isLoaded) return;

        const encrypted = encryptData(patients, encryptionKey);
        if (encrypted) {
            localStorage.setItem(DB_KEY, encrypted);
        }
    }, [patients, encryptionKey, isLoaded]);


    const addPatient = (patient) => {
        setPatients(prev => [patient, ...prev]);
    };

    const updatePatient = (id, updates) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePatient = (id) => {
        setPatients(prev => prev.filter(p => p.id !== id));
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

    const stats = useMemo(() => {
        return {
            all: calculateStats(patients),
            new: calculateStats(patients.filter(p => p.userType === 'New')),
            experienced: calculateStats(patients.filter(p => p.userType === 'Experienced')),
        };
    }, [patients]);

    return {
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        stats
    };
}
