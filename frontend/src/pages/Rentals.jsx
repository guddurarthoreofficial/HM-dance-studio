import React from "react";

const Rentals = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🚀 Auto Deployment Test
        </h1>

        <p className="text-gray-700 text-lg mb-3">
          This page is deployed successfully using
          <span className="font-semibold text-green-600">
            {" "}GitHub Actions + Vercel
          </span>
        </p>

        <p className="text-sm text-gray-500">
          Last Updated: {new Date().toLocaleString()}
        </p>

        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Deployment Successful ✅
        </button>
      </div>
    </div>
  );
};

export default Rentals;