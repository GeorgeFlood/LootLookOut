import { useState, useEffect } from "react";

// SubmitPage component definition, receiving email and skin as props
const SubmitPage = ({ email, skin }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const gradientStyle = {
    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
  };

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true); // Show loading indicator while fetching
      try {
        // Fetching data from Fortnite API using the API key from environment variables
        const response = await fetch("https://fortniteapi.io/v2/shop?lang=en", {
          headers: {
            Authorization: `${import.meta.env.VITE_FORTNITE_API_KEY}`, // Ensure API key is properly formatted
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Filtering to only include items that are outfits
        const filteredItems = data.shop.filter(
          (item) => item.displayType === "Outfit"
        );
        setItems(filteredItems);
        if (filteredItems.length === 0) {
          setError("No outfits currently available in the shop.");
        }
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
        setError(
          "Failed to fetch shop data. Please check the console for more details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  console.log(items);
  // Helper function to format the email by extracting the username part
  const formattedEmail = (email) => {
    const atIndex = email.indexOf("@");
    return atIndex !== -1 ? email.substring(0, atIndex) : email;
  };

  const calculateDaysAgo = (dateString) => {
    const previousDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = today.getTime() - previousDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  };

  // Render loading, error, or the main content based on the state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen"
      style={gradientStyle}
    >
      <h1 className="font-heading text-7xl font-bold my-4 text-gray-100 text-center">
        Thank you!
      </h1>
      <p className="font-sans text-lg mt-2 text-xl md:w-3/12 text-center">
        {formattedEmail(email)}, you'll be notified when {skin} is in the store.
      </p>
      <h3 className="mt-6">Check out what skins are in-stock today!</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-12 mt-6">
        {items.map((item, index) => {
          let textColor;
          switch (item.rarity.id) {
            case "Uncommon":
              textColor = "text-gray-500"; // Assuming gray for uncommon
              break;
            case "Rare":
              textColor = "text-blue-500"; // Assuming blue for rare
              break;
            case "Epic":
              textColor = "text-purple-500"; // Assuming purple for epic
              break;
            case "Legendary":
              textColor = "text-yellow-600"; // Assuming gold/yellow for legendary
              break;
            default:
              textColor = "text-black"; // Default color if no rarity is matched
          }
          return (
            <div
              key={index}
              className="item bg-white bg-opacity-50 p-4 shadow rounded-md"
            >
              <h1
                className={`text-center my-3 font-heading text-xl ${textColor}`}
              >
                {item.displayName}
              </h1>
              <img
                src={item.displayAssets[0].url}
                alt={item.displayName}
                className="rounded-md"
              />
              {item.displayDescription ? (
                <p className="my-3 font-sans">{item.displayDescription}</p>
              ) : (
                <p className="my-3 font-sans">Bundle Pack!</p>
              )}
              <p className="font-bold font-sans mb-3">
                {item.price.regularPrice} v-bucks
              </p>
              <p>
                Last seen {calculateDaysAgo(item.previousReleaseDate)} days ago
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmitPage;
