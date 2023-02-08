import { createForm } from "svelte-forms-lib";
import { object, string, bool } from "yup";
import { get } from "svelte/store";
// import { toasts } from "svelte-toasts";
// import { navigate } from "svelte-routing";

import { isMiniProgram as isMiniProgramStore } from "@/stores/miniProgram";
import { isWelcomeModalShown, isSignupFormShown } from "@/stores/welcomeModal";
import { isShowTutorial } from "@/stores/tutorial";

import { signup } from "@/api/auth";
import { completeTask, EAvailableTasks } from "@/api/tasks";
import { sendGuestAnalytics, GuestAnalyticsType } from "@/api/analytics";

import {
  requiredString,
  requiredMobileNumber,
  requiredName,
  requiredBoolean,
  requiredNumber,
  optionalName,
} from "@/constants/validationSchema";

import {
  setAccessToken,
  setUsername,
  setProfilePicture,
  getGuestId,
  setshowNotifIcon,
} from "@/utils";
import { fetchNavatar } from "@/utils/navatar/generate";
// import { showNotifIconStore } from "@/stores/notifications";

import type { SignupSource, Gender, Experience } from "@/interfaces/form";
import {
  setBubbleMessageToLocalStorage,
  triggerBubbleSpeech,
} from "@/utils/bubbleMessage";
import { currentRoom, reloadNavatar } from "./room";

const initialValues = {
  firstName: "",
  lastName: "",
  year: "",
  month: "",
  date: "",
  gender: "female",
  countryCode: "+86",
  phoneNumber: "",
  verificationCode: "",
  experience: "",
  isAgree: false,
  marketingConsent: false,
  nickname: "",
  country: "",
  city: "",
  province: "",
  openId: "",
  thumbnail: "",
};

const validationSchema = {
  firstName: requiredName,
  lastName: optionalName,
  year: requiredNumber,
  month: requiredNumber,
  date: requiredNumber,
  gender: string().oneOf(["female", "male", ""]),
  countryCode: requiredMobileNumber,
  phoneNumber: requiredMobileNumber,
  verificationCode: requiredString,
  experience: requiredString.oneOf(["using", "tried-it", "never"]),
  isAgree: requiredBoolean.oneOf([true]),
  marketingConsent: bool(),
  nickname: string(),
  country: string(),
  city: string(),
  province: string(),
  openId: string(),
  thumbnail: string(),
};

/* function openGamePage() {
  navigate("/lobby");
} */

export const {
  // observables state
  form,
  errors,
  state,
  touched,
  isValid,
  isSubmitting,
  isValidating,
  // handlers
  // handleBlur,
  updateField,
  validateField,
  handleChange,
  handleSubmit,
} = createForm({
  initialValues,
  validationSchema: object().shape(validationSchema),
  onSubmit: async (values) => {
    // alert(JSON.stringify(values, null, 2));
    try {
      const isMiniProgram = get(isMiniProgramStore);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        countryCode: values.countryCode,
        mobileNumber: values.phoneNumber,
        birthDay: `${values.year}-${values.month}-${values.date}`,
        gender: values.gender as Gender,
        experienceUsingNARS: values.experience as Experience,
        source: (isMiniProgram ? "WECHAT" : "REGULAR") as SignupSource,
        otp: Number(values.verificationCode),
        nickname: values.nickname,
        country: values.country,
        city: values.city,
        province: values.province,
        openid: values.openId,
        thumbnail: values.thumbnail,
        marketingConsent: values.marketingConsent,
      };
      const response = await signup(payload);
      setAccessToken(response.token);
      setshowNotifIcon("show");

      setUsername(`${values.firstName} ${values.lastName}`.trim());
      setProfilePicture(values.thumbnail);
      setBubbleMessageToLocalStorage(response.id);
      try {
        await completeTask(EAvailableTasks.Register);
        console.log("NCOINS earned from signup");
      } catch (error) {
        console.error(error, error.stack);
      }

      // toasts.success("Signup success");
      // showNotifIconStore.update(() => true);
      isWelcomeModalShown.update(() => false);
      isSignupFormShown.update(() => false);
      isShowTutorial.update(() => true);
      reloadNavatar.update(() => true);

      let room = "hall";
      currentRoom.subscribe((val) => (room = val));
      setTimeout(() => {
        triggerBubbleSpeech(room);
      }, 600);
      // openGamePage();

      window.gtag("event", "click", {
        event_category: "onboarding_button_registration",
        event_label: "account_creation",
      });

      sendGuestAnalytics({
        type: GuestAnalyticsType.CREATE_ACCOUNT,
        guestId: getGuestId(),
        entryType: "start",
      })
        .then(() => console.log("Send guest analytics"))
        .catch((error) => console.error(error));

      fetchNavatar()
        .then(() => {
          console.log("Navatar fetched and rendered");
        })
        .catch((error) => {
          // toasts.error("Navatar Error", error.message);
          console.error("Navatar Error", error.message);
        });
    } catch (error) {
      // toasts.error("Signup Error", error.message);
      console.error("Signup Error", error.message);
    }
  },
});
// oGXeb509U17cSeHJIOFbCfVCE-bs
