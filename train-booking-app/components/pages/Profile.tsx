"use client";
import React, { useState } from 'react';

function Profile() {
  const [image, setImage] = useState<string>('/default-avatar.png');
  const [name, setName] = useState<string>('John Doe');
  const [username, setUsername] = useState<string>('johndoe');
  const [address, setAddress] = useState<string>('123 Main St, City, Country');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          setImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <span>Edit</span>
            </label>
          </div>
          {!isEditing ? (
            <>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p>{name}</p>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <p>{username}</p>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p>{address}</p>
              </div>
              <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          ) : (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <button
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
