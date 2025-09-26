"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaSun, FaMoon, FaHeart, FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <footer className="glass-card mx-4 mb-6 rounded-2xl p-8 mt-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Theme Toggle Section */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleTheme}
            className="glass-button flex items-center space-x-3 px-6 py-3 rounded-full text-slate-800 dark:text-slate-100 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <FaMoon className="text-lg text-slate-600 dark:text-slate-400" />
                <span>Switch to Dark</span>
              </>
            ) : (
              <>
                <FaSun className="text-lg text-yellow-500" />
                <span>Switch to Light</span>
              </>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="text-center text-slate-800 dark:text-slate-100">
          {/* Logo/Brand */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Jotz 👻
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Ephemeral Notes & Files</p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center space-x-6 mb-8">
            <Link
              href="https://instagram.com/onlyptraa"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button p-3 rounded-full text-slate-800 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 group"
            >
              <FaInstagram size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button p-3 rounded-full text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-400 transition-all duration-300 group"
            >
              <FaGithub size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </Link>
          </div>

          {/* Attribution */}
          <div className="border-t border-slate-300/30 dark:border-slate-600/30 pt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Made by{" "}
              <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Wibowo Yunanto Sri Saputra
              </span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Inspired by{" "}
              <Link
                href="https://nocel.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 underline decoration-dotted"
              >
                nocel.vercel.app
              </Link>
              {" "}by Prima Mukti
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
              &copy; {new Date().getFullYear()} Jotz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
