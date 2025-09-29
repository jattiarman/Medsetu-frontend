import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const API_URL = 'https://medsetu-backend.onrender.com'; 

function SearchPage() {
    const [originalCode, setOriginalCode] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [results, setResults] = useState([]); // State now holds an array
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput) {
            setError('Please enter a medical code to translate.');
            return;
        }
        setLoading(true);
        setError('');
        setResults([]);
        setOriginalCode(searchInput);

        try {
            const response = await fetch(`${API_URL}/api/map`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: searchInput }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Mapping not found');
            }
            setResults(data); // The response is an array
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h1 className="search-title">Medical Code Translator</h1>
            <p className="search-subtitle">Enter an ICD-11 or NAMASTE code to find its equivalent.</p>
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                    <FaSearch className="search-input-icon" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="e.g., FA20.0 or NAM-D-102"
                        className="search-input"
                    />
                </div>
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Searching...' : 'Translate'}
                </button>
            </form>

            {error && <div className="error-box">{error}</div>}
            
            {results.length > 0 && (
                <div className="result-box">
                    <h2>Translation for <span className="code-highlight">{originalCode.toUpperCase()}</span></h2>
                    {/* Map over the results array */}
                    {results.map((result, index) => (
                        <div key={index} className="result-item-wrapper">
                            {results.length > 1 && <h4 className="result-option">Option {index + 1}</h4>}
                            <p><strong>Mapped Code:</strong> <span className="code-highlight">{result.code}</span></p>
                            <p><strong>Official Term:</strong> {result.term}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPage;

