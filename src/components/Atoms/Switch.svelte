<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import type { OptionData } from "@/interfaces/form";

  export let name: string;
  export let data: OptionData[];

  const { getUpdateField, getErrors, getForm } = getContext("form");
  const updateField = getUpdateField();
  const errors = getErrors();
  const form = getForm();

  function onClick(this: HTMLButtonElement) {
    updateField(name, this.dataset.value);
  }
</script>

<div class="field">
  <div class="control">
    <div class="buttons has-addons">
      {#each data as datum (datum.value)}
        <button
          class="button"
          type="button"
          class:is-selected="{$form[name] === datum.value}"
          data-value="{datum.value}"
          on:click="{onClick}"
        >
          {datum.label}
        </button>
      {/each}
    </div>
  </div>
  {#if $errors[name]}
    <p class="help is-danger is-uppercase">{$_($errors[name].key)}</p>
  {/if}
</div>

<style lang="scss">
  @import "../../styles/typography";

  .buttons {
    justify-content: flex-end;
  }

  .button {
    @include typography-2;
    border-radius: 0;
    color: white;
    background-color: black;
    border: 1px solid white;
    width: 5rem;
    margin: 5px;

    &.is-selected {
      color: black;
      background-color: white;
    }
  }
</style>
