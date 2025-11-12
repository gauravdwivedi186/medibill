"use client"
import Navbar from "@/components/Navbar";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import Image from "next/image";


const MyPage = () => {
    const searchParams = useSearchParams();
    const orderid = searchParams.get('id')
    const [msg, setmsg] = useState("")

    const [Product, setProduct] = useState("")
    const [Customer, setCustomer] = useState("")

    const [ProductList, setProductList] = useState([])

    const postData = {
        orderid: orderid,
        // Add other properties if needed
    };
    useEffect(() => {
       auth();
        fetch("/api/getOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.Product);
                    setProduct(data.Order)
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);


    useEffect(() => {
        fetch("/api/getCustomer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ customerid: Product.CustomerID }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data);
                    setCustomer(data.customer)
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });



        fetch("/api/getProduct", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.products);
                    setProductList(data.products);
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [Product])

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
  

    const getOrderDetails = () => {
        if (Product && Product.Products && Array.isArray(Product.Products)) {
            let subtotalAmount = 0;
            const taxRate = 0.18;
    
            const orderDetails = Product.Products.map(order => {
                const productDetails = ProductList.find(product => product.ProductID === order.productId);
    
                if (productDetails) {
                    const total = productDetails.ProductPrice * parseInt(order.quantity);
                    subtotalAmount += total;
    
                    return (
                        <div key={order.productId} className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            <div className="col-span-full sm:col-span-2">
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Item</h5>
                                <p className="font-medium text-gray-800">{productDetails.ProductName}</p>
                            </div>
                            <div>
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Qty</h5>
                                <p className="text-gray-800">{order.quantity}</p>
                            </div>
                            <div>
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Rate</h5>
                                <p className="text-gray-800">{productDetails.ProductPrice}</p>
                            </div>
                            <div>
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Amount</h5>
                                <p className="sm:text-end text-gray-800">₹{total.toFixed(2)}</p>
                            </div>
                        </div>
                    );
                }
    
                return null;
            });
    
            const taxAmount = subtotalAmount * taxRate;
    const totalAmount = subtotalAmount;

    // Additional JSX for tax and total
    const additionalDetails = (
      <div className="mt-8 flex sm:justify-end">
        <div className="w-full max-w-2xl sm:text-end space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 ">Subtotal:</dt>
              <dd className="col-span-2 text-gray-500">₹{subtotalAmount.toFixed(2)}</dd>
            </dl>

            {/* <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800  ">Tax:</dt>
              <dd className="col-span-2 text-gray-500">₹{taxAmount.toFixed(2)}</dd>
            </dl> */}

            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800  ">Total GST</dt>
              <dd className="col-span-2 text-gray-500">₹{Product.GST}</dd>
            </dl>
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800  ">Total Amount</dt>
              <dd className="col-span-2 text-gray-500">₹{Product.Total}</dd>
            </dl>
          </div>
        </div>
      </div>
    );

    return [orderDetails, additionalDetails];
  }

  return null;
};
    



    const [printData, setPrintData] = useState({
        title: 'Printable Title',
        description: 'This is the content to be printed.',
    });

    const handlePrint = () => {
        const printableArea = document.getElementById('printableArea');

        if (printableArea) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print</title> <script src="https://cdn.tailwindcss.com"></script></head><body>');
            printWindow.document.write('<div class="flex justify-center items-center mt-3"><button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="window.print()">Print</button></div>');
            printWindow.document.write('<div style="margin: 20px;">');
            printWindow.document.write(printableArea.innerHTML);
            printWindow.document.write('</div></body></html>');
            printWindow.document.close();
        }
    };


    return (
        <>

            <div className="mt-20">
                <h2 className="mb-5 text-2xl font-bold text-center">
                    {Product.OrderID} - ORDER DETAILS
                </h2>
                <div className="flex items-center justify-center mb-2">
                    <a href={`/admin/invoices/add?id=${Product.OrderID}`} class="mx-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                            Generate Invoice
                        </span>
                    </a>
                    <button onClick={handlePrint} href="" class="mx-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                            Print PDF
                        </span>
                    </button>
                </div>
            </div>
            {/* <section >
                <div class="max-w-xl mx-auto border border-3 rounded-lg p-5">
                    {!msg ? ("") : (<div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                        {msg}
                    </div>)}
                    <h2 className="mb-5 text-2xl font-bold text-center">
                        Zbytes Invoice</h2>

                    <h2 class="mb-2 text-lg font-semibold text-gray-900 ">Order Details</h2>
                    <ul class="max-w-xl space-y-1 text-gray-500 list-disc list-inside ">
                        <li className="text-lg font-bold">
                            ORDER ID : {Product.OrderID}
                        </li>
                        <li className="text-lg font-bold">
                            Customer Name : {Customer.CustomerName}
                        </li>
                        <li className="text-lg font-bold">
                            Customer Phone : {Customer.CustomerPhone}
                        </li>
                        <li className="text-lg font-bold">
                            Customer Email : {Customer.CustomerEmail}
                        </li>
                        <li className="text-lg font-bold">
                            Address : {Product.Address}
                        </li>
                        <li className="text-lg font-bold">
                            Tracking ID : {Product.TrackingID}
                        </li>
                        <li className="text-lg font-bold">
                            Sales Channel : {Product.SalesChannel}
                        </li>
                    </ul>



                    <div>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 mt-8">Products Details</h2>
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border py-2 px-4">Product ID</th>
                                    <th className="border py-2 px-4">Product Name</th>
                                    <th className="border py-2 px-4">Quantity</th>
                                    <th className="border py-2 px-4">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getOrderDetails()}
                            </tbody>
                        </table>
                        <p className="mt-2">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </section>

          */}
 








  <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10" id="printableArea">
    <div class="sm:w-11/12 lg:w-3/4 mx-auto">
   
      <div class="flex flex-col p-4 sm:p-10 bg-white shadow-md rounded-xl border-4">
       
        <div class="flex justify-between">
          <div>
           <Image height={140} width={250} src="/logo.png" className=""   />

            {/* <h1 class="mt-2 text-xl md:text-2xl font-semibold text-blue-600 ">BharatGen</h1> */}
          </div>

          <div class="text-end">
            <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 ">Invoice #</h2>
            <span class="mt-1 block text-gray-500">{Product.OrderID}</span>

            <address class="mt-4 not-italic text-gray-800 ">
              BharatGen Unit-II Ratapur<br/>
              Raebareli, Uttar Pradesh<br/>
             India<br/>
            </address>
          </div>
        </div>
        
        <div class="mt-8 grid sm:grid-cols-2 gap-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 ">Bill to:</h3>
            <h3 class="text-lg font-semibold text-gray-800 ">{Customer.CustomerName}</h3>
            <address class="mt-2 not-italic text-gray-500">
            {Product.Address}<br/>
            {Product.Pincode}<br/>
            {Customer.CustomerPhone}<br/>
            </address>
          </div>

          <div class="sm:text-end space-y-2">
           
            <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
              <dl class="grid sm:grid-cols-5 gap-x-3">
                <dt class="col-span-3 font-semibold text-gray-800 ">Invoice date:</dt>
                <dd class="col-span-2 text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
              </dl>
              <dl class="grid sm:grid-cols-5 gap-x-3">
                {/* <dt class="col-span-3 font-semibold text-gray-800 ">Tracking Id</dt>
                <dd class="col-span-2 text-gray-500">#{Product.TrackingID}</dd> */}
              </dl>
            </div>
           
          </div>
         

          
                        
                     
        </div>
        <div class="mt-6">
  <div class="border border-gray-200 p-4 rounded-lg space-y-4">
    <div class="hidden sm:grid sm:grid-cols-5">
      <div class="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">Item</div>
      <div class="text-start text-xs font-medium text-gray-500 uppercase">Qty</div>
      <div class="text-start text-xs font-medium text-gray-500 uppercase">Rate</div>
      <div class="text-end text-xs font-medium text-gray-500 uppercase">Amount</div>
    </div>

    <div class="hidden sm:block border-b border-gray-200"></div>

    {/* Integrate getOrderDetails function here */}
    {getOrderDetails()}

  </div>
</div>
     

        <div class="mt-8 sm:mt-12">
          <h4 class="text-lg font-medium text-gray-800  ">Thank you ! Contact us at - tobharatgen@gmail.com</h4>
          {/* <p class="text-gray-500">If you have any questions concerning this invoice, use the following contact information:</p>
          <div class="mt-2">
            <p class="block text-sm font-medium text-gray-800  ">example@site.com</p>
            <p class="block text-sm font-medium text-gray-800  ">+1 (062) 109-9222</p>
          </div> */}
        </div>

      </div>
   
      {/* <div class="mt-6 flex justify-end gap-x-3">
        <a class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm" href="#">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Invoice PDF
        </a>
        <a class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print
        </a>
      </div> */}
    
    </div>
  </div>


        </>
    );
};




const Page = () => {
  return (
    <Suspense fallback={<div className="mt-20 text-center">Loading tracking details...</div>}>
      <MyPage />
    </Suspense>
  );
};



export default Page;
