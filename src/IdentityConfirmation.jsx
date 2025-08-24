
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IdentityConfirmation.css';

export default function IdentityConfirmation({ open, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [highSchool, setHighSchool] = React.useState("");
  const [maidenName, setMaidenName] = React.useState("");
  const [carManufacturer, setCarManufacturer] = React.useState("");
  const highSchoolOptions = [
    "Eastern Regional",
    "Seaton West",
    "St. Mary's",
    "Windmill Hill",
    "None of the above"
  ];
  const maidenNameOptions = [
    "Johnson",
    "Anderson",
    "Smith",
    "Shah",
    "None of the above"
  ];
  const carManufacturerOptions = [
    "Ford",
    "Nissan",
    "Honda",
    "Audi",
    "None of the above"
  ];
  if (!open) return null;
  return (
    <div className="identity-confirmation-backdrop">
      <div
        className="identity-confirmation-modal"
        style={{
          width: '90vw',
          maxWidth: 420,
          minWidth: 260,
          padding: '24px 2vw 18px 2vw',
          boxSizing: 'border-box',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, position: 'relative', textAlign: 'left' }}>
          <h2 style={{ margin: 0, textAlign: 'left' }}>Identity Confirmation</h2>
          <span style={{ fontWeight: 600, color: '#555', background: '#e3e8f0', borderRadius: 8, padding: '4px 14px', fontSize: '1.05rem', marginLeft: 16 }}>{step}/3</span>
        </div>
        {step === 1 && (
          <>
            <div style={{ marginBottom: 22, textAlign: 'left' }}>
              <label style={{ fontWeight: 500, fontSize: '1.08rem', color: '#222', display: 'block', marginBottom: 10 }}>
                What high school did you attend?<span style={{ color: '#e11d48', marginLeft: 2, whiteSpace: 'nowrap' }}>&nbsp;*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {highSchoolOptions.map(option => (
                  <label
                    key={option}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #bfc6d1',
                      borderRadius: 8,
                      padding: '10px 14px',
                      cursor: 'pointer',
                      background: highSchool === option ? '#f1f5fb' : '#fff',
                      boxShadow: highSchool === option ? '0 2px 8px rgba(25,118,210,0.08)' : 'none',
                      transition: 'background 0.2s, box-shadow 0.2s',
                      fontWeight: 500
                    }}
                  >
                    <input
                      type="radio"
                      name="highSchool"
                      value={option}
                      checked={highSchool === option}
                      onChange={() => setHighSchool(option)}
                      style={{ marginRight: 12, accentColor: '#1976d2', width: 18, height: 18 }}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button
                className="next-btn"
                style={{ minWidth: 120, marginLeft: 12 }}
                disabled={!highSchool}
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ marginBottom: 22, textAlign: 'left' }}>
              <label style={{ fontWeight: 500, fontSize: '1.08rem', color: '#222', display: 'block', marginBottom: 10 }}>
                What is your mother's maiden name?<span style={{ color: '#e11d48', marginLeft: 2, whiteSpace: 'nowrap' }}>&nbsp;*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {maidenNameOptions.map(option => (
                  <label
                    key={option}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #bfc6d1',
                      borderRadius: 8,
                      padding: '10px 14px',
                      cursor: 'pointer',
                      background: maidenName === option ? '#f1f5fb' : '#fff',
                      boxShadow: maidenName === option ? '0 2px 8px rgba(25,118,210,0.08)' : 'none',
                      transition: 'background 0.2s, box-shadow 0.2s',
                      fontWeight: 500
                    }}
                  >
                    <input
                      type="radio"
                      name="maidenName"
                      value={option}
                      checked={maidenName === option}
                      onChange={() => setMaidenName(option)}
                      style={{ marginRight: 12, accentColor: '#1976d2', width: 18, height: 18 }}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button
                className="next-btn"
                style={{ minWidth: 120, marginLeft: 12 }}
                disabled={!maidenName}
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ marginBottom: 22, textAlign: 'left' }}>
              <label style={{ fontWeight: 500, fontSize: '1.08rem', color: '#222', display: 'block', marginBottom: 10 }}>
                What was the name of your first car's manufacturer?<span style={{ color: '#e11d48', marginLeft: 2, whiteSpace: 'nowrap' }}>&nbsp;*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {carManufacturerOptions.map(option => (
                  <label
                    key={option}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #bfc6d1',
                      borderRadius: 8,
                      padding: '10px 14px',
                      cursor: 'pointer',
                      background: carManufacturer === option ? '#f1f5fb' : '#fff',
                      boxShadow: carManufacturer === option ? '0 2px 8px rgba(25,118,210,0.08)' : 'none',
                      transition: 'background 0.2s, box-shadow 0.2s',
                      fontWeight: 500
                    }}
                  >
                    <input
                      type="radio"
                      name="carManufacturer"
                      value={option}
                      checked={carManufacturer === option}
                      onChange={() => setCarManufacturer(option)}
                      style={{ marginRight: 12, accentColor: '#1976d2', width: 18, height: 18 }}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button
                className="next-btn"
                style={{ minWidth: 120, marginLeft: 12 }}
                disabled={!carManufacturer}
                onClick={() => navigate('/review-and-sign')}
              >
                Next
              </button>
            </div>
          </>
        )}
  {/* Removed Close button, replaced with X in header */}
      </div>
    </div>
  );
}
