'use client';

import { useState } from 'react';

const FileUpload = () => {
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState('');

  const onFileUpload = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (file) {
      let image = window.URL.createObjectURL(file);

      setImageURL(image);
      setImageFile(file);
      console.log('imageURL:', imageURL);
      console.log('file:', file);
    }
  };

  return (
    <>
      <input type='file' accept='image/*' onChange={(e) => onFileUpload(e)} />
      {imageURL && (
        <img
          src={imageURL}
          alt='미리보기이미지'
          style={{ marginBottom: '1rem' }}
        />
      )}
    </>
  );
};

export default FileUpload;
