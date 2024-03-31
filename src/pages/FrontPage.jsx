import { useState } from "react";

const FrontPage = ({ onSubmitFortniteInfo }) => {
  const [localEmail, setLocalEmail] = useState("");
  const [localSkin, setLocalSkin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFortniteInfo(localEmail, localSkin);
  };

  const gradientStyle = {
    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen mx-auto"
      style={gradientStyle}
    >
      <div className="w-7/12">
        <h1 className="font-heading w-2 text-7xl text-gray-100 text-left mr-auto">
          Loot Look Out!
        </h1>
      </div>
      <form className="w-3/5" onSubmit={handleSubmit}>
        <div className="relative my-6">
          <div className="absolute inset-y-0 start-0 flex items-center pl-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
          </div>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="youremail@lootlookout.com"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            id="skin-name"
            value={localSkin}
            onChange={(e) => setLocalSkin(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter desired Fortnite skin"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="mt-4 bg-white/30 backdrop-blur-lg hover:bg-white/40 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out border border-gray-700 shadow-sm hover:shadow-md"
          >
            Notify Me
          </button>
        </div>
      </form>
      <div>
        <p className="w-3/4 font-sans text-center m-auto mt-4 text-black">
          *Enter your email and desired Fortnite skin to receive a notification
          when it becomes available in the shop.
        </p>
      </div>
    </div>
  );
};

export default FrontPage;
