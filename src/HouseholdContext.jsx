import React, { createContext, useContext, useState, useEffect } from 'react';

const HouseholdContext = createContext();


export function HouseholdProvider({ children }) {
  const [household, setHousehold] = useState({
    primary: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      ssn: '',
      citizen: '',
      applyForCoverage: false
    },
    spouse: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      ssn: '',
      citizen: '',
      applyForCoverage: false
    },
    dependents: [],
    address: '',
    phone: '',
    altPhone: ''
  ,tax: [],
  income: []
  ,specialEnrollment: { lostCoverage: [], lostCoverageDetails: {} }
  ,personDetails: {}
  // Additional question flags (default to false so consumers can read them safely)
  ,pregnant: false
  ,disability: false
  ,incarcerated: false
  ,immigrant: false
  ,nativeTribe: false
  // Backwards-compatible container some components read from
  ,additionalQuestions: { pregnant: false, disability: false, incarcerated: false, immigrant: false, nativeTribe: false }
  });

  // Helper to generate a stable-ish id for dependents when SSN is not available
  const generateId = () => {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) {
      // fallthrough to fallback
    }
    return 'id-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
  };

  // Prevent fetch if data is already set (e.g., after uploadDoc)
  const [isPopulated, setIsPopulated] = useState(false);
  // Wrap setHousehold to merge incoming data and set the flag
  const setHouseholdAndFlag = (data) => {
    // Ensure dependents have stable ids (use existing id if present, otherwise generate one)
    const processed = { ...data };
    if (Array.isArray(data.dependents)) {
      processed.dependents = data.dependents.map((dep) => ({ id: dep.id || generateId(), ...dep }));
    }

    // Backwards-compatible: if an additionalQuestions object is provided, copy its booleans
    // to the top-level keys so components can read either location.
    if (processed.additionalQuestions && typeof processed.additionalQuestions === 'object') {
      const aq = processed.additionalQuestions;
      processed.pregnant = aq.pregnant ?? processed.pregnant;
      processed.disability = aq.disability ?? processed.disability;
      processed.incarcerated = aq.incarcerated ?? processed.incarcerated;
      processed.immigrant = aq.immigrant ?? processed.immigrant;
      processed.nativeTribe = aq.nativeTribe ?? processed.nativeTribe;
    }

    setHousehold((prev) => ({ ...prev, ...processed }));
    setIsPopulated(true);
  };

  useEffect(() => {
    if (isPopulated) return; // Don't fetch if already populated
    async function fetchHousehold() {
      try {
        const res = await fetch('/api/household');
        if (!res.ok) throw new Error('Failed to fetch household data');
        const data = await res.json();
        setHouseholdAndFlag(data);
      } catch (err) {
        console.error('Error fetching household data:', err);
      }
    }
    fetchHousehold();
  }, [isPopulated]);

  return (
    <HouseholdContext.Provider value={{ household, setHousehold: setHouseholdAndFlag }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}
