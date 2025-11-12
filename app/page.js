"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState({
    Customers: 0,
    Invoices: 0,
    Products: 0,
    Orders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const authenticateAndFetchData = async () => {
      try {
        // Authenticate user
        const authResponse = await fetch("/api/auth/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const authData = await authResponse.json();

        if (!authData.success) {
          router.push("/login");
          return;
        }

        // Fetch dashboard data
        const dashboardResponse = await fetch("/api/dashboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const dashboardData = await dashboardResponse.json();

        if (isMounted) {
          if (dashboardData.success) {
            setDashboard({
              Customers: dashboardData.Customers || 0,
              Invoices: dashboardData.Invoices || 0,
              Products: dashboardData.Products || 0,
              Orders: dashboardData.Orders || 0,
            });
          } else {
            setError(dashboardData.msg || "Failed to load dashboard data");
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("An error occurred while loading data");
          setIsLoading(false);
          console.error("Error:", err);
        }
      }
    };

    authenticateAndFetchData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const statsCards = [
    { title: "Total Customers", value: dashboard.Customers, color: "from-blue-500 to-cyan-400" },
    { title: "Total Invoices", value: dashboard.Invoices, color: "from-purple-500 to-pink-400" },
    { title: "Total Products", value: dashboard.Products, color: "from-green-500 to-emerald-400" },
    { title: "Total Orders", value: dashboard.Orders, color: "from-orange-500 to-yellow-400" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12 mt-8">
         
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">
              Smart Invoice
            </span>
            <span className="text-gray-900"> System</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive business management dashboard
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="p-6 relative z-10">
                <h5 className="text-lg font-bold text-gray-700 mb-3">
                  {stat.title}
                </h5>
                <p className={`text-4xl font-extrabold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          ))}
        </div>

        {/* Optional Action Buttons */}
        {/* <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="/admin/trackings"
            className="px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            All Trackings
          </a>
          <a
            href="/admin/payments"
            className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            All Payments
          </a>
        </div> */}
      </div>
    </div>
  );
}
