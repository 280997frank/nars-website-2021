<script lang="ts">
  import Coupon from "@/components/Atoms/Coupon.svelte";

  import TextInput from "@/components/Atoms/TextInputCode.svelte";
  import InputContainer from "@/components/Molecules/InputContainer.svelte";
  import {
    errorMessage,
    errors,
    form as formValue,
    handleChange,
    handleReset,
    handleSubmit,
    idCoupon,
    isSuccessVerification,
    updateField,
    isSubmitting,
  } from "@/stores/wallet";
  import { onMount, setContext } from "svelte";
  import { _ } from "svelte-i18n";
  // import { toasts } from "svelte-toasts";
  import IoIosClose from "svelte-icons/io/IoIosClose.svelte";

  export let setPageType: (arg0: string) => string;
  export let setRedemData: (arg0: object) => object;
  export let data;
  // let close = "/icons/close.png";

  let id: string;

  setContext("form", {
    getHandleChange: () => handleChange,
    getUpdateField: () => updateField,
    getForm: () => formValue,
    getErrors: () => errors,
  });

  $: if ($isSuccessVerification) {
    setPageType("detail");
  } else if ($errorMessage) {
    console.log("Error Verification", $errorMessage);
  }

  onMount(() => {
    for (let i = 1; i < 6; i++) {
      document
        .getElementById(`input${i}`)
        .addEventListener("input", function (event) {
          const target = event.target as HTMLTextAreaElement;
          if (target.value.length === 1) {
            document.getElementById(`input${i + 1}`).focus();
          }
        });
    }

    document
      .getElementById(`input6`)
      .addEventListener("input", function (event) {
        const target = event.target as HTMLTextAreaElement;
        if (target.value.length === 1) {
          document.getElementById(`btn-submit`).focus();
          document.getElementById(`btn-submit`).click();
        }
      });

    if (data) {
      const arrayData = data.id.split("-");
      id = arrayData[0];
      idCoupon.update(() => data.id);
    }
  });

  const exitPage = () => {
    setRedemData({});
    setPageType("detail");
    handleReset();
  };
</script>

<div class="content-container">
  <div class="header">
    <!-- <img src="{close}" alt="close icon" height="20" width="20" /> -->
    <button on:click="{exitPage}" class="btn-close">
      <span class="icon">
        <IoIosClose />
      </span>
    </button>
  </div>
  <div class="content">
    <div class="content-title">
      <h5 class="has-text-centered">{$_("nwallet.orderNumber")} : {id}</h5>
      <Coupon
        coin="{data.price}"
        date="{data.expiryDate}"
        name="{data.name}"
        thumbnail="{data.image || ''}"
      />
      <form on:submit="{handleSubmit}">
        <InputContainer marginBottom="{`1rem`}">
          <TextInput name="input1" id="input1" maxlength="{1}" />
          <TextInput name="input2" id="input2" maxlength="{1}" />
          <TextInput name="input3" id="input3" maxlength="{1}" />
          <TextInput name="input4" id="input4" maxlength="{1}" />
          <TextInput name="input5" id="input5" maxlength="{1}" />
          <TextInput name="input6" id="input6" maxlength="{1}" />
        </InputContainer>
        <div class="text-container">
          <p>
            {@html $_("nwallet.verificationDescription")}
          </p>
        </div>
        <button
          class="btn-confirm button"
          class:is-loading="{$isSubmitting}"
          type="submit"
          id="btn-submit"
        >
          {$_("nwallet.use2")}
        </button>
      </form>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../styles/typography";
  .content-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .header {
    // width: 100%;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    color: #fff;
    font-weight: 500;
    width: 86%;
  }
  .content {
    box-sizing: border-box;
    padding: 1rem 3rem 1rem 3rem;
    background-color: #fff;
    color: #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 86%;

    .content-title {
      .has-text-centered {
        font-weight: 250;
      }
    }
  }

  .btn-confirm {
    background-color: #000;
    font-size: 1rem;
    color: #fff;
    width: 230px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    cursor: pointer;
  }
  form {
    color: #000;
    padding-bottom: 10px;
  }
  .text-container {
    width: 80%;
    margin: auto;
    font-size: 11px;
    margin-bottom: 1rem;
    p {
      text-align: center;
      font-weight: 250;
    }
  }

  .btn-close {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    margin-right: -8px;
    color: white;

    .icon {
      width: 40px;
      height: 40px;
    }
  }
</style>
