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
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
    //     <div className="flex flex-col items-center">
    //       <div className="relative">
    //         <img
    //           src={image}
    //           alt="Profile"
    //           className="w-32 h-32 rounded-full object-cover"
    //         />
    //         <label className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-2 cursor-pointer">
    //           <input
    //             type="file"
    //             accept="image/*"
    //             className="hidden"
    //             onChange={handleImageChange}
    //           />
    //           <span>Edit</span>
    //         </label>
    //       </div>
    //       {!isEditing ? (
    //         <>
    //           <div className="mt-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Name
    //             </label>
    //             <p>{name}</p>
    //           </div>
    //           <div className="mt-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Username
    //             </label>
    //             <p>{username}</p>
    //           </div>
    //           <div className="mt-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Address
    //             </label>
    //             <p>{address}</p>
    //           </div>
    //           <button
    //             className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    //             onClick={() => setIsEditing(true)}
    //           >
    //             Edit
    //           </button>
    //         </>
    //       ) : (
    //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    //           <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
    //             <div className="mt-4">
    //               <label className="block text-sm font-medium text-gray-700">
    //                 Name
    //               </label>
    //               <input
    //                 type="text"
    //                 value={name}
    //                 onChange={(e) => setName(e.target.value)}
    //                 className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    //               />
    //             </div>
    //             <div className="mt-4">
    //               <label className="block text-sm font-medium text-gray-700">
    //                 Username
    //               </label>
    //               <input
    //                 type="text"
    //                 value={username}
    //                 onChange={(e) => setUsername(e.target.value)}
    //                 className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    //               />
    //             </div>
    //             <div className="mt-4">
    //               <label className="block text-sm font-medium text-gray-700">
    //                 Address
    //               </label>
    //               <input
    //                 type="text"
    //                 value={address}
    //                 onChange={(e) => setAddress(e.target.value)}
    //                 className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    //               />
    //             </div>
    //             <button
    //               className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    //               onClick={handleSaveChanges}
    //             >
    //               Save Changes
    //             </button>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div
    className="p-16 w-full h-screen bg-no-repeat bg-center bg-fixed"
    style={{
      backgroundImage: 'url(/images/profile_pic.jpg)',
      backgroundSize: 'cover',
    }}
  >
      <div className="p-8 bg-white w-8/9 shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">0</p>
              <p className="text-gray-400">saved services</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">0</p>
              <p className="text-gray-400">last services</p>
            </div>
            {/* <div>
              <p className="font-bold text-gray-700 text-xl">89</p>
              <p className="text-gray-400">Comments</p>
            </div> */}
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">  Change Password</button>
            <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">  Edit</button>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">Jessica Jones</h1>
          <p className="font-light text-gray-600 mt-3">example@example.com</p>
          {/* <p className="mt-8 text-gray-500">Solution Manager - Creative Tim Officer</p>
          <p className="mt-2 text-gray-500">University of Computer Science</p> */}
        </div>
        <div className="mt-12 flex flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">An artist of considerable range, Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.</p>
          <button className="text-indigo-500 py-2 px-4  font-medium mt-4">  Show more</button>
        </div>
      </div>
    </div>
  );


}

export default Profile;
