<script lang="ts">
  import type { OptionData } from "@/interfaces/form";
  import { nanoid } from "nanoid/non-secure";
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  export let data: OptionData[];
  export let name: string;
  export let placeholder: string;
  export let maxWidth = "calc(33% - 0.75rem)";
  export let dropdownMenuWidth = "100%";
  export let dropdownItemPaddingRight = "3rem";

  let isDropdownOpen = false;
  let isParentContainerOverflowed: boolean;

  const id = nanoid();
  const { getUpdateField, getValidateField, getForm, getErrors } =
    getContext("form");
  const updateField = getUpdateField();
  const validateField = getValidateField();
  const errors = getErrors();
  const form = getForm();

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function isOverflowed(element: HTMLElement) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }

  function onChange(this: HTMLButtonElement) {
    updateField(name, this.dataset.value);
    isDropdownOpen = false;
    validateField(name);
  }

  $: {
    if (isDropdownOpen) {
      const parentContainer = document.getElementById("parent-container");

      setTimeout(() => {
        isParentContainerOverflowed = isOverflowed(parentContainer);
      });
    } else {
      isParentContainerOverflowed = false;
    }
  }
</script>

<div class="field" style="{`max-width: ${maxWidth}`}">
  <div class="control">
    <!-- <div class="select">
      <select>
        <option>Select dropdown</option>
        <option>With options</option>
      </select>
    </div> -->
    <div class="dropdown" class:is-active="{isDropdownOpen}">
      <div class="dropdown-trigger">
        <button
          type="button"
          class="button dropdown"
          class:is-danger="{$errors[name]}"
          aria-haspopup="true"
          aria-controls="dropdown-menu-{id}"
          on:click="{toggleDropdown}"
        >
          <span class="helvetica-neue">
            {data.find((datum) => datum.value === $form[name])?.label ??
              placeholder}
          </span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div
        class="dropdown-menu"
        class:is-overflowing="{isParentContainerOverflowed}"
        id="dropdown-menu-{id}"
        role="menu"
        style="{`width: ${dropdownMenuWidth}`}"
      >
        <div class="dropdown-content">
          {#each data as datum (datum.value)}
            <button
              type="button"
              class="dropdown-item helvetica-neue"
              class:is-active="{$form[name] === datum.value}"
              data-value="{datum.value}"
              style="{`padding-right: ${dropdownItemPaddingRight}`}"
              on:click="{onChange}"
            >
              {datum.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
  {#if $errors[name]}
    <p class="help is-danger is-uppercase">{$_($errors[name].key)}</p>
  {/if}
</div>

<style lang="scss">
  .button.dropdown {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid white;
    border-radius: 0;
    width: 100%;
    font-weight: 300;

    span:first-child {
      width: 100%;
      overflow: clip;
      color: white;
      text-align: start;
    }
  }

  .dropdown-item {
    cursor: pointer;
    background-color: black;
    color: white;
    border: none;
    white-space: break-spaces;
    text-align: left;

    &:hover {
      color: black;
      background-color: white;
    }

    &.is-active {
      color: black;
      background-color: grey;
    }
  }

  .field {
    // max-width: calc(33% - 0.75rem);
    width: 100%;

    .dropdown-menu {
      max-height: 30vh;
      overflow-y: auto;
      background-color: black;

      &.is-overflowing {
        right: auto;
        left: 0;
      }
    }

    &:last-of-type {
      max-width: 33%;

      .dropdown-menu {
        &.is-overflowing {
          // right: 0;
          left: auto;
        }
      }
    }
  }

  .dropdown,
  .dropdown-trigger {
    width: 100%;
  }

  .dropdown-menu {
    min-width: unset;
    width: 100%;
  }

  .dropdown-content {
    background-color: black;
    // width: 62%;
  }

  /* .select {
    &:not(.is-multiple):not(.is-loading)::after {
      border-color: white;
    }
  }

  select {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid white;
    border-radius: 0;
  } */
</style>
