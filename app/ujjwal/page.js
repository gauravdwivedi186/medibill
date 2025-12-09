"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        setDeviceData(result.data[0]);
        setLastUpdate(new Date());
        setError(null);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3500);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F3EE] to-[#E8E4DC] flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-base font-medium">Loading sensor data...</p>
      </div>
    );
  }

  if (error || !deviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F3EE] to-[#E8E4DC] flex flex-col items-center justify-center px-5">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-gray-600 text-center text-base">{error || 'Unable to fetch sensor data'}</p>
      </div>
    );
  }

  const isOnline = deviceData.status === 'online';
  const weeksSincePlanting = 26;

  return (
    <>
      <Head>
        <title>Plant Monitor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#F5F3EE] to-[#E8E4DC]">
        <div className="max-w-[430px] mx-auto pb-10">
          
          {/* Back Button */}
          {/* <button className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg hover:bg-gray-700 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button> */}

          {/* Header */}
          <div className="pt-8 ps-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
              {deviceData.deviceName || 'My Plant'}
            </h1>
            <p className="text-base text-gray-500 font-medium">Last Sync : {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}</p>
          </div>

          {/* Plant Section with Left-Aligned Sensor Cards */}
          <div className="relative w-full mb-8">
            
            {/* Plant Image Container */}
            <div className="relative w-full h-[600px]">
              {/* Plant Image - Right Side */}
              <div className="absolute right-0 bottom-0 w-[100%] h-full flex items-end justify-center">
                <img 
                  src="/plantImage.png" 
                  alt="Plant" 
                  className="w-full h-full object-contain object-bottom drop-shadow-2xl"
                />
              </div>

              {/* Sensor Cards - Left Side */}
              <div className="absolute left-0 top-0 w-[41%] h-full flex flex-col justify-end space-y-6 pt-8 pb-16 px-3">
                
                {/* Temperature Card */}
                <div className="bg-[#FEF3E2] rounded-[20px] p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-float">
                  <p className="text-xs text-gray-500 font-medium mb-2">Temp</p>
                  <p className="text-3xl font-bold text-gray-800">{deviceData.temperature}°C</p>
                </div>

                {/* Humidity Card */}
                <div className="bg-[#E0F2FE] rounded-[20px] p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-float-delayed">
                  <p className="text-xs text-gray-500 font-medium mb-2">Humidity</p>
                  <p className="text-3xl font-bold text-gray-800">{deviceData.humidity}%</p>
                </div>

                {/* Soil Moisture Card */}
                <div className="bg-[#F3F4F6] rounded-[20px] p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-float-delayed-more">
                  <p className="text-xs text-gray-500 font-medium mb-2">Soil Moisture</p>
                  <p className="text-3xl font-bold text-gray-800">{deviceData.moisture}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {isOnline && (
            <div className="inline-flex items-center gap-2 ms-5 px-4 py-2.5 bg-green-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-green-500/30 mb-1.5">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Live Monitoring</span>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-white m-5 rounded-3xl p-5 shadow-lg">
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1.5">Device Status</p>
                <p className="text-sm text-gray-800 font-semibold">{isOnline ? 'Online' : 'Offline'}</p>
              </div>
              
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1.5">Location</p>
                <p className="text-sm text-gray-800 font-semibold">{deviceData.location || 'Lucknow, Uttar Pradesh'}</p>
              </div>

              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1.5">WiFi Signal</p>
                <p className="text-sm text-gray-800 font-semibold">
                  {deviceData.rssi} dBm ({getSignalStrength(deviceData.rssi)})
                </p>
              </div>

              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1.5">Free Memory</p>
                <p className="text-sm text-gray-800 font-semibold">
                  {(deviceData.freeHeap / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1.5">Chip ID</p>
                <p className="text-xs text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">
                  {deviceData.chipId}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-1.5">Last Updated</p>
                <p className="text-sm text-gray-800 font-semibold">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Auto-refresh Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Auto-refreshing every 7 seconds</span>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-float-delayed {
            animation: float 3s ease-in-out infinite;
            animation-delay: 0.5s;
          }

          .animate-float-delayed-more {
            animation: float 3s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}</style>
      </div>
    </>
  );
}

function getSignalStrength(rssi) {
  if (rssi >= -50) return 'Excellent';
  if (rssi >= -70) return 'Good';
  if (rssi >= -80) return 'Fair';
  return 'Weak';
}
