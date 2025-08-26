import React, { useState } from 'react';
import { useHousehold } from './HouseholdContext';
import Header from './Header';
import LeftNavigation from './LeftNavigation';
import './ReviewAndSign.css';

export default function ReviewAndSign() {
  const { household, setHousehold } = useHousehold();
  const completedSections = [0,1,2,3,4,"dark5"];
  const [householdOpen, setHouseholdOpen] = useState(true);
  const members = [
    household?.primary,
    household?.spouse,
    ...(household?.dependents || [])
  ].filter(Boolean);
  const [taxOpen, setTaxOpen] = useState(true);
  const [incomeOpen, setIncomeOpen] = useState(true);
  const [additionalOpen, setAdditionalOpen] = useState(true);

  // Assumed shapes (if backend provides):
  // household.tax => [{ name, taxStatus, reconciledPremiumTaxCredits }]
  // household.income => [{ ownerName, amount, frequency, companyType }]
  const taxItems = household?.tax || [];
  const incomeItems = household?.income || [];
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
                  {members.length > 0 && (
                    <tr>
                      <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Member Information</td>
                    </tr>
                  )}
                  {members.map((member, idx) => (
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
                  {/* Two empty rows for spacing */}
                <tr><td colSpan="6" style={{height: '12px', background: '#fff', border: 'none', padding: 0}}></td></tr>
                <tr><td colSpan="6" style={{height: '12px', background: '#fff', border: 'none', padding: 0}}></td></tr>
                {/* Add a household member button row */}
                  <tr>
                  <td colSpan="6" style={{padding: 0, background: '#fff', border: 'none'}}>
                    <button
                      style={{
                        width: '100%',
                        border: '2px solid #1976d2',
                        color: '#1976d2',
                        background: '#f7fbff',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: '1.04rem',
                        padding: '14px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        margin: 0
                      }}
                    >
                      <span style={{fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', marginRight: 4}}>+</span>
                      Add a household member
                    </button>
                  </td>
                </tr>
          {/* Household Address Section (moved inside main table) */}
          <tr>
            <td colSpan="6" style={{padding: 0, background: '#fff', border: 'none'}}>
              <div style={{marginTop: 0, background: '#fff', borderRadius: 8, border: '1.5px solid #e3e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.01)', padding: 0}}>
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
            </td>
          </tr>

          {/* Contact Information Section (moved inside main table) */}
          <tr>
            <td colSpan="6" style={{padding: 0, background: '#fff', border: 'none'}}>
              <div style={{marginTop: 0, background: '#fff', borderRadius: 8, border: '1.5px solid #e3e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.01)', padding: 0}}>
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
            </td>
          </tr>
                </tbody>
              )}
            </table>
          </div>
          {/* Tax Information (collapsible) */}
          <div style={{marginTop: 24}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1976d2', color: '#fff', borderRadius: 8, padding: '12px 18px', fontWeight: 700, fontSize: '1.13rem'}}>
              <span>Tax Information</span>
              <span
                onClick={() => setTaxOpen((open) => !open)}
                style={{cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center'}}
                title={taxOpen ? 'Collapse' : 'Expand'}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#1976d2" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M7 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {taxOpen && (
              <div style={{border: '1.5px solid #e3e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', background: '#fff', padding: 0}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <tbody>
                    {/* Build display entries for primary and spouse only */}
                    {(() => {
                      const entries = [];
                      const primaryName = household?.primary ? `${household.primary.firstName || ''} ${household.primary.lastName || ''}`.trim() : '';
                      const spouseName = household?.spouse ? `${household.spouse.firstName || ''} ${household.spouse.lastName || ''}`.trim() : '';
                      const findMatch = (name) => taxItems.find(t => (t.name || '').toString().trim().toLowerCase() === name.toLowerCase());
                      if (primaryName) {
                        const match = findMatch(primaryName);
                        entries.push({ name: primaryName, taxStatus: match ? match.taxStatus : (taxItems[0] ? taxItems[0].taxStatus : ''), reconciledPremiumTaxCredits: match ? !!match.reconciledPremiumTaxCredits : !!(taxItems[0] && taxItems[0].reconciledPremiumTaxCredits) });
                      }
                      if (spouseName) {
                        const match = findMatch(spouseName);
                        entries.push({ name: spouseName, taxStatus: match ? match.taxStatus : (taxItems[0] ? taxItems[0].taxStatus : ''), reconciledPremiumTaxCredits: match ? !!match.reconciledPremiumTaxCredits : !!(taxItems[0] && taxItems[0].reconciledPremiumTaxCredits) });
                      }
                      if (entries.length === 0) {
                        return (<tr><td style={{padding: 16, color: '#666'}}>No tax information available.</td></tr>);
                      }
                      return entries.map((t, i) => (
                        <React.Fragment key={i}>
                          <tr>
                            <td colSpan="6" style={{fontWeight: 700, padding: '12px 16px', background: '#f7f9fb'}}>{t.name || 'Household Member'}</td>
                          </tr>
                          <tr style={{background: '#fff'}}>
                            <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left', width: '33%'}}>Tax Status</th>
                            <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}}>{t.taxStatus || ''}</td>
                            <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left', width: '33%'}}>Reconciled premium tax credits</th>
                            <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}}>{t.reconciledPremiumTaxCredits ? 'Yes' : 'No'}</td>
                          </tr>
                        </React.Fragment>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Income Information (collapsible) */}
          <div style={{marginTop: 24}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1976d2', color: '#fff', borderRadius: 8, padding: '12px 18px', fontWeight: 700, fontSize: '1.13rem'}}>
              <span>Income Information</span>
              <span
                onClick={() => setIncomeOpen((open) => !open)}
                style={{cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center'}}
                title={incomeOpen ? 'Collapse' : 'Expand'}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#1976d2" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M7 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {incomeOpen && (
              <div style={{border: '1.5px solid #e3e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', background: '#fff', padding: 0}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <tbody>
                    {(() => {
                      const entries = [];
                      const primaryName = household?.primary ? `${household.primary.firstName || ''} ${household.primary.lastName || ''}`.trim() : '';
                      const spouseName = household?.spouse ? `${household.spouse.firstName || ''} ${household.spouse.lastName || ''}`.trim() : '';
                      const findMatch = (name) => incomeItems.find(i => ((i.ownerName || i.name) || '').toString().trim().toLowerCase() === name.toLowerCase());
                      if (primaryName) {
                        const match = findMatch(primaryName);
                        entries.push({ ownerName: primaryName, amount: match ? match.amount : (incomeItems[0] ? incomeItems[0].amount : ''), frequency: match ? match.frequency : (incomeItems[0] ? incomeItems[0].frequency : ''), companyType: match ? match.companyType : (incomeItems[0] ? incomeItems[0].companyType : '') });
                      }
                      if (spouseName) {
                        const match = findMatch(spouseName);
                        entries.push({ ownerName: spouseName, amount: match ? match.amount : (incomeItems[0] ? incomeItems[0].amount : ''), frequency: match ? match.frequency : (incomeItems[0] ? incomeItems[0].frequency : ''), companyType: match ? match.companyType : (incomeItems[0] ? incomeItems[0].companyType : '') });
                      }
                      if (entries.length === 0) {
                        return (<tr><td style={{padding: 16, color: '#666'}}>No income information available.</td></tr>);
                      }
                      return entries.map((inc, idx) => (
                        <React.Fragment key={idx}>
                          <tr>
                            <td colSpan="6" style={{fontWeight: 700, padding: '12px 16px', background: '#f7f9fb'}}>{inc.ownerName || 'Income'}</td>
                          </tr>
                          <tr style={{background: '#fff'}}>
                            <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left', width: '33%'}}>Amount earned</th>
                            <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}}>{inc.amount || ''}</td>
                            <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left', width: '33%'}}>Frequency</th>
                            <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}}>{inc.frequency || ''}</td>
                          </tr>
                          {inc.companyType && (
                            <tr style={{background: '#fff'}}>
                              <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left'}}>Company Type</th>
                              <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}} colSpan={3}>{inc.companyType}</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Additional review and sign content continues here... */}
          {/* Additional Questions (Special Enrollment & Additional Questions) */}
          <div style={{marginTop: 24}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1976d2', color: '#fff', borderRadius: 8, padding: '12px 18px', fontWeight: 700, fontSize: '1.13rem'}}>
              <span>Additional Questions</span>
              <span
                onClick={() => setAdditionalOpen((open) => !open)}
                style={{cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center'}}
                title={additionalOpen ? 'Collapse' : 'Expand'}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#1976d2" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M7 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {additionalOpen && (
            <div style={{border: '1.5px solid #e3e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', background: '#fff', padding: 0}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <tbody>
                  <tr>
                    <td colSpan={2} style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 16px'}}>Special Enrollment Questions</td>
                  </tr>
                  {/* Special enrollment event / applies to */}
                  {(() => {
                    const lost = household?.specialEnrollment?.lostCoverage || [];
                    const nameForId = (id) => {
                      if (id === 'primary') return `${household?.primary?.firstName || ''} ${household?.primary?.lastName || ''}`.trim();
                      if (id === 'spouse') return `${household?.spouse?.firstName || ''} ${household?.spouse?.lastName || ''}`.trim();
                      const dep = (household?.dependents || []).find(d => d.id === id);
                      if (dep) return `${dep.firstName || ''} ${dep.lastName || ''}`.trim();
                      return id;
                    };
                    const appliesTo = lost.length === 0 ? 'None' : lost.map(nameForId).filter(Boolean).join(', ');
                    const eventLabel = lost.length > 0 ? 'Lost coverage in the last 60 days' : '';
                    return (
                      <>
                        <tr style={{background: '#fff'}}>
                          <th style={{padding: '10px 16px', textAlign: 'left', width: '40%', fontWeight: 700}}>Special enrollment event</th>
                          <td style={{padding: '10px 16px'}}>{eventLabel}</td>
                        </tr>
                        <tr style={{background: '#fff'}}>
                          <th style={{padding: '10px 16px', textAlign: 'left', fontWeight: 700}}>Applies to</th>
                          <td style={{padding: '10px 16px'}}>{appliesTo}</td>
                        </tr>
                      </>
                    );
                  })()}

                  <tr>
                    <td colSpan={2} style={{fontWeight: 600, fontSize: '1.02rem', background: '#f7f9fb', padding: '10px 16px'}}>Additional questions</td>
                  </tr>
                  {(() => {
                    const boolLabel = (val) => (val === true || val === 'yes' || val === 'Yes') ? 'Yes' : 'No';
                    const pregnant = boolLabel(household?.pregnant ?? household?.additionalQuestions?.pregnant ?? false);
                    const disability = boolLabel(household?.disability ?? household?.additionalQuestions?.disability ?? false);
                    const incarcerated = boolLabel(household?.incarcerated ?? household?.additionalQuestions?.incarcerated ?? false);
                    const immigrant = boolLabel(household?.immigrant ?? household?.additionalQuestions?.immigrant ?? false);
                    const nativeTribe = boolLabel(household?.nativeTribe ?? household?.additionalQuestions?.nativeTribe ?? false);
                    return (
                      <>
                        <tr style={{background: '#fff'}}>
                          <th style={{padding: '10px 16px', textAlign: 'left', fontWeight: 700}}>Is anyone in your household pregnant?</th>
                          <td style={{padding: '10px 16px'}}>{pregnant}</td>
                        </tr>
                        <tr style={{background: '#fff'}}>
                          <th style={{padding: '10px 16px', textAlign: 'left', fontWeight: 700}}>Does anyone in your household have any physical disability or mental health condition that limits their ability to work, attend school, or take care of their daily needs?</th>
                          <td style={{padding: '10px 16px'}}>{disability}</td>
                        </tr>
                        <tr style={{background: '#fff'}}>
                          <th style={{padding: '10px 16px', textAlign: 'left', fontWeight: 700}}>Is anyone in your household incarcerated?</th>
                          <td style={{padding: '10px 16px'}}>{incarcerated}</td>
                        </tr>
                        <tr style={{background: '#fff'}}>
                          <th style={{padding: '10px 16px', textAlign: 'left', fontWeight: 700}}>Is anyone in your household a naturalized citizen or an immigrant?</th>
                          <td style={{padding: '10px 16px'}}>{immigrant}</td>
                        </tr>
                        <tr style={{background: '#fff'}}>
                          <th style={{padding: '10px 16px', textAlign: 'left', fontWeight: 700}}>Are any household members affiliated with an American Indian or Alaska Native tribe?</th>
                          <td style={{padding: '10px 16px'}}>{nativeTribe}</td>
                        </tr>
                      </>
                    );
                  })()}

                  {/* Individual Details header will remain below; duplicate header left out here */}
                  {/* Individual Details (render personDetails saved from Additional Questions) */}
                  {(() => {
                    const pd = household?.personDetails || {};
                    const keys = Object.keys(pd || {});
                    if (keys.length === 0) return null;

                    const nameForKey = (key) => {
                      if (key === 'primary') return 'Your details';
                      if (key === 'spouse') return `${household?.spouse?.firstName || ''} ${household?.spouse?.lastName || ''}`.trim() + "'s details";
                      const dep = (household?.dependents || []).find(d => d.id === key);
                      if (dep) return `${dep.firstName || ''} ${dep.lastName || ''}`.trim() + "'s details";
                      return key;
                    };

                    // Ensure primary renders first if present
                    const ordered = [...keys.filter(k => k === 'primary'), ...keys.filter(k => k !== 'primary')];

                    return (
                      <>
                        <tr>
                          <td colSpan={2} style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 16px'}}>Individual Details</td>
                        </tr>
                        {ordered.map((k) => {
                          const person = pd[k] || {};
                          const header = nameForKey(k);
                          const hispanicRaw = person.hispanic ?? person.hispanicOrigin ?? person.hispanicOrigin;
                          const hispanic = (hispanicRaw === true || hispanicRaw === 'Yes' || hispanicRaw === 'yes' || hispanicRaw === 'YES') ? 'Yes' : (hispanicRaw ? 'Yes' : 'No');
                          const race = person.race || '';
                          const living = person.livingArrangement || '';
                          return (
                            <React.Fragment key={k}>
                              <tr>
                                <td colSpan={2} style={{fontWeight: 700, padding: '12px 16px', background: '#fff'}}>{header}</td>
                              </tr>
                              <tr style={{background: '#fff'}}>
                                <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left', width: '33%'}}>Living Arrangement</th>
                                <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}}>{living}</td>
                              </tr>
                              <tr style={{background: '#fff'}}>
                                <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left'}}>Hispanic, Latino, or Spanish origin?</th>
                                <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}}>{hispanic}</td>
                              </tr>
                              <tr style={{background: '#fff'}}>
                                <th style={{padding: '10px 16px', borderBottom: '1px solid #eee', textAlign: 'left'}}>Race</th>
                                <td style={{padding: '10px 16px', borderBottom: '1px solid #eee'}}>{race}</td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
            )}
          </div>

          {/* Signature section */}
          <div style={{marginTop: 24}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', color: '#000', borderRadius: 8, padding: '12px 18px', fontWeight: 700, fontSize: '1.13rem'}}>
              <span>Signature</span>
            </div>
              <div style={{border: '1.5px solid #e3e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', background: '#fff', padding: 18}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  <div style={{fontSize: '0.98rem', marginBottom: 6}}>Read and check the box next to each statement if you agree.</div>

                  {/* Signature checkboxes - default unchecked and persisted to household.signatureAgreements */}
                  {(() => {
                    const sig = household?.signatureAgreements || {};
                    const [a1, a2, a3, a4, a5, a6, a7] = [
                      sig.a1 || false,
                      sig.a2 || false,
                      sig.a3 || false,
                      sig.a4 || false,
                      sig.a5 || false,
                      sig.a6 || false,
                      sig.a7 || false,
                    ];
                    // Local handlers
                    const updateSig = (key, value) => {
                      try {
                        const next = { ...(household?.signatureAgreements || {}), [key]: value };
                        if (setHousehold) setHousehold({ signatureAgreements: next });
                      } catch (err) {
                        console.error('Error persisting signature agreements:', err);
                      }
                    };

                    return (
                      <>
                        <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                          <input type="checkbox" checked={a1} onChange={(e) => updateSig('a1', e.target.checked)} style={{marginTop: 4}} />
                          <div>I know that I must tell the program I'm enrolled in if information I listed on this application changes.<span style={{color: '#d9534f'}}> *</span></div>
                        </label>

                        <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                          <input type="checkbox" checked={a2} onChange={(e) => updateSig('a2', e.target.checked)} style={{marginTop: 4}} />
                          <div>MEDICAID ONLY: I know that if Medicaid pays for a medical expense any money I get from other health insurance or legal settlements will go to Medicaid in an amount equal to what Medicaid pays for the expense.<span style={{color: '#d9534f'}}> *</span></div>
                        </label>

                        <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                          <input type="checkbox" checked={a3} onChange={(e) => updateSig('a3', e.target.checked)} style={{marginTop: 4}} />
                          <div>MEDICAID ONLY: I know that if Medicaid pays for any of my medical expenses, any money I receive from a lawsuit will be assigned to the State to pay for any medical expenses paid by the State related to injuries that led to the lawsuit. If I have other insurance or a third party is liable to pay for my medical expenses, the State may recover the cost of my medical bills directly from the insurer or the third party. The State may bill a legally liable relative to repay the State for the costs of my medical care. The State may recover money from the estates of those people who were 55 years old or older at the time that community medical benefits were paid and who do not have a living spouse or surviving child under age 21 or blind or disabled. The State may recover from an inheritance or other lump sum of money I receive to repay the State for the costs of my medical care. The State may place a lien, under certain conditions, on my home if I permanently enter a nursing facility.<span style={{color: '#d9534f'}}> *</span></div>
                        </label>

                        <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                          <input type="checkbox" checked={a4} onChange={(e) => updateSig('a4', e.target.checked)} style={{marginTop: 4}} />
                          <div>I know I'll be asked to cooperate with the agency that collects medical support from an absent parent. If I think that cooperating to collect medical support will harm me or my children, I can tell the agency and I won't have to cooperate.<span style={{color: '#d9534f'}}> *</span></div>
                        </label>

                        <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                          <input type="checkbox" checked={a5} onChange={(e) => updateSig('a5', e.target.checked)} style={{marginTop: 4}} />
                          <div>I understand that AccessHealthCT.com will use data from my tax return during the renewal process to determine yearly eligibility for help paying for health insurance for the next 5 years. I understand that if I check this box I can change my answer later, and if I don't check the box I can select less than 5 years.</div>
                        </label>

                        <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                          <input type="checkbox" checked={a6} onChange={(e) => updateSig('a6', e.target.checked)} style={{marginTop: 4}} />
                          <div>I know that any change that I report may alter mine or my household's eligibility status. If the change results in me and my household becoming ineligible for help paying for health coverage, I and my household may no longer receive help paying for coverage.<span style={{color: '#d9534f'}}> *</span></div>
                        </label>

                        <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                          <input type="checkbox" checked={a7} onChange={(e) => updateSig('a7', e.target.checked)} style={{marginTop: 4}} />
                          <div>I'm signing this application under penalty of perjury. This means I've provided true answers to all the questions on this form to the best of my knowledge. I know that if I'm not truthful, there may be a penalty.<span style={{color: '#d9534f'}}> *</span></div>
                        </label>
                      </>
                    );
                  })()}

                  <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 8}}>
                    <div style={{flex: '0 0 auto'}}>
                      <div style={{fontSize: '0.95rem', marginBottom: 6, fontWeight: 600}}>Your Signature</div>
                      <input
                        type="text"
                        placeholder="Type your name here"
                        style={{width: '240px', maxWidth: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc'}}
                        value={household?.signature || ''}
                        onChange={(e) => { try { if (setHousehold) setHousehold({ signature: e.target.value }); } catch (err) { console.error(err); } }}
                      />
                    </div>
                    <div style={{minWidth: 220}}>
                      <div style={{fontSize: '0.95rem', marginBottom: 6, fontWeight: 600}}></div>
                      <div>{"Today's date : " + new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 12}}>
                    <button style={{background: '#2b2bff', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700}}>Next</button>
                  </div>
                </div>
              </div>
          </div>

        </main>
      </div>
    </div>
  );
}
