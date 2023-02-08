import { io } from "socket.io-client";
import { getAccessToken } from "../utils";

const retailerName = location.pathname.split("/")[1];

export const handleWebsocket = () => {
  const token = getAccessToken();
  if (token) {
    const socket = io(process.env.VITE_WSS, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
        "Retailer-Name": retailerName,
      },
    });

    return socket;
  }
  return null;
};
