"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
}

export default function Favourite() {
  const [favorites, setFavorites] = useState<Coin[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const removeFromFavorites = (coinId: string) => {
    const updatedFavorites = favorites.filter((coin) => coin.id !== coinId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
                  <h1 className="text-5xl m-5 font-extrabold text-white text-center p-8 rounded-lg shadow-lg bg-green-500
              hover:shadow-2xl transition-all duration-300 ease-in-out 
              dark:text-gray-900">My Watchlist</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-xl">Your watchlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((coin) => (
            <li key={coin.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{coin.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
                </div>
                <div className="font-bold text-xl text-green-500">
                  ${coin.current_price.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link href={`/testing/${coin.id}`} className="text-blue-500">View Details</Link>
                <button
                  onClick={() => removeFromFavorites(coin.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 text-center">
        <Link href="/">
          <button className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors">
            Go Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
