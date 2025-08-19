import React, { useState, useRef } from 'react';
import './App.css';
import { Tabs, Tab, Button, Table, Form, Spinner, Alert, Navbar, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftNavigation from './LeftNavigation';
import UploadDocumentScreen from './UploadDocumentScreen';

function App() {
  return (
    <UploadDocumentScreen />
  );
}

export default App;
