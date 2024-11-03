import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function Search() {
  const [aduls, setAduls] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<"from" | "to" | null>(null);
  const [results, setResults] = useState<any[]>([]); // State for storing fetched results

  // Example locations
  const cities = require("cities");
  const locations: string[] = cities.findByState("NJ").map((city: any) => city.city);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAdulsChange = (increment: number) => {
    if (increment < 0 && aduls === 1 && children === 0) return;
    setAduls(Math.max(0, aduls + increment));
  };

  const handleChildrenChange = (increment: number) => {
    if (increment < 0 && children === 0 && aduls === 1) return;
    setChildren(Math.max(0, children + increment));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>, field: "from" | "to") => {
    const value = e.target.value;
    if (field === "from") {
      setFromLocation(value);
      setCurrentField("from");
    } else {
      setToLocation(value);
      setCurrentField("to");
    }
    setSuggestions(
      locations.filter((loc) => loc.toLowerCase().startsWith(value.toLowerCase()))
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (currentField === "from") {
      setFromLocation(suggestion);
    } else if (currentField === "to") {
      setToLocation(suggestion);
    }
    setSuggestions([]);
  };

  const getPassengerLabel = () => {
    const adulLabel = aduls > 0 ? `${aduls === 1 ? "1 adul" : `${aduls} aduls`}` : "";
    const childrenLabel = children > 0 ? `${children === 1 ? "1 child" : `${children} children`}` : "";
    
    return [adulLabel, childrenLabel].filter(Boolean).join(" and ") || "No passengers";
  };

  const checkAvailableTrips = async () => {
    if (!fromLocation || !toLocation || !departureDate) {
      alert("Please fill in all fields.");
      return;
    }

    const totalPassengers = aduls + children; // Calculate total number of passengers
    const queryParams = new URLSearchParams({
      fromLocation,
      toLocation,
      time: departureDate.toISOString(),
      aduls: aduls.toString(),
      children: children.toString(),
    }).toString();

    try {
      const response = await fetch(`http://localhost:3000/api/services?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      // Check if there are available services
      if (data.services && data.services.length > 0) {
        const availableServices = data.services.filter((service:any) => {
          // Check if available seats are enough
          return service.availableSeatsA >= aduls && service.availableSeatsB >= children;
        });

        if (availableServices.length > 0) {
          setResults(availableServices); // Save available results
        } else {
          alert("No seats available for the requested number of passengers.");
        }
      } else {
        alert("No services available based on the selected criteria.");
      }
    } catch (error) {
      console.error("Error checking trips:", error);
      alert("Error checking trips. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="container h-screen mx-auto flex justify-center items-center p-2 md:p-0">
        <div className="border border-gray-300 p-6 bg-white shadow-lg rounded-lg w-full max-w-lg text-black">
          {/* From Location Input */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-2 text-gray-500">From</span>
            <input
              type="text"
              className="border p-2 pl-20 rounded w-full text-black"
              value={fromLocation}
              onChange={(e) => handleLocationChange(e, "from")}
              placeholder="Enter departure city"
            />
          </div>

          {/* To Location Input */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-2 text-gray-500">To</span>
            <input
              type="text"
              className="border p-2 pl-20 rounded w-full text-black"
              value={toLocation}
              onChange={(e) => handleLocationChange(e, "to")}
              placeholder="Enter destination city"
            />
          </div>

          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute border bg-white w-full mt-1 rounded z-10 text-black">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}

          {/* Date and Time Selection */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-2 text-gray-500">Out</span>
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className="border p-2 pl-20 rounded w-full text-black"
              placeholderText="Select date and time"
              popperClassName="custom-popper" // Add custom popper class
              popperPlacement="bottom" // Position the popper
            />
          </div>

          {/* Button to open the modal for selecting adults and children */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">{getPassengerLabel()}</span>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
              onClick={openModal}
            >
              +
            </button>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={checkAvailableTrips}
          >
            Search
          </button>

          {/* Displaying Results */}
          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-4">Available Routes</h2>
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <div key={index} className="border p-4 rounded shadow-md">
                    <h3 className="text-md font-semibold">{result.exit} → {result.destination}</h3>
                    <p>Price: ${result.price}</p>
                    <p>Departure Time: {new Date(result.regularService?.schedules[0]?.startTime).toLocaleString()}</p>
                    <p>Frequency: {result.frequency}</p> {/* Assuming frequency is a property of the result */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;











// "use client";
// import React, { useState, ChangeEvent } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import { Service } from '@prisma/client';

// function Search() {
//   const [aduls, setAduls] = useState<number>(1);
//   const [children, setChildren] = useState<number>(0);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [fromLocation, setFromLocation] = useState<string>("");
//   const [toLocation, setToLocation] = useState<string>("");
//   const [departureDate, setDepartureDate] = useState<Date | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [currentField, setCurrentField] = useState<"from" | "to" | null>(null);
//   const [results, setResults] = useState<any[]>([]); // State for storing fetched results

//   // Example locations
//   const cities = require("cities");
//   const locations: string[] = cities.findByState("NJ").map((city: any) => city.city);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const handleAdulsChange = (increment: number) => {
//     if (increment < 0 && aduls === 1 && children === 0) return;
//     setAduls(Math.max(0, aduls + increment));
//   };

//   const handleChildrenChange = (increment: number) => {
//     if (increment < 0 && children === 0 && aduls === 1) return;
//     setChildren(Math.max(0, children + increment));
//   };

//   const handleLocationChange = (e: ChangeEvent<HTMLInputElement>, field: "from" | "to") => {
//     const value = e.target.value;
//     if (field === "from") {
//       setFromLocation(value);
//       setCurrentField("from");
//     } else {
//       setToLocation(value);
//       setCurrentField("to");
//     }
//     setSuggestions(
//       locations.filter((loc) => loc.toLowerCase().startsWith(value.toLowerCase()))
//     );
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     if (currentField === "from") {
//       setFromLocation(suggestion);
//     } else if (currentField === "to") {
//       setToLocation(suggestion);
//     }
//     setSuggestions([]);
//   };

//   const getPassengerLabel = () => {
//     const adulLabel = aduls > 0 ? `${aduls === 1 ? "1 adul" : `${aduls} aduls`}` : "";
//     const childrenLabel = children > 0 ? `${children === 1 ? "1 child" : `${children} children`}` : "";
    
//     return [adulLabel, childrenLabel].filter(Boolean).join(" and ") || "No passengers";
//   };

//   const checkAvailableTrips = async () => {
//     if (!fromLocation || !toLocation || !departureDate) {
//       alert("Please fill in all fields.");
//       return;
//     }
  
//     const totalPassengers = aduls + children; // Calculate total number of passengers
//     const queryParams = new URLSearchParams({
//       fromLocation,
//       toLocation,
//       time: departureDate.toISOString(),
//       aduls: aduls.toString(),
//       children: children.toString(),
//     }).toString();
  
//     try {
//       const response = await fetch(`http://localhost:3000/api/services?${queryParams}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
      
//       const data = await response.json();
      
//       // Check if there are available services
//       if (data.services && data.services.length > 0) {
//         const availableServices = data.services.filter(service => {
//           // Check if available seats are enough
//           return service.availableSeatsA >= aduls && service.availableSeatsB >= children;
//         });
  
//         if (availableServices.length > 0) {
//           setResults(availableServices); // Save available results
//         } else {
//           alert("No seats available for the requested number of passengers.");
//         }
//       } else {
//         alert("No services available based on the selected criteria.");
//       }
//     } catch (error) {
//       console.error("Error checking trips:", error);
//       alert("Error checking trips. Please try again later.");
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
//       <div className="container h-screen mx-auto flex justify-center items-center p-2 md:p-0">
//         <div className="border border-gray-300 p-6 bg-white shadow-lg rounded-lg w-full max-w-lg text-black">
//           {/* From Location Input */}
//           <div className="relative mb-4">
//             <span className="absolute left-3 top-2 text-gray-500">From</span>
//             <input
//               type="text"
//               className="border p-2 pl-20 rounded w-full text-black"
//               value={fromLocation}
//               onChange={(e) => handleLocationChange(e, "from")}
//               placeholder="Enter departure city"
//             />
//           </div>

//           {/* To Location Input */}
//           <div className="relative mb-4">
//             <span className="absolute left-3 top-2 text-gray-500">To</span>
//             <input
//               type="text"
//               className="border p-2 pl-20 rounded w-full text-black"
//               value={toLocation}
//               onChange={(e) => handleLocationChange(e, "to")}
//               placeholder="Enter destination city"
//             />
//           </div>

//           {/* Autocomplete suggestions */}
//           {suggestions.length > 0 && (
//             <ul className="absolute border bg-white w-full mt-1 rounded z-10 text-black">
//               {suggestions.map((suggestion, index) => (
//                 <li
//                   key={index}
//                   className="p-2 cursor-pointer hover:bg-gray-200"
//                   onClick={() => handleSuggestionClick(suggestion)}
//                 >
//                   {suggestion}
//                 </li>
//               ))}
//             </ul>
//           )}

//           {/* Date and Time Selection */}
//           <div className="relative mb-4">
//             <span className="absolute left-3 top-2 text-gray-500">Out</span>
//             <DatePicker
//               selected={departureDate}
//               onChange={(date) => setDepartureDate(date)}
//               showTimeSelect
//               dateFormat="Pp"
//               className="border p-2 pl-20 rounded w-full"
//               placeholderText="Select date and time"
//             />
//           </div>

//           {/* Button to open the modal for selecting aduls and children */}
//           <div className="flex justify-between items-center mb-4">
//             <span className="font-bold text-lg">{getPassengerLabel()}</span>
//             <button
//               className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
//               onClick={openModal}
//             >
//               +
//             </button>
//           </div>

//           <button
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
//             onClick={checkAvailableTrips}
//           >
//             Search
//           </button>

//           {/* Displaying Results */}
//           {results.length > 0 && (
//             <div className="mt-6">
//               <h2 className="text-lg font-bold mb-4">Available Routes</h2>
//               <div className="grid gap-4">
//                 {results.map((result, index) => (
//                   <div key={index} className="border p-4 rounded shadow-md">
//                     <h3 className="text-md font-semibold">{result.exit} → {result.destination}</h3>
//                     <p>Price: ${result.price}</p>
//                     <p>Seats Available (A): {result.availableSeatsA}</p>
//                     <p>Seats Available (B): {result.availableSeatsB}</p>
//                     <p>Type: {result.type}</p>
//                     <p>Departure Time: {new Date(result.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
//                     <p>Frequency: {result.frequency} דקות</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Search;
