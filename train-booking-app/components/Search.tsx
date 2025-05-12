import React, { useState, ChangeEvent, useEffect } from "react";
import StarButton from "./StarButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiStar } from "react-icons/ci";
import Link from "next/link";

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
  const locations: string[] = cities
    .findByState("NJ")
    .map((city: any) => city.city);

  const handleLocationChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "from" | "to"
  ) => {
    const value = e.target.value;
    if (field === "from") {
      setFromLocation("AAA");
      setCurrentField("from");
    } else {
      setToLocation("BBB");
      setCurrentField("to");
    }
    setSuggestions(
      locations.filter((loc) =>
        loc.toLowerCase().startsWith(value.toLowerCase())
      )
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

  const openModal = () => {
    setModalOpen(true); // פותח את המודל
  };

  const closeModal = () => {
    setModalOpen(false); // סוגר את המודל
  };

  const handlePassengerChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "adults" | "children"
  ) => {
    const value = parseInt(e.target.value);
    setPassengers((prev) => ({
      ...prev,
      [type]: value >= 0 ? value : 0,
    }));
  };

  const getPassengerLabel = () => {
    const { adults, children } = passengers;
    const adultLabel =
      adults > 0 ? `${adults === 1 ? "1 Adult" : `${adults} Adults`}` : "";
    const childrenLabel =
      children > 0
        ? `${children === 1 ? "1 Child" : `${children} Children`}`
        : "";

    return (
      [adultLabel, childrenLabel].filter(Boolean).join(" and ") ||
      "No passengers"
    );
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
      passengers: (adults + children).toString(),
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:3000/api/services?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

  useEffect(() => {
    console.log("Updated results:", results);
  }, [results]);

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
            minTime={
              departureDate &&
              departureDate.toDateString() === new Date().toDateString()
                ? new Date()
                : new Date(new Date().setHours(0, 0))
            }
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
              <Service
                toLocation={toLocation}
                fromLocation={fromLocation}
                results={results}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;

type ServiceProps = {
  toLocation: string;
  fromLocation: string;
  results: {
    Line: {
      id: string;
      price: number;
      availableSeats: number;
    };
    id: string;
    departureTime: number;
    stations: string[];
    lineId: string;
  }[];
};

// odel Line {
//   id_line     String   @id @default(auto()) @map("_id") @db.ObjectId
//   exit        String
//   destination String
//   price       Int
//   LineDetails LineDetails[]
// }

// // סכמת פרטי קווים
// model LineDetails {
//   id_lineDetails String   @id @default(auto()) @map("_id") @db.ObjectId
//   date        String
//   departureTime  String
//   arrivalTime    String
//   availableSeats Int
//   stations       String[]
//   id_Line        String @db.ObjectId
//   Line           Line     @relation(fields: [id_Line], references: [id_line])
//   Order Order[]
//   UserFavorites  UserFavorites[]
// }


const Service: React.FC<ServiceProps> = ({
  toLocation,
  fromLocation,
  results,
}) => {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [selectedService, setSelectedSercive] = useState(false);
  const toggleExpand = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  useEffect(() => {
    console.log("newwwwwwwww Updated results:", results);
    if (results && results[0] && results[0].departureTime)
      console.log("newwwwwwwww:", results[0].departureTime);
  }, [results]);

  const filterResultsByLocation = (stations: string[]) => {
    const fromIndex = stations.indexOf(fromLocation);
    const toIndex = stations.indexOf(toLocation);

    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) {
      return []; // אם התחנות לא נמצאו או לא בסדר הנכון
    }

    return stations.slice(fromIndex, toIndex + 1); // חותך את תחנות המסלול לפי מיקום ההתחלה והסיום
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Available Routes</h2>
      <div className="grid gap-4">
        {results.map((result, index) => {
          const filteredStations = filterResultsByLocation(result.stations);
          return (
            <div key={index} className="border p-4 rounded shadow-md relative">
              <StarButton />
              <h3 className="text-md font-semibold">
                {/* הצגת התחנות הראשונה והאחרונה עם חץ ושלוש נקודות */}
                {filteredStations.length > 0 ? (
                  <>
                    {filteredStations[0]} →{" "}
                    {filteredStations.length > 2 ? (
                      <>
                        <span
                          onClick={() => toggleExpand(result.id)}
                          className="text-blue-500 cursor-pointer"
                        >
                          ...
                        </span>{" "}
                        {filteredStations[filteredStations.length - 1]}
                      </>
                    ) : (
                      filteredStations[filteredStations.length - 1]
                    )}
                  </>
                ) : (
                  "No valid route"
                )}
              </h3>
              <p>
                Price: {results && result && result.Line && result.Line.price}$
              </p>
              <p>
                Hour:{" "}
                {results &&
                  result &&
                  result.departureTime &&
                  result.departureTime}
              </p>
              {expandedService === result.id && filteredStations.length > 2 && (
                <div className="mt-2 text-gray-700">
                  <h4>Intermediate Stations:</h4>
                  <ul>
                    {filteredStations
                      .slice(1, filteredStations.length - 1)
                      .map((station, i) => (
                        <li key={i}>{station}</li>
                      ))}
                  </ul>
                </div>
              )}
              
            
               <Link 
      href={{ 
        pathname: '/payment', 
        query: { tripDetails:JSON.stringify(result)
        } 
      }}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
    >
      Select
    </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
