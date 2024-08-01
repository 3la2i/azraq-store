

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-white">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-tomato text-white text-center p-8">
            <img
              alt="Profile"
              className="w-32 h-32 mb-4 rounded-full border-4 border-white"
              src=""
            />
            <h2 className="font-bold text-3xl">Your Name</h2>
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-tomato text-white rounded-lg p-3 px-6 hover:bg-red-600 transition-colors duration-300">
              Edit
            </button>
          </div>
          <div className="p-8">
            <h4 className="text-tomato font-bold mb-5 text-2xl">Your Information:</h4>
            <div className="mb-5">
              <p className="text-tomato font-medium">Email</p>
              <p className="text-gray-800">your.email@example.com</p>
            </div>
          </div>

            </div>
          </div>
        </div>

  );
};

export default ProfilePage;
