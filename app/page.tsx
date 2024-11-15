"use client";
import DataTable from "../components/DataTable";
import Login from "../components/Login";
import Header from "../components/header";
import { CheckoutProvider } from "@/components/CheckoutContext";
import { useState, useEffect } from "react";
import SelectedPeopleView from "@/components/SelectedPeopleView";
import { Toaster } from "@/components/ui/toaster";
import GoFishingView from "@/components/GoFishingView";

export default function Home() {
  const [view, setView] = useState("login");

  useEffect(() => {
    // Check if user data exists in local storage
    const user = localStorage.getItem("user");
    if (user) {
      // If logged in, show the DataTable
      setView("dataTable");
    }
  }, []);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setView("dataTable"); // Navigate to DataTable on login success
  };

  return (
    <CheckoutProvider>
      <main>
        {view === "login" ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <Header setView={setView} view={view} />
            <div className="p-8">
              {view === "dataTable" && <DataTable />}
              {view === "SelectedPeopleView" && <SelectedPeopleView />}
              {view === "GoFishing" && <GoFishingView />}
            </div>
          </>
        )}
      </main>
      <Toaster />
    </CheckoutProvider>
  );
}
