"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";
import { useParams } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Coin {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: { usd: number };
    market_cap_rank: number;
    circulating_supply: number;
    total_supply: number | null;
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
  description: { en: string };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    backgroundColor: string;
    tension: number;
    pointBackgroundColor: string;
  }[];
}

const CoinDetailsPage = () => {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [prices, setPrices] = useState<[number, number][]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [coinDetailsResponse, priceDataResponse] = await axios.all([
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}`),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
          ),
        ]);

        setCoin(coinDetailsResponse.data);
        setPrices(priceDataResponse.data.prices);
      } catch {
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  useEffect(() => {
    if (prices.length > 0) {
      const dates = prices.map((price) =>
        format(new Date(price[0]), "MM/dd")
      );
      const priceData = prices.map((price) => price[1]);

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Price (USD)",
            data: priceData,
            fill: false,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            tension: 0.4,
            pointBackgroundColor: "#4CAF50",
          },
        ],
      });
    }
  }, [prices]);

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white p-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        coin && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold text-white text-center p-8 rounded-lg shadow-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 dark:text-gray-900">
              {coin.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gray-50 shadow-md rounded-lg p-8 space-y-4 dark:bg-gray-800 dark:text-gray-100">
                <p className="text-2xl font-bold text-green-600">
                  💰 Current Value: ${coin.market_data.current_price?.usd.toFixed(2)}
                </p>
                <p>🔹 Symbol: {coin.symbol.toUpperCase()}</p>
                <p>🏅 Rank: #{coin.market_data.market_cap_rank}</p>
                <p>
                  🔄 Circulating Supply: {coin.market_data.circulating_supply.toLocaleString()}
                </p>
                <p>
                  📦 Total Supply: {coin.market_data.total_supply?.toLocaleString() || "N/A"}
                </p>
                <p>📈 24h High: ${coin.market_data.high_24h?.usd.toFixed(2)}</p>
                <p>📉 24h Low: ${coin.market_data.low_24h?.usd.toFixed(2)}</p>
              </div>

              <div className="bg-gray-50 shadow-md rounded-lg p-8 dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-green-500 mb-4">
                  📄 Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm dark:text-gray-200">
                  {coin.description.en}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 shadow-md rounded-lg p-8 mt-8 dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-green-500 mb-4">
                📊 7-Day Price Trend
              </h2>
              {chartData ? (
                <Line data={chartData} />
              ) : (
                <div className="text-center text-gray-500 dark:text-white">
                  Chart not available
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CoinDetailsPage;
