import React, { useState } from 'react';
import { Activity, Lock, KeyRound } from 'lucide-react';
import { usePatients } from './hooks/usePatients';
import { StatsDashboard } from './components/StatsDashboard';
import { PatientForm } from './components/PatientForm';
import { PatientList } from './components/PatientList';
import { AssessmentModal } from './components/AssessmentModal';
import { UnlockScreen } from './components/UnlockScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { decryptData } from './utils/crypto';

function App() {
  const [encryptionKey, setEncryptionKey] = useState(null);

  // Only pass the encryption key down once it's set
  const { patients, addPatient, deletePatient, updatePatient, stats } = usePatients(encryptionKey);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
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

  const handleChangePassword = (newPassword) => {
    // By simply updating the encryptionKey state, the usePatients hook will naturally 
    // trigger its useEffect, re-encrypt the current 'patients' array with this new key, 
    // and overwrite localStorage seamlessly.
    setEncryptionKey(newPassword);
  };

  const handleOpenModal = (patient) => {
    setCurrentPatient(patient);
    setIsModalOpen(true);
  };

  const handleSaveAssessment = (id, ioiDetails, q8Score) => {
    const sum = ioiDetails.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const average = parseFloat((sum / 7).toFixed(1));

    // Factor 1 (Tech/Fitting): Items 1, 2, 4, 7 (Indices 0, 1, 3, 6)
    const f1Sum = parseInt(ioiDetails[0]) + parseInt(ioiDetails[1]) + parseInt(ioiDetails[3]) + parseInt(ioiDetails[6]);
    const factor1 = parseFloat((f1Sum / 4).toFixed(1));

    // Factor 2 (Lifestyle/Counseling): Items 3, 5, 6 (Indices 2, 4, 5)
    const f2Sum = parseInt(ioiDetails[2]) + parseInt(ioiDetails[4]) + parseInt(ioiDetails[5]);
    const factor2 = parseFloat((f2Sum / 3).toFixed(1));

    updatePatient(id, {
      ioiScore: average,
      factor1Score: factor1,
      factor2Score: factor2,
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
              onClick={() => setIsChangePasswordOpen(true)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              title="Change Password"
            >
              <KeyRound size={18} />
            </button>
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
            onUpdate={updatePatient}
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

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal
          onClose={() => setIsChangePasswordOpen(false)}
          onChangePassword={handleChangePassword}
          currentEncryptionKey={encryptionKey}
        />
      )}
    </div>
  );
}

export default App;
