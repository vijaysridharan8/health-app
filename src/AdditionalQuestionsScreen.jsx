import React, { useState, useRef, useEffect } from 'react';
import LeftNavigation from './LeftNavigation';
import IdentityConfirmation from './IdentityConfirmation';
import './AdditionalQuestionsScreen.css';
import Header from './Header';
import { useHousehold } from './HouseholdContext';

const livingArrangementOptions = [
  "Acute Care Facility",
  "Public Alcohol/Drug Center",
  "At Home",
  "Alien Sponsor Living Alone ",
  "Alcohol & Drug Treat CTR Non-Rated ",
  "Alcohol & Drug Treat CTR Rated ",
  "Alien Sponsor Spouse ",
  "Boarder ",
  "Boarding School ",
  "Battered Spouse Shelter ",
  "Chronic Disease Facility ",
  "Contregate Housing ",
  "Commercial Housing ",
  "Emergency Housing ",
  "Foster Care (Not IV -E) ",
  "Foster Care (IV-E) ",
  "Homeless ",
  "Halfway House Rated   ",
  "Halfway House Non-Rated ",
  "Intermediate Care Facility ",
  "Correctional Facility ",
  "Large Licensed Boarding Home ",
  "Large Group Home ",
  "Mental Disease Facility ",
  "New Horizons ",
  "Not in Home ",
  "Roomer ",
  "Small Licensed Boarding Home ",
  "Small Group Home ",
  "Supervised Apartment ",
  "Skilled Nursing Facility ",
  "Unlicensed Boarding Home "
];
const specialEnrollmentOptions = [
  "Did any of these people lose health coverage in the last 60 days?",
  "Are any of these people going to lose their health coverage in the next 60 days?",
  "Did any of these people have an employer that didn’t provide health coverage or an employer that provided health coverage that wasn’t affordable? or didn’t meet minimum value in the last 60 days?",
  "Are any of these people going to have an employer that will not provide health coverage or an employer that will provide health coverage that isn’t affordable? or won’t meet minimum value in the next 60 days?",
  "Have any of these people been adopted or placed for adoption in the last 60 days?",
  "Did any of these people get married in the last 60 days?",
  "Did any of these people gain eligible immigration status in the last 60 days?",
  "Did any of these people move in the last 60 days?",
  "Will any of these individuals be certified as pregnant by a licensed provider in the last 30 days?",
  "Will any of these individuals be certified as pregnant by a licensed provider in the next 30 days?",
  "Are any of these individuals an American Indian or Alaskan Native?",
  "Did any of these people lose health reimbursement arrangement (HRA) in the last 60 days or will lose HRA in the next 60 days?",
  "Did any of these people gain health reimbursement arrangement (HRA) in the last 60 days or will gain HRA in the next 60 days?",
  "Did any of these people recently get released from incarceration (correctional institution or detention) in the last 60 days?"
];

function AdditionalQuestionsScreen() {
  const [showIdentityPopup, setShowIdentityPopup] = useState(false);
  const { household, setHousehold } = useHousehold();
  // Helper to generate a stable-ish id when SSN isn't present
  const generateId = () => {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) {
      // ignore
    }
    return 'id-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
  };

  // Ensure dependents have stable ids and migrate any legacy specialEnrollment ids
  useEffect(() => {
    if (!household) return;
    const deps = household.dependents || [];
    let created = false;
    const newDeps = deps.map((d) => {
      if (!d.id) {
        created = true;
        return { id: generateId(), ...d };
      }
      return d;
    });
    if (created && setHousehold) {
      // merge updated dependents back into household
      setHousehold({ dependents: newDeps });
      return; // wait for household to update before attempting migration
    }

    // Migrate any legacy dep-<idx> ids in household.specialEnrollment.lostCoverage -> use matching dependent ids
    if (household.specialEnrollment && Array.isArray(household.specialEnrollment.lostCoverage) && deps.length > 0) {
      const legacyPrefix = 'dep-';
      const mapping = {};
      let needsUpdate = false;
      household.dependents.forEach((d, idx) => {
        const legacy = `${legacyPrefix}${idx}`;
        if (household.specialEnrollment.lostCoverage.includes(legacy)) {
          mapping[legacy] = d.id || generateId();
          needsUpdate = true;
        }
      });
      if (needsUpdate && setHousehold) {
        const newLost = household.specialEnrollment.lostCoverage.map((it) => mapping[it] || it);
        setHousehold({ specialEnrollment: { ...household.specialEnrollment, lostCoverage: newLost } });
      }
    }
  }, [household, setHousehold]);
  const primaryName = `${household?.primary?.firstName || 'Primary'} ${household?.primary?.lastName || ''}`.trim();
  const spouseName = `${household?.spouse?.firstName || 'Spouse'} ${household?.spouse?.lastName || ''}`.trim();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [jobCoverage, setJobCoverage] = useState("");
  const [otherCoverage, setOtherCoverage] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [disability, setDisability] = useState("");
  const [incarcerated, setIncarcerated] = useState("");
  const [nativeTribe, setNativeTribe] = useState("");
  const [livingArrangement, setLivingArrangement] = useState("At Home"); // James Smith
  const [hispanicOrigin, setHispanicOrigin] = useState(""); // James Smith
  const [race, setRace] = useState(""); // James Smith
  const [applyToAll, setApplyToAll] = useState(false);
  const [milanLivingArrangement, setMilanLivingArrangement] = useState("At Home");
  const [milanHispanicOrigin, setMilanHispanicOrigin] = useState("");
  const [milanRace, setMilanRace] = useState("");
  const [lostCoveragePeople, setLostCoveragePeople] = useState([]); // stores ids: 'primary' | 'spouse' | 'dep-<idx>' | 'none'
  const [lostCoverageDetails, setLostCoverageDetails] = useState({}); // { [id]: { date: 'YYYY-MM-DD', reason: 'yes'|'no' } }
  const [highlightNavBlue, setHighlightNavBlue] = useState(true);
  const [showFifthDark, setShowFifthDark] = useState(true);
  const dropdownRef = useRef(null);
  const raceOptions = [
    "White",
    "Black or African American",
    "American Indian or Alaska Native",
    "Asian Indian",
    "Chinese",
    "Filipino",
    "Japanese",
    "Korean",
    "Vietnamese",
    "Other Asian",
    "Native Hawaiian",
    "Guamanian or Chamorro",
    "Samoan",
    "Other Pacific Islander",
    "Some other race"
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };
  const handleJobCoverageChange = (e) => setJobCoverage(e.target.value);
  const handleOtherCoverageChange = (e) => setOtherCoverage(e.target.value);
  const handlePregnantChange = (e) => setPregnant(e.target.value);
  const handleDisabilityChange = (e) => setDisability(e.target.value);
  const handleIncarceratedChange = (e) => setIncarcerated(e.target.value);
  const handleNativeTribeChange = (e) => setNativeTribe(e.target.value);
  const handleLivingArrangementChange = (e) => {
    setLivingArrangement(e.target.value);
    if (applyToAll) setMilanLivingArrangement(e.target.value);
  };
  const handleHispanicOriginChange = (e) => {
    setHispanicOrigin(e.target.value);
    if (applyToAll) setMilanHispanicOrigin(e.target.value);
  };
  const handleRaceChange = (e) => {
    setRace(e.target.value);
    if (applyToAll) setMilanRace(e.target.value);
  };
  const handleApplyToAllChange = (e) => {
    const checked = e.target.checked;
    setApplyToAll(checked);
    if (checked) {
      setMilanLivingArrangement(livingArrangement);
      setMilanHispanicOrigin(hispanicOrigin);
      setMilanRace(race);
    }
  };
  const handleLostCoveragePeopleChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setLostCoveragePeople((prev) => {
      // 'none' is exclusive
      if (value === 'none') {
        return checked ? ['none'] : prev.filter((v) => v !== 'none');
      }
      // selecting someone should remove 'none' if present
      let next = prev.filter((v) => v !== 'none');
      if (checked) {
        if (!next.includes(value)) next = [...next, value];
      } else {
        next = next.filter((v) => v !== value);
      }
      // persist to household.specialEnrollment
      try {
        const se = household?.specialEnrollment || {};
        const newSE = { ...se, lostCoverage: next, lostCoverageDetails: lostCoverageDetails };
        if (setHousehold) setHousehold({ specialEnrollment: newSE });
      } catch (err) {
        console.error('Error persisting specialEnrollment lostCoverage:', err);
      }
      return next;
    });
  };

  // Initialize local lostCoverage state from household.specialEnrollment when available
  useEffect(() => {
    if (!household) return;
    const se = household.specialEnrollment || {};
    if (Array.isArray(se.lostCoverage) && se.lostCoverage.length > 0) {
      setLostCoveragePeople(se.lostCoverage);
    }
    if (se.lostCoverageDetails && typeof se.lostCoverageDetails === 'object') {
      setLostCoverageDetails(se.lostCoverageDetails);
    }
  }, [household]);

  const persistLostCoverageDetails = (nextDetails) => {
    setLostCoverageDetails(nextDetails);
    try {
      const se = household?.specialEnrollment || {};
      const newSE = { ...se, lostCoverage: lostCoveragePeople, lostCoverageDetails: nextDetails };
      if (setHousehold) setHousehold({ specialEnrollment: newSE });
    } catch (err) {
      console.error('Error persisting specialEnrollment lostCoverageDetails:', err);
    }
  };

  const handleCoverageDateChange = (id, value) => {
    setLostCoverageDetails((prev) => {
      const next = { ...prev, [id]: { ...(prev[id] || {}), date: value } };
      persistLostCoverageDetails(next);
      return next;
    });
  };

  const handleCoverageReasonChange = (id, value) => {
    setLostCoverageDetails((prev) => {
      const next = { ...prev, [id]: { ...(prev[id] || {}), reason: value } };
      persistLostCoverageDetails(next);
      return next;
    });
  };

  

  // On initial load, show 5th section in dark grey, then revert to normal after mount


  const completedSections = showFifthDark ? [0,1,2,3,"dark4"] : [0,1,2,3];

  return (
    <>
      <Header />
      <div className="upload-docs-layout">
      <LeftNavigation
        completedSections={completedSections}
        highlightNavBlue={highlightNavBlue ? [
          'Application',
          'My Household',
          'Tax & Income Information',
          'Special Enrollment & Additional Questions',
          'Special Enrollment Questions',
        ] : []}
        stepLabel="Step 5/10"
        openSections={{ Application: true, 'Special Enrollment & Additional Questions': true }}
        showCreateAccountTick={["Create Account", "Upload Documents", "My Household"]}
        answeredAdditionalQuestions={Boolean(jobCoverage || otherCoverage || pregnant || disability || incarcerated || nativeTribe || livingArrangement || hispanicOrigin || race)}
      />
      <main className="upload-docs-content">
        <h1>
          <span className="aq-circle">5</span>
          Additional Questions
        </h1>
        <section className="upload-question">
          <h2>Special Enrollment Questions</h2>
          <div className="aq-multiselect" ref={dropdownRef}>
            <div
              className="aq-multiselect-control"
              onClick={() => setDropdownOpen((open) => !open)}
              tabIndex={0}
            >
              {'Select Special Enrollment Questions whichever applicable'}
              <span className="aq-arrow">▼</span>
            </div>
            {dropdownOpen && (
              <div className="aq-multiselect-dropdown">
                {specialEnrollmentOptions.map((option) => (
                  <label key={option} className="aq-multiselect-option">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleSelect(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Show the following only if the relevant specialEnrollmentOption is selected */}
          {selectedOptions.includes("Did any of these people lose health coverage in the last 60 days?") && (
            <>
              <div style={{marginTop: 24}}>
                <div style={{fontWeight: 500, marginBottom: 8}}>
                  Did any of these people lose health coverage in the last 60 days? (select all that apply)<span className="red-star">*</span>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 8}}>
                  <label>
                    <input
                      type="checkbox"
                      name="lostCoveragePeople"
                      value="primary"
                      checked={lostCoveragePeople.includes('primary')}
                      onChange={handleLostCoveragePeopleChange}
                    /> {primaryName}
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="lostCoveragePeople"
                      value="spouse"
                      checked={lostCoveragePeople.includes('spouse')}
                      onChange={handleLostCoveragePeopleChange}
                    /> {spouseName}
                  </label>
                  {/* Render dependents dynamically */}
                  { (household?.dependents || []).map((dep, idx) => {
                    const depName = `${dep.firstName || 'Dependent'} ${dep.lastName || ''}`.trim();
                    const id = dep.id || `dep-${idx}`;
                    return (
                      <label key={id}>
                        <input
                          type="checkbox"
                          name="lostCoveragePeople"
                          value={id}
                          checked={lostCoveragePeople.includes(id)}
                          onChange={handleLostCoveragePeopleChange}
                        /> {depName}
                      </label>
                    );
                  })}
                  <label>
                    <input
                      type="checkbox"
                      name="lostCoveragePeople"
                      value="none"
                      checked={lostCoveragePeople.includes('none')}
                      onChange={handleLostCoveragePeopleChange}
                    /> None of the people
                  </label>
                </div>
              </div>
              {lostCoveragePeople.includes('primary') && (
                <>
                  <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 12}}>
                    <label htmlFor="primary-coverage-date" style={{fontWeight: 500}}>
                      When did {primaryName} lose coverage?<span className="red-star">*</span>
                    </label>
                      <input
                        id="primary-coverage-date"
                        type="date"
                        style={{marginLeft: 8, padding: '6px 10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4}}
                        required
                        value={lostCoverageDetails['primary']?.date || ''}
                        onChange={(e) => handleCoverageDateChange('primary', e.target.value)}
                      />
                  </div>
                  <div style={{marginTop: 18, textAlign: 'left'}}>
                    <div style={{fontWeight: 500, marginBottom: 8}}>
                      Did {primaryName} lose coverage because he/she didn't pay premiums or he/she voluntarily terminated coverage? <span className="red-star">*</span>
                      <div style={{fontWeight: 400, fontSize: '0.97rem', color: '#444', marginTop: 2}}>Note: This does not include leaving a job.</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
                      <label style={{display: 'flex', alignItems: 'center', fontWeight: 400}}>
                        <input type="radio" name="primaryLostCoverageReason" value="yes" style={{marginRight: 6}} checked={lostCoverageDetails['primary']?.reason === 'yes'} onChange={() => handleCoverageReasonChange('primary', 'yes')} /> Yes
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', fontWeight: 400}}>
                        <input type="radio" name="primaryLostCoverageReason" value="no" style={{marginRight: 6}} checked={lostCoverageDetails['primary']?.reason === 'no'} onChange={() => handleCoverageReasonChange('primary', 'no')} /> No
                      </label>
                    </div>
                  </div>
                </>
              )}
              {lostCoveragePeople.includes('spouse') && (
                <>
                  <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 12}}>
                    <label htmlFor="spouse-coverage-date" style={{fontWeight: 500}}>
                      When did {spouseName} lose coverage?<span className="red-star">*</span>
                    </label>
                    <input
                      id="spouse-coverage-date"
                      type="date"
                      style={{marginLeft: 8, padding: '6px 10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4}}
                      required
                      value={lostCoverageDetails['spouse']?.date || ''}
                      onChange={(e) => handleCoverageDateChange('spouse', e.target.value)}
                    />
                  </div>
                  <div style={{marginTop: 18, textAlign: 'left'}}>
                    <div style={{fontWeight: 500, marginBottom: 8}}>
                      Did {spouseName} lose coverage because he/she didn't pay premiums or he/she voluntarily terminated coverage? <span className="red-star">*</span>
                      <div style={{fontWeight: 400, fontSize: '0.97rem', color: '#444', marginTop: 2}}>Note: This does not include leaving a job.</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
                      <label style={{display: 'flex', alignItems: 'center', fontWeight: 400}}>
                        <input type="radio" name="spouseLostCoverageReason" value="yes" style={{marginRight: 6}} checked={lostCoverageDetails['spouse']?.reason === 'yes'} onChange={() => handleCoverageReasonChange('spouse', 'yes')} /> Yes
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', fontWeight: 400}}>
                        <input type="radio" name="spouseLostCoverageReason" value="no" style={{marginRight: 6}} checked={lostCoverageDetails['spouse']?.reason === 'no'} onChange={() => handleCoverageReasonChange('spouse', 'no')} /> No
                      </label>
                    </div>
                  </div>
                </>
              )}
              {/* Render conditional sections for dependents selected */}
              {(household?.dependents || []).map((dep, idx) => {
                const depName = `${dep.firstName || 'Dependent'} ${dep.lastName || ''}`.trim();
                const id = dep.id || `dep-${idx}`;
                const selected = lostCoveragePeople.includes(id);
                return selected ? (
                  <React.Fragment key={`dep-block-${id}`}>
                    <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 12}}>
                      <label htmlFor={`${id}-coverage-date`} style={{fontWeight: 500}}>
                        When did {depName} lose coverage?<span className="red-star">*</span>
                      </label>
                        <input
                          id={`${id}-coverage-date`}
                          type="date"
                          style={{marginLeft: 8, padding: '6px 10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4}}
                          required
                          value={lostCoverageDetails[id]?.date || ''}
                          onChange={(e) => handleCoverageDateChange(id, e.target.value)}
                        />
                    </div>
                    <div style={{marginTop: 18, textAlign: 'left'}}>
                      <div style={{fontWeight: 500, marginBottom: 8}}>
                        Did {depName} lose coverage because he/she didn't pay premiums or he/she voluntarily terminated coverage? <span className="red-star">*</span>
                        <div style={{fontWeight: 400, fontSize: '0.97rem', color: '#444', marginTop: 2}}>Note: This does not include leaving a job.</div>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
                        <label style={{display: 'flex', alignItems: 'center', fontWeight: 400}}>
                          <input type="radio" name={`depLostCoverageReason-${id}`} value="yes" style={{marginRight: 6}} checked={lostCoverageDetails[id]?.reason === 'yes'} onChange={() => handleCoverageReasonChange(id, 'yes')} /> Yes
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', fontWeight: 400}}>
                          <input type="radio" name={`depLostCoverageReason-${id}`} value="no" style={{marginRight: 6}} checked={lostCoverageDetails[id]?.reason === 'no'} onChange={() => handleCoverageReasonChange(id, 'no')} /> No
                        </label>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null;
              })}
            </>
          )}
        </section>

        <section className="upload-question">
          <h2 style={{fontSize: '1.2rem', marginBottom: 14, color: '#222'}}>Additional Questions</h2>
          <h2 style={{marginBottom: 8}}>
            Will any member of this household who is requesting coverage be offered health coverage from a job during 2025 (even if it's from another person's job, like a spouse or a parent/legal guardian)?
            <span className="red-star">*</span>
          </h2>
          <div style={{fontSize: '0.98rem', marginBottom: 14, color: '#222'}}>
            Note: An adult can typically only stay on a parents/legal guardians health insurance plan through an employer until the age of 26. The only exception to this rule is when the adult is disabled.
          </div>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="jobCoverage"
                value="yes"
                checked={jobCoverage === 'yes'}
                onChange={handleJobCoverageChange}
                required
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="jobCoverage"
                value="no"
                checked={jobCoverage === 'no'}
                onChange={handleJobCoverageChange}
                required
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>
          <br /><br />
          <h2 style={{marginBottom: 8}}>
            Are any members of this household who are requesting coverage currently enrolled in health coverage that is not offered through Access Health CT or the CT Department of Social Services?
            <span className="red-star">*</span>
          </h2>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="otherCoverage"
                value="yes"
                checked={otherCoverage === 'yes'}
                onChange={handleOtherCoverageChange}
                required
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="otherCoverage"
                value="no"
                checked={otherCoverage === 'no'}
                onChange={handleOtherCoverageChange}
                required
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>
          <br /><br />
          <h2 style={{marginBottom: 8}}>
            Is anyone in your household pregnant?
            <span className="red-star">*</span>
          </h2>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="pregnant"
                value="yes"
                checked={pregnant === 'yes'}
                onChange={handlePregnantChange}
                required
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="pregnant"
                value="no"
                checked={pregnant === 'no'}
                onChange={handlePregnantChange}
                required
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>
          <br /><br />
          <h2 style={{marginBottom: 8}}>
            Do any members of your household have a physical disability or mental health condition that limits their ability to work, attend school or take care of their daily needs?
            <span className="red-star">*</span>
          </h2>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="disability"
                value="yes"
                checked={disability === 'yes'}
                onChange={handleDisabilityChange}
                required
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="disability"
                value="no"
                checked={disability === 'no'}
                onChange={handleDisabilityChange}
                required
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>
          <br /><br />
          <h2 style={{marginBottom: 8}}>
            Is anyone in your household incarcerated?
            <span className="red-star">*</span>
          </h2>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="incarcerated"
                value="yes"
                checked={incarcerated === 'yes'}
                onChange={handleIncarceratedChange}
                required
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="incarcerated"
                value="no"
                checked={incarcerated === 'no'}
                onChange={handleIncarceratedChange}
                required
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>
          <br /><br />
          <h2 style={{marginBottom: 8}}>
            Are any household members affiliated with an American Indian or Alaska Native tribe?
            <span className="red-star">*</span>
          </h2>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="nativeTribe"
                value="yes"
                checked={nativeTribe === 'yes'}
                onChange={handleNativeTribeChange}
                required
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="nativeTribe"
                value="no"
                checked={nativeTribe === 'no'}
                onChange={handleNativeTribeChange}
                required
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>
        </section>

        <section style={{marginTop: 32}}>
          <h2 style={{fontSize: '1.2rem', marginBottom: 8, color: '#222'}}>Individual Details</h2>
           <div className="upload-question">
            <h2 style={{fontSize: '1.0rem', marginBottom: 8, color: '#222'}}>Your Details</h2>
          <hr style={{border: 'none', borderTop: '1.5px solid #e3e8f0', margin: '12px 0 24px 0'}} />
          
            <h2 style={{marginBottom: 8}}>
              What is your current Living Arrangement
              <span className="red-star">*</span>
            </h2>
            <div style={{maxWidth: 400}}>
              <select
                className="aq-multiselect-control"
                name="livingArrangement"
                value={livingArrangement}
                onChange={handleLivingArrangementChange}
                required
                style={{width: '100%', minHeight: 40, fontSize: '1rem'}}
              >
                <option value="" disabled>Select your living arrangement</option>
                {livingArrangementOptions.map((option) => (
                  <option key={option.trim()} value={option.trim()}>{option.trim()}</option>
                ))}
              </select>
            </div>
            <br></br>
           <h2 style={{marginBottom: 8}}>
            Are you of Hispanic, Latino, or Spanish origin?
          </h2>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="hispanicOrigin"
                value="yes"
                checked={hispanicOrigin === 'yes'}
                onChange={handleHispanicOriginChange}
                required
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="hispanicOrigin"
                value="no"
                checked={hispanicOrigin === 'no'}
                onChange={handleHispanicOriginChange}
                required
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>

          <h2 style={{marginBottom: 8}}>
            What is your race?
          </h2>

          <div style={{maxWidth: 400}}>
            <select
              className="aq-multiselect-control"
              name="race"
              value={race}
              onChange={handleRaceChange}
              required
              style={{width: '100%', minHeight: 40, fontSize: '1rem'}}
            >
              <option value="" disabled>Select your race</option>
              {raceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <hr style={{border: 'none', borderTop: '1.5px solid #e3e8f0', margin: '12px 0 24px 0'}} />
          <div style={{margin: '18px 0 0 0'}}>
            <label style={{display: 'flex', alignItems: 'center', fontSize: '1rem'}}>
              <input
                type="checkbox"
                style={{marginRight: 8}}
                checked={applyToAll}
                onChange={handleApplyToAllChange}
              />
              These details apply to all members in my household
            </label>
          </div>
        </div>
        </section>

         <section style={{marginTop: 32}}>
           <div className="upload-question">
            <h2 style={{fontSize: '1.0rem', marginBottom: 8, color: '#222'}}>Milan Smith</h2>
          <hr style={{border: 'none', borderTop: '1.5px solid #e3e8f0', margin: '12px 0 24px 0'}} />
          
            <h2 style={{marginBottom: 8}}>
              What is Milan Smith's current Living Arrangement
              <span className="red-star">*</span>
            </h2>
            <div style={{maxWidth: 400}}>
              <select
                className="aq-multiselect-control"
                name="milanLivingArrangement"
                value={milanLivingArrangement}
                onChange={e => setMilanLivingArrangement(e.target.value)}
                required
                style={{width: '100%', minHeight: 40, fontSize: '1rem'}}
                disabled={applyToAll}
              >
                <option value="" disabled>Select your living arrangement</option>
                {livingArrangementOptions.map((option) => (
                  <option key={option.trim()} value={option.trim()}>{option.trim()}</option>
                ))}
              </select>
            </div>
            <br></br>
           <h2 style={{marginBottom: 8}}>
            Is Milan Smith of Hispanic, Latino, or Spanish origin?
          </h2>
          <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <label className="radio-box">
              <input
                type="radio"
                name="milanHispanicOrigin"
                value="yes"
                checked={milanHispanicOrigin === 'yes'}
                onChange={e => setMilanHispanicOrigin(e.target.value)}
                required
                disabled={applyToAll}
                style={{marginRight: 6}}
              />
              Yes
            </label>
            <label className="radio-box">
              <input
                type="radio"
                name="milanHispanicOrigin"
                value="no"
                checked={milanHispanicOrigin === 'no'}
                onChange={e => setMilanHispanicOrigin(e.target.value)}
                required
                disabled={applyToAll}
                style={{marginRight: 6}}
              />
              No
            </label>
          </div>

          <h2 style={{marginBottom: 8}}>
            What is Milan Smith's race?
          </h2>

          <div style={{maxWidth: 400}}>
            <select
              className="aq-multiselect-control"
              name="milanRace"
              value={milanRace}
              onChange={e => setMilanRace(e.target.value)}
              required
              style={{width: '100%', minHeight: 40, fontSize: '1rem'}}
              disabled={applyToAll}
            >
              <option value="" disabled>Select your race</option>
              {raceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        </section>

        <div className="next-btn-row">
          <button
            className="next-btn"
            disabled={![jobCoverage, otherCoverage, pregnant, disability, incarcerated, nativeTribe, livingArrangement].every(Boolean)}
            onClick={e => {
              e.preventDefault();
              setShowIdentityPopup(true);
            }}
          >
            Next
          </button>
        </div>
      </main>
  <IdentityConfirmation open={showIdentityPopup} onClose={() => setShowIdentityPopup(false)} />
  {/* No aside/floating panel for now, but can be added if needed */}
      </div>
    </>
  );
}

export default AdditionalQuestionsScreen;