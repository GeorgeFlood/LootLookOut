import FrontPage from "./pages/FrontPage";
import SubmitPage from "./pages/SubmitPage";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [skin, setSkin] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmitFortniteInfo(submittedEmail, skin) {
    const formattedSkin = skin.toLowerCase().trim();

    const response = await fetch("http://localhost:5000/submit-fortnite-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: submittedEmail, skin: formattedSkin }),
    });

    if (response.ok) {
      console.log("Data sent to the backend successfully");
      setEmail(submittedEmail); // Set the email state here after successful submission
      setSkin(skin);
      setIsSubmitted(true); // Update the submitted state here to ensure order
    } else {
      console.error(
        "Failed to send data. Status:",
        response.status,
        "Status Text:",
        response.statusText
      );
    }
  }

  console.log(email);

  return (
    <div>
      {!isSubmitted ? (
        <FrontPage
          onSubmitFortniteInfo={onSubmitFortniteInfo}
          setIsSubmitted={setIsSubmitted}
        />
      ) : (
        <SubmitPage email={email} skin={skin} />
      )}
    </div>
  );
}

export default App;
