<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  export let name: string;
  export let label: string;

  const { getErrors, getForm, getValidateField } = getContext("form");
  const validateField = getValidateField();
  const errors = getErrors();
  const form = getForm();

  $: {
    if ($form[name]) {
      validateField(name);
    }
  }
</script>

<div class="field">
  <div class="control">
    <span class="checkbox">
      {@html label}
      <input
        type="checkbox"
        bind:checked="{$form[name]}"
        id="checkbox-{name}"
      />
      <label
        class="checkmark"
        class:is-danger="{$errors[name]}"
        for="checkbox-{name}"></label>
    </span>
  </div>
  {#if $errors[name]}
    <p class="help is-danger is-uppercase">{$_($errors[name].key)}</p>
  {/if}
</div>

<style lang="scss">
  @import "../../styles/typography";

  $outer-box-size: 0.8125rem;
  $inner-box-size: 50%;
  $inner-box-top: -1px;
  $inner-box-left: 4px;

  .checkbox {
    @include typography-2;
    display: flex;
    align-items: flex-start;
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: auto;
    // font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:hover input ~ .checkmark {
      background-color: #ccc;
      cursor: pointer;
    }

    input {
      margin-right: 0.5rem;
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      &:checked ~ .checkmark {
        background-color: grey;
      }

      &:checked ~ .checkmark:after {
        display: block;
      }
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: $outer-box-size;
      width: $outer-box-size;
      background-color: #eee;

      &.is-danger {
        border: 1px solid #e6001e;
      }

      &:after {
        content: "X";
        position: absolute;
        display: none;
        right: 3px;
        top: -2px;
        /* left: $inner-box-left;
        top: $inner-box-top;
        width: $inner-box-size;
        height: calc($inner-box-size * 2);
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg); */
      }
    }
  }
</style>
