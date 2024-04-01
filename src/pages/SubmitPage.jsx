const SubmitPage = ({ email, skin }) => {
  const formattedEmail = (email) => {
    const shortedEmail = email.split("@");
    return shortedEmail[0];
  };

  const gradientStyle = {
    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen"
      style={gradientStyle}
    >
      <h1 className="font-heading text-7xl font-bold my-4 text-gray-100">
        Thank you!
      </h1>
      <p className="font-sans text-lg mt-2 text-xl w-3/12 text-center">
        {formattedEmail(email)}, you'll be notified when {skin} is in the store.
      </p>
    </div>
  );
};

export default SubmitPage;
