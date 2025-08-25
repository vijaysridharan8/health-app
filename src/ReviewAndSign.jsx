import React, { useState } from 'react';
import { useHousehold } from './HouseholdContext';
import Header from './Header';
import LeftNavigation from './LeftNavigation';
import './ReviewAndSign.css';

export default function ReviewAndSign() {
  const { household } = useHousehold();
  const completedSections = [0,1,2,3,4,"dark5"];
  const [householdOpen, setHouseholdOpen] = useState(true);
  return (
    <div>
      <Header />
      <div className="review-sign-layout">
        <LeftNavigation
          stepLabel="Step 6/10"
          completedSections={completedSections}
          openSections={{ Application: true, 'Review and Sign': true }}
          highlightNavBlue={[
            "Application",
            "My Household",
            "Tax & Income Information",
            "Special Enrollment & Additional Questions",
            "Review and Sign",
            "Review",
            "Sign"
          ]}
          showCreateAccountTick={[
            "Create Account",
            "Upload Documents",
            "My Household",
            "Tax & Income Information",
            "Special Enrollment & Additional Questions"
          ]}
        />
        <main className="review-sign-content">
          <h1><span className="aq-circle">6</span> Review & Sign</h1>
          <div style={{marginTop: 36, marginBottom: 24, border: '1.5px solid #e3e8f0', borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1976d2', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: '12px 18px 12px 18px', fontWeight: 700, fontSize: '1.13rem', letterSpacing: '0.2px'}}>
              <span>My Household</span>
              <span
                onClick={() => setHouseholdOpen((open) => !open)}
                style={{cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center'}}
                title={householdOpen ? 'Collapse' : 'Expand'}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#1976d2" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M7 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12}}>
              {householdOpen && (
                <tbody>
                  {[ 
                    household?.primary, 
                    household?.spouse, 
                    ...(household?.dependents || []) 
                  ].filter(Boolean).map((member, idx) => (
                    <React.Fragment key={idx}>
                      <tr>
                        <td colSpan="6" style={{fontWeight: 700, fontSize: '1.11rem', background: '#fff', borderRadius: 6, padding: '12px 8px 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>{`${member.firstName || ''} ${member.lastName || ''}`.trim()}</td>
                      </tr>
                      <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Date of Birth</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>{member.dob || ''}</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Gender</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>{member.gender ? 'Female' : 'Male'}</th>
                      </tr>
                      <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Social Security Number</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>{member.ssn || ''}</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>US Citizen or Naturalized Citizen</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>{member.citizen ? 'No' : 'Yes'}</th>
                      </tr>
                      <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Applying for Coverage</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>{member.applyForCoverage ? 'No' : 'Yes'}</th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                        <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                      </tr>
                    </React.Fragment>
                  ))}
          {/* Household Address Section */}
          <div style={{marginTop: 24, background: '#fff', borderRadius: 8, border: '1.5px solid #e3e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.01)', padding: 16}}>
            <div style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Household Address</div>
            <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff'}}>
              <tbody>
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Address</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '33.32%', background: '#fff', fontWeight: 'normal'}}>{household?.address || '315 Trumbull St, Hartford, CT 06103'}</th>
                </tr>
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <td colSpan="2" style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', fontWeight: 700}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <input type="checkbox" checked disabled style={{accentColor: '#b0b0b0', width: 18, height: 18, marginRight: 8, cursor: 'not-allowed'}} />
                      <span style={{color: '#000', fontWeight: 500}}>All household members live at this address</span>
                    </span>
                  </td>
                  <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', width: '16.66%'}}></td>
                  <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', width: '16.66%'}}></td>
                  <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', width: '16.66%'}}></td>
                </tr>
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <td colSpan="2" style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', fontWeight: 700}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <input type="checkbox" checked disabled style={{accentColor: '#b0b0b0', width: 18, height: 18, marginRight: 8, cursor: 'not-allowed'}} />
                      <span style={{color: '#000', fontWeight: 500}}>This address is same as my mailing address</span>
                    </span>
                  </td>
                  <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', width: '16.66%'}}></td>
                  <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', width: '16.66%'}}></td>
                  <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff', width: '16.66%'}}></td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Contact Information Section */}
          <div style={{marginTop: 24, background: '#fff', borderRadius: 8, border: '1.5px solid #e3e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.01)', padding: 16}}>
            <div style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Your Contact Information</div>
            <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff'}}>
              <tbody>
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Phone Number</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '33.32%', background: '#fff', fontWeight: 'normal'}}>{household?.phone || '342-234-2333'}</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Alternate Phone Number</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '33.32%', background: '#fff', fontWeight: 'normal'}}>{household?.altPhone || '876-345-5444'}</th>
                </tr>
              </tbody>
            </table>
          </div>
                </tbody>
              )}
            </table>
          </div>
          {/* Additional review and sign content continues here... */}
        </main>
      </div>
    </div>
  );
}
