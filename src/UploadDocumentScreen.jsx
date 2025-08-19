import React, { useState } from 'react';
import LeftNavigation from './LeftNavigation';
import './UploadDocumentScreen.css';
import uploadImg from './assets/upload_illustration.png';
import { FaRegClock, FaMobileAlt, FaUpload } from 'react-icons/fa';

export default function UploadDocumentScreen() {
  // State for mandatory questions
  const [answers, setAnswers] = useState({
    helpPaying: '',
    autoEnroll: '',
    consentDSS: '',
  });
  const isAllAnswered = answers.helpPaying && answers.autoEnroll && answers.consentDSS;

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  return (
    <div className="upload-docs-layout">
      <LeftNavigation completedSections={[0]} />
      <main className="upload-docs-content">
        <h1>Upload Documents</h1>
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
          <div className="radio-group">
            <label>
              <input type="radio" name="helpPaying" value="yes" checked={answers.helpPaying === 'yes'} onChange={handleChange} required />
              Yes. You’ll answer questions about your income to see if you qualify for financial help to lower your health coverage costs.
            </label>
            <label>
              <input type="radio" name="helpPaying" value="no" checked={answers.helpPaying === 'no'} onChange={handleChange} required />
              No. You’ll answer fewer questions, but you won’t get financial help to lower your health coverage costs.
            </label>
          </div>
        </section>
        <section className="upload-question">
          <h2>Do you want to be automatically enrolled into the Covered CT Program?<span className="red-star">*</span></h2>
          <p>If you or anyone in your household is determined to be newly eligible for the Covered CT Program with $0 premium and $0 out-of-pocket costs, do you want to be automatically enrolled into the Covered CT Program?<span className="red-star">*</span></p>
          <div className="radio-group">
            <label>
              <input type="radio" name="autoEnroll" value="yes" checked={answers.autoEnroll === 'yes'} onChange={handleChange} required />
              Yes
            </label>
            <label>
              <input type="radio" name="autoEnroll" value="no" checked={answers.autoEnroll === 'no'} onChange={handleChange} required />
              No
            </label>
          </div>
        </section>
        <section className="upload-question">
          <h2>Do you consent to having your information shared with Department of Social Services?<span className="red-star">*</span></h2>
          <div className="radio-group">
            <label>
              <input type="radio" name="consentDSS" value="yes" checked={answers.consentDSS === 'yes'} onChange={handleChange} required />
              Yes
            </label>
            <label>
              <input type="radio" name="consentDSS" value="no" checked={answers.consentDSS === 'no'} onChange={handleChange} required />
              No
            </label>
          </div>
        </section>
        <div className="next-btn-row">
          <button className="next-btn" disabled={!isAllAnswered}>Next</button>
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
          <div className="float-row">
            <FaUpload className="float-icon" />
            <span>Upload documents from your computer</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
