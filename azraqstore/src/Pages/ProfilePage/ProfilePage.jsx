import React from 'react';

const ProfilePage = () => {
  const user = {
    name: "alaa",
    email: "alaa.ata25@gmail.com",
    avatar: "https://placehold.co/100x100?text=Avatar",
    about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Quisque vel odio nec nisi aliquet euismod."
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-tomato">User Profile</h1>
        <div className="flex items-center mt-4">
          <img
            className="w-40 h-40 rounded-full border-4 border-tomato"
            alt="User Avatar"
            src={user.avatar}
          />
          <div className="ml-8">
            <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-tomato">About Me</h3>
          <p className="text-gray-600">{user.about}</p>
        </div>
        <div className="mt-6">
          <button className="bg-tomato text-white hover:bg-red-600 px-8 py-4 rounded-lg">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
