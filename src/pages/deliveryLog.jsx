
import { FcGoogle, FcLeft } from "react-icons/fc";
import { Link } from "react-router-dom";

function DeliveryLog() {
  const handleGoogleLogin = () => {
    window.open("http://localhost:5001/auth/google/deliveryBoy", "_self");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-2xl shadow-md text-center w-80">
    <Link to="/" className="text-left text-black mb-6">
        <FcLeft size={25} />
      </Link>
    <h2 className="font-semibold text-black-800 ">
      KOCART Delivery Partner
    </h2>
    <h2 className="text-4xl font-semibold border-b border-gray-800  mb-3 text-gray-800 ">
      Login
    </h2>
 
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center border border-gray-300 justify-center gap-2 bg-white hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition duration-200"
    >
      <FcGoogle size={25} />

      Continue with Google
    </button>

  </div>
</div> 
  );
}

export default DeliveryLog;
