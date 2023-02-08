// import { navigate } from "svelte-routing";
import { createForm } from "svelte-forms-lib";
// import { toasts } from "svelte-toasts";
import { object } from "yup";

import {
  requiredMobileNumber,
  requiredString,
} from "@/constants/validationSchema";

import { login } from "@/api/auth";
import { firstFetchProfile } from "@/api/retailer";

import { isLoginFormShown, isWelcomeModalShown } from "@/stores/welcomeModal";
import { userData } from "@/stores/profile";
import { isShowTaskMonthly } from "@/stores/taskMonthly";
// import { showNotifIconStore } from "@/stores/notifications";
import {
  setAccessToken,
  setUsername,
  setProfilePicture,
  setshowNotifIcon,
} from "@/utils";
import { fetchNavatar } from "@/utils/navatar/generate";
import {
  setBubbleMessageToLocalStorage,
  triggerBubbleSpeech,
} from "@/utils/bubbleMessage";
import { currentRoom, reloadNavatar } from "./room";

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
  initialValues: {
    countryCode: "+86",
    phoneNumber: "",
    verificationCode: "",
  },
  validationSchema: object().shape({
    countryCode: requiredMobileNumber,
    phoneNumber: requiredMobileNumber,
    verificationCode: requiredString,
  }),
  onSubmit: async (values) => {
    // alert(JSON.stringify(values, null, 2));
    try {
      const payload = {
        countryCode: values.countryCode,
        mobileNumber: values.phoneNumber,
        otp: Number(values.verificationCode),
      };
      const response = await login(payload);
      setAccessToken(response.token);
      setshowNotifIcon("show");

      setUsername(`${response.firstName} ${response.lastName}`.trim());
      setProfilePicture(response.thumbnail || "");

      // toasts.success("Login success");
      // showNotifIconStore.update(()=> true);
      isWelcomeModalShown.update(() => false);
      isLoginFormShown.update(() => false);
      isShowTaskMonthly.update(() => true);
      reloadNavatar.update(() => true);
      const resProfile = await firstFetchProfile(response.token);
      userData.update(() => resProfile);
      setBubbleMessageToLocalStorage(resProfile.id);
      let room = "hall";
      currentRoom.subscribe((val) => (room = val));
      setTimeout(() => {
        triggerBubbleSpeech(room);
        // showNotifIconStore.update(() => true);
      }, 600);
      // openGamePage();
      fetchNavatar()
        .then(() => {
          console.log("Navatar fetched and rendered");
        })
        .catch((error) => {
          // toasts.error("Navatar Error", error.message);
          console.error("Navatar Error", error.message);
        });
    } catch (error) {
      // toasts.error("Login Error", error.message);
      console.error("Login Error", error.message);
    }
  },
});
