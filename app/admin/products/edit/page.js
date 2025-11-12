"use client"
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'

// Separate component that uses useSearchParams
const EditProductContent = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('id')
  const [ProductID, setProductID] = useState(search);
  const [ProductName, setProductName] = useState("");
  const [ProductPrice, setProductPrice] = useState("");
  const [ProductStock, setProductStock] = useState("");
  const [ProductHSN, setProductHSN] = useState("")
  const [ProductType, setProductType] = useState("Product");
  const [msg, setmsg] = useState("")

  const router = useRouter();

  const postData = {
    productid: ProductID,
  };

  useEffect(() => {
    auth();
    fetch("/api/getProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.Product);
          setProductName(data.Product.ProductName)
          setProductPrice(data.Product.ProductPrice)
          setProductStock(data.Product.ProductStock)
          setProductHSN(data.Product.ProductHSN)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function updateDetails() {
    const postData = {
      ProductID,
      ProductName,
      ProductPrice,
      ProductHSN,
      ProductType,
    };

    if (ProductType === "Product") {
      postData.ProductStock = ProductStock;
    }

    fetch("/api/editProduct", {
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
            window.location.href = "/admin/products";
          }, 1000);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

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

  return (
    <>
      <div className="mt-20">
        <h2 className="mb-5 text-2xl font-bold text-center">
          Edit Product Details
        </h2>
      </div>
      <div className="max-w-sm mx-auto border border-3 rounded-lg p-5">
        {!msg ? ("") : (<div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
          {msg}
        </div>)}
        <div className="mb-5">
          <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">
            Product ID
          </label>
          <input
            value={ProductID}
            type="text"
            disabled
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="productType"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Product Type
          </label>
          <select
            id="productType"
            value={ProductType}
            onChange={(e) => setProductType(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="Product">Product</option>
            <option value="Service">Service</option>
          </select>
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
            value={ProductName}
            onChange={(e) => setProductName(e.target.value)}
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
            Product Price
          </label>
          <input
            value={ProductPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            type="text"
            id="class"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="10A"
            required
          />
        </div>

        {ProductType === "Product" && (
          <div className="mb-5">
            <label
              htmlFor="Contact"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Stock
            </label>
            <input
              id="Contact"
              value={ProductStock}
              onChange={(e) => setProductStock(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
              placeholder="100"
              required
            />
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="HSN"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            HSN Number
          </label>
          <input
            id="HSN"
            value={ProductHSN}
            onChange={(e) => setProductHSN(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="Enter HSN (Optional)"
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
    <Suspense fallback={<div className="mt-20 text-center">Loading product details...</div>}>
      <EditProductContent />
    </Suspense>
  );
};

export default Page;
