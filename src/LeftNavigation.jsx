import React, { useState } from 'react';
import './LeftNavigation.css';

const navItems = [
  { label: 'Upload Documents', color: '#1976d2' },
  {
    label: 'Application', color: '#757575',collapsible: true,
    subItems: [
      {
        label: 'My Household',
        collapsible: true,
        subItems: [
          'Member Information',
          'Household Address',
          'Your Contact Information',
          'Authorized Representative',
        ],
      },
    ],
  },
  { label: 'Tax & Income Information', color: '#757575', collapsible: true },
  { label: 'Additional Questions', color: '#757575', collapsible: true },
  { label: 'Identity Confirmation', color: '#757575' },
  { label: 'Review and Sign', color: '#757575', collapsible: true },
  { label: 'Eligibility Results', color: '#757575' },
  { label: 'Medical Information', color: '#757575', collapsible: true },
  { label: 'Select Plans', color: '#757575' },
  { label: 'Confirm & Pay', color: '#757575' },
];

const sectionCount = 10;

export default function LeftNavigation({ completedSections = [] }) {
  const [openSections, setOpenSections] = useState({
    'Application': false,
    'My Household': false,
  });

  const handleToggle = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="leftnav-container">
      <div className="progress-bar">
        {[...Array(sectionCount)].map((_, i) => (
          <div
            key={i}
            className={`progress-box${completedSections.includes(i) ? ' completed' : ''}`}
          />
        ))}
      </div>
      <nav className="leftnav">
        <ul>
          {navItems.map((item) => {
            if (item.label === 'Application' && item.collapsible) {
              return (
                <li key={item.label} className="nav-item collapsible">
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
                  {openSections[item.label] && (
                    <ul className="subnav">
                      {item.subItems.map((sub) => {
                        if (sub.label === 'My Household' && sub.collapsible) {
                          return (
                            <li key={sub.label} className="subnav-item collapsible">
                              <span
                                className="collapsible-label"
                                onClick={() => handleToggle(sub.label)}
                              >
                                {sub.label}
                                {openSections[sub.label] ? (
                                  <span className="arrow up" />
                                ) : (
                                  <span className="arrow down" />
                                )}
                              </span>
                              {openSections[sub.label] && (
                                <ul className="collapse-list">
                                  {sub.subItems.map((s) => (
                                    <li key={s} className="collapse-item">{s}</li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        }
                        return (
                          <li key={sub.label} className="subnav-item">{sub.label}</li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }
            if (item.collapsible) {
              return (
                <li key={item.label} className="nav-item collapsible">
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
              );
            }
            return (
              <li key={item.label} className="nav-item">
                <span className="nav-label" style={{ color: item.color }}>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
