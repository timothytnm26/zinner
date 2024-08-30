import { useEffect, useState } from "react";
import "./App.css";

import { Scanner } from "@yudiel/react-qr-scanner";
import useGoogleSheets from "use-google-sheets";

const API_POST_TO_SPREADSHEET_URL =
  "https://script.google.com/macros/s/AKfycbxA0V4cQ2CzBBZq8a048GdyskXkKosX6vz4wjwDNOmj0jpbH3qfG1nVuY7R_cl4jDW-Bg/exec";
function App() {
  const [qrCode, setQrCode] = useState("");
  const { data, refetch } = useGoogleSheets({
    apiKey: "AIzaSyDDV7gs37iGZsH0mKlPxx275LFq3kn8LYY",
    sheetId: "1suYYhsoL7YWVSfnWQ5rgeVJkSJEbAB2So8VWIXWMo2c",
    sheetsOptions: [{ id: "finalList" }],
  });

  const [cur, setCur] = useState();
  const [err, setErr] = useState(undefined);
  const postCodeToSheet = (code) => {
    const formData = new FormData();
    formData.append("code", code);

    fetch(API_POST_TO_SPREADSHEET_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
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
    if (!curUser && qrCode !== "") {
      setErr("QR KHÔNG ĐÚNG");
      return;
    }
    setCur(curUser);
    setErr(undefined);
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
        scanDelay={1000}
        classNames={{
          container: "scanner-container",
        }}
      />
      <div className="content">
        <div
          className={`user-code ${cur?.isChecked > 0 ? "have-checked" : "ok"}`}
        >
          {err && err}
          {qrCode}
        </div>
        {cur && (
          <div className="user-info">
            <div>{cur.name}</div>
            <div>{cur.phone}</div>
            <div
              className={`checked-tag ${
                cur?.isChecked > 0 ? "have-checked" : "ok"
              }`}
            >
              {cur?.isChecked > 0 ? "ĐÃ CHECKIN" : "THÀNH CÔNG"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
