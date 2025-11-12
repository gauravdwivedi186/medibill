"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";


const MyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");
    const [msg, setmsg] = useState("")
    const [Loading, setLoading] = useState(false);

function loginUser(){
    setLoading(true)
    fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
          }),
      }).then((response) => response.json())
        .then((data) => {
          setmsg(data.msg)
          if (data.success) {
            console.log(data);
            setLoading(false)
            router.push("/");
          } else {
            console.error("API request failed");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
}
    useEffect(() => {
      auth();
    }, [])
    
async function auth() {
  const fetch_api = await fetch("/api/auth/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await fetch_api.json();
  if (data.success) {
    router.push("/");
  }
};

  return (
    <section className="h-[100vh] dark:bg-white mt-56">

    <div className="flex flex-col sm:pt-6 items-center mt-5 justify-cnter px-6 mx-auto md:h-screen lg:py-0">
      {/* <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-blue-200">
        <img className="w-16 h-16 mr-2 rounded-full" src="/192.png" alt="logo" />
        Task Mate
      </a> */}
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight   md:text-2xl ">
           Admin Login
          </h1>
        
        {!msg ? ("") : (<div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
          {msg}
        </div>)}
      
          <div className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium   "
              >
                Your email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 outline-0  sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                placeholder="name@company.com"
                required=""
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium   "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 outline-0  sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                required=""
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
    
            <button
            onClick={loginUser}
              className={`w-full bg-indigo-500 hover:bg-indigo-600 font-medium rounded-lg text-sm font-semibold uppercase text-white px-5 py-2.5 text-center ${
                Loading && "bg-indigo-200"
              } `}
            >
              Sign in{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}


const Page = () => {
  return (
    <Suspense fallback={<div className="mt-20 text-center">Loading tracking details...</div>}>
      <MyPage />
    </Suspense>
  );
};



export default Page