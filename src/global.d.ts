/// <reference types="svelte" />

type JsApiName =
  | "updateAppMessageShareData"
  | "updateTimelineShareData"
  | "onMenuShareWeibo"
  | "onMenuShareQZone"
  | "startRecord"
  | "stopRecord"
  | "onVoiceRecordEnd"
  | "playVoice"
  | "pauseVoice"
  | "stopVoice"
  | "onVoicePlayEnd"
  | "uploadVoice"
  | "downloadVoice"
  | "chooseImage"
  | "previewImage"
  | "uploadImage"
  | "downloadImage"
  | "translateVoice"
  | "getNetworkType"
  | "openLocation"
  | "getLocation"
  | "hideOptionMenu"
  | "showOptionMenu"
  | "hideMenuItems"
  | "showMenuItems"
  | "hideAllNonBaseMenuItem"
  | "showAllNonBaseMenuItem"
  | "closeWindow"
  | "scanQRCode"
  | "chooseWXPay"
  | "openProductSpecificView"
  | "addCard"
  | "chooseCard"
  | "openCard";

interface ErrorMessage {
  errMsg: string;
}

interface JWeixin {
  config: (config: {
    debug: boolean;
    appId: string;
    timestamp: number;
    nonceStr: string;
    signature: string;
    jsApiList: JsApiName[];
  }) => void;
  ready: (callback: () => void) => void;
  error: (callback: (res: ErrorMessage) => void) => void;
  downloadImage: (config: {
    serverId: string;
    isShowProgressTips: number;
    success: (res: { localId: string }) => void;
    fail: (res: ErrorMessage) => void;
    complete: () => void;
  }) => void;
}

interface GameInstance {
  Module: {
    canvas: HTMLCanvasElement;
  };
  container: HTMLElement;
  SendMessage: (
    targetObject: "[Bridge]",
    functionName: "ReceiveMessageFromPage",
    msg: string
  ) => void;
  Quit: () => void;
}

declare interface Window {
  UnityLoader: {
    instantiate: (containerId: string, buildUrl: string) => GameInstance;
  };
  gameBuild: string;
  receiveMessageFromUnity: (msg: string) => void;
  wx: JWeixin;
  gtag: typeof gtag;
}
