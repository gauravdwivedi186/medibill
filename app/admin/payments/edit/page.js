"use client"
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'

// Separate component that uses useSearchParams
const PaymentPageContent = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('id')
  const [PaymentID, setPaymentID] = useState(search);
  const [PaymentName, setPaymentName] = useState("");
  const [PaymentMode, setPaymentMode] = useState('');
  const [PaymentChannel, setPaymentChannel] = useState('');
  const [PaymentDate, setPaymentDate] = useState('');
  const [OrderAmount, setOrderAmount] = useState('');
  const [msg, setmsg] = useState("")

  const router = useRouter();

  const postData = {
    paymentid: PaymentID,
  };

  useEffect(() => {
    auth();
    fetch("/api/getPayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.Payment);
          setPaymentName(data.Payment.PaymentID)
          setPaymentMode(data.Payment.PaymentMode)
          setPaymentChannel(data.Payment.PaymentChannel)
          setPaymentDate(data.Payment.PaymentDate)
          setOrderAmount(data.Payment.PaymentAmount)
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
    const postData = {
      PaymentID: PaymentID,
      PaymentMode: PaymentMode,
      PaymentChannel: PaymentChannel,
      PaymentDate: PaymentDate,
      PaymentAmount: OrderAmount,
    };

    fetch("/api/editPayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          setTimeout(() => {
            window.location.href = "/admin/payments";
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
    <div className="mt-20 mx-auto container">
      <div id="payment-modal" className="ms-60 overflow-y-auto overflow-x-hidden justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow border-4">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900"> Payment Details for order </h3>
              <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="payment-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" action="#">
                <div>
                  <label htmlFor="orderID" className="block mb-2 text-sm font-medium text-gray-900">Payment ID</label>
                  <input disabled value={PaymentID} onChange={(e) => setPaymentID(e.target.value)} type="text" name="orderID" id="orderID" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Payment No" required />
                </div>
                <div>
                  <label htmlFor="paymentMode" className="block mb-2 text-sm font-medium text-gray-900">Payment Mode</label>
                  <select value={PaymentMode} onChange={(e) => setPaymentMode(e.target.value)} name="paymentMode" id="paymentMode" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                    <option value="" disabled>Select</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="net_banking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="paytmChannel" className="block mb-2 text-sm font-medium text-gray-900">Paytm Channel</label>
                  <select value={PaymentChannel} onChange={(e) => setPaymentChannel(e.target.value)} name="paytmChannel" id="paytmChannel" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                    <option value="" disabled>Select Paytm Channel</option>
                    <option value="Paytm">Paytm</option>
                    <option value="PhonePay">PhonePay</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="paymentDate" className="block mb-2 text-sm font-medium text-gray-900">Payment Date</label>
                  <input
                    value={PaymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    type="date"
                    name="paymentDate"
                    id="paymentDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter Payment Date"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="orderAmount" className="block mb-2 text-sm font-medium text-gray-900">Payment Amount</label>
                  <input value={OrderAmount} onChange={(e) => setOrderAmount(e.target.value)} type="text" name="orderAmount" id="orderAmount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Payment Amount" required />
                </div>
                {!msg ? ("") : (
                  <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                    {msg}
                  </div>)}
                <button onClick={updateDetails} type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Payment Details</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page component with Suspense wrapper
const Page = () => {
  return (
    <Suspense fallback={<div className="mt-20 mx-auto container text-center">Loading payment details...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
};

export default Page;
