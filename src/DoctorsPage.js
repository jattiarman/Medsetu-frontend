import React, { useState, useEffect } from 'react';
import { FaUserMd } from 'react-icons/fa';

const API_URL = 'https://medsetu-backend.onrender.com';

function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch(`${API_URL}/api/doctors`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setDoctors(data);
            } catch (err) {
                setError('Failed to fetch doctor data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <div className="search-container">
                <h1 className="search-title">Loading Directory...</h1>
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
        <div className="page-container">
            <div className="search-container">
                <h1 className="search-title">Doctor Directory</h1>
                <p className="search-subtitle">List of all physicians available in the system.</p>
                <div className="doctors-grid">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="doctor-card">
                            <div className="doctor-card-header">
                                <div className="doctor-icon">
                                    <FaUserMd />
                                </div>
                                <div>
                                    <h3>{doctor.name}</h3>
                                    <p>{doctor.specialty}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DoctorsPage;

