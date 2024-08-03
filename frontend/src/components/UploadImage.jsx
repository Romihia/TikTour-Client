import React, { useState } from 'react';

const UploadImage = ({ token }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append('picture', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/picture/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data);
      } else {
        console.error('Failed to upload image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadImage;
