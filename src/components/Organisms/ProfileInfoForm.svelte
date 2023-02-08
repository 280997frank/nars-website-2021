<script lang="ts">
  import Dropdown from "@/components/Atoms/Dropdown.svelte";
  import Switch from "@/components/Atoms/Switch.svelte";
  import TextInput from "@/components/Atoms/TextInput.svelte";
  import InputContainer from "@/components/Molecules/InputContainer.svelte";
  import { userData } from "@/stores/profile";
  import {
    errors,
    form as formValue,
    handleChange,
    handleSubmit,
    updateField,
    validateField,
  } from "@/stores/profileInfoForm";
  import range from "lodash/range";
  import { setContext } from "svelte";
  import { _ } from "svelte-i18n";

  formValue.update((values) => {
    if ($userData === null) {
      return values;
    } else {
      const {
        firstName,
        lastName,
        countryCode,
        mobileNumber,
        birthDay,
        gender,
      } = $userData;
      const birthDate = new Date(birthDay);
      return {
        ...values,
        firstName,
        lastName,
        gender,
        year: "" + birthDate.getFullYear(),
        month: "" + (birthDate.getMonth() + 1),
        date: "" + birthDate.getDate(),
        countryCode,
        mobileNumber,
      };
    }
  });

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

  const yearRange = getRange(
    new Date().getUTCFullYear() - 70,
    new Date().getUTCFullYear() - 18
  );
  const monthRange = getRange(1, 12);
  const dateRange = getRange(1, 31);
</script>

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
      marginBottom="1rem"
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
      <TextInput
        name="countryCode"
        id="countryCode"
        placeholder="+86"
        width="3rem"
        className="helvetica-neue-light"
      />
      <TextInput
        name="mobileNumber"
        id="mobileNumber"
        placeholder="{$_('signupForm.phoneNumber')}"
        className="helvetica-neue-light"
      />
    </InputContainer>
  </div>
  <div class="button-container"></div>
</form>

<style lang="scss">
  .inputs-container {
    margin-bottom: 2rem;
  }

  .button-container {
    margin: auto;
  }
</style>
