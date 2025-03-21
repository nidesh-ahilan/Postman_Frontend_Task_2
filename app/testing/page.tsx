"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
}

export default function Page() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Coin[]>([]);

  const API_KEY = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}&sparkline=false`;

  
  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_KEY);
      setCoins(res.data);
    } catch {
      setError("Oops! Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    fetchCoins();
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, [fetchCoins, page]);

  const handleFavorite = (coin: Coin) => {
    const isFavorite = favorites.some((fav) => fav.id === coin.id);
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== coin.id)
      : [...favorites, coin];

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <span className="text-white rounded-full p-4 text-7xl">⚠️</span>
            <p className="text-2xl font-bold text-red-600 mt-4">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-4xl text-center bg-green-400 p-10 font-bold mb-6">
            Top 50 Cryptocurrencies
          </h1>
          <div>
            <ul className="space-y-4">
              {coins.map((coin) => (
                <li
                  key={coin.id}
                  className="bg-white hover:bg-gray-100 border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        {coin.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                    <div className="font-bold text-xl text-green-500">
                      ${coin.current_price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Link href={`/testing/${coin.id}`} className="text-blue-500">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleFavorite(coin)}
                      className="text-red-500 text-2xl cursor-pointer"
                    >
                      {favorites.some((fav) => fav.id === coin.id) ? '🗑️' : '❤️'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 cursor-pointer"
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= 5 || coins.length < 10}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 text-center">
        <Link href="/">
          <button className="bg-green-500 cursor-pointer text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
