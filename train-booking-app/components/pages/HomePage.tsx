"use client"
import React, { useEffect } from 'react';
import Search from '../Search';



function HomePage() {
  const user = {
    user_id: "123456",
    email: "b@a.a",
    name: "michal",
    password: "1234"
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    sendData();
  }, []);

  
  return (
    <>
<<<<<<< HEAD
      {/* תפריט ניווט */}
      <div className="">
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex justify-around">
            <li>
              <Link href="/login" className="hover:text-gray-400">
                Login
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-gray-400">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-gray-400">
                Dashboard
              </Link>
            </li>
            <li>
              <a href="#about-section" className="hover:text-gray-400">
                About
              </a>
            </li>
            <li>
              <Link href="/Search" className="hover:text-gray-400">
                Search
              </Link>
            </li>
           
          </ul>
        </nav>
      </div>

      {/* קומפוננטת חיפוש */}
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-4">
        <Search />
      </div>

      {/* סקשן About בתחתית הדף */}
      <div id="about-section">
        <About />
      </div>
=======
      <Search />
>>>>>>> c170256f30011da239624a8ad393e4f569416fbe
    </>
  );
}

export default HomePage;
