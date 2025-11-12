"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import Select from 'react-select';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Page = () => {

  const [totalSum, setTotalSum] = useState(0);
  const [GSTtax, setGSTtax] = useState("none")
  const [TotalGST, setTotalGST] = useState(0)
  const [rows, setRows] = useState([
    { productId: '', quantity: 1 },
  ]);

  const handleProductChange = (index, productId) => {
    const newRows = [...rows];
    newRows[index].productId = productId;
    setRows(newRows);
  };

  const handleQuantityChange = (index, quantity) => {
    const newRows = [...rows];
    newRows[index].quantity = quantity;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { productId: '', quantity: 1 }]);
    console.log(rows);
  };


  const handleDeleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };


  const calculateTotalSum = () => {
    let sum = 0;
    rows.forEach(row => {
      const product = ProductList.find(product => product.ProductID === row.productId);
      const total = row.quantity * (product ? product.ProductPrice : 0);
      sum += total;
    });
    if (GSTtax === "none") {
      setTotalSum(parseFloat(sum.toFixed(2)));
      setTotalGST(0);
    }
    if (GSTtax === "i_GST5") {
      setTotalSum(parseFloat((sum + (sum * 0.05)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.05).toFixed(2)));
    }
    if (GSTtax === "i_GST12") {
      setTotalSum(parseFloat((sum + (sum * 0.12)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.12).toFixed(2)));
    }
    if (GSTtax === "i_GST18") {
      setTotalSum(parseFloat((sum + (sum * 0.18)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.18).toFixed(2)));
    }

    if (GSTtax === "sc_GST5") {
      setTotalSum(parseFloat((sum + (sum * 0.05)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.05).toFixed(2)));
    }
    if (GSTtax === "sc_GST12") {
      setTotalSum(parseFloat((sum + (sum * 0.12)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.12).toFixed(2)));
    }
    if (GSTtax === "sc_GST18") {
      setTotalSum(parseFloat((sum + (sum * 0.18)).toFixed(2)));
      setTotalGST(parseFloat((sum * 0.18).toFixed(2)));
    }
  };




  const [CustomersList, setCustomersList] = useState([]);
  const [SalesManList, setSalesManList] = useState([]);
  const [ProductList, setProductList] = useState([]);

  const [OrderID, setOrderID] = useState("")
  const [CustomerID, setCustomerID] = useState("")
  const [CustomerName, setCustomerName] = useState("")
  const [CustomerPhone, setCustomerPhone] = useState("")
  const [CustomerEmail, setCustomerEmail] = useState("")

  const [TotalAmount, setTotalAmount] = useState("")
  const [TrackingNo, setTrackingNo] = useState("")
  const [cost, setCost] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [TrackingStatus, setTrackingStatus] = useState('pending');
  const [courierName, setCourierName] = useState('fedex');


  const [PaymentMode, setPaymentMode] = useState('');
  const [PaymentStatus, setPaymentStatus] = useState('');
  const [PaymentChannel, setPaymentChannel] = useState('');
  const [PaymentDate, setPaymentDate] = useState('');
  const [OrderAmount, setOrderAmount] = useState('');
  const [PaymentID, setPaymentID] = useState([])
  const [TrackingID, setTrackingID] = useState([])

  const [SalesChannel, setSalesChannel] = useState("None")
  const [Address, setAddress] = useState("")
  const [Pincode, setPincode] = useState("")

  const [PaymentNo, setPaymentNo] = useState("")

  function addCustomer() {
    // Fetch data from the API
    const postData = {
      CustomerID: CustomerID,
      CustomerName: CustomerName,
      CustomerPhone: CustomerPhone,
      CustomerEmail: CustomerEmail,
    };


    fetch("/api/addCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data.customer);
          location.reload();
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
  };

  useEffect(() => {
    calculateTotalSum();
  }, [rows, ProductList, GSTtax]);


  const handleCustomerSelection = (event) => {
    const selectedValue = event.target.value;
    const [selectedCustomerID, selectedCustomerName, selectedCustomerPhone, selectedCustomerEmail] = selectedValue.split(" | ");
    // You can perform additional actions based on the selected customer
    console.log("Selected Customer ID:", selectedCustomerID);
    console.log("Selected Customer Name:", selectedCustomerName);

    setCustomerID(selectedCustomerID);
    setCustomerName(selectedCustomerName)
    setCustomerPhone(selectedCustomerPhone)
    setCustomerEmail(selectedCustomerEmail)

  };



  const [msg, setmsg] = useState("")


  useEffect(() => {
    auth();
    fetch("/api/getCustomer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.customers);
          setCustomersList(data.customers)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetch("/api/getSalesMan", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.SalesMans);
          setSalesManList(data.SalesMans)
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
  }, []);


  function save() {
    const postData =
    {
      OrderID: OrderID,
      CustomerID: CustomerID,
      Products: rows,
      SalesChannel: SalesChannel,
      Address: Address,
      Pincode: Pincode,
      PaymentID: PaymentID,
      TrackingID: TrackingID,
      TrackingStatus: TrackingStatus,
      TaxType: GSTtax,
      GST: TotalGST,
      Total: totalSum
    }
    console.log(postData);
    fetch("/api/addOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        toast.info(data.msg);
        if (data.success) {
          console.log(data);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function saveTrackingDetails() {
    const postData = {
      TrackingNo: TrackingNo,
      cost: cost,
      trackingUrl: trackingUrl,
      TrackingCourier: courierName,
      OrderID: OrderID

    }

    console.log(postData);

    fetch("/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        toast.info(data.msg);
        if (data.success) {
          console.log(data);
          const updatedTrackingID = [...TrackingID];
          updatedTrackingID.push(data.TrackingID);
          setTrackingID(updatedTrackingID);

        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

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

  function savePaymentDetails() {
    const postData = {
      OrderID: OrderID,
      PaymentID: PaymentID,
      PaymentNo: PaymentNo,
      PaymentMode: PaymentMode,
      PaymentStatus: PaymentStatus,
      PaymentChannel: PaymentChannel,
      PaymentDate: PaymentDate,
      PaymentAmount: OrderAmount
    }

    console.log(postData);

    fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          const updatedPaymentID = [...PaymentID];
          updatedPaymentID.push(data.PaymentID);
          setPaymentID(updatedPaymentID);
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
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} />
      <div className="mt-20">
        <h2 className="mb-5 text-2xl font-bold text-center">ADD NEW ORDER</h2>
      </div>
      <div className=" max-w-screen mx-auto container mx-auto border border-3 rounded-lg p-5">





      <div className="bg-white p-6 rounded-2xl shadow-lg border">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Left Side */}
    <div>
      {msg && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 border border-green-200" role="alert">
          {msg}
        </div>
      )}

      <div className="mb-5">
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select or type Customer ID</label>
        <div className="flex items-center">
          <input
            type="text"
            id="countries"
            onChange={handleCustomerSelection}
            list="country-list"
            className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 p-2.5"
          />
          <button data-modal-target="customer-modal" data-modal-toggle="customer-modal" className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300">
            +
          </button>
        </div>
        <datalist id="country-list">
          {CustomersList.map((customer) => (
            <option key={customer._id} value={`${customer.CustomerID} | ${customer.CustomerName} | ${customer.CustomerPhone} | ${customer.CustomerEmail}`} />
          ))}
        </datalist>
      </div>

      {/* Customer Info */}
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Customer Name</label>
          <input disabled value={CustomerName} onChange={(e) => setCustomerName(e.target.value)} type="text" id="name" className="input-field" />
        </div>
        <div className="flex-1">
          <label htmlFor="customerPhone" className="block mb-2 text-sm font-medium text-gray-900">Customer Phone</label>
          <input disabled value={CustomerPhone} onChange={(e) => setCustomerPhone(e.target.value)} id="customerPhone" className="input-field" />
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <label htmlFor="customerEmail" className="block mb-2 text-sm font-medium text-gray-900">Customer Email</label>
          <input disabled value={CustomerEmail} onChange={(e) => setCustomerEmail(e.target.value)} id="customerEmail" className="input-field" />
        </div>
        <div className="w-1/2">
          <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900">Pincode</label>
          <input value={Pincode} onChange={(e) => setPincode(e.target.value)} id="pincode" className="input-field" />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="sc" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
        <textarea value={Address} onChange={(e) => setAddress(e.target.value)} id="sc" rows={3} className="input-field resize-none" />
      </div>
    </div>

    {/* Right Side */}
    <div>
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <label htmlFor="sc" className="block mb-2 text-sm font-medium text-gray-900">Sales Man</label>
          <select value={SalesChannel} onChange={(e) => setSalesChannel(e.target.value)} className="input-field">
            <option value="None">None</option>
            {SalesManList.map((salesman) => (
              <option key={salesman._id} value={`${salesman.SalesManName} (${salesman.SalesManID})`}>
                {salesman.SalesManName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <label htmlFor="TrackingNo" className="block mb-2 text-sm font-medium text-gray-900">Tracking ID</label>
          <input disabled value={TrackingID} onChange={(e) => setTrackingID(e.target.value)} id="TrackingNo" className="input-field" />
        </div>

        <div className="flex-1">
          <label htmlFor="trackingCost" className="block mb-2 text-sm font-medium text-gray-900">Payment ID</label>
          <input disabled value={PaymentID} onChange={(e) => setPaymentID(e.target.value)} id="trackingCost" className="input-field" />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">Current Order Status</label>
        <select value={TrackingStatus} onChange={(e) => setTrackingStatus(e.target.value)} className="input-field">
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="return">Return</option>
        </select>
      </div>
    </div>
  </div>

  {/* Product Table */}
  <table className="w-full mt-8 border border-gray-200 text-sm text-gray-700 rounded-xl overflow-hidden shadow-sm">
    <thead className="bg-gray-100 text-left">
      <tr>
        <th className="px-4 py-3 border">Product</th>
        <th className="px-4 py-3 border">Quantity</th>
        <th className="px-4 py-3 border">Total</th>
        <th className="px-4 py-3 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="border px-4 py-2">
            <select value={row.productId} onChange={(e) => handleProductChange(index, e.target.value)} className="input-field">
              <option value="" disabled>Select a product</option>
              {ProductList.map((product) => (
                <option key={product._id} value={product.ProductID}>
                  {product.ProductID} | {product.ProductName} | {product.ProductHSN}
                </option>
              ))}
            </select>
          </td>
          <td className="border px-4 py-2">
            <input type="number" value={row.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} className="input-field" />
          </td>
          <td className="border px-4 py-2">
            <input type="text" value={row.quantity * ProductList.find((product) => product.ProductID === row.productId)?.ProductPrice || 0} disabled className="input-field" />
          </td>
          <td className="border px-4 py-2 space-x-2">
            <button onClick={() => handleDeleteRow(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">X</button>
            <button onClick={handleAddRow} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">+</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* GST & Total */}
  <div className="flex flex-wrap gap-6 mt-6 items-end">
    <div className="flex flex-col">
      <label htmlFor="interStateGST" className="text-sm font-medium text-gray-700 mb-1">Inter-state GST</label>
      <select value={GSTtax} onChange={(e) => setGSTtax(e.target.value)} className="input-field min-w-[200px]">
        <option value="none">No GST (0%)</option>
        <option value="i_GST5">i-GST 5%</option>
        <option value="i_GST12">i-GST 12%</option>
        <option value="i_GST18">i-GST 18%</option>
      </select>
    </div>
    <div className="flex flex-col">
      <label htmlFor="stateCentralGST" className="text-sm font-medium text-gray-700 mb-1">State + Central GST</label>
      <select value={GSTtax} onChange={(e) => setGSTtax(e.target.value)} className="input-field min-w-[250px]">
        <option value="none">No GST (0%)</option>
        <option value="sc_GST5">S-GST 2.5% + C-GST 2.5%</option>
        <option value="sc_GST12">S-GST 6% + C-GST 6%</option>
        <option value="sc_GST18">S-GST 9% + C-GST 9%</option>
      </select>
    </div>
    <div className="text-lg font-semibold text-gray-800">
      Total GST: ₹{TotalGST}
    </div>
  </div>

  {/* Total Sum */}
  <div className="text-3xl font-bold text-red-700 mt-6">Total Sum: ₹{totalSum}</div>

  {/* Action Buttons */}
  <div className="flex flex-wrap mt-6 gap-3">
    <a href="/admin/products/add" className="btn-primary">New Product</a>
    
    <button onClick={save} className="btn-danger">Save & Create Order</button>
  </div>
</div>








    <div className="border hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div>
            {!msg ? ("") : (
              <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                {msg}
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select or type Customer ID</label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="countries"
                  onChange={handleCustomerSelection}
                  list="country-list"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <button data-modal-target="customer-modal" data-modal-toggle="customer-modal" className="ml-2.5 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">+</button>
              </div>

              <datalist id="country-list">
                {CustomersList.map((customer) => (
                  <option key={customer._id} value={`${customer.CustomerID} | ${customer.CustomerName} | ${customer.CustomerPhone} | ${customer.CustomerEmail}`} />
                ))}
              </datalist>
            </div>

            <div className="flex space-x-4 mb-5">
              {/* Customer Name and Customer Phone in one line */}
              <div className="flex-1">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Customer Name</label>
                <input disabled value={CustomerName} onChange={(e) => setCustomerName(e.target.value)} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" required />
              </div>

              <div className="flex-1">
                <label htmlFor="customerPhone" className="block mb-2 text-sm font-medium text-gray-900">Customer Phone</label>
                <input value={CustomerPhone} onChange={(e) => setCustomerPhone(e.target.value)} id="customerPhone" disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>
            </div>

            <div className="flex space-x-4 mb-5">
              {/* Customer Email and Pincode in another line */}
              <div className="flex-1">
                <label htmlFor="customerEmail" className="block mb-2 text-sm font-medium text-gray-900">Customer Email</label>
                <input value={CustomerEmail} onChange={(e) => setCustomerEmail(e.target.value)} type="text" id="customerEmail" disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>

              <div className="w-1/2">
                <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900">Pincode</label>
                <input value={Pincode} onChange={(e) => setPincode(e.target.value)} id="pincode" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>
            </div>


            <div className="mb-5">
              <label htmlFor="sc" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
              <textarea value={Address} onChange={(e) => setAddress(e.target.value)} id="sc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
            </div>

          </div>

          {/* Right side */}
          <div>
            <div className="flex space-x-4 mb-5">
              {/* Order ID */}
              {/* <div className="flex-1">
                <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">Order ID</label>
                <input value={OrderID} onChange={(e) => setOrderID(e.target.value)} type="text" id="id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
              </div> */}

              {/* Sales Channel */}



              <div className="flex-1">
                <label htmlFor="sc" className="block mb-2 text-sm font-medium text-gray-900">Sales Man</label>
                <select
                  value={SalesChannel}
                  onChange={(e) => setSalesChannel(e.target.value)}
                  id="sc"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
                  required
                >
                  <option value="None" >None</option>
                  {SalesManList.map((salesman) => (
                    <option key={salesman._id} value={`${salesman.SalesManName} (${salesman.SalesManID})`} >{salesman.SalesManName}</option>
                  ))}
                </select>



              </div>


            </div>

            <div className="mb-5 flex space-x-4">
              {/* Tracking ID */}
              <div className="flex-1">
                <label htmlFor="TrackingNo" className="block mb-2 text-sm font-medium text-gray-900">Tracking ID</label>
                <input disabled value={TrackingID} onChange={(e) => setTrackingID(e.target.value)} id="TrackingNo" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>

              {/* Tracking Cost */}
              <div className="flex-1">
                <label htmlFor="trackingCost" className="block mb-2 text-sm font-medium text-gray-900">Payment ID</label>
                <input disabled value={PaymentID} onChange={(e) => setPaymentID(e.target.value)} id="trackingCost" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0" placeholder="" required />
              </div>



            </div>
            <div>
              <label for="status" class="block mb-2 text-sm font-medium text-gray-900">Current Order Status</label>
              <select value={TrackingStatus} onChange={(e) => setTrackingStatus(e.target.value)} name="status" id="status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="delivered">Return</option>
              </select>
            </div>
          </div> 
        </div>
          

        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border py-2 px-4">Product</th>
              <th className="border py-2 px-4">Quantity</th>
              <th className="border py-2 px-4">Total</th>
              <th className="border py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border py-2 px-4">
                  <select value={row.productId} onChange={(e) => handleProductChange(index, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="" disabled>Select a product</option>
                    {ProductList.map((product) => (
                      <option key={product._id} value={product.ProductID}>{product.ProductID}{" "}|{" "}{product.ProductName}{" "}|{" "}{product.ProductHSN}</option>
                    ))}
                  </select>
                </td>
                <td className="border py-2 px-4">
                  <input type="number" value={row.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </td>
                <td className="border py-2 px-4">
                  <input type="text" value={row.quantity * ProductList.find((product) => product.ProductID === row.productId)?.ProductPrice || 0} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </td>
                <td className="border py-2 px-4">
                  <button onClick={() => handleDeleteRow(index)} className="bg-red-500 text-white px-4 py-2 rounded">X</button>
                  <button onClick={handleAddRow} className="bg-blue-500 ms-1 text-white px-4 py-2 rounded">+</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 
 
        <div className="flex flex-wrap items-center gap-6 mt-6">

          <div className="flex flex-col">
            <label htmlFor="interStateGST" className="text-sm font-medium text-gray-700 mb-1">
              Inter-state GST
            </label>
            <select
              id="interStateGST"
              value={GSTtax}
              onChange={(e) => setGSTtax(e.target.value)}
              className="min-w-[200px] bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 px-4 py-2 shadow-sm"
            >
              <option value="none">No GST (0%)</option>
              <option value="i_GST5">i-GST 5%</option>
              <option value="i_GST12">i-GST 12%</option>
              <option value="i_GST18">i-GST 18%</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="stateCentralGST" className="text-sm font-medium text-gray-700 mb-1">
              State + Central GST
            </label>
            <select
              id="stateCentralGST"
              value={GSTtax}
              onChange={(e) => setGSTtax(e.target.value)}
              className="min-w-[250px] bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 px-4 py-2 shadow-sm"
            >
              <option value="none">No GST (0%)</option>
              <option value="sc_GST5">S-GST 2.5% + C-GST 2.5%</option>
              <option value="sc_GST12">S-GST 6% + C-GST 6%</option>
              <option value="sc_GST18">S-GST 9% + C-GST 9%</option>
            </select>
          </div>

          <div className="text-lg font-semibold text-gray-800">
            Total GST: ₹{TotalGST}
          </div>
        </div>
 

        <div className="flex my-4 items-center justify-start text-red-700">
          <div className="text-3xl font-bold">Total Sum: ₹{totalSum}</div>
        </div>


        <div className="flex">

          <a href="/admin/products/add" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button">
            New Product
          </a>
          <button data-modal-target="tracking-modal" data-modal-toggle="tracking-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button">
            Add Tracking Details
          </button>
          <button data-modal-target="payment-modal" data-modal-toggle="payment-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button"> Add Payment Details </button>
          <button onClick={save} class="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2" type="button">Save & Create Order </button>
 
        </div>
        </div>

        <div id="customer-modal" tabIndex="-1" aria-hidden="true"
          class="hidden fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div class="relative w-full max-w-md p-4">
            <div class="relative bg-white rounded-2xl shadow-lg border border-gray-200">
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-gray-900">Add New Customer</h3>
                <button type="button"
                  class="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
                  data-modal-hide="customer-modal">
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-5">
                <form class="space-y-4">
                  {msg && (
                    <div class="p-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>
                  )}
                  {/* <div>
            <label htmlFor="id" class="block mb-2 text-sm font-medium text-gray-700">Customer ID</label>
            <input type="text" id="id" value={CustomerID} onChange={(e) => setCustomerID(e.target.value)}
              class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm" required />
          </div> */}
                  <div>
                    <label htmlFor="name" class="block mb-2 text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" value={CustomerName} onChange={(e) => setCustomerName(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm" required />
                  </div>
                  <div>
                    <label htmlFor="phone" class="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="text" id="phone" value={CustomerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      placeholder="9999928938" required />
                  </div>
                  <div>
                    <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" value={CustomerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      placeholder="example@email.com" required />
                  </div>
                  <button type="button" onClick={addCustomer}
                    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Add New Customer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>




        <div id="tracking-modal" tabIndex="-1" aria-hidden="true"
          class="hidden fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div class="relative w-full max-w-md p-4">
            <div class="relative bg-white rounded-2xl shadow-lg border border-gray-200">
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-gray-900">
                  Tracking Details for Order
                </h3>
                <button type="button"
                  class="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                  data-modal-hide="tracking-modal">
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-5">
                <form class="space-y-4">
                  <div>
                    <label htmlFor="TrackingNo" class="block mb-2 text-sm font-medium text-gray-700">Tracking ID</label>
                    <input type="text" id="TrackingNo" value={TrackingNo} onChange={(e) => setTrackingNo(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      placeholder="Enter Tracking ID" required />
                  </div>

                  <div>
                    <label htmlFor="cost" class="block mb-2 text-sm font-medium text-gray-700">Cost</label>
                    <input type="text" id="cost" value={cost} onChange={(e) => setCost(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      placeholder="Enter Cost" required />
                  </div>

                  <div>
                    <label htmlFor="trackingUrl" class="block mb-2 text-sm font-medium text-gray-700">Tracking URL</label>
                    <input type="text" id="trackingUrl" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      placeholder="Enter URL" required />
                  </div>

                  <div>
                    <label htmlFor="courierName" class="block mb-2 text-sm font-medium text-gray-700">Courier Name</label>
                    <select id="courierName" value={courierName} onChange={(e) => setCourierName(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      required>
                      <option value="fedex">FedEx</option>
                      <option value="ekart">EKART</option>
                      <option value="dhl">DHL</option>
                      <option value="bluedart">BlueDart</option>
                    </select>
                  </div>

                  {msg && (
                    <div class="p-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>
                  )}

                  <button type="button" onClick={saveTrackingDetails}
                    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Save Tracking Details
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>





        <div id="payment-modal" tabIndex="-1" aria-hidden="true"
          class="hidden fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div class="relative w-full max-w-md p-4">
            <div class="relative bg-white rounded-2xl shadow-lg border border-gray-200">
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-gray-900">
                  Payment Details for Order
                </h3>
                <button type="button"
                  class="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                  data-modal-hide="payment-modal">
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <div class="p-5">
                <form class="space-y-4">
                  <div>
                    <label for="orderID" class="block mb-2 text-sm font-medium text-gray-700">Payment Reference</label>
                    <input value={PaymentNo} onChange={(e) => setPaymentNo(e.target.value)} type="text" id="orderID"
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      placeholder="Enter Payment Ref" required />
                  </div>

                  <div>
                    <label for="paymentMode" class="block mb-2 text-sm font-medium text-gray-700">Payment Mode</label>
                    <select value={PaymentMode} onChange={(e) => setPaymentMode(e.target.value)} id="paymentMode"
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      required>
                      <option value="" disabled>Select</option>
                      <option value="cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>

                  <div>
                    <label for="paytmChannel" class="block mb-2 text-sm font-medium text-gray-700">Paytm Channel</label>
                    <select value={PaymentChannel} onChange={(e) => setPaymentChannel(e.target.value)} id="paytmChannel"
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      required>
                      <option value="" disabled>Select Paytm Channel</option>
                      <option value="Paytm">Paytm</option>
                      <option value="PhonePay">PhonePay</option>
                      <option value="PhonePay">GooglePay</option>
                      <option value="otherUPI">Other Upi App</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label for="paymentDate" class="block mb-2 text-sm font-medium text-gray-700">Payment Date</label>
                    <input type="date" id="paymentDate" value={PaymentDate} onChange={(e) => setPaymentDate(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      required />
                  </div>

                  <div>
                    <label for="orderAmount" class="block mb-2 text-sm font-medium text-gray-700">Payment Amount</label>
                    <input type="text" id="orderAmount" value={OrderAmount} onChange={(e) => setOrderAmount(e.target.value)}
                      class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      placeholder="Enter Payment Amount" required />
                  </div>

                  {msg && (
                    <div class="p-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>
                  )}

                  <button type="button" onClick={savePaymentDetails}
                    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Save Payment Details
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>


      </div>
      {/* sdd */}
    </>
  );
};

export default Page;
