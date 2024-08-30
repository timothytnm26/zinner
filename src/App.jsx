import { useEffect, useState } from "react";
import "./App.css";
import { useRef } from "react";
import jsQR from "jsqr";

import { Scanner } from "@yudiel/react-qr-scanner";
import useGoogleSheets from "use-google-sheets";

// Config variables
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const CLIENT_EMAIL = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
// const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n')
const API_KEY = import.meta.env.API_KEY;
const API_POST_TO_SPREADSHEET_URL =
  "https://script.google.com/macros/s/AKfycbw6l4jodfxz5qnkKpbu-TuGHFKTV-WBe1js78mEsuTaUnEqUXpzcesbsT_eaYorOhptsg/exec";
function App() {
  const [qrCode, setQrCode] = useState("");
  const { data, refetch } = useGoogleSheets({
    apiKey: "AIzaSyDDV7gs37iGZsH0mKlPxx275LFq3kn8LYY",
    sheetId: "1suYYhsoL7YWVSfnWQ5rgeVJkSJEbAB2So8VWIXWMo2c",
    sheetsOptions: [{ id: "finalList" }],
  });

  const [cur, setCur] = useState();

  const postCodeToSheet = (code) => {
    const formData = new FormData();
    formData.append("code", code);

    fetch(API_POST_TO_SPREADSHEET_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then((res) => {
        console.log("Response received:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Data:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // check code
  useEffect(() => {
    const userList = data[0]?.data;
    const curUser = userList?.filter((user) => user.code === qrCode)[0];
    setCur(curUser);
  }, [qrCode]);

  useEffect(() => {
    if (cur?.code) {
      postCodeToSheet(cur.code);
      refetch();
    }
  }, [cur]);

  return (
    <div className="wrapper">
      <div className="zinner-logo" />
      <Scanner
        onScan={(result) => {
          setQrCode(result[0].rawValue);
        }}
        allowMultiple
        scanDelay={1000}
        classNames={{
          container: "scanner-container",
        }}
      />
      <div className="content">
        <div className="user-code">{qrCode}</div>
        {cur && (
          <div className="user-info">
            <div>{cur.name}</div>
            <div>{cur.phone}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
