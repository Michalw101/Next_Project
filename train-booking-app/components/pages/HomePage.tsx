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
      <Search />
    </>
  );
}

export default HomePage;
