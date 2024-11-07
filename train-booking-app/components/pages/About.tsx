import React from 'react';
import Image from 'next/image';
import aboutPic from '/images/about_pic.jpg'


const About: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">About Us</h2>

        <p className="text-lg text-gray-700 text-center mb-12">
          Welcome to TrainTicketHub, your reliable source for seamless and convenient train ticket booking.
          We aim to provide a smooth experience that connects you to your destination with just a few clicks.
          Whether you're planning a quick commute or a scenic journey, we are here to make your travels effortless and enjoyable.
        </p>
        

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <Image
              src={aboutPic}
              alt="Train journey"
              className="rounded-lg shadow-lg w-full object-cover h-64 sm:h-96"
            />
          </div>
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700 mb-6">
              Our mission is to make train travel accessible, efficient, and enjoyable. We’re here to support you at every step of the way, from selecting the best routes to securing your tickets instantly.
            </p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Real-time schedule and availability updates</li>
              <li>Easy and fast booking process</li>
              <li>Secure payment and personalized customer support</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
