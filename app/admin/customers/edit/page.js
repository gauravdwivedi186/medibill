"use client"
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'

// Separate component that uses useSearchParams
const EditCustomerContent = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('id')
  const [CustomerID, setcustomerID] = useState(search);
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerPhone, setCustomerPhone] = useState("");
  const [CustomerEmail, setCustomerEmail] = useState("");
  const [msg, setmsg] = useState("")

  const router = useRouter();

  const postData = {
    customerid: CustomerID,
  };

  useEffect(() => {
    auth();
    fetch("/api/getCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.customer);
          setCustomerName(data.customer.CustomerName)
          setCustomerPhone(data.customer.CustomerPhone)
          setCustomerEmail(data.customer.CustomerEmail)
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
    fetch("/api/editCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        CustomerID: CustomerID, 
        CustomerName: CustomerName, 
        CustomerPhone: CustomerPhone, 
        CustomerEmail: CustomerEmail 
      }),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          setTimeout(() => {
            window.location.href = "/admin/customers";
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
          Edit Customer Details
        </h2>
      </div>
      <div className="max-w-sm mx-auto border border-3 rounded-lg p-5">
        {!msg ? ("") : (<div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
          {msg}
        </div>)}
        <div className="mb-5">
          <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">
            Customer ID
          </label>
          <input
            value={CustomerID}
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
            value={CustomerName}
            onChange={(e) => setCustomerName(e.target.value)}
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
            value={CustomerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
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
            value={CustomerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
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
    <Suspense fallback={<div className="mt-20 text-center">Loading customer details...</div>}>
      <EditCustomerContent />
    </Suspense>
  );
};

export default Page;
