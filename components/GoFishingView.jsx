"use client";

import React, { useState, useEffect } from "react";
import SearchesTable from "./SearchesTable";
import { useCheckoutContext } from "./CheckoutContext";

export default function GoFishingView() {
  const [searchesInfo, setSearchesInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { accessToken } = useCheckoutContext();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/get-fishing-stats", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setSearchesInfo(data);
      } catch (error) {
        console.error("Failed to fetch fishing stats:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/*<h1 className="text-3xl font-bold mb-6">Searches Dashboard</h1>*/}
      <SearchesTable searches={searchesInfo} />
    </div>
  );
}
