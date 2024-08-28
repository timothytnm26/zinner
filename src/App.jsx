
import { useState } from 'react'
import './App.css'
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
    </div>
  )
}

export default App
