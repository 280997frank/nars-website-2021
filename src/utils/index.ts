import { AnalyticsType } from "@/interfaces/analytics";

type WeChatToken = "access" | "refresh" | "api-ticket";

const retailerName = location.pathname.split("/")[1];

export const getAccessToken = (): string => {
  if ((process.env.VITE_COOKIE_NAME as string) !== "") {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(
        process.env.VITE_COOKIE_NAME as string
      );
      return token !== null ? token : "";
    }
  }

  return "";
};

export const setAccessToken = (accessToken: string) => {
  if (typeof process.env.VITE_COOKIE_NAME === "string") {
    window.localStorage.setItem(process.env.VITE_COOKIE_NAME, accessToken);
  } else {
    throw new Error("Token cannot be stored");
  }
};

export const removeAccessToken = () => {
  if (typeof process.env.VITE_COOKIE_NAME === "string") {
    const getMessage = window.localStorage.getItem(
      `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`
    );
    window.localStorage.clear();
    window.localStorage.setItem(
      `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`,
      getMessage
    );
  } else {
    throw new Error("Token cannot be stored");
  }
};

export const getWeChatToken = (type: WeChatToken) => {
  const token = localStorage.getItem(
    `${process.env.VITE_COOKIE_NAME}-wechat-${type}`
  );
  return token;
};

export const setWeChatToken = (type: WeChatToken, token: string) => {
  localStorage.setItem(`${process.env.VITE_COOKIE_NAME}-wechat-${type}`, token);
};

export const setUsername = (name: string) => {
  localStorage.setItem(`${process.env.VITE_COOKIE_NAME}-username`, name);
};

export const getUsername = () => {
  return localStorage.getItem(`${process.env.VITE_COOKIE_NAME}-username`);
};

export const setProfilePicture = (url: string) => {
  localStorage.setItem(`${process.env.VITE_COOKIE_NAME}-profpic`, url);
};

export const getProfilePicture = () => {
  return localStorage.getItem(`${process.env.VITE_COOKIE_NAME}-profpic`);
};

export const setRoomAnalyticsId = (analyticsId: string) => {
  localStorage.setItem("room-analytics-id", analyticsId);
};

export const setshowNotifIcon = (show: string) => {
  localStorage.setItem("isShowNotifIcon", show);
};

export const getshowNotifIcon = () => {
  return localStorage.getItem("isShowNotifIcon");
};

export const getRoomAnalyticsId = () => {
  return localStorage.getItem("room-analytics-id");
};

export const setRoomName = (roomName: string) => {
  localStorage.setItem("room-name", roomName);
};

export const getRoomName = () => {
  return localStorage.getItem("room-name");
};

export function dataURItoBlob(dataURI: string) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString = "";
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = window.atob(dataURI.split(",")[1]);
  // byteString = unescape(dataURI.split(',')[1]);
  else byteString = decodeURI(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export const goToRoom = (room = "hall") => {
  location.replace(`/${retailerName}?room=${room}`);
};

export function isMyNavatarReady(obj: Record<string, string>) {
  const requiredItems = [
    "skintone",
    "headModel",
    "hairColor",
    "lookBookTexture",
    "bodyModel",
  ];
  const isEverythingThere =
    Object.entries(obj).filter(
      ([key, val]) => requiredItems.includes(key) && val
    ).length === requiredItems.length;

  return isEverythingThere;
}

export function getRoomAnalyticsType(roomName: string) {
  let analyticsType = AnalyticsType.NONSTOP_HALL;

  switch (roomName) {
    case "community":
      analyticsType = AnalyticsType.COMMUNITY_ROOM;
      break;
    case "play":
      analyticsType = AnalyticsType.GAME_ROOM;
      break;
    case "discovery":
      analyticsType = AnalyticsType.DISCOVERY_ROOM;
      break;
  }

  return analyticsType;
}

export const setGuestId = (name: string) => {
  localStorage.setItem("guestId", name);
};

export const getGuestId = () => {
  return localStorage.getItem("guestId");
};
