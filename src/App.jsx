import React from 'react';
import { HouseholdProvider } from './HouseholdContext';
import { Routes, Route } from 'react-router-dom';
import UploadDocumentScreen from './UploadDocumentScreen';
import AdditionalQuestionsScreen from './AdditionalQuestionsScreen';
import ReviewAndSign from './ReviewAndSign';

function App() {
  return (
    <HouseholdProvider>
      <Routes>
        <Route path="/" element={<UploadDocumentScreen />} />
        <Route path="/additional-questions" element={<AdditionalQuestionsScreen />} />
        <Route path="/review-and-sign" element={<ReviewAndSign />} />
      </Routes>
    </HouseholdProvider>
  );
}

export default App;
