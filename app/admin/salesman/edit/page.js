"use client"
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'

// Separate component that uses useSearchParams
const EditSalesManContent = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('id')
  const [SalesManID, setSalesManID] = useState(search);
  const [SalesManName, setSalesManName] = useState("");
  const [SalesManPhone, setSalesManPhone] = useState("");
  const [SalesManEmail, setSalesManEmail] = useState("");
  const [msg, setmsg] = useState("")

  const router = useRouter();

  const postData = {
    SalesManid: SalesManID,
  };

  useEffect(() => {
    auth();
    fetch("/api/getSalesMan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.SalesMan);
          setSalesManName(data.SalesMan.SalesManName)
          setSalesManPhone(data.SalesMan.SalesManPhone)
          setSalesManEmail(data.SalesMan.SalesManEmail)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  async function auth() {
    const fetch_api = await fetch("/api/auth/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await fetch_api.json();
    if (!data.success) {
      router.push("/login");
    }
  };

  function updateDetails() {
    fetch("/api/editSalesMan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        SalesManID: SalesManID, 
        SalesManName: SalesManName, 
        SalesManPhone: SalesManPhone, 
        SalesManEmail: SalesManEmail 
      }),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          setTimeout(() => {
            window.location.href = "/admin/salesman";
          }, 1000);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="mt-20">
        <h2 className="mb-5 text-2xl font-bold text-center">
          Edit SalesMan Details
        </h2>
      </div>
      <div className="max-w-sm mx-auto border border-3 rounded-lg p-5">
        {!msg ? ("") : (<div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
          {msg}
        </div>)}
        <div className="mb-5">
          <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">
            SalesMan ID
          </label>
          <input
            value={SalesManID}
            type="text"
            disabled
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            value={SalesManName}
            onChange={(e) => setSalesManName(e.target.value)}
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="class"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Phone Number
          </label>
          <input
            value={SalesManPhone}
            onChange={(e) => setSalesManPhone(e.target.value)}
            type="text"
            id="class"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="10A"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="Contact"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            id="Contact"
            value={SalesManEmail}
            onChange={(e) => setSalesManEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="27657265"
            required
          />
        </div>

        <button
          onClick={updateDetails}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Save
        </button>
      </div>
    </>
  );
};

// Main Page component with Suspense wrapper
const Page = () => {
  return (
    <Suspense fallback={<div className="mt-20 text-center">Loading salesman details...</div>}>
      <EditSalesManContent />
    </Suspense>
  );
};

export default Page;
