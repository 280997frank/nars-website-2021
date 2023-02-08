<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  export let marginBottom = "3rem";
  export let marginTop = "0";

  let field: HTMLDivElement;

  const { getErrors } = getContext("form");

  export let label = "";
  export let inputName = "";
  export let isHorizontal = false;

  const errors = getErrors();

  onMount(() => {
    field.style.setProperty("--margin-bottom", marginBottom);
    field.style.setProperty("--margin-top", marginTop);
  });
</script>

<div class="field" class:is-horizontal="{isHorizontal}" bind:this="{field}">
  {#if label}
    <div class="field-label">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">{@html label}</label>
    </div>
  {/if}
  <div class="field-body is-flex is-justify-content-space-between">
    <slot />
  </div>
  {#if $errors[inputName] && $$slots.default}
    <p class="help is-danger is-uppercase">{$_($errors[inputName].key)}</p>
  {/if}
</div>

<style lang="scss">
  @import "../../styles/typography";

  .field {
    &:not(:last-child) {
      margin-bottom: var(--margin-bottom);
      margin-top: var(--margin-top);
    }
  }

  .field-label {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .label {
    @include form-typography;
  }

  .help {
    text-align: start;
  }

  .is-horizontal {
    display: flex;
    justify-content: space-between;
  }
</style>
