<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  export let name: string;
  export let id: string;
  export let type = "text";
  export let label = "";
  export let placeholder = "";
  export let width = "";
  export let className = "";

  function typeAction(node: { type: string }) {
    node.type = type;
  }

  const { getHandleChange, getErrors, getForm } = getContext("form");
  const handleChange = getHandleChange();
  const errors = getErrors();
  const form = getForm();
  const formValue = $form ?? {};
</script>

<div
  class="field"
  class:is-flex-0="{width}"
  class:has-addons="{$$slots.rightAddon}"
>
  {#if label}
    <label class="label" for="{id}">{label}</label>
  {/if}
  <div class="control is-full-height" class:is-expanded="{$$slots.rightAddon}">
    <!-- class:is-full-height="{$$slots.rightAddon}" -->
    <input
      class="input {className}"
      class:is-danger="{$errors[name]}"
      name="{name}"
      id="{id}"
      placeholder="{placeholder}"
      style="width: {width}"
      on:change="{handleChange}"
      use:typeAction
      bind:value="{formValue[name]}"
    />
    <!-- value="{$form[name]}" -->
  </div>
  {#if $$slots.rightAddon}
    <div class="control is-padded" class:is-danger="{$errors[name]}">
      <slot name="rightAddon" />
    </div>
  {/if}
  {#if $errors[name] && !$$slots.rightAddon}
    <p class="help is-danger is-uppercase">{$_($errors[name].key)}</p>
  {/if}
</div>

<style lang="scss">
  @import "../../styles/typography";

  .field {
    flex: 1;

    &:not(:last-child) {
      margin-right: 0.75rem;
    }
  }

  .label {
    @include form-typography;
  }

  .control.is-full-height {
    // height: 100%;
    height: 2.5rem;

    .input {
      height: inherit;
    }
  }

  .input {
    border: none;
    border-bottom: 1px solid white;
    border-radius: 0;
    background-color: transparent;
    padding-left: 0;
    @include form-typography;

    &::placeholder {
      @include form-typography;
    }

    &:hover {
      border-color: white;
    }

    &:focus {
      border-color: white;
      box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.25);
    }

    /* &.is-full-height {
      height: 100%;
    } */

    &.is-danger {
      border-color: #f14668 !important;
    }
  }

  .help {
    text-align: start;
  }

  .is-flex-0 {
    flex-grow: 0 !important;
  }

  .control.is-padded {
    padding: 0.3rem 0;
    border-bottom: 1px solid white;
    &.is-danger {
      border-color: #f14668 !important;
    }
  }
</style>
