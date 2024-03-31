import FrontPage from "./pages/FrontPage";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [skin, setSkin] = useState("");

  function capitalizeFirstLetters(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async function onSubmitFortniteInfo(email, skin) {
    const formattedSkin = capitalizeFirstLetters(skin);

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
