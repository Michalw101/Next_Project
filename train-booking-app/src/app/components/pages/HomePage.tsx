"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import Search from './Search';
import About from '../About';
const  usersModel  = require('../../../../connect');
const connectDB = require('../../../../DB')

function HomePage() {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // התחברות למונגו דיבי
        await connectDB();
        // קבלת משתמש על ידי ID
        const user = await usersModel.findOne({ id: 1 });
        console.log("user", user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  return (
    <>
      {/* תפריט ניווט */}
      <div className="min-h-screen">
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
    </>
  );
}

export default HomePage;
