import React, { useState, useEffect, useRef } from 'react';
import { useHousehold } from './HouseholdContext';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import LeftNavigation from './LeftNavigation';
import './UploadDocumentScreen.css';
import uploadImg from './assets/upload_illustration.png';
import { FaRegClock, FaMobileAlt, FaUpload } from 'react-icons/fa';

export default function UploadDocumentScreen() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedDocInfo, setUploadedDocInfo] = useState(null); // { name, filename, uploadedAt }
  const { household, setHousehold } = useHousehold();

  const handleComputerUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsUploading(true);
      setUploadMessage("");
      setUploadedDocInfo(null);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('http://localhost:8080/api/uploadDoc', {
          method: 'POST',
          body: formData,
        });
        const text = await response.text();
        if (response.ok) {
          setUploadMessage('Upload successful');
          let docName = '';
          try {
            const json = JSON.parse(text);
            const fields = json.fields || {};
            // helper to read multiple possible variants of a key from an object
            const getField = (obj, ...keys) => {
              if (!obj) return '';
              for (const k of keys) {
                if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
              }
              return '';
            };
            if (fields['First Name'] || fields['Last Name']) {
              docName = `${fields['First Name'] || ''} ${fields['Last Name'] || ''}`.trim();
            }
            setUploadedDocInfo({
              name: docName || 'Unknown',
              filename: file.name,
              uploadedAt: new Date(),
              fields: fields
            });
            // Build tax and income arrays (if provided by LLM)
            const taxFromLLM = fields.tax || fields.Tax || [];
            const incomeFromLLM = fields.income || fields.Income || [];

            // Determine filing status from common keys
            const filingStatusRaw = (fields['Filing Status'] || fields['FilingStatus'] || fields['Filing_Status'] || '').toString().toLowerCase();
            const isMarriedFilingJointly = filingStatusRaw.includes('married') && filingStatusRaw.includes('joint');

            // Ensure tax entries for primary and spouse when 'Married filing jointly' is detected
            const taxItems = Array.isArray(taxFromLLM) ? [...taxFromLLM] : [];
            if (isMarriedFilingJointly) {
              const primaryName = `${fields['First Name'] || ''} ${fields['Last Name'] || ''}`.trim();
              const spouseName = fields.Spouse ? `${fields.Spouse['First Name'] || ''} ${fields.Spouse['Last Name'] || ''}`.trim() : '';
              // Helper to check existing by name
              const existsFor = (name) => taxItems.some(t => (t.name || '').toString().trim() === name);
              if (primaryName && !existsFor(primaryName)) {
                taxItems.unshift({ name: primaryName, taxStatus: 'Married Filing Jointly', reconciledPremiumTaxCredits: false });
              }
              if (spouseName && !existsFor(spouseName)) {
                taxItems.unshift({ name: spouseName, taxStatus: 'Married Filing Jointly', reconciledPremiumTaxCredits: false });
              }
            }

            // Set household context (normalize common key variants for DOB and SSN)
            setHousehold({
              primary: {
                firstName: getField(fields, 'First Name', 'firstName', 'givenName') || '',
                lastName: getField(fields, 'Last Name', 'lastName', 'familyName') || '',
                dob: getField(fields, 'Date of Birth', 'DOB', 'dob', 'DateOfBirth', 'date_of_birth') || '',
                gender: getField(fields, 'Gender', 'gender') || '',
                ssn: getField(fields, 'SSN', 'ssn', 'Social Security Number', 'socialSecurityNumber') || '',
                citizen: getField(fields, 'US Citizen or Naturalized Citizen') || '',
                applyForCoverage: getField(fields, 'Applying for Coverage') === 'Yes'
              },
              spouse: fields.Spouse ? {
                firstName: getField(fields.Spouse, 'First Name', 'firstName', 'givenName') || '',
                lastName: getField(fields.Spouse, 'Last Name', 'lastName', 'familyName') || '',
                dob: getField(fields.Spouse, 'Date of Birth', 'DOB', 'dob', 'DateOfBirth', 'date_of_birth') || '',
                gender: getField(fields.Spouse, 'Gender', 'gender') || '',
                ssn: getField(fields.Spouse, 'SSN', 'ssn', 'Social Security Number', 'socialSecurityNumber') || '',
                citizen: getField(fields.Spouse, 'US Citizen or Naturalized Citizen') || '',
                applyForCoverage: getField(fields.Spouse, 'Applying for Coverage') === 'Yes'
              } : null,
              dependents: Array.isArray(fields.Dependents) ? fields.Dependents.map(dep => ({
                firstName: getField(dep, 'First Name', 'firstName', 'givenName') || '',
                lastName: getField(dep, 'Last Name', 'lastName', 'familyName') || '',
                dob: getField(dep, 'Date of Birth', 'DOB', 'dob', 'DateOfBirth', 'date_of_birth') || '',
                gender: getField(dep, 'Gender', 'gender') || '',
                ssn: getField(dep, 'SSN', 'ssn', 'Social Security Number', 'socialSecurityNumber') || '',
                citizen: getField(dep, 'US Citizen or Naturalized Citizen') || '',
                applyForCoverage: getField(dep, 'Applying for Coverage') === 'Yes'
              })) : [],
              address: getField(fields, 'Address', 'Address Line 1', 'address', 'addressLine1') || '',
              phone: getField(fields, 'Phone', 'Phone Number', 'phone', 'phoneNumber') || '',
              altPhone: getField(fields, 'Alternate Phone Number', 'Alt Phone', 'alternatePhone') || '',
              tax: taxItems,
              income: Array.isArray(incomeFromLLM) ? incomeFromLLM : []
            });
          } catch (e) {}
        } else {
          setUploadMessage(`Upload failed: ${text}`);
        }
      } catch (error) {
        setUploadMessage('Error uploading file.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    helpPaying: '',
    autoEnroll: '',
    consentDSS: '',
  });
  const isAllAnswered = answers.helpPaying && answers.autoEnroll && answers.consentDSS;
  const [showSecondDark, setShowSecondDark] = useState(true);
  const completedSections = showSecondDark ? [0, "dark1"] : [0, 1];
  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };
  const handleNext = async () => {
    // If user consented to share with DSS, call backend /api/processCase
    if (answers.consentDSS === 'yes') {
      try {
        // include current household so server can merge and return mergedHousehold
        const payload = {
          consentDSS: 'yes',
          household: household || null,
          uploadedDocInfo: uploadedDocInfo || null
        };

        const resp = await fetch('http://localhost:8080/api/processCase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const text = await resp.text();
        if (resp.ok) {
          try {
            const json = JSON.parse(text);
            // prefer backend merged household if present
            if (json.mergedHousehold && setHousehold) {
              setHousehold(json.mergedHousehold);
            }
            // also persist the caseId onto the household
            if (json.caseId && setHousehold) {
              try {
                // use updater form to avoid overwriting
                setHousehold(prev => ({ ...(prev || {}), processCaseId: json.caseId }));
              } catch (e) {
                // fallback: set simple object
                setHousehold({ processCaseId: json.caseId });
              }
            }
            setUploadMessage('Case submitted: ' + (json.caseId || 'queued'));
          } catch (e) {
            setUploadMessage('Case submitted');
          }
        } else {
          setUploadMessage('Failed to submit case: ' + text);
        }
      } catch (err) {
        console.error('processCase error', err);
        setUploadMessage('Error submitting case to DSS');
      }
    }
    navigate('/additional-questions');
  };

  // removed client-side merge: server now returns mergedHousehold

  return (
    <>
      <Header />
      <div className="upload-docs-layout">
        <LeftNavigation completedSections={completedSections} stepLabel="Step 2/10" showCreateAccountTick={["Create Account"]} />
        <main className="upload-docs-content">
          <h1><span className="aq-circle">1</span> Upload Documents</h1>
          <section className="upload-howto">
            <img src={uploadImg} alt="How to upload documents" className="upload-img" />
            <div>
              <h2>How to add documents</h2>
              <ul>
                <li>Add your own document</li>
                <li>Then, add the documents for each of your household members that are applying for coverage</li>
              </ul>
            </div>
          </section>
          <section className="upload-acceptable">
            <h2>Acceptable Documents</h2>
            <ul>
              <li>1040 tax document</li>
              <li>Drivers license or State IDs</li>
            </ul>
          </section>
          <section className="upload-question">
            <h2>Do you want to find out if you can get help paying for health coverage?<span className="red-star">*</span></h2>
            <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start'}}>
              <label className="radio-box" style={{alignItems: 'flex-start'}}>
                <input type="radio" name="helpPaying" value="yes" checked={answers.helpPaying === 'yes'} onChange={handleChange} required style={{marginRight: 6}} />
                <span>Yes. You’ll answer questions about your income to see if you qualify for financial help to lower your health coverage costs.</span>
              </label>
              <label className="radio-box" style={{alignItems: 'flex-start'}}>
                <input type="radio" name="helpPaying" value="no" checked={answers.helpPaying === 'no'} onChange={handleChange} required style={{marginRight: 6}} />
                <span>No. You’ll answer fewer questions, but you won’t get financial help to lower your health coverage costs.</span>
              </label>
            </div>
          </section>
          <section className="upload-question">
            <h2>Do you want to be automatically enrolled into the Covered CT Program?<span className="red-star">*</span></h2>
            <p>If you or anyone in your household is determined to be newly eligible for the Covered CT Program with $0 premium and $0 out-of-pocket costs, do you want to be automatically enrolled into the Covered CT Program?<span className="red-star">*</span></p>
            <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
              <label className="radio-box">
                <input type="radio" name="autoEnroll" value="yes" checked={answers.autoEnroll === 'yes'} onChange={handleChange} required style={{marginRight: 6}} />
                Yes
              </label>
              <label className="radio-box">
                <input type="radio" name="autoEnroll" value="no" checked={answers.autoEnroll === 'no'} onChange={handleChange} required style={{marginRight: 6}} />
                No
              </label>
            </div>
          </section>
          <section className="upload-question">
            <h2>Do you consent to having your information shared with Department of Social Services?<span className="red-star">*</span></h2>
            <div className="radio-group" style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
              <label className="radio-box">
                <input type="radio" name="consentDSS" value="yes" checked={answers.consentDSS === 'yes'} onChange={handleChange} required style={{marginRight: 6}} />
                Yes
              </label>
              <label className="radio-box">
                <input type="radio" name="consentDSS" value="no" checked={answers.consentDSS === 'no'} onChange={handleChange} required style={{marginRight: 6}} />
                No
              </label>
            </div>
          </section>
          <div className="next-btn-row">
            <button className="next-btn" disabled={!isAllAnswered} onClick={handleNext}>Next</button>
          </div>
        </main>
        <aside className="upload-docs-float">
          <div className="float-section">
            <h3>Upload documents</h3>
            <div className="float-row">
              <FaRegClock className="float-icon" />
              <span>Save time by uploading documents to fill out your application</span>
            </div>
          </div>
          <div className="float-section">
            <h4>Acceptable documents</h4>
            <ul>
              <li>1040</li>
              <li>Paystub</li>
              <li>Driver's license, Passport, Birth Certificate</li>
            </ul>
          </div>
          <div className="float-section float-actions">
            <div className="float-row">
              <FaMobileAlt className="float-icon" />
              <span>Scan documents with your phone</span>
            </div>
            <div className="float-row" style={{ cursor: 'pointer' }} onClick={handleComputerUploadClick}>
              <FaUpload className="float-icon" />
              <span>Upload documents from your computer</span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {uploadedDocInfo ? (
              <>
                
                <div style={{ fontWeight: 600, color: '#222', marginBottom: 4, marginTop: 8 }}>Uploaded</div>
                <hr className="float-divider" style={{ margin: '16px 0' }} />
                <div style={{ fontSize: '0.95em', color: '#070707ff', background: 'white', borderRadius: 8, padding: 10, boxShadow: '0 1px 2px #eee' }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>1040 - {uploadedDocInfo.name}</div>
                  <div style={{ fontSize: '0.95em', color: '#060505ff' }}>{uploadedDocInfo.filename}</div>
                  <div style={{ fontSize: '0.9em', color: '#070707ff', marginTop: 2 }}>
                    Uploaded {Math.round((new Date() - uploadedDocInfo.uploadedAt) / 1000)}s ago
                  </div>
                </div>
                <div style={{ fontSize: '0.85em', color: '#888', marginTop: 6 }}>
                  <pre style={{ background: '#f4f4f4', padding: 6, borderRadius: 4, overflowX: 'auto' }}>{JSON.stringify(uploadedDocInfo, null, 2)}</pre>
                </div>
                <div style={{ fontSize: '0.9em', color: '#444', marginTop: 6 }}>
                  <span style={{ fontWeight: 500 }}>First Name:</span> {uploadedDocInfo.name.split(' ')[0] || ''}<br />
                  <span style={{ fontWeight: 500 }}>Last Name:</span> {uploadedDocInfo.name.split(' ').slice(1).join(' ') || ''}
                  {uploadedDocInfo.fields && (
                    <>
                      {uploadedDocInfo.fields.Spouse && (
                        <>
                          <br /><span style={{ fontWeight: 500 }}>Spouse First Name:</span> {uploadedDocInfo.fields.Spouse['First Name'] || ''}<br />
                          <span style={{ fontWeight: 500 }}>Spouse Last Name:</span> {uploadedDocInfo.fields.Spouse['Last Name'] || ''}
                        </>
                      )}
                      {uploadedDocInfo.fields.Dependents && Array.isArray(uploadedDocInfo.fields.Dependents) && uploadedDocInfo.fields.Dependents.length > 0 && (
                        <>
                          <br /><span style={{ fontWeight: 500 }}>Dependents:</span>
                          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                            {uploadedDocInfo.fields.Dependents.map((dep, idx) => (
                              <li key={idx} style={{ fontSize: '0.9em', color: '#444' }}>
                                {dep['First Name'] || ''} {dep['Last Name'] || ''} {dep.Relationship ? `(${dep.Relationship})` : ''}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : selectedFile && (
              <div style={{ fontSize: '0.9em', marginTop: 4, color: '#333' }}>
                Selected: {selectedFile.name}
                {isUploading && <span style={{ marginLeft: 8 }}>Uploading...</span>}
                {uploadMessage && (
                  <div style={{ color: uploadMessage.startsWith('Received') ? 'green' : 'red', marginTop: 4 }}>{uploadMessage}</div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

