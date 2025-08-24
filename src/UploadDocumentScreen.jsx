import React, { useState, useEffect, useRef } from 'react';
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
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('http://localhost:8080/api/uploadDoc', {
          method: 'POST',
          body: formData,
        });
        const text = await response.text();
        if (response.ok) {
          setUploadMessage(text);
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
  const handleNext = () => {
    navigate('/additional-questions');
  };

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
          <hr className="float-divider" />
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
            {selectedFile && (
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

