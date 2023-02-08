import { updateProfile } from "@/api/retailer";
// import { MESSAGES } from "@/constants/messages";
import {
  optionalName,
  requiredMobileNumber,
  requiredName,
  requiredNumber,
  requiredString,
} from "@/constants/validationSchema";
import type { IProfileInformation } from "@/interfaces/retailer";
import { createForm } from "svelte-forms-lib";
// import { toasts } from "svelte-toasts";
import { object } from "yup";

const initialValues: IProfileInformation = {
  firstName: "",
  lastName: "",
  year: "",
  month: "",
  date: "",
  gender: "female",
  countryCode: "",
  mobileNumber: "",
};

const validationSchema = {
  firstName: requiredName,
  lastName: optionalName,
  year: requiredNumber,
  month: requiredNumber,
  date: requiredNumber,
  gender: requiredString.oneOf(["female", "male", ""]),
  countryCode: requiredMobileNumber,
  mobileNumber: requiredMobileNumber,
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
  updateField,
  validateField,
  handleChange,
  handleSubmit,
} = createForm({
  initialValues,
  validationSchema: object().shape(validationSchema),
  onSubmit: async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        mobileNumber: values.mobileNumber,
        birthday: `${values.year}-${values.month}-${values.date}`,
      };
      await updateProfile(payload);

      // toasts.success(MESSAGES.SUCCESSFULLY_UPDATED);
    } catch (error) {
      // toasts.error("Error", error.message);
      console.error("Error", error.message);
    }
  },
});

export const updateValue = (field, value) => {
  updateField(field, value);
};

export const updateInitialValues = (values: IProfileInformation) => {
  form.update(() => {
    return values;
  });
};
