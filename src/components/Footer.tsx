"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white bg-opacity-20 backdrop-blur-lg text-gray-800 p-6 mt-12 rounded-lg shadow-lg">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Jotz. All rights reserved.
        </p>
        <p className="text-sm mt-4">
          Inspired by{" "}
          <Link
            href="https://nocel.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            nocel.vercel.app
          </Link>{" "}
          by Prima Mukti.
        </p>
        <div className="flex justify-center items-center mt-6 space-x-4">
          <Link
            href="https://instagram.com/onlyptraa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
          >
            <FaInstagram size={28} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
