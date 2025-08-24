import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadDocumentScreen from './UploadDocumentScreen';
import AdditionalQuestionsScreen from './AdditionalQuestionsScreen';
import ReviewAndSign from './ReviewAndSign';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadDocumentScreen />} />
      <Route path="/additional-questions" element={<AdditionalQuestionsScreen />} />
      <Route path="/review-and-sign" element={<ReviewAndSign />} />
    </Routes>
  );
}

export default App;
