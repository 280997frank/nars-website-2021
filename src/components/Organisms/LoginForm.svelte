<script lang="ts">
  import { getVerificationCode } from "@/api/auth";
  import Button from "@/components/Atoms/Button.svelte";
  import Dropdown from "@/components/Atoms/Dropdown.svelte";
  import TextInput from "@/components/Atoms/TextInput.svelte";
  import InputContainer from "@/components/Molecules/InputContainer.svelte";
  import { properCountryCodeList } from "@/constants/countryCodeList";
  import {
    errors,
    form as formValue,
    handleChange,
    handleSubmit,
    isSubmitting,
    updateField,
    validateField,
  } from "@/stores/loginForm";
  // import { toasts } from "svelte-toasts";
  import { useMutation } from "@sveltestack/svelte-query";
  import { setContext } from "svelte";
  import { _ } from "svelte-i18n";

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

  const mutationVerificationCode = useMutation(getVerificationCode, {
    onSuccess() {
      console.log("Verification code sent");
    },
    onError(error: Error) {
      console.error("Verification Code Error", error.message);
    },
  });
</script>

<h1 class="title">{$_("loginForm.title")}</h1>
<p>
  {@html $_("loginForm.body")}
</p>
<form on:submit="{handleSubmit}">
  <div class="inputs-container">
    <InputContainer>
      <Dropdown
        name="countryCode"
        data="{properCountryCodeList}"
        placeholder="+86"
        maxWidth="5rem"
        dropdownMenuWidth="5rem"
        dropdownItemPaddingRight="0"
      />
      <!-- <TextInput
        name="countryCode"
        id="countryCode"
        placeholder="+86"
        width="3rem"
      /> -->
      <TextInput
        name="phoneNumber"
        id="phoneNumber"
        type="tel"
        placeholder="{$_('loginForm.phoneNumber')}"
        className="helvetica-neue-light"
      />
    </InputContainer>
    <InputContainer inputName="verificationCode">
      <TextInput
        name="verificationCode"
        id="verificationCode"
        placeholder="{$_('loginForm.verificationCode')}"
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
          className="font-weigt-400"
          isLoading="{$mutationVerificationCode.isLoading}"
          disabled="{!$formValue.phoneNumber ||
            !$formValue.countryCode ||
            countdown !== 0}"
        >
          {countdown === 0 ? $_("loginForm.sendCode") : `${countdown} sec`}
        </Button>
      </TextInput>
    </InputContainer>
  </div>
  <div class="button-container">
    <Button
      type="submit"
      isLoading="{$isSubmitting}"
      className="is-elveticaNeue-lt-std">{$_("loginForm.login")}</Button
    >
  </div>
</form>

<style lang="scss">
  @import "../../styles/typography";

  .title {
    @include typography;
    font-size: 40px;
    line-height: 48px;
    // font-family: "Helvetica Neue LT Std", sans-serif;
  }

  p {
    @include paragraph;
    margin-bottom: 2rem;
    // font-family: "Helvetica Neue LT Std", sans-serif;
  }

  .inputs-container {
    margin-bottom: 2rem;
  }

  .button-container {
    width: calc(100% - 3rem);
    margin: auto;
  }
</style>
