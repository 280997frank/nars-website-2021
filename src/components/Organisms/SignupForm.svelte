<script lang="ts">
  import { getVerificationCode } from "@/api/auth";
  import Button from "@/components/Atoms/Button.svelte";
  import Checkbox from "@/components/Atoms/Checkbox.svelte";
  import Dropdown from "@/components/Atoms/Dropdown.svelte";
  import Radio from "@/components/Atoms/Radio.svelte";
  import Switch from "@/components/Atoms/Switch.svelte";
  import TextInput from "@/components/Atoms/TextInput.svelte";
  import InputContainer from "@/components/Molecules/InputContainer.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import { properCountryCodeList } from "@/constants/countryCodeList";
  import { retailerName } from "@/stores/retailer";
  import {
    errors,
    form as formValue,
    handleChange,
    handleSubmit,
    isSubmitting,
    updateField,
    validateField,
  } from "@/stores/signupForm";
  import { useMutation } from "@sveltestack/svelte-query";
  import range from "lodash/range";
  import { setContext } from "svelte";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";

  export let toggleWelcomeModal: () => void;

  export let countdown = 0;
  let timer = null;

  $: {
    if (countdown === 0) {
      clearInterval(timer);
      timer = null;
    }
  }

  setContext("form", {
    getHandleChange: () => handleChange,
    getUpdateField: () => updateField,
    getValidateField: () => validateField,
    getForm: () => formValue,
    getErrors: () => errors,
  });

  function getRange(min: number, max: number) {
    const timeRange = range(min, max + 1);
    return timeRange.map((time) => ({
      label: `${time}`.padStart(2, "0"),
      value: `${time}`,
    }));
  }

  const mutationVerificationCode = useMutation(getVerificationCode, {
    onSuccess() {
      // console.log("Verification code sent");
    },
    onError(error: Error) {
      // console.log("Verification Code Error", error.message);
      console.error("Verification Code Error", error.message);
    },
  });

  const yearRange = getRange(
    new Date().getUTCFullYear() - 70,
    new Date().getUTCFullYear() - 18
  );
  const monthRange = getRange(1, 12);
  const dateRange = getRange(1, 31);

  /* $: {
    const existingErrors = Object.entries($errors).filter(([, val]) => val);

    if (existingErrors.length) {
      const obj = {};
      existingErrors.forEach(([key, val]) => {
        obj[key] = val;
      });
      alert(JSON.stringify(obj, null, 2));
    }

  } */
</script>

<Navbar onBackButtonClick="{toggleWelcomeModal}" />
<h1 class="title">{@html $_("signupForm.title")}</h1>
<form on:submit="{handleSubmit}">
  <div class="inputs-container">
    <InputContainer label="{$_('signupForm.name')}" marginBottom="1.5rem">
      <TextInput
        name="firstName"
        id="firstName"
        placeholder="{$_('signupForm.firstName')}"
        className="helvetica-neue-light"
      />
      <TextInput
        name="lastName"
        id="lastName"
        placeholder="{$_('signupForm.lastName')}"
        className="helvetica-neue-light"
      />
    </InputContainer>
    <InputContainer label="{$_('signupForm.birthday')}" marginBottom="1.5rem">
      <Dropdown name="year" data="{yearRange}" placeholder="YYYY" />
      <Dropdown name="month" data="{monthRange}" placeholder="MM" />
      <Dropdown name="date" data="{dateRange}" placeholder="DD" />
    </InputContainer>
    <InputContainer
      label="{$_('signupForm.gender')}"
      marginBottom="2rem"
      isHorizontal
    >
      <Switch
        name="gender"
        data="{[
          { label: $_('signupForm.female'), value: 'female' },
          { label: $_('signupForm.male'), value: 'male' },
        ]}"
      />
    </InputContainer>
    <InputContainer>
      <Dropdown
        name="countryCode"
        data="{properCountryCodeList}"
        placeholder="+86"
        maxWidth="5rem"
        dropdownMenuWidth="5rem"
        dropdownItemPaddingRight="0"
      />
      <TextInput
        name="phoneNumber"
        id="phoneNumber"
        placeholder="{$_('signupForm.phoneNumber')}"
        type="tel"
        className="helvetica-neue-light"
      />
    </InputContainer>
    <InputContainer marginBottom="2rem" inputName="verificationCode">
      <TextInput
        name="verificationCode"
        id="verificationCode"
        placeholder="{$_('signupForm.verificationCode')}"
        type="tel"
        className="helvetica-neue-light"
      >
        <Button
          onClick="{() => {
            countdown = 60;
            timer = setInterval(() => {
              countdown -= 1;
            }, 1000);
            $mutationVerificationCode.mutate({
              countryCode: $formValue.countryCode,
              mobileNumber: $formValue.phoneNumber,
            });
          }}"
          isAddon="{true}"
          slot="rightAddon"
          isLoading="{$mutationVerificationCode.isLoading}"
          disabled="{!$formValue.phoneNumber ||
            !$formValue.countryCode ||
            countdown !== 0}"
        >
          {countdown === 0 ? $_("signupForm.sendCode") : `${countdown} sec`}
        </Button>
      </TextInput>
    </InputContainer>
    <InputContainer
      marginBottom="1rem"
      label="{$_('signupForm.experienceWithNARS')}"
    >
      <Radio
        name="experience"
        data="{[
          { label: $_('signupForm.using'), value: 'using' },
          { label: $_('signupForm.tryItBefore'), value: 'tried-it' },
          { label: $_('signupForm.never'), value: 'never' },
        ]}"
      />
    </InputContainer>
    <InputContainer marginBottom="0">
      <Checkbox
        name="isAgree"
        label="{$_('signupForm.disclaimer', {
          values: { retailerName: $retailerName },
        })}"
      />
    </InputContainer>
    <InputContainer>
      <Checkbox
        name="marketingConsent"
        label="{$_('signupForm.marketingConsent')}"
      />
    </InputContainer>
  </div>
  <div class="button-container">
    <Button
      type="submit"
      isLoading="{$isSubmitting}"
      disabled="{!$formValue.isAgree}"
    >
      {$_("signupForm.createAccount")}
    </Button>
  </div>
</form>

<style lang="scss">
  @import "../../styles/typography";

  .title {
    @include typography;
    font-size: 1.875rem;
    line-height: 2.25rem;
    margin-top: 1rem;
    text-align: start;
  }

  .inputs-container {
    margin-bottom: 2rem;
  }

  .button-container {
    width: calc(100% - 3rem);
    margin: auto;
  }
</style>
