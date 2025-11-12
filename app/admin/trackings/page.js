"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [Trackings, setTrackings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [Loading, setLoading] = useState(true)

  const searchQueryLowercase = searchQuery.toLowerCase();

  // Filter Trackings based on the case-insensitive search query
  const filteredTrackings = Trackings.filter(
    (card) =>
      card.TrackingID.toLowerCase().includes(searchQueryLowercase) ||
      card.OrderID.toLowerCase().includes(searchQueryLowercase) ||
      card.trackingUrl.toLowerCase().includes(searchQueryLowercase) ||
      card.TrackingStatus.toLowerCase().includes(searchQueryLowercase)
  );
  useEffect(() => {
    auth()
    setLoading(true)
    fetch("/api/tracking")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false)
        if (data.success) {
          console.log(data);
          setTrackings(data.trackings)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const router = useRouter();
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


  async function deleteMe(trackingID) {
    const fetch_api = await fetch("/api/delete/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deltype: "tracking", id: trackingID })
    });

    const data = await fetch_api.json();
    if (data.success) {
      location.reload();
    }
  };




  return (
    <>
      <div class="p-4 mx-auto container mt-5">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-screen">

          <div class=" mt-14  pb-4">
            <form>
              <label
                for="default-search"
                class="mb-2 text-sm font-medium text-gray-900 sr-only"
              >
                Search
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  id="default-search"
                  class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Search Mockups, Logos..."
                  required
                />
                <button
                  type="submit"
                  class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          {/* <a href="Trackings/add" type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">New Customer</a> */}

          {filteredTrackings.length > 0 ? (
            <table className="w-full mt-3 text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Tracking ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tracking URL
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                  {/* <th scope="col" className="px-6 py-3">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {filteredTrackings.map((customer) => (
                  <tr
                    key={customer._id}
                    className="bg-white border-b"
                  >
                    {/* Display only the relevant columns */}
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {customer.TrackingID}
                    </th>
                    <td className="px-6 py-4">{customer.OrderID}</td>
                    <td className="px-6 py-4">{customer.trackingUrl}</td>
                    <td className="px-6 py-4">₹{customer.TrackingCost}</td>
                    <td className="px-6 py-4">
                      <a href={`/admin/trackings/edit/?id=${customer.TrackingID}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {"| "}Edit{" | "}
                      </a>
                      <a
                        onClick={() => (deleteMe(customer.PaymentID))}
                        className="font-medium text-red-600 hover:underline"
                      >
                        {"| "}Delete{" | "}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-lg mt-4 text-center">No matching records found.</p>
          )}

          {!Loading ? "" : (
            <div role="status" className="flex justify-center">
              <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default Page;
