const Help = "/icons/icon-help.svg";
const personalInformation = "/icons/icon-personal-info.svg";
const tnc = "/icons/icon-tnc.svg";
const privacy = "/icons/icon-privacy.svg";

export const SETTING_MENUS = [
  {
    key: "1",
    icon: personalInformation,
    title: "personalInformation",
    route: "/profile/information",
    mustBeAuthenticated: true,
  },
  {
    key: "2",
    icon: Help,
    title: "help",
    route: "/help",
    mustBeAuthenticated: false,
  },
  {
    key: "3",
    icon: tnc,
    title: "tnc",
    route: "/terms-and-conditions",
    mustBeAuthenticated: false,
  },
  {
    key: "4",
    icon: privacy,
    title: "privacyPolicy",
    route: "/privacy-policy",
    mustBeAuthenticated: false,
  },
];
