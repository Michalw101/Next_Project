"use client"
import React, { useEffect } from 'react';
import Search from '../Search';



function HomePage() {

  return (
    <>
      <div
        className="w-full h-screen bg-no-repeat bg-center bg-fixed"
        style={{
          backgroundImage: 'url(/images/about_pic.jpg)',
          backgroundSize: 'cover',
        }}
      >

        <Search />
      </div>
    </>
  );
}

export default HomePage;
