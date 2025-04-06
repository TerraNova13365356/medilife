'use client';
import React from 'react';
import { BsHeartPulseFill, BsCapsule, BsClockHistory } from 'react-icons/bs';

const Dashboard = () => {
  return (
    <div className="relative min-h-screen bg-[#f8f8fc] text-gray-800 font-sans">
      {/* Blurred background image */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center blur-md scale-105"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/3d-pharmacy-drug-health-pharmaceutical-purple-background-cartoon-minimal-first-aid-health-care-medical-symbol-emergency-help-3d-aid-medicine-icon-vector-render-illustration_839035-353275.jpg')",
        }}
      ></div>

      {/* Main Dashboard Container */}
      <div className="flex flex-col px-6 md:px-10 py-10 backdrop-blur-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-4xl md:text-5xl font-bold text-[#3e167a] tracking-wide">
            MEDILIFE
          </div>
          <button className="bg-[#3e0b70] hover:bg-[#3d1b5e] text-white px-6 py-2 rounded-full font-bold transition-all">
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" >
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition"
          onClick={
            () => {
              window.location.href = "/donate";
            }
          }
          >
            <BsHeartPulseFill className="text-5xl text-[#7245a0] mx-auto" />
            <h3 className="text-xl font-semibold text-[#5e3c94] mt-4 mb-2">Donate Medicine</h3>
            <p className="text-gray-600">Submit unused or excess medicine to help those in need.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition"
          onClick={
            () => {
              window.location.href = "/search";
            }
          }
          >
            <BsCapsule className="text-5xl text-[#7245a0] mx-auto" />
            <h3 className="text-xl font-semibold text-[#5e3c94] mt-4 mb-2">Find Medicine</h3>
            <p className="text-gray-600">Search for medicines donated by others in your community.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition"
          onClick={
            () => {
              window.location.href = "/history";
            }
          }
          >
            <BsClockHistory className="text-5xl text-[#7245a0] mx-auto" />
            <h3 className="text-xl font-semibold text-[#5e3c94] mt-4 mb-2">History</h3>
            <p className="text-gray-600">Track your donation and request activity history easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
