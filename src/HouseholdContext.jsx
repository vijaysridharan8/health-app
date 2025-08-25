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
  });

  // Prevent fetch if data is already set (e.g., after uploadDoc)
  const [isPopulated, setIsPopulated] = useState(false);
  // Wrap setHousehold to set the flag
  const setHouseholdAndFlag = (data) => {
    setHousehold(data);
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
