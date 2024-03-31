import FrontPage from "./pages/FrontPage";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [skin, setSkin] = useState("");

  async function onSubmitFortniteInfo(email, skin) {
    const formattedSkin = skin.toLowerCase().trim();

    const response = await fetch("http://localhost:5000/submit-fortnite-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, skin: formattedSkin }), // Ensure backend expects this format
    });

    if (response.ok) {
      console.log("Data sent to the backend successfully");
    } else {
      console.error(
        "Failed to send data. Status:",
        response.status,
        "Status Text:",
        response.statusText
      );
    }
  }

  console.log(email, skin);

  return (
    <div>
      <FrontPage onSubmitFortniteInfo={onSubmitFortniteInfo} />
    </div>
  );
}

export default App;
