import React, { useState } from 'react';
import Header from './Header';
import LeftNavigation from './LeftNavigation';
import './ReviewAndSign.css';

export default function ReviewAndSign() {
  const completedSections = [0,1,2,3,4,"dark5"];
  const [householdOpen, setHouseholdOpen] = useState(true);
  const [taxInfoOpen, setTaxInfoOpen] = useState(true);
  const [incomeInfoOpen, setIncomeInfoOpen] = useState(true);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree4, setAgree4] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [agree5, setAgree5] = useState(false);
  const [agree6, setAgree6] = useState(false);

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
            {/* Table Header with Collapse/Uncollapse */}
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
                <tr>
                  <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Member Information</td>
                </tr>
                <tr>
                  <td colSpan="6" style={{fontWeight: 700, fontSize: '1.11rem', background: '#fff', borderRadius: 6, padding: '12px 8px 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>James Smith</td>
                </tr>
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Date of Birth</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>01/01/1990</th>
                 <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Gender</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Male</th>
                </tr>
                {/* New row for Social Security Number and US Citizen/Naturalized Citizen */}
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Social Security Number</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>111-11-1111</th>
                 <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>US Citizen or Naturalized  Citizen</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yes</th>
              </tr>
                {/* New row for Applying for Coverage */}
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Applying for Coverage</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yes</th>
                 <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                </tr>
                <tr>
                  <td colSpan="6" style={{height: '16px', background: '#fff', border: 'none', padding: 0}}></td>
                </tr>
                <tr>
                  <td colSpan="6" style={{fontWeight: 700, fontSize: '1.11rem', background: '#fff', borderRadius: 6, padding: '12px 8px 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>Milan Smith</td>
                </tr>
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Date of Birth</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>03/21/1992</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Gender</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Female</th>
                </tr>
                {/* New row for Social Security Number and US Citizen/Naturalized Citizen */}
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Social Security Number</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>222-22-2222</th>
                 <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>US Citizen or Naturalized  Citizen</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yes</th>
                 </tr>
                {/* New row for Applying for Coverage */}
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Applying for Coverage</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yes</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                </tr>
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
                {/* Subheader: Household Address */}
                <tr>
                  <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Household Address</td>
                </tr>
                {/* Address row */}
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Address</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '33.32%', background: '#fff', fontWeight: 'normal'}}>315 Trumbull St, Hartford, CT 06103</th>
                <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '16.66%', background: '#fff'}}></th>
                </tr>
                {/* Row: All household members live at this address */}
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
                {/* Row: This address is same as my mailing address */}
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
                {/* Subheader: Your Contact Information */}
                <tr>
                  <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Your Contact Information</td>
                </tr>
                {/* Row: Phone Number and Alternate Phone Number */}
                <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Phone Number</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>342-234-2333</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Alternate Phone Number</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>876-345-5444</th>
                </tr>
                </tbody>
              )}
            </table>
          </div>
          {/* Tax Information Table */}
          {/* Tax Information Table */}
          <div style={{marginTop: 36, marginBottom: 24, border: '1.5px solid #e3e8f0', borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>
            {/* Table Header with Collapse/Uncollapse */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1976d2', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: '12px 18px 12px 18px', fontWeight: 700, fontSize: '1.13rem', letterSpacing: '0.2px'}}>
              <span>Tax Information</span>
              <span
                onClick={() => setTaxInfoOpen((open) => !open)}
                style={{cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center'}}
                title={taxInfoOpen ? 'Collapse' : 'Expand'}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#1976d2" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M7 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {taxInfoOpen && (
              <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8}}>
                <tbody>
                  {/* Subheader: Tax Status */}
                  <tr>
                    <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Tax Status</td>
                  </tr>
                  {/* Row: James Smith */}
                  <tr>
                    <td colSpan="6" style={{fontWeight: 700, fontSize: '1.11rem', background: '#fff', borderRadius: 6, padding: '12px 8px 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>James Smith</td>
                  </tr>
                  {/* Row: Tax Status and Reconcilled premium tax credits for James Smith */}
                  <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Tax Status</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Married Filing Jointly</th>
                   <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Reconcilled premium tax credits</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yes</th>
                   <th style={{background: '#fff', borderBottom: '1.5px solid #e3e8f0', width: '16.66%'}}></th>
                  </tr>
                  {/* Row: Milan Smith */}
                  <tr>
                    <td colSpan="6" style={{fontWeight: 700, fontSize: '1.11rem', background: '#fff', borderRadius: 6, padding: '12px 8px 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>Milan Smith</td>
                  </tr>
                  {/* Row: Tax Status and Reconcilled premium tax credits for Milan Smith */}
                  <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Tax Status</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Married Filing Jointly</th>
               <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Reconcilled premium tax credits</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yes</th>
                   <th style={{background: '#fff', borderBottom: '1.5px solid #e3e8f0', width: '16.66%'}}></th>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          {/* Income Information Table */}
          <div style={{marginTop: 36, marginBottom: 24, border: '1.5px solid #e3e8f0', borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>
            {/* Table Header with Collapse/Uncollapse */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1976d2', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: '12px 18px 12px 18px', fontWeight: 700, fontSize: '1.13rem', letterSpacing: '0.2px'}}>
              <span>Income Information</span>
              <span
                onClick={() => setIncomeInfoOpen((open) => !open)}
                style={{cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center'}}
                title={incomeInfoOpen ? 'Collapse' : 'Expand'}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#1976d2" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M7 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {incomeInfoOpen && (
              <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8}}>
                <tbody>
                  {/* Subheader: John Smith's Annual Income */}
                  <tr>
                    <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>John Smith's Annual Income</td>
                  </tr>
                  {/* Row: Amount earned, Frequency */}
                  <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Amount earned</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>$50,000</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Frequency</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yearly</th>
                 </tr>
                  {/* Row: No planned end date checkbox */}
                  <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                    <td colSpan="6" style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff'}}>
                      <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <input type="checkbox" checked disabled style={{accentColor: '#b0b0b0', width: 18, height: 18, marginRight: 8, cursor: 'not-allowed'}} />
                        <span style={{color: '#000', fontWeight: 500}}>There is no planned end date</span>
                      </span>
                    </td>
                  </tr>
                  {/* Subheader: John Smith's Employment Income */}
                  <tr>
                    <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>John Smith's Employment Income</td>
                  </tr>
                  {/* Row: Company Type */}
                  <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Company Type</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '33.32%', background: '#fff', fontWeight: 'normal'}}>DataZone Inc</th>
                  <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff'}}></th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff'}}></th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'center', width: '16.66%', background: '#fff'}}></th>
                  </tr>
                  {/* Row: Amount earned, Frequency (Employment) */}
                  <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Amount earned</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>$50,000</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 700}}>Frequency</th>
                    <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '16.66%', background: '#fff', fontWeight: 'normal'}}>Yearly</th>
                 </tr>
                  {/* Row: No planned end date checkbox (Employment) */}
                  <tr style={{background: '#fff', fontSize: '0.9rem'}}>
                    <td colSpan="6" style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', background: '#fff'}}>
                      <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <input type="checkbox" checked disabled style={{accentColor: '#b0b0b0', width: 18, height: 18, marginRight: 8, cursor: 'not-allowed'}} />
                        <span style={{color: '#000', fontWeight: 500}}>There is no planned end date</span>
                      </span>
                    </td>
                  </tr>
                  {/* Row: Add a income button */}
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
                        Add a income
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          {/* Additional Questions Table */}
          <AdditionalQuestionsTable />


            {/* Add review summary or details here */}
          {/* End of review summary section */}
          <section className="sign-section" style={{textAlign: 'left', marginLeft: 0, marginTop: 40}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
              <h2 style={{margin: 0}}>Signature</h2>
            </div>
            <div style={{marginBottom: 24, marginTop: 18}}>
              <div style={{fontWeight: 500, marginBottom: 10}}>
                Read and check the box next to each statement if you agree.
              </div>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10}}>
                <input
                  type="checkbox"
                  required
                  style={{marginTop: 3}}
                  checked={agree1}
                  onChange={e => setAgree1(e.target.checked)}
                />
                <span>
                  I know that I must tell the program I'm enrolled in if information I listed on this application changes.
                  <span style={{color: 'red'}}>*</span>
                </span>
              </label>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10}}>
                <input
                  type="checkbox"
                  required
                  style={{marginTop: 3}}
                  checked={agree2}
                  onChange={e => setAgree2(e.target.checked)}
                />
                <span>
                  MEDICAID ONLY: I know that if Medicaid pays for a medical expense any money I get from other health insurance or legal settlements will go to Medicaid in an amount equal to what Medicaid pays for the expense.
                  <span style={{color: 'red'}}>*</span>
                </span>
              </label>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10}}>
                <input
                  type="checkbox"
                  style={{marginTop: 3}}
                />
                <span>
                  MEDICAID ONLY: I know that if Medicaid pays for any of my medical expenses, any money I receive from a lawsuit will be assigned to the State to pay for any medical expenses paid by the State related to injuries that led to the lawsuit. If I have other insurance or a third party is liable to pay for my medical expenses, the State may recover the cost of my medical bills directly from the insurer or the third party. The State may bill a legally liable relative to repay the State for the costs of my medical care. The State may recover money from the estates of those people who were 55 years old or older at the time that community medical benefits were paid and who do not have a living spouse or surviving child under age 21 or blind or disabled. The State may recover from an inheritance or other lump sum of money I receive to repay the State for the costs of my medical care. The State may place a lien, under certain conditions, on my home if I permanently enter a nursing facility.
                </span>
              </label>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10}}>
                <input
                  type="checkbox"
                  required
                  style={{marginTop: 3}}
                  checked={agree4}
                  onChange={e => setAgree4(e.target.checked)}
                />
                <span>
                  I know I'll be asked to cooperate with the agency that collects medical support from an absent parent. If I think that cooperating to collect medical support will harm me or my children, I can tell the agency and I won't have to cooperate.<span style={{color: 'red'}}>*</span>
                </span>
              </label>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10}}>
                <input
                  type="checkbox"
                  style={{marginTop: 3}}
                />
                <span>
                  I understand that AccessHealthCT.com will use data from my tax return during the renewal process to determine yearly eligibility for help paying for health insurance for the next 5 years. I understand that if I check this box I can change my answer later, and if I don't check the box I can select less than 5 years.
                </span>
              </label>
               
            </div>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10}}>
                <input
                  type="checkbox"
                  required
                  style={{marginTop: 3}}
                  checked={agree5}
                  onChange={e => setAgree5(e.target.checked)}
                />
                <span>
                  I know that any change that I report may alter mine or my household's eligibility status. If the change results in me and my household becoming ineligible for help paying for health coverage, I and my household may no longer receive help paying for coverage.<span style={{color: 'red'}}>*</span>
                </span>
              </label>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10}}>
                <input
                  type="checkbox"
                  required
                  style={{marginTop: 3}}
                  checked={agree6}
                  onChange={e => setAgree6(e.target.checked)}
                />
                <span>
                  I'm signing this application under penalty of perjury. This means I've provided true answers to all the questions on this form to the best of my knowledge. I know that if I'm not truthful, there may be a penalty.<span style={{color: 'red'}}>*</span>
                </span>
              </label>

              <div style={{margin: '24px 0 10px 0', fontWeight: 700, fontSize: '1.08rem', paddingLeft: 30}}>Your Signature</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18, paddingLeft: 30}}>
                <input type="text" style={{width: '100%', maxWidth: 320, padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4}} placeholder="Type your name here" />
                <span style={{fontWeight: 500}}>
                  Today's date : {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </span>
              </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 32, width: '100%'}}>
              <button className="sign-btn" type="submit" style={{minWidth: 120}} disabled={!(agree1 && agree2 && agree4 && agree5 && agree6)}>Next</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
// --- Additional Questions Table and helpers ---

function AdditionalQuestionsTable() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{marginTop: 36, marginBottom: 24, border: '1.5px solid #e3e8f0', borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1976d2', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: '12px 18px 12px 18px', fontWeight: 700, fontSize: '1.13rem', letterSpacing: '0.2px'}}>
        <span>Additional Questions</span>
        <span
          onClick={() => setOpen((open) => !open)}
          style={{cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center'}}
          title={open ? 'Collapse' : 'Expand'}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#1976d2" stroke="#fff" strokeWidth="1.5"/>
            <path d="M7 10l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {open && (
        <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8}}>
          <tbody>
            {/* Subheader: Special Enrollment Questions */}
            <tr>
              <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Special Enrollment Questions</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Special enrollment event</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>Lost coverage in the last 60 days</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '25%', background: '#fff', fontWeight: 700}}>Applies to</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '25%'}}>James Smith</td>
              </tr>
            {/* Subheader: Additional questions */}
            <tr>
              <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Additional questions</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Is anyone in your household pregnant?</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>No</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Does anyone in your household have any physical disability or mental health condition that limits their ability to work, attend school, or take care of their daily needs?</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>No</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Is anyone in your household incarcerated?</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>No</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Is anyone in your household a naturalized citizen or an immigrant?</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>No</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Are any household members affiliated with an American Indian or Alaska Native Tribe?</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>No</td>
            </tr>
            {/* Subheader: Individual Details */}
            <tr>
              <td colSpan="6" style={{fontWeight: 600, fontSize: '1.12rem', background: '#f0f4f8', padding: '10px 8px 8px 8px', letterSpacing: '0.2px', borderBottom: '1.5px solid #e3e8f0'}}>Individual Details</td>
            </tr>
            {/* Your details */}
            <tr>
              <td colSpan="3" style={{fontWeight: 700, fontSize: '1.11rem', background: '#fff', borderRadius: 6, padding: '12px 8px 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>Your details</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Living Arrangement</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>At Home</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Hispanic, Latino, or Spanish origin?</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>Yes</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Race</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>Hispanic</td>
            </tr>
            {/* Milan Smith's details */}
            <tr>
              <td colSpan="3" style={{fontWeight: 700, fontSize: '1.11rem', background: '#fff', borderRadius: 6, padding: '12px 8px 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)'}}>Milan Smith's details</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Living Arrangement</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>At Home</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Hispanic, Latino, or Spanish origin?</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>Yes</td>
            </tr>
            <tr style={{background: '#fff', fontSize: '0.9rem'}}>
              <th style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', textAlign: 'left', width: '50%', background: '#fff', fontWeight: 700}}>Race</th>
              <td style={{padding: '10px 8px', borderBottom: '1.5px solid #e3e8f0', width: '50%'}}>Hispanic</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}


function EditIcon({ title }) {
  return (
    <span style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', position: 'relative'}} title={title}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="2.5" width="17" height="17" rx="3" fill="#fff" stroke="#1976d2" strokeWidth="1.5"/>
      </svg>
      <span style={{color: '#1976d2', fontSize: 15, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -52%)', fontWeight: 600}}>✎</span>
    </span>
  );
}