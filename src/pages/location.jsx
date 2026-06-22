import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import axios from "axios";
import { generateAndSaveFCMToken } from '../utili/token';


const Location = () => {

  const [city, setcity] = useState('city');
  const [Number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [latitude, setlatitude] = useState(null)
  const [longitude, setlongitude] = useState(null)
  const [loading, setloading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    generateAndSaveFCMToken();
  }, []);


  const getcitybylatlan = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(


      async (pos) => {
        setloading(true)
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        console.log(`lat : ${lat} lon : ${lon}`);

        try {
          const res = await axios.get(
            "https://api.geoapify.com/v1/geocode/reverse",
            {
              params: {
                lat,
                lon,
                format: "json",
                apiKey: import.meta.env.VITE_GEOAPIFY_KEY,
              },
            }
          );

          console.log(res.data.results[0].city)
          setcity(res.data.results[0].city)
          setlatitude(lat)
          setlongitude(lon)
          setloading(false)

        } catch (err) {
          console.error(err);
          setError("Failed to fetch city");
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (city === 'city' || !latitude) {
      alert(`use live location`)
    }

    if (!Number) {
      alert(`enter your number`)
    }
    
    try {

      await api.post("/api/delivery-boy/location", { city: city, Number: Number, longitude: longitude, latitude: latitude },
        { withCredentials: true })
        .then((res) => {
          // setsuccess(res.data.message)
          if (res.data.success === true) {
            navigate('/')
          }
        })

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message); // Server error
      } else {
        setError("Network error"); // Network error
      }
    }
  };

  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center ">
        <div className="flex flex-col items-center w-70 h-auto rounded px-5 p-4 shadow-xl/65 shadow-black inset-shadow-sm inset-shadow-indigo-500 ">
          <h2 className="font-bold text-3xl mt-10"  >register</h2>
          <form action="post" className="items-center p-2 pb-0.5" onSubmit={handleSubmit} >

            <input
              type="tel"
              placeholder='enter your number'
              value={Number}
              onChange={(e) => setNumber(e.target.value)}
              className='border w-full px-3 py-2 rounded my-4'
              minLength={10}
              maxLength={10}
            />

            <button
              type='button'
              onClick={getcitybylatlan}
              className={`border w-full px-3 py-2 rounded btn-primary`}
            >
              {loading ? 'getting...' : 'use live location'}
            </button>
            <h1>{city}</h1>



            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type='submit' className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"> Next </button>

          </form>


        </div>
      </div>
    </div>
  )
}

export default Location
