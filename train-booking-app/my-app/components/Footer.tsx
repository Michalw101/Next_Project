import React from "react";

export default function Footer() {
    return (
        <footer className="bg-gray-800/95  rounded-lg shadow w-full mt-auto">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Train Booking</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0">
                        <li>
                            <a href="/about" className="hover:underline me-4 md:me-6 text-white">About us</a>
                        </li>
                        <li>
                            <a href="/privacy-policy" className="hover:underline me-4 md:me-6 text-white">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="/terms" className="hover:underline me-4 md:me-6 text-white">Terms of use</a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline text-white">Contact us</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-700 sm:mx-auto" />
                <span className="block text-sm text-gray-400 sm:text-center">© 2024 <a href="#" className="hover:underline text-white">Train Booking</a>. All Rights Reserved.</span>
            </div>
        </footer>
    );
}
