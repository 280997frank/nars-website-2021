import { requiredOnlyOneString } from "@/constants/validationSchema";
import { createForm } from "svelte-forms-lib";
import { object } from "yup";
import { writable, get } from "svelte/store";
// import { toasts } from "svelte-toasts";

import { verifyCoupon } from "@/api/wallet";
import { sendAnalytics } from "@/api/analytics";

import { couponAnalyticsId as couponAnalyticsIdStore } from "@/stores/analytics";

import { AnalyticsType } from "@/interfaces/analytics";

export const submitData = writable(null);
export const idCoupon = writable(null);
export const isSuccessVerification = writable(false);
export const errorMessage = writable(null);

const initialValues = {
  input1: "",
  input2: "",
  input3: "",
  input4: "",
  input5: "",
  input6: "",
};

const validationSchema = {
  input1: requiredOnlyOneString,
  input2: requiredOnlyOneString,
  input3: requiredOnlyOneString,
  input4: requiredOnlyOneString,
  input5: requiredOnlyOneString,
  input6: requiredOnlyOneString,
};

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
  handleReset,
} = createForm({
  initialValues,
  validationSchema: object().shape(validationSchema),
  onSubmit: async (values) => {
    try {
      const data = [
        values.input1,
        values.input2,
        values.input3,
        values.input4,
        values.input5,
        values.input6,
      ];
      const stringData = data.join("");
      const id = get(idCoupon);

      const payload = {
        couponId: id,
        verificationCode: stringData,
      };

      const response = await verifyCoupon(payload);

      try {
        const couponAnalyticsId = get(couponAnalyticsIdStore);
        await sendAnalytics({
          type: AnalyticsType.COUPON_USE,
          entryType: "end",
          id: couponAnalyticsId,
        });
      } catch (error) {
        console.error(error);
      }

      if (response.success) {
        // toasts.success("Verification Success");
        isSuccessVerification.update(() => true);
      }
    } catch (error) {
      errorMessage.update(() => error.message);
    }
  },
});
