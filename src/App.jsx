
import { useState } from 'react'
import './App.css'
import  { useRef } from 'react';
import jsQR from 'jsqr';

import { Scanner } from '@yudiel/react-qr-scanner'
import useGoogleSheets from 'use-google-sheets';


// Config variables
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const SHEET_ID = import.meta.env.VITE_SHEET_ID
const CLIENT_EMAIL =  import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL
// const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n')
const API_KEY = import.meta.env.API_KEY

console.log({SPREADSHEET_ID})

function App() {
  const [qrCode, setQrCode] = useState('')
  const [color, setColor] = useState('')
  const { data, loading, error } = useGoogleSheets({
    apiKey: "AIzaSyDDV7gs37iGZsH0mKlPxx275LFq3kn8LYY",
    sheetId: "1suYYhsoL7YWVSfnWQ5rgeVJkSJEbAB2So8VWIXWMo2c",
    sheetsOptions: [{ id: 'isChecked' }],
  });
   const fileInputRef = useRef(null);
  if (data) {
  console.log(data)
}
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
              setQrCode(code.data);
              setColor(getRandomColor())
            } else {
              alert('check-in.qrNotFound');
            }
          }
        };
        image.src = imageData;
      };
      reader.readAsDataURL(file);
    }
  };
  function getRandomColor() {
    // Generate a random color in hexadecimal format
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  return (
    <div style={{
      width: '100%',
      height:'100%',
    }
    }>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        
      }}>
        <Scanner onScan={result => {
        setQrCode(result[0].rawValue)
        setColor(getRandomColor())
      }}
        onError={(err) => console.log(err)}
        allowMultiple
        scanDelay={1000}
      />
      <h1 style={{color: color, maxWidth:"500px"}}>{qrCode}</h1>
      </div>
    </div>
  )
}

export default App
