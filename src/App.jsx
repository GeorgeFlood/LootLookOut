import FrontPage from "./pages/FrontPage";
import SubmitPage from "./pages/SubmitPage";
import { useState } from "react";

function App() {
  // State hooks for managing email, skin, and submission status
  const [email, setEmail] = useState("");
  const [skin, setSkin] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(true);

  // Async function to handle form submission and interact with backend
  async function onSubmitFortniteInfo(submittedEmail, skin) {
    // Formatting the skin string
    const formattedSkin = skin.toLowerCase().trim();

    // Sending POST request to backend with user's email and formatted skin
    const response = await fetch("http://localhost:5000/submit-fortnite-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: submittedEmail, skin: formattedSkin }),
    });

    // Checking response status to update the state accordingly
    if (response.ok) {
      console.log("Data sent to the backend successfully");
      setEmail(submittedEmail);
      setSkin(skin);
      setIsSubmitted(true);
    } else {
      console.error(
        "Failed to send data. Status:",
        response.status,
        "Status Text:",
        response.statusText
      );
    }
  }

  // Debugging log for the current email state
  console.log(email);

  // Conditional rendering based on the isSubmitted state
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

// Exporting App component for use in other parts of the app
export default App;
