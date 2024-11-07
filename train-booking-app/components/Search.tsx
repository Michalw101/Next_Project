import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiStar } from "react-icons/ci";

function Search() {
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<"from" | "to" | null>(null);
  const [results, setResults] = useState<any[]>([]); // State for storing fetched results

  // Example locations
  const cities = require("cities");
  const locations: string[] = cities.findByState("NJ").map((city: any) => city.city);

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
    setSuggestions([]); // מנקה את ההצעות לאחר הבחירה
  };


  const openModal = () => {
    setModalOpen(true); // פותח את המודל
  };

  const closeModal = () => {
    setModalOpen(false); // סוגר את המודל
  };

  const handlePassengerChange = (e: ChangeEvent<HTMLInputElement>, type: "adults" | "children") => {
    const value = parseInt(e.target.value);
    setPassengers((prev) => ({
      ...prev,
      [type]: value >= 0 ? value : 0,
    }));
  };

  const getPassengerLabel = () => {
    const { adults, children } = passengers;
    const adultLabel = adults > 0 ? `${adults === 1 ? "1 Adult" : `${adults} Adults`}` : "";
    const childrenLabel = children > 0 ? `${children === 1 ? "1 Child" : `${children} Children`}` : "";

    return [adultLabel, childrenLabel].filter(Boolean).join(" and ") || "No passengers";
  };

  const checkAvailableTrips = async () => {
    const { adults, children } = passengers;
    if (!fromLocation || !toLocation || !departureDate) {
      alert("Please fill in all fields.");
      return;
    }

    const queryParams = new URLSearchParams({
      fromLocation,
      toLocation,
      time: departureDate.toString(),
      passengers: (adults + children).toString()
    }).toString();

    try {
      const response = await fetch(`http://localhost:3000/api/services?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.services && data.services.length > 0) {
        setResults(data.services);
      } else {
        alert("No services available based on the selected criteria.");
      }
    } catch (error) {
      console.error("Error checking trips:", error);
      alert("Error checking trips. Please try again later.");
    }
  };

  return (

    <div className="container h-screen mx-auto flex justify-center items-center p-2 md:p-0">
      <div className="border border-gray-300 p-6 bg-white shadow-lg rounded-lg w-full max-w-lg text-black">
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

        <div className="relative mb-4">
          <span className="absolute left-3 top-2 text-gray-500">Out</span>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="border p-2 pl-20 rounded w-full text-black"
            placeholderText="Select date and time"
            minDate={new Date()}
            minTime={departureDate && departureDate.toDateString() === new Date().toDateString() ? new Date() : new Date(new Date().setHours(0, 0))}
            maxTime={new Date(new Date().setHours(23, 59))}
          />


        </div>

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

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Select Passengers</h2>
              <div className="mb-4">
                <label className="block mb-2">Adults</label>
                <input
                  type="number"
                  value={passengers.adults}
                  onChange={(e) => handlePassengerChange(e, "adults")}
                  className="border p-2 rounded w-full"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Children</label>
                <input
                  type="number"
                  value={passengers.children}
                  onChange={(e) => handlePassengerChange(e, "children")}
                  className="border p-2 rounded w-full"
                  min="0"
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Available Routes</h2>
            <div className="grid gap-4">


              {results.map((result, index) => (
                <Service index={index} result={result} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default Search;

type ServiceProps = {
  index: number;
  result: {
    line: {
      id: string;
      exit: string;
      destination: string;
      price: number;
      availableSeats: number;
    };
  } & {
    id: string;
    hour: number;
    lineId: string;
  };
}



const Service: React.FC<ServiceProps> = ({ index, result }) => {
  return (
    <div key={index} className="border p-4 rounded shadow-md relative">
      <StarButton />
      <h3 className="text-md font-semibold">
        {result.line.exit} → {result.line.destination}
      </h3>
      <p>Price: ${result.line.price}</p>
      <p>Hour: {result.hour}:00</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
      // onClick={selectService}
      >
        Select
      </button>
    </div>
  );
};



const StarButton = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCheckboxChange = () => {
    setIsFavorited(!isFavorited);
    // כאן אפשר להוסיף לוגיקה לשמירת המצב במועדפים
    console.log(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <label className="absolute top-2 right-2">
      <input
        type="checkbox"
        className="absolute opacity-0 h-0 w-0 cursor-pointer peer"
        checked={isFavorited}
        onChange={handleCheckboxChange}
      />
      <svg
        className="h-6 w-6 fill-gray-500 transition-transform duration-300 peer-checked:fill-yellow-300 hover:scale-110"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g>
          <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path>
        </g>
      </svg>
    </label>
  );
};

