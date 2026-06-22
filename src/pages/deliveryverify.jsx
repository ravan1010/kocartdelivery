
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function Deliveryverify() {
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/town/cookie") // cookie auto sent
      .then((res) => {
        console.log("User:", res.data.user);
        navigate("/location"); // or wherever
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  return <h2>Logging you in...</h2>;
}

export default Deliveryverify;
