
import { useState } from 'react'
import './App.css'
import React, { useRef } from 'react';
import jsQR from 'jsqr';

import { Scanner } from '@yudiel/react-qr-scanner'
function getRandomColor() {
    // Generate a random color in hexadecimal format
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function App() {
  const [qrCode, setQrCode] = useState('')
  const [color, setColor] = useState('')

   const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result;
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (context) {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);

            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              {
                inversionAttempts: 'dontInvert',
              }
            );

            if (code) {
              onDetected(code.data);
              setQrCode(code.data)
              setColor(getRandomColor())
              // Handle the detected QR code here
            } else {
              alert(t('check-in.qrNotFound'));
            }
          }
        };

        image.src = imageData;
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <Scanner onScan={result => {
        setQrCode(result[0].rawValue)
        setColor(getRandomColor())
      }}
        onError={(err) => console.log(err)}
        allowMultiple
        scanDelay={1000}
      />
      
      
         <h1 style={{color:color}}>code: {qrCode}</h1>
          <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button
        className="img-input"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        SCAN
      </button>
    </div>
    </div>
  )
}

export default App
