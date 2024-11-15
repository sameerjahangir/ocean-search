import React, { useState } from "react";
import { useCheckoutContext } from "./CheckoutContext";

const LoginPage = ({ onLoginSuccess }) => {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const {
    setAccessToken
  } = useCheckoutContext();

  // Update authState with input values
  const handleChange = (e) => {
    const { id, value } = e.target;
    setAuthState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message
    setIsLoading(true); // Start loader

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify(authState),
      });

      const data = await response.json();
      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data));
        // Redirect or update UI as needed
        setAccessToken(data?.accessToken)
        onLoginSuccess();
        
        console.log("Login successful:", data);
      } else {
        setErrorMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              value={authState.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              value={authState.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-slate-950 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
