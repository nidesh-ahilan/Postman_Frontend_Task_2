"use client";

import Searchbar from "@/components/Searchbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 bg-green-500 text-white flex justify-between items-center shadow-md">
        <h1 className="text-5xl text-white font-semibold">CoinGecko</h1>
        <div className="flex items-center space-x-4">
        <Link href="/favourite">
              <button className="bg-white text-green-500 cursor-pointer px-4 py-2 rounded-lg shadow-md">
                My Watchlist
              </button>
          </Link>
          <Link  href="/testing">
          <button className="bg-white text-green-500 cursor-pointer px-4 py-2 rounded-lg shadow-md">Show all coins</button>
        </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto mt-6 p-4">
        <div className="bg-red-600 text-gray-900 p-5 rounded-lg shadow dark:bg-red-800 dark:text-gray-100">
          <h2 className="text-center font-medium">
            Don't invest unless you’re prepared to lose all the money you invest. 
            This is a high-risk investment, and you should not expect to be protected 
            if something goes wrong.
          </h2>
        </div>
      </div>

      <Searchbar />
    </div>
  );
}
