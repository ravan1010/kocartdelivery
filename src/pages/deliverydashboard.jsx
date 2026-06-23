import { useEffect, useState } from 'react'
// import Navbar from '../componetstoowner/navbertoowner'
import api from '../api';
import { ToggleRight, ToggleLeft } from 'lucide-react';
import { generateAndSaveFCMToken } from '../utili/token';


const Deliverydashboard = () => {


  const [isOnline, setisOnline] = useState(false)
  const [orders, setOrders] = useState([]);
  const [assigned, setassigned] = useState([]);
  const [pickedup, setpickedup] = useState([]);
  const [step, setstep] = useState(1)


  // const [error, setError] = useState('');
  // const [success, setsuccess] = useState('');

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/delivery/dashboard')
      console.log(res.data.isOnline, 'dashboard')
      setisOnline(res.data.isOnline)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchOrders = async () => {
    await api.get("/api/delivery/orders")
      .then((res) => {
        console.log(res.data.orders)
        setOrders(Array.isArray(res.data.orders)
          ? res.data.orders
          : [])
      })
  };

  const fetchAssignOrders = async () => {
    await api.get("/api/delivery/assigned")
      .then((res) => {
        console.log(res.data.orders)
        setassigned(Array.isArray(res.data.orders)
          ? res.data.orders
          : [])
      })
  };

  const fetchpickedupOrders = async () => {
    await api.get("/api/delivery/getpickedupOrder")
      .then((res) => {
        console.log('pick', res.data.orders)
        setpickedup(Array.isArray(res.data.orders)
          ? res.data.orders
          : [])
      })
  };


  useEffect(() => {
    const loadData = async () => {
      await fetchDashboard()
      await fetchOrders()
      await fetchAssignOrders()
      await fetchpickedupOrders()
      await generateAndSaveFCMToken()
    }
    loadData()
  }, [])

  const handleToggle = async () => {

    const newStatus = !isOnline;
    setisOnline(newStatus);

    try {
      await api.post(
        "/api/delivery/onAndOff",
        { isOnline: newStatus },
        { withCredentials: true }
      ).then((res) => {
        if (res.data.success === true) {
          fetchDashboard()
        }
      })
    } catch (err) {
      console.error(err);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await api.put(`/api/delivery/accept/${orderId}`,
        {},
      )
        .then((res) => {
          if (res.data.success) {
            alert('order assigned you')
            setstep(2)
            fetchOrders()
          }
        })
    } catch (error) {
      console.log(error);
    }
  };

  const pickedupOrder = async (orderId) => {
    try {
      await api.put(`/api/delivery/pickedup/${orderId}`,
        {}
      )
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message)
            fetchAssignOrders()
            setstep(3)
          }
        })
    } catch (error) {
      console.log(error);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await api.put(`/api/delivery/complete/${orderId}`,
        {}
      )
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message)
            fetchpickedupOrders()
            setstep(1)
          }
        })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

      {/* Delivery Status */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-full ${isOnline
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
              }`}
          >
            {isOnline ? (
              <ToggleRight size={28} />
            ) : (
              <ToggleLeft size={28} />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Delivery Partner Status
            </h3>

            <p className="text-gray-500 text-sm">
              {isOnline
                ? "Delivery Partner is Online"
                : "Delivery Partner is Offline"}
            </p>
          </div>
        </div>

        <input
          type="checkbox"
          checked={isOnline}
          onChange={handleToggle}
          className="w-6 h-6 cursor-pointer"
        />
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-2xl shadow-md p-2 mb-6 overflow-x-auto">
        <div className="flex gap-3 min-w-max">

          <button
            onClick={() => setstep(1)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${step === 1
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            🛒 Available Orders
          </button>

          <button
            onClick={() => setstep(2)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${step === 2
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            📦 Pickup
          </button>

          <button
            onClick={() => setstep(3)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${step === 3
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            🚚 Delivery
          </button>

        </div>
      </div>

      {/* Available Orders */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders?.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-10 shadow-md text-center">
              <h2 className="text-xl font-bold text-gray-700">
                No Orders Available 📭
              </h2>
            </div>
          ) : (
            Array.isArray(orders) &&
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-green-600 text-white p-4">
                  <p className="text-sm opacity-90">
                    Order #{order._id.slice(-8)}
                  </p>

                  <h2 className="font-bold text-lg">
                    🛒 New Delivery Request
                  </h2>
                </div>

                <div className="p-5 space-y-4">
                  {/* Shops */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      🏪 Pickup Stores
                    </h4>

                    {order.shop?.map((shop) => (
                      <div
                        key={shop._id}
                        className="bg-white p-2 rounded-lg border mb-2 last:mb-0"
                      >
                        <p className="font-medium text-gray-800">
                          {shop.admin?.companyName}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Customer */}
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-bold text-gray-800 text-lg">
                      👤 {order.userId?.name}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">
                        Payment Method
                      </p>

                      <p className="font-semibold text-purple-700">
                        {order.paymentMethod}
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">
                        Status
                      </p>

                      <p
                        className={`font-semibold ${order.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-green-50 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Order Value
                    </span>

                    <span className="text-2xl font-bold text-green-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>

                  {/* Accept Button */}
                  <button
                    onClick={() => acceptOrder(order._id)}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all"
                  >
                    ✅ Accept Order
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* pickup Orders */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assigned?.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-10 shadow-md text-center">
              <h2 className="text-xl font-bold text-gray-700">
                No Assigned Orders 📦
              </h2>
            </div>
          ) : (
            Array.isArray(assigned) &&
            assigned.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-orange-500 text-white p-4">
                  <p className="text-sm opacity-90">
                    Order #{order._id.slice(-8)}
                  </p>
                  <h2 className="font-bold text-lg">
                    📦 Assigned Order
                  </h2>
                </div>

                <div className="p-5 space-y-4">
                  {order.shop?.map((shop) => (
                    <div
                      key={shop._id}
                      className="border rounded-2xl p-4 bg-gray-50"
                    >
                      {/* Shop Info */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            🏪 {shop.admin?.companyName}
                          </h3>
                        </div>

                        <a
                          href={`https://www.google.com/maps?q=${shop.admin?.location.coordinates[1]},${shop.admin?.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          📍 Navigate
                        </a>
                      </div>

                      {/* Products */}
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-gray-700">
                          Products
                        </h4>

                        {shop.items?.map((item) => (
                          <div
                            key={item._id}
                            className="bg-white p-3 rounded-xl border"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {item.name}
                              </span>

                              <span className="font-bold text-green-600">
                                ₹{item.price}
                              </span>
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                              Variant: {item.variantName}
                            </div>

                            <div className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Subtotal */}
                      <div className="mt-4 bg-green-50 rounded-xl p-3 flex justify-between">
                        <span className="font-medium text-gray-700">
                          Shop Total
                        </span>

                        <span className="font-bold text-green-600">
                          ₹{shop.subtotal}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Pickup Button */}
                  <button
                    onClick={() => pickedupOrder(order._id)}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all"
                  >
                    🚚 Mark as Picked Up
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* delivery Orders */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pickedup?.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-10 shadow-md text-center">
              <h2 className="text-xl font-bold text-gray-700">
                No Active Deliveries 🚚
              </h2>
            </div>
          ) : (
            Array.isArray(pickedup) &&
            pickedup.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-xl font-bold">
                    {order.userId?.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    🚚 Out for Delivery
                  </p>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">

                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium text-gray-800">
                      📍 {order.address?.ASSV}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="bg-green-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-green-600">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Payment</p>
                      <p className="font-semibold text-blue-700">
                        {order.paymentMethod}
                      </p>
                    </div>

                  </div>

                  <div className="bg-yellow-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <p
                      className={`font-semibold ${order.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {order.paymentStatus}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Customer Number</p>
                    <a
                      href={`tel:${order.number}`}
                      className="font-medium text-blue-600"
                    >
                      📞 {order.number}
                    </a>
                  </div>

                  {/* Navigate Button */}
                  <a
                    href={`https://www.google.com/maps?q=${order.location.coordinates[1]},${order.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    📍 Open Navigation
                  </a>

                  {/* Delivered Button */}
                  <button
                    onClick={() => completeOrder(order._id)}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition"
                  >
                    ✅ Mark as Delivered
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Deliverydashboard
