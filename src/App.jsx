import React, { useState } from 'react';
import { Activity, Lock } from 'lucide-react';
import { usePatients } from './hooks/usePatients';
import { StatsDashboard } from './components/StatsDashboard';
import { PatientForm } from './components/PatientForm';
import { PatientList } from './components/PatientList';
import { AssessmentModal } from './components/AssessmentModal';
import { UnlockScreen } from './components/UnlockScreen';
import { decryptData } from './utils/crypto';

function App() {
  const [encryptionKey, setEncryptionKey] = useState(null);

  // Only pass the encryption key down once it's set
  const { patients, addPatient, deletePatient, updatePatient, stats } = usePatients(encryptionKey);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  const handleUnlock = (password) => {
    const storedData = localStorage.getItem('pdsa_patients_db');

    // If a DB exists, attempt to decrypt it to verify the password is correct
    if (storedData) {
      const testDecrypt = decryptData(storedData, password);
      if (testDecrypt) {
        setEncryptionKey(password);
        return true;
      } else {
        return false; // Wrong password
      }
    } else {
      // No DB exists yet. The password provided is the new master password.
      setEncryptionKey(password);
      return true;
    }
  };

  if (!encryptionKey) {
    return <UnlockScreen onUnlock={handleUnlock} />;
  }

  const handleLock = () => {
    setEncryptionKey(null);
  };

  const handleOpenModal = (patient) => {
    setCurrentPatient(patient);
    setIsModalOpen(true);
  };

  const handleSaveAssessment = (id, ioiDetails, q8Score) => {
    const sum = ioiDetails.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const average = parseFloat((sum / 7).toFixed(1));

    updatePatient(id, {
      ioiScore: average,
      ioiDetails: ioiDetails,
      q8Score: q8Score
    });
    setIsModalOpen(false);
    setCurrentPatient(null);
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
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
              Population Count: {patients.length}
            </div>
            <button
              onClick={handleLock}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Lock Database"
            >
              <Lock size={18} />
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard stats={stats} patients={patients} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <PatientForm onAddPatient={addPatient} />

          {/* Patient List */}
          <PatientList
            patients={patients}
            onDelete={deletePatient}
            onOpenModal={handleOpenModal}
          />
        </div>
      </div>

      {/* IOI-HA Modal */}
      {isModalOpen && currentPatient && (
        <AssessmentModal
          patient={currentPatient}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAssessment}
        />
      )}
    </div>
  );
}

export default App;
