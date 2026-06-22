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
      <div className="bg-white rounded-xl shadow p-2 mb-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setstep(1)}
            className={`px-5 py-2 rounded-xl font-medium transition ${step === 1
              ? "bg-green-400 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            Available Orders
          </button>

          <button
            onClick={() => setstep(2)}
            className={`px-5 py-2 rounded-xl font-medium transition ${step === 2
              ? "bg-green-700 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            pickup
          </button>

          <button
            onClick={() => setstep(3)}
            className={`px-5 py-2 rounded-xl font-medium transition ${step === 3
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            My Deliveries
          </button>
        </div>
      </div>

      {/* Available Orders */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders?.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-8 shadow text-center">
              <h2 className="font-semibold text-lg">
                No Orders Available
              </h2>
            </div>
          ) : (
            Array.isArray(orders) &&
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
              >
                <div className="space-y-2">

                  {/* <h3 className='text-lg font-bold text-black break-words'> */}
                  {order.shop?.map((shop) => (
                    <h3
                      key={shop._id}
                      className='text-lg font-bold text-black break-words'
                    >
                      {shop.admin?.companyName}
                    </h3>
                  ))}
                  {/* </h3> */}

                  <h3 className="text-lg font-bold text-gray-800 break-words">
                    {order.userId?.name}
                  </h3>

                  {/* <p className="text-gray-600">
                    📍 {order.address?.ASSV}
                  </p> */}

                  <p className="text-xs text-gray-400">
                    #{order._id.slice(-8)}
                  </p>

                   <p className="text-xs text-gray-400">
                    {order.paymentMethod}
                  </p>

                  <p className="text-xs text-gray-400">
                    {order.paymentStatus}
                  </p>

                  <p className="text-xs text-gray-400">
                    {order.totalAmount}
                  </p>

                </div>

                <button
                  onClick={() => acceptOrder(order._id)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition"
                >
                  Accept Order
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* pickup Orders */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assigned?.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-8 shadow text-center">
              <h2 className="font-semibold text-lg">
                No Active 
              </h2>
            </div>
          ) : (
            Array.isArray(assigned) &&
            assigned.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
              >
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">
                    #{order._id.slice(-8)}
                  </p>

                  {order.shop?.map((shop) => (
                    <h3
                      key={shop._id}
                      className="text-lg font-bold text-black break-words"
                    >
                      {shop.admin?.companyName}

                      <div className="mt-3">
                        <a
                          href={`https://www.google.com/maps?q=${shop.admin?.location.coordinates[1]},${shop.admin?.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                        >
                          📍 Navigate to Shop
                        </a>
                      </div>

                      {shop.items?.map((item) => (
                        <h3
                          key={item._id}
                          className="text-lg font-bold text-black break-words"
                        > 
                          {item.name} - {item.variantName} 
                          <br />
                          qtn : {item.quantity} 
                          <br />
                          price : {item.price}

                        </h3>
                      ))}

                      {shop.subtotal}

                    </h3>
                  ))}
                </div>



                <button
                  onClick={() => pickedupOrder(order._id)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
                >
                  pickedup
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* delivery Orders */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pickedup?.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-8 shadow text-center">
              <h2 className="font-semibold text-lg">
                No Active Delivery
              </h2>
            </div>
          ) : (
            Array.isArray(pickedup) &&
            pickedup.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 break-words">
                    {order.userId?.name}
                  </h3>

                  <p className="text-gray-600">
                    {order.address?.ASSV}
                  </p>


                  <a
                    href={`https://www.google.com/maps?q=${order.location.coordinates[1]},${order.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                  >
                    📍 Navigate
                  </a>

                  <p className="text-sm text-blue-600 font-medium">
                    🚚 Out for Delivery
                  </p>

                  <p>
                    {order.number}
                  </p>

                  <p>
                    {order.totalAmount}
                  </p>

                </div>

                <button
                  onClick={() => completeOrder(order._id)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
                >
                  Mark as Delivered
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Deliverydashboard
