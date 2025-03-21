"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import axios from 'axios';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
}

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=60&page=1&sparkline=false`;

  // ✅ Use useCallback to prevent unnecessary re-renders and fix dependency warning
  const fetchCoins = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Crypto[]>(API);
      setSearchResults(res.data);
    } catch {
      setError('Oops! Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  // ✅ Improved search efficiency with Fuse.js
  const fuse = new Fuse(searchResults, {
    keys: ['name', 'symbol'],
    threshold: 0.4,
  });

  const filteredResults: Crypto[] = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-center text-4xl font-bold text-green-500 mb-8">Search Cryptocurrencies</h1>

      <div className="flex justify-center items-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for a cryptocurrency..."
            className="w-full py-3 px-5 pr-12 text-lg border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Image src="/search.svg" alt="Search" width={24} height={24} />
          </button>
        </div>
      </div>

      {loading && <p className="text-center mt-4 text-gray-600 dark:text-gray-300">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {searchTerm && filteredResults.length > 0 && (
        <div className="mt-5 max-w-md mx-auto">
          <ul className="space-y-2">
            {filteredResults.map((crypto) => (
              <li
                key={crypto.id}
                className="p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:text-white"
              >
                <Link href={`/testing/${crypto.id}`}>
                  <div>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchTerm && filteredResults.length === 0 && (
        <div className="mt-5 max-w-md mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-300">No results found</p>
        </div>
      )}
    </div>
  );
};
