"use client";

import React, { FormEvent, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget;

    const values = {
      email: target.email.value,
      password: target.password.value,
    };

    try {
      const credential = await signIn("credentials", { ...values, callbackUrl: "/" });
      console.log("credential", credential);
    } catch (error) {
      console.log(error);
    }
  }

  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget;

    const values = {
      email: target.email.value,
      password: target.password.value,
      //@ts-ignore
      name: target.name.value,
    };
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="pt-16 w-full h-screen bg-no-repeat bg-center bg-fixed"
      style={{
        backgroundImage: 'url(/images/profile_pic.jpg)',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex flex-col w-full justify-center items-center my-5">
        <form onSubmit={isLogin ? handleSubmit : register} className="w-full">
          <h1 className="text-center text-xl font-semibold">
            {isLogin ? "Login" : "Register"}
          </h1>
          {!isLogin && (
            <InputLogin
              label="Name"
              type="name"
              id="name"
              name="name"
              placeholder="Type Name..."
            />
          )}
          <InputLogin
            label="Email"
            type="email"
            id="email"
            name="email"
            placeholder="Type Email..."
          />
          <InputLogin
            label="Password"
            type="password"
            id="password"
            name="password"
            placeholder="Type Password..."
          />
          <p
            onClick={() => setIsLogin((prev) => !prev)}
            className="text-center text-blue-500 text-sm cursor-pointer"
          >
            You haven't Account? - Sign Up
          </p>
          <div className="w-full flex justify-center items-center">
            <button
              type="submit"
              className="focus:outline-none w-[80%] text-white bg-purple-700 hover:bg-purple-800 
         focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5
          my-5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
        {/* Google BTN */}
        <div className="flex w-full flex-col justify-center items-center gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-[80%] items-center justify-center bg-white
         dark:bg-gray-900 border border-gray-300 rounded-lg 
         shadow-md px-6 py-2 text-sm font-medium text-gray-800
          dark:text-white hover:bg-gray-200 focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FaGoogle className="h-6 w-6 mr-2" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>

  );
}

type InputLoginProps = {
  label: string;
  type: string;
  id: string;
  name: string;
  placeholder: string;
};

function InputLogin({ label, ...props }: InputLoginProps) {
  return (
    <>
      <div className="mb-6 w-full">
        <label
          htmlFor="default-input"
          className="block w-[80%] mx-auto mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <input
          {...props}
          className="bg-gray-50 border border-gray-300
           text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500
             block w-[80%] mx-auto p-2.5 dark:bg-gray-700
              dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500
                dark:focus:border-blue-500"
        />
      </div>
    </>
  );
}
