"use client"
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'

// Separate component that uses useSearchParams
const AddInvoiceContent = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('id')
  const [OrderID, setOrderID] = useState(search)
  const [InvoiceID, setInvoiceID] = useState(search + "inv");
  const [InvoiceName, setInvoiceName] = useState("");
  const [InvoiceNo, setInvoiceNo] = useState("")
  const [InvoiceDate, setInvoiceDate] = useState("");
  const [InvoiceTax, setInvoiceTax] = useState("");
  const [msg, setmsg] = useState("")

  const router = useRouter();

  useEffect(() => {
    auth();
  }, [])

  function addInvoice() {
    const postData = {
      InvoiceID: InvoiceID,
      OrderID: OrderID,
      InvoiceDate: InvoiceDate,
      InvoiceTax: InvoiceTax,
      InvoiceNo: InvoiceNo
    };

    fetch("/api/addInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data.Invoice);
          setInvoiceName(data.Invoice.InvoiceName)
          setInvoiceDate(data.Invoice.InvoiceDate)
          setInvoiceTax(data.Invoice.InvoiceTax)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

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

  const formatDate = (selectedDate) => {
    const dateObject = new Date(selectedDate);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  return (
    <>
      <div className="mt-20">
        <h2 className="mb-5 text-2xl font-bold text-center">
          Add Invoice Details
        </h2>
      </div>
      <div className="max-w-sm mx-auto border border-3 rounded-lg p-5">
        {!msg ? ("") : (<div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
          {msg}
        </div>)}
        <div className="mb-5">
          <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">
            Invoice ID
          </label>
          <input
            value={InvoiceID}
            onChange={(e) => setInvoiceID(e.target.value)}
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
            Order ID
          </label>
          <input
            type="text"
            disabled
            value={OrderID}
            onChange={(e) => setInvoiceName(e.target.value)}
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="invoiceNo"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Invoice Number
          </label>
          <input
            type="text"
            value={InvoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            id="invoiceNo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="invoiceDate"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Invoice Date
          </label>
          <input
            value={InvoiceDate}
            onChange={(e) => setInvoiceDate(formatDate(e.target.value))}
            type="date"
            id="invoiceDate"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            required
          />
        </div>

        <button
          onClick={addInvoice}
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
    <Suspense fallback={<div className="mt-20 text-center">Loading invoice form...</div>}>
      <AddInvoiceContent />
    </Suspense>
  );
};

export default Page;
