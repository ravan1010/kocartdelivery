import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import api from "../api";

export const generateAndSaveFCMToken = async () => {

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: "BPcWN5bCGY7dJTyDkF3aGeIGfd2iKO3B__dV2htnXtTegOG1crO2gBl9WQ-jCqs6gjbDRLubaTMFjeaGgBwM8NM",
    });

    console.log(token)

    if (token) {
      await api.post("/api/delivery-boy/fcmToken", { fcmToken: token });
      console.log("FCM token saved");
    }
  } catch (err) {
    console.error("FCM error:", err);
  }

};
