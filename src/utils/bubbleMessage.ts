import {
  BubbleMessage,
  BubbleMessagePosition,
  BubbleMessageUser,
  bubblePosition,
  message,
} from "@/constants/bubbleMessage";
import { bubbleSpeechContent } from "@/stores/bubbleContent";

export const getDataMessage = (
  data: BubbleMessage[],
  position: BubbleMessagePosition
) => {
  return data.find((item) => item.position === position);
};

export const setBubbleMessageToLocalStorage = (id: string) => {
  window.localStorage.setItem(
    `${process.env.VITE_COOKIE_NAME}-id-users`,
    JSON.stringify(id)
  );
  const getBubbleMessageUser = window.localStorage.getItem(
    `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`
  );
  const getBubbleMessageUserParsed: BubbleMessageUser[] =
    JSON.parse(getBubbleMessageUser);

  if (getBubbleMessageUser) {
    let bubleMessage: BubbleMessageUser[];
    if (getBubbleMessageUserParsed?.find((item) => item.id === id)) {
      bubleMessage = getBubbleMessageUserParsed;
    } else {
      const array = Array.isArray(getBubbleMessageUserParsed)
        ? getBubbleMessageUserParsed
        : [];
      bubleMessage = [...array, { id, bubbleMessage: message }];
    }
    window.localStorage.setItem(
      `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`,
      JSON.stringify(bubleMessage)
    );
  } else {
    const bubbleMessageUser: BubbleMessageUser[] = [
      { id, bubbleMessage: message },
    ];
    window.localStorage.setItem(
      `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`,
      JSON.stringify(bubbleMessageUser)
    );
  }
};

export const getBubbleMessageFromLocalStorage = () => {
  const id = window.localStorage.getItem(
    `${process.env.VITE_COOKIE_NAME}-id-users`
  );
  const idParse = JSON.parse(id);
  const message = window.localStorage.getItem(
    `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`
  );

  if (message) {
    const messageParsed: BubbleMessageUser[] = JSON.parse(message);
    const userMessage = messageParsed?.find((item) => item.id === idParse);
    if (userMessage) {
      return userMessage.bubbleMessage as BubbleMessage[];
    }
  }
  // setBubbleMessageToLocalStorage(id);
  return [] as BubbleMessage[];
};

export const updateBubbleMessageToLocalStorage = (
  position: BubbleMessagePosition | string
) => {
  const id = window.localStorage.getItem(
    `${process.env.VITE_COOKIE_NAME}-id-users`
  );
  const idParsed = JSON.parse(id);
  const message = window.localStorage.getItem(
    `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`
  );
  if (message) {
    const data: BubbleMessageUser[] = JSON.parse(message);
    const userData =
      data?.map((item) => {
        if (item.id === idParsed) {
          return {
            ...item,
            bubbleMessage: item.bubbleMessage.map((list) => {
              return list.position === position
                ? { ...list, isRead: true }
                : list;
            }),
          };
        } else {
          return item;
        }
      }) || [];
    // console.log("old data of bubble message", userData);
    window.localStorage.setItem(
      `${process.env.VITE_COOKIE_NAME}-bubbleMessage-users`,
      JSON.stringify(userData)
    );
  }
};

export const showBubbleMessage = (position: BubbleMessagePosition) => {
  const getMessage = getBubbleMessageFromLocalStorage();
  if (getMessage.length > 0) {
    if (!bubblePosition.includes(position)) {
      position = "entry";
    }
    const data: BubbleMessage = getMessage.find(
      (item) => item.position === position
    );
    let arrMessage = [];
    if (data.isRead) {
      let index: number[];
      switch (position) {
        case (position = "entry"):
          index = [0];
          break;
        case (position = "hall"):
          index = [];
          break;
        case (position = "discovery"):
          index = [];
          break;
        case (position = "play"):
          index = [];
          break;
        case (position = "community"):
          index = [];
          break;
        default:
          index = [0];
          break;
      }

      index.map((item) => {
        arrMessage.push(data.text[item]);
      });
    } else {
      arrMessage = data.text;
    }
    return arrMessage as string[];
  }
  return [] as string[];
};

export const triggerBubbleSpeech = (room) => {
  const data: string[] = showBubbleMessage(room as BubbleMessagePosition);
  const numberOfIndex = data.length;
  let numberOfShow = 0;
  const timer = setInterval(() => {
    bubbleSpeechContent.update(() => data[numberOfShow]);
    if (numberOfIndex === numberOfShow || numberOfShow > 10) {
      bubbleSpeechContent.update(() => "");
      return clearInterval(timer);
    }
    numberOfShow += 1;
  }, 2500);
  updateBubbleMessageToLocalStorage(room);
};
