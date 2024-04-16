import { useState, useEffect } from "react";

// SubmitPage component definition, receiving email and skin as props
const SubmitPage = ({ email, skin }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchShopData = async () => {
      const response = await fetch("https://fortniteapi.io/v2/shop?lang=en", {
        headers: {
          Authorization: "62a5c119-9ac95a45-4fbdc0fe-2d7825c0", // Replace 'YOUR_API_KEY' with your actual API key
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.shop.slice(100, 167)); // Assuming 'shop' is the key where items are stored
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    };

    fetchShopData();
  }, []);

  console.log(items);
  // Function to extract the username from the email address
  const formattedEmail = (email) => {
    const shortedEmail = email.split("@");
    return shortedEmail[0];
  };

  const calculateDaysAgo = (dateString) => {
    const previousDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = today.getTime() - previousDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  // Style object for the background gradient
  const gradientStyle = {
    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen"
      style={gradientStyle}
    >
      {/* Thank you message */}
      <h1 className="font-heading text-7xl font-bold my-4 text-gray-100">
        Thank you!
      </h1>
      {/* Notification message displaying the formatted email and skin name */}
      <p className="font-sans text-lg mt-2 text-xl w-3/12 text-center">
        {formattedEmail(email)}, you'll be notified when {skin} is in the store.
      </p>
      <h3 className="mt-6">Check out what skin's are in-stock Today</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-12 mt-6">
        {items
          .filter((item) => item.displayType === "Outfit")
          .map((item, index) => (
            <div
              key={index}
              className="item bg-white bg-opacity-50 p-4 shadow rounded-md"
            >
              <h1 className="text-center my-3 font-heading text-xl">
                {item.displayName}
              </h1>
              <img
                src={item.displayAssets[0].background}
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
          ))}
      </div>
    </div>
  );
};

export default SubmitPage;
