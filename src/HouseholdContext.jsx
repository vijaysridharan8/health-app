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
