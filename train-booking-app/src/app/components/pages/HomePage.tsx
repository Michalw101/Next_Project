"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import Search from './Search';
import About from '../About';
const connect = require('../../../../connect') ;

function HomePage() {
  useEffect(()=>{
    const users = connect.getUser(1);
    console.log(users);
  },)
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
