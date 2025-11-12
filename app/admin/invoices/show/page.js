"use client"
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'

// Separate component that uses useSearchParams
const ShowInvoiceContent = () => {
    const searchParams = useSearchParams();
    const orderid = searchParams.get('id')
    const [msg, setmsg] = useState("")
    const [Product, setProduct] = useState("")
    const [InvoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    const [Customer, setCustomer] = useState("")
    const [InvoiceNo, setInvoiceNo] = useState("")
    const [Tax, setTax] = useState(18)
    const [ProductList, setProductList] = useState([])

    const router = useRouter();

    const postData = {
        orderid: orderid,
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

        fetch("/api/getInvoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ invoiceid: orderid + "inv" }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.Invoice.Tax);
                    setTax(data.Invoice.Tax)
                    setInvoiceDate(data.Invoice.Date)
                    setInvoiceNo(data.Invoice.InvoiceNo)
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [Product])

    const getOrderDetails = () => {
        if (Product && Product.Products && Array.isArray(Product.Products)) {
            let subtotalAmount = 0;
            const taxRate = Tax / 100;

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
            const totalAmount = subtotalAmount + taxAmount;

            const additionalDetails = (
                <div className="mt-8 flex sm:justify-end">
                    <div className="w-full max-w-2xl sm:text-end space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800 ">Subtotal:</dt>
                                <dd className="col-span-2 text-gray-500">₹{subtotalAmount.toFixed(2)}</dd>
                            </dl>

                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800">
                                    {(() => {
                                        switch (Product.TaxType) {
                                            case "i_GST12":
                                                return "i-GST 12%";
                                            case "i_GST5":
                                                return "i-GST 5%";
                                            case "i_GST18":
                                                return "i-GST 18%";
                                            default:
                                                return "";
                                        }
                                    })()}
                                </dt>

                                {(() => {
                                    switch (Product.TaxType) {
                                        case "sc_GST5":
                                            return (
                                                <>
                                                    <dt className="col-span-3 font-semibold text-gray-800">Central GST 2.5%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                    <dt className="col-span-3 font-semibold text-gray-800">State GST 2.5%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                </>
                                            );
                                        case "sc_GST12":
                                            return (
                                                <>
                                                    <dt className="col-span-3 font-semibold text-gray-800">Central GST 6%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                    <dt className="col-span-3 font-semibold text-gray-800">State GST 6%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                </>
                                            );
                                        case "sc_GST18":
                                            return (
                                                <>
                                                    <dt className="col-span-3 font-semibold text-gray-800">Central GST 9%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                    <dt className="col-span-3 font-semibold text-gray-800">State GST 9%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                </>
                                            );
                                        default:
                                            return <dd className="col-span-2 text-gray-500">₹{Product.GST}</dd>;
                                    }
                                })()}
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

    const handlePrint = () => {
        const printableArea = document.getElementById('printableArea');

        if (printableArea) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print</title> <script src="https://cdn.tailwindcss.com"></script></head><body>');
            printWindow.document.write('<div className="flex justify-center items-center mt-3"><button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="window.print()">Print</button></div>');
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
                    <button onClick={handlePrint} className="mx-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                            Print PDF
                        </span>
                    </button>
                </div>
            </div>

            <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10" id="printableArea">
                <div className="sm:w-11/12 lg:w-3/4 mx-auto">
                    <div className="flex flex-col p-4 sm:p-10 bg-white shadow-md rounded-xl border-4">
                        <div className="flex justify-between">
                            <div>
                                <h1 className="mt-2 text-xl md:text-2xl font-semibold text-blue-600 ">HandMakers</h1>
                            </div>

                            <div className="text-end">
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 ">Invoice #</h2>
                                <span className="mt-1 block text-gray-500">{Product.OrderID}</span>

                                <address className="mt-4 not-italic text-gray-800 ">
                                    45 Towers city<br />
                                    Jaipur, Rajasthan<br />
                                    India<br />
                                </address>
                            </div>
                        </div>

                        <div className="mt-8 grid sm:grid-cols-2 gap-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 ">Bill to:</h3>
                                <h3 className="text-lg font-semibold text-gray-800 ">{Customer.CustomerName}</h3>
                                <address className="mt-2 not-italic text-gray-500">
                                    {Product.Address}<br />
                                    {Product.Pincode}<br />
                                    +91 {Customer.CustomerPhone}<br />
                                </address>
                            </div>

                            <div className="sm:text-end space-y-2">
                                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                                    <dl className="grid sm:grid-cols-5 gap-x-3">
                                        <dt className="col-span-3 font-semibold text-gray-800 ">Invoice date:</dt>
                                        <dd className="col-span-2 text-gray-500">{InvoiceDate}</dd>
                                    </dl>
                                    <dl className="grid sm:grid-cols-5 gap-x-3">
                                        <dt className="col-span-3 font-semibold text-gray-800 ">Invoice No.</dt>
                                        <dd className="col-span-2 text-gray-500">{InvoiceNo}</dd>
                                    </dl>
                                    <dl className="grid sm:grid-cols-5 gap-x-3">
                                        <dt className="col-span-3 font-semibold text-gray-800 ">Tracking Id</dt>
                                        <dd className="col-span-2 text-gray-500">#{Product.TrackingID}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="border border-gray-200 p-4 rounded-lg space-y-4">
                                <div className="hidden sm:grid sm:grid-cols-5">
                                    <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">Item</div>
                                    <div className="text-start text-xs font-medium text-gray-500 uppercase">Qty</div>
                                    <div className="text-start text-xs font-medium text-gray-500 uppercase">Rate</div>
                                    <div className="text-end text-xs font-medium text-gray-500 uppercase">Amount</div>
                                </div>

                                <div className="hidden sm:block border-b border-gray-200"></div>

                                {getOrderDetails()}
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-12">
                            <h4 className="text-lg font-semibold text-gray-800  ">Thank you!</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Main Page component with Suspense wrapper
const Page = () => {
    return (
        <Suspense fallback={<div className="mt-20 text-center">Loading invoice...</div>}>
            <ShowInvoiceContent />
        </Suspense>
    );
};

export default Page;
