"use client";
import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the DatePicker styles

function Search() {
  const [adults, setAdults] = useState<number>(1); // Default 1 adult
  const [children, setChildren] = useState<number>(0); // Default 0 children
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility state
  const [fromLocation, setFromLocation] = useState<string>(""); // From location state
  const [toLocation, setToLocation] = useState<string>(""); // To location state
  const [departureDate, setDepartureDate] = useState<Date | null>(null); // Departure date and time state
  const [suggestions, setSuggestions] = useState<string[]>([]); // Autocomplete suggestions
  const [currentField, setCurrentField] = useState<"from" | "to" | null>(null); // Track which field is being updated

  const locations: string[] = ["London", "Los Angeles", "Lisbon", "Lyon"]; // List of locations

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAdultsChange = (increment: number) => {
    if (increment < 0 && adults === 1 && children === 0) return; // Prevent 0 adults if currently 1 and no children
    setAdults(Math.max(0, adults + increment)); // Allow adults to be 0 or more
  };

  const handleChildrenChange = (increment: number) => {
    if (increment < 0 && children === 0 && adults === 1) return; // Prevent 0 children if currently 0
    setChildren(Math.max(0, children + increment)); // Ensure at least 0 children
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
    setSuggestions([]); // Clear suggestions after selection
  };

  const getPassengerLabel = () => {
    let label = adults > 0 ? `${adults === 1 ? "1 Adult" : `${adults} Adults`}` : ''; // Adults label
    if (children > 0) {
      label += `${adults > 0 ? " and " : ""}${children === 1 ? "1 Child" : `${children} Children`}`; // Add children if any
    }
    return label || "No passengers"; // If both are 0, show "No passengers"
  };

  return (
     <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
       <div className="container h-screen mx-auto flex justify-center items-center p-2 md:p-0">
         <div className="border border-gray-300 p-6 bg-white shadow-lg rounded-lg w-full max-w-lg">
          {/* From Location Input */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-2 text-gray-500">From</span>
            <input
              type="text"
              className="border p-2 pl-20 rounded w-full"
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
              className="border p-2 pl-20 rounded w-full"
              value={toLocation}
              onChange={(e) => handleLocationChange(e, "to")}
              placeholder="Enter destination city"
            />
          </div>

          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute border bg-white w-full mt-1 rounded z-10">
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

          {/* Date and Time Selection in the main form */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-2 text-gray-500">Out</span>
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className="border p-2 pl-20 rounded w-full"
              placeholderText="Select date and time"
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

          {/* Search Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
            Search
          </button>

          {/* Modal for selecting number of adults and children */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4 text-center">Select Passengers</h2>

                {/* Adults Selection */}
                <div className="flex justify-between items-center mb-4">
                  <span>Adults</span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                      onClick={() => handleAdultsChange(-1)}
                    >
                      -
                    </button>
                    <span className="font-bold">{adults}</span>
                    <button
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                      onClick={() => handleAdultsChange(1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Selection */}
                <div className="flex justify-between items-center mb-4">
                  <span>Children</span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                      onClick={() => handleChildrenChange(-1)}
                    >
                      -
                    </button>
                    <span className="font-bold">{children}</span>
                    <button
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                      onClick={() => handleChildrenChange(1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Close/Submit buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={closeModal}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
