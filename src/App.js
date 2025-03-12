import React, { useState } from 'react';
import './App.css';

function App() {
  const [odds, setOdds] = useState(['']);
  const [wager, setWager] = useState('');
  const [result, setResult] = useState(null);

  // Convert American odds (input) to decimal odds
  const convertToDecimal = (oddStr) => {
    const oddClean = oddStr.trim();
    if (!oddClean) return NaN;
    const firstChar = oddClean[0];
    let americanValue = parseFloat(oddClean);
    if (isNaN(americanValue)) return NaN;

    let decimal;
    if (firstChar === '+') {
      decimal = (americanValue / 100) + 1;
    } else if (firstChar === '-') {
      decimal = (100 / Math.abs(americanValue)) + 1;
    } else {
      // Assume it's an American odd if no sign is provided (treat it as positive)
      decimal = (americanValue / 100) + 1;
    }
    return decimal;
  };

  // Convert decimal odds back to American odds for display
  const convertDecimalToAmerican = (decimalOdds) => {
    if (decimalOdds >= 2.0) {
      const american = (decimalOdds - 1) * 100;
      return `+${Math.round(american)}`;
    } else {
      const american = - (100 / (decimalOdds - 1));
      return `${Math.round(american)}`;
    }
  };

  const handleOddChange = (index, value) => {
    const newOdds = [...odds];
    newOdds[index] = value;
    setOdds(newOdds);
  };

  const addOddField = () => {
    setOdds([...odds, '']);
  };

  const removeOddField = (index) => {
    const newOdds = odds.filter((_, i) => i !== index);
    setOdds(newOdds);
  };

  const calculateParlay = () => {
    const decimalOdds = odds
      .map(o => convertToDecimal(o))
      .filter(o => !isNaN(o));

    if (decimalOdds.length === 0) {
      setResult(null);
      return;
    }

    const parlayDecimal = decimalOdds.reduce((acc, cur) => acc * cur, 1);
    const parlayAmerican = convertDecimalToAmerican(parlayDecimal);
    const payout = wager ? parlayDecimal * parseFloat(wager) : parlayDecimal;

    setResult({ parlayDecimal, parlayAmerican, payout });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Parlay Calculator</h1>
      {odds.map((odd, index) => (
        <div key={index} style={styles.inputRow}>
          <input
            type="text"
            placeholder={`Odd #${index + 1} (e.g., +150, -200)`}
            value={odd}
            onChange={(e) => handleOddChange(index, e.target.value)}
            style={styles.input}
          />
          <button onClick={() => removeOddField(index)} style={styles.removeButton}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={addOddField} style={styles.addButton}>
        Add Odd
      </button>
      <div style={styles.inputRow}>
        <label style={styles.label}>
          Wager (optional):
          <input
            type="number"
            value={wager}
            onChange={(e) => setWager(e.target.value)}
            placeholder="e.g., 100"
            style={{ ...styles.input, marginLeft: '10px', width: '120px' }}
          />
        </label>
      </div>
      <button onClick={calculateParlay} style={styles.calculateButton}>
        Calculate Parlay
      </button>
      {result && (
        <div style={styles.resultContainer}>
          <h2 style={styles.resultText}>Parlay Odds: {result.parlayAmerican}</h2>
          {wager && (
            <h2 style={styles.resultText}>
              Potential Payout: ${result.payout.toFixed(2)}
            </h2>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  removeButton: {
    marginLeft: '10px',
    padding: '8px 12px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto 20px',
  },
  calculateButton: {
    padding: '12px 20px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto',
  },
  label: {
    fontSize: '16px',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: '30px',
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  resultText: {
    margin: '10px 0',
    color: '#333',
  },
};

export default App;
