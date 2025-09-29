import React, { useState, useEffect, useCallback } from 'react';
import { FaUserMd } from 'react-icons/fa';

const API_URL = 'https://medsetu-backend.onrender.com';

function PatientDashboard() {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [mappedDiagnosis, setMappedDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes] = await Promise.all([
                    fetch(`${API_URL}/api/patients`),
                    fetch(`${API_URL}/api/doctors`)
                ]);
                
                if (!patientsRes.ok || !doctorsRes.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const patientsData = await patientsRes.json();
                const doctorsData = await doctorsRes.json();
                
                setPatients(patientsData);
                setDoctors(doctorsData);
            } catch (err) {
                setError('Failed to fetch initial data. Please ensure the backend server is running and accessible.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchMappedDiagnosis = useCallback(async (code) => {
        if (!code) return;
        setMappedDiagnosis({ loading: true });
        try {
            const response = await fetch(`${API_URL}/api/map`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Mapping not found');
            }
            
            if (data && data.length > 0) {
                setMappedDiagnosis(data[0]);
            } else {
                setMappedDiagnosis({ error: "No valid mapping was returned from server" });
            }
        } catch (err) {
            setMappedDiagnosis({ error: err.message });
        }
    }, []);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setMappedDiagnosis(null);
        if (patient && patient.visit && patient.visit.diagnosis) {
            fetchMappedDiagnosis(patient.visit.diagnosis.code);
        }
    };
    
    const attendingDoctor = selectedPatient ? doctors.find(doc => doc.id === selectedPatient.doctorId) : null;

    if (loading) {
        return (
             <div className="search-container">
                <h1 className="search-title">Loading Patient Records...</h1>
            </div>
        );
    }
    if (error) {
        return (
            <div className="search-container">
                 <div className="error-box">{error}</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="patient-list-column">
                <h2 className="column-title">Patient Records ({patients.length})</h2>
                <div className="patient-list">
                    {patients.map((p) => (
                        <div
                            key={p.id}
                            className={`patient-list-item ${selectedPatient?.id === p.id ? 'selected' : ''}`}
                            onClick={() => handlePatientSelect(p)}
                        >
                            {p.name}
                        </div>
                    ))}
                </div>
            </div>
            <div className="patient-details-column">
                {selectedPatient ? (
                    <div className="details-card">
                        <h2 className="patient-name-title">{selectedPatient.name}</h2>
                        <div className="patient-info-grid">
                            <p><strong>Age:</strong> {selectedPatient.age}</p>
                            <p><strong>Visit Date:</strong> {selectedPatient.visit.date}</p>
                            <p className="symptoms-p">
                                <strong>Symptoms:</strong> 
                                {selectedPatient.symptoms && selectedPatient.symptoms.length > 0 ? selectedPatient.symptoms.join(', ') : 'N/A'}
                            </p>
                        </div>

                        {attendingDoctor && (
                            <div className="attending-doctor">
                                <FaUserMd className="attending-doctor-icon" />
                                <span>Handled by: <strong>{attendingDoctor.name}</strong> ({attendingDoctor.specialty})</span>
                            </div>
                        )}
                        <hr />
                        <div className="details-section">
                            <h3>Original Diagnosis</h3>
                            <p><strong>System:</strong> {selectedPatient.visit.diagnosis.system}</p>
                            <p><strong>Code:</strong> <span className="code-highlight">{selectedPatient.visit.diagnosis.code}</span></p>
                            <p><strong>Description:</strong> {selectedPatient.visit.diagnosis.description}</p>
                        </div>
                        <hr />
                        <div className="details-section">
                            <h3>Mapped Diagnosis</h3>
                            {mappedDiagnosis?.loading && <p>Translating code...</p>}
                            {mappedDiagnosis?.error && <p className="error-text">Error: {mappedDiagnosis.error}</p>}
                            {mappedDiagnosis && !mappedDiagnosis.loading && !mappedDiagnosis.error && (
                                <>
                                    <p><strong>Code:</strong> <span className="code-highlight">{mappedDiagnosis.code}</span></p>
                                    <p><strong>Term:</strong> {mappedDiagnosis.term}</p>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="details-card details-card-placeholder">
                        <p className="search-subtitle">Select a patient from the list to view their details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientDashboard;
