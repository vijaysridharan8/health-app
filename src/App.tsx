
import { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Health Care Portal</h1>
      <p>Upload your health documents securely below:</p>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.png"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && <span style={{ marginLeft: '10px' }}>Uploading...</span>}
      {uploadMessage && (
        <p style={{ color: uploadMessage.startsWith('Received') ? 'green' : 'red', marginTop: '20px' }}>{uploadMessage}</p>
      )}
    </div>
  );
}

export default App;
