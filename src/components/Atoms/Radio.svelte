<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import type { OptionData } from "@/interfaces/form";

  export let name: string;
  export let data: OptionData[];

  const { getUpdateField, getValidateField, getErrors } = getContext("form");
  const updateField = getUpdateField();
  const validateField = getValidateField();
  const errors = getErrors();

  function onChange(this: HTMLInputElement) {
    updateField(name, this.value);
    validateField(name);
  }
</script>

<div class="field">
  <div class="control is-flex">
    {#each data as datum (datum.value)}
      <label class="radio">
        {datum.label}
        <input
          type="radio"
          name="{name}"
          value="{datum.value}"
          on:change="{onChange}"
        />
        <span class="checkmark" class:is-danger="{$errors[name]}"></span>
      </label>
    {/each}
  </div>
  {#if $errors[name]}
    <p class="help is-danger is-uppercase">{$_($errors[name].key)}</p>
  {/if}
</div>

<style lang="scss">
  @import "../../styles/typography";

  $outer-circle-size: 0.8125rem;
  $inner-circle-size: 50%;
  $inner-circle-top: 50%;
  $inner-circle-left: 50%;

  /* $outer-circle-size: 13px;
  $inner-circle-size: 5px;
  $inner-circle-top: 6px;
  $inner-circle-left: 6px; */

  /////////////////////
  /* Customize the label (the container) */
  .radio {
    @include typography-2;
    display: block;
    position: relative;
    padding-left: 1.1rem;
    margin-bottom: 12px;
    // cursor: pointer;
    // font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    & + .radio {
      margin-left: 1.25rem;
    }

    /* On mouse-over, add a grey background color */
    &:hover input ~ .checkmark {
      background-color: #ccc;
    }

    /* Hide the browser's default radio button */
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      /* When the radio button is checked, add a blue background */
      &:checked ~ .checkmark {
        background-color: grey;
      }

      /* Show the indicator (dot/circle) when checked */
      &:checked ~ .checkmark:after {
        display: block;
      }
    }

    /* Create a custom radio button */
    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: $outer-circle-size;
      width: $outer-circle-size;
      background-color: transparent;
      border: 1px solid white;

      &.is-danger {
        border: 1px solid #e6001e;
      }

      /* Create the indicator (the dot/circle - hidden when not checked) */
      &:after {
        content: "X";
        position: absolute;
        display: none;
        right: 2px;
        top: -3px;

        /* Style the indicator (dot/circle) */
        /* top: $inner-circle-top;
        left: $inner-circle-left;
        width: $inner-circle-size;
        height: $inner-circle-size;
        border-radius: 0;
        background: white;
        transform: translate(-50%, -50%); */
      }
    }
  }
</style>
