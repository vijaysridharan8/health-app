  // Default answeredAdditionalQuestions to false if not provided
  const isAnsweredAdditionalQuestions = typeof answeredAdditionalQuestions === 'boolean' ? answeredAdditionalQuestions : false;
import React, { useState } from 'react';

import './LeftNavigation.css';

const navItems = [
  { label: 'Create Account', color: '#1976d2' },
  { label: 'Upload Documents', color: '#1976d2' },
  {
    label: 'Application', color: '#757575', collapsible: true, subItems: [
      {
        label: 'My Household', collapsible: true, subItems: [
          'Member Information',
          'Household Address',
          'Your Contact Information',
          'Authorized Representative',
        ]
      },
      {
        label: 'Tax & Income Information', collapsible: true, subItems: [
          'Tax Information',
          'Income Confirmation',
        ]
      },
      {
        label: 'Special Enrollment & Additional Questions', collapsible: true, subItems: [
          'Special Enrollment Questions',
          'Additional Questions',
          'Individual Details',
        ]
      },
      {
        label: 'Review and Sign', collapsible: true, subItems: [
          'Review',
          'Sign',
        ]
      },
    ]
  },
  { label: 'Eligibility Results', color: '#757575' },
  { label: 'Medical Information', color: '#757575', collapsible: true },
  { label: 'Select Plans', color: '#757575' },
  { label: 'Confirm & Pay', color: '#757575' },
];

const sectionCount = 10;

export default function LeftNavigation({ completedSections = [], highlightNavBlue = [], stepLabel, openSections: openSectionsProp, showCreateAccountTick }) {
  // Automatically open 'Special Enrollment & Additional Questions' if on AdditionalQuestionsScreen
  const defaultOpenSections = openSectionsProp || { Application: false };
  if (stepLabel === 'Special Enrollment & Additional Questions') {
    defaultOpenSections['Special Enrollment & Additional Questions'] = true;
  }
  const [openSections, setOpenSections] = useState(defaultOpenSections);

  // Only show tick for 'My Household', 'Tax & Income Information', and 'Tax Information' when on 'Special Enrollment & Additional Questions'
  let tickList = Array.isArray(showCreateAccountTick) ? [...showCreateAccountTick] : [];
  if (stepLabel === 'Special Enrollment & Additional Questions') {
    if (!tickList.includes('My Household')) {
      tickList.push('My Household');
    }
    if (!tickList.includes('Tax & Income Information')) {
      tickList.push('Tax & Income Information');
    }
    if (!tickList.includes('Tax Information')) {
      tickList.push('Tax Information');
    }
  }

  const handleToggle = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="leftnav-container">
  <div className="progress-step-label" style={{padding: '18px 0 0 32px', fontWeight: 700, color: '#22292f', fontSize: '1.08rem', letterSpacing: '0.5px'}}>{stepLabel || 'Step 1/10'}</div>
      <div className="progress-bar">
        {[...Array(sectionCount)].map((_, i) => {
          let boxClass = 'progress-box';
          if (completedSections.includes(i)) boxClass += ' completed';
          if (completedSections.includes(`dark${i}`)) boxClass += ' completed-dark';
          return <div key={i} className={boxClass} />;
        })}
      </div>
      <nav className="leftnav">
        <ul>
          <hr className="nav-divider top-divider" />
          {navItems.map((item, idx) => {
            if (item.collapsible) {
              // Make 'Special Enrollment & Additional Questions' blue if on that step
              const isBlue = highlightNavBlue.includes(item.label) || (stepLabel === 'Special Enrollment & Additional Questions' && item.label === 'Special Enrollment & Additional Questions');
              // Render tick for main nav items like 'My Household' (not subnav)
              const showTick = tickList.includes(item.label);
              return (
                <React.Fragment key={item.label}>
                  <li className={`nav-item collapsible${isBlue ? ' nav-blue' : ''}`}> 
                    <span
                      className={`collapsible-label${isBlue ? ' nav-blue' : ''}`}
                      onClick={() => handleToggle(item.label)}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <span>{item.label}</span>
                      <span className={`arrow-container${isBlue ? ' nav-blue' : ''}`}>
                        {openSections[item.label] ? (
                          <span className={`arrow up${isBlue ? ' nav-blue' : ''}`} />
                        ) : (
                          <span className={`arrow down${isBlue ? ' nav-blue' : ''}`} />
                        )}
                      </span>
                      {showTick && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 1 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#22c55e',
                            color: '#fff',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                              <path d="M7 13L11 17L17 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </span>
                      )}
                    </span>
                    {openSections[item.label] && (
                      <ul className="subnav">
                        {item.subItems.map((sub, subIdx) => {
                          const subLabel = typeof sub === 'object' ? sub.label : sub;
                          const isBlueSub = highlightNavBlue.includes(subLabel);
                          if (typeof sub === 'object' && sub.collapsible) {
                            // Show tick for 'My Household' in subnav if requested
                            const showSubTick = tickList.includes(sub.label);
                            return (
                              <React.Fragment key={sub.label}>
                                <li className={`subnav-item collapsible${isBlueSub ? ' nav-blue' : ''}`}> 
                                  <hr className="subsubnav-divider" />
                                  <span
                                    className={`collapsible-label${isBlueSub ? ' nav-blue' : ''}`}
                                    onClick={() => handleToggle(sub.label)}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                  >
                                    <span>{sub.label}</span>
                                    <span className={`arrow-container${isBlueSub ? ' nav-blue' : ''}`}>
                                      {openSections[sub.label] ? (
                                        <span className={`arrow up${isBlueSub ? ' nav-blue' : ''}`} />
                                      ) : (
                                        <span className={`arrow down${isBlueSub ? ' nav-blue' : ''}`} />
                                      )}
                                    </span>
                                    {showSubTick && (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 1 }}>
                                        <span style={{
                                          display: 'inline-flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          width: 22,
                                          height: 22,
                                          borderRadius: '50%',
                                          background: '#22c55e',
                                          color: '#fff',
                                          boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                                        }}>
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                                            <path d="M7 13L11 17L17 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        </span>
                                      </span>
                                    )}
                                  </span>
                                  {openSections[sub.label] && (
                                    <ul className="collapse-list">
                                      {sub.subItems.map((s, sIdx) => (
                                        <React.Fragment key={s}>
                                          {sIdx === 0 && <hr className="subsubnav-divider" />}
                                          <li className={`collapse-item${
                                            highlightNavBlue.includes(s) ||
                                            (isAnsweredAdditionalQuestions &&
                                              sub.label === 'Special Enrollment & Additional Questions' && s === 'Additional Questions')
                                              ? ' nav-blue'
                                              : ''
                                          }`}>{s}
                                            {/* Tick for Tax Information as a collapse-item */}
                                            {stepLabel === 'Special Enrollment & Additional Questions' && s === 'Tax Information' && (
                                              <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                                                <span style={{
                                                  display: 'inline-flex',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  width: 22,
                                                  height: 22,
                                                  borderRadius: '50%',
                                                  background: '#22c55e',
                                                  color: '#fff',
                                                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                                                }}>
                                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                                                    <path d="M7 13L11 17L17 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                                  </svg>
                                                </span>
                                              </span>
                                            )}
                                          </li>
                                        </React.Fragment>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              </React.Fragment>
                            );
                          }
                          // Only show tick for main nav, not subnav
                          return (
                            <React.Fragment key={sub}>
                              {subIdx === 0 && <hr className="subsubnav-divider" />}
                              <li className={`subnav-item${isBlueSub ? ' nav-blue' : ''}`}>{sub}
                                {/* Tick for Tax Information as a subnav-item (if not collapsible) */}
                                {stepLabel === 'Special Enrollment & Additional Questions' && sub === 'Tax Information' && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                                    <span style={{
                                      display: 'inline-flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      width: 22,
                                      height: 22,
                                      borderRadius: '50%',
                                      background: '#22c55e',
                                      color: '#fff',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                                    }}>
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                                        <path d="M7 13L11 17L17 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </span>
                                  </span>
                                )}
                              </li>
                            </React.Fragment>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                  <hr className="nav-divider" />
                </React.Fragment>
              );
            }
            if (item.collapsible && !item.subItems) {
              return (
                <React.Fragment key={item.label}>
                  <li className="nav-item collapsible">
                    <span
                      className="collapsible-label"
                      onClick={() => handleToggle(item.label)}
                    >
                      {item.label}
                      {openSections[item.label] ? (
                        <span className="arrow up" />
                      ) : (
                        <span className="arrow down" />
                      )}
                    </span>
                  </li>
                  <hr className="nav-divider" />
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={item.label}>
                <li className="nav-item">
                  {['Create Account', 'Upload Documents'].includes(item.label) ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span className="nav-label" style={{ color: item.color }}>{item.label}</span>
                      {tickList.includes(item.label) && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#22c55e',
                            color: '#fff',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                              <path d="M7 13L11 17L17 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </span>
                      )}
                    </span>
                  ) : (
                    <>
                      <span className="nav-label" style={{ color: item.color }}>{item.label}</span>
                      {/* Tick mark after up/down arrow */}
                      {tickList.includes(item.label) ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                          <span style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#22c55e',
                            color: '#fff',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                              <path d="M7 13L11 17L17 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </span>
                      ) : null}
                    </>
                  )}
                </li>
                <hr className="nav-divider" />
              </React.Fragment>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
