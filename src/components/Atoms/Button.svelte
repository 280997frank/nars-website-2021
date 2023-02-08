<script lang="ts">
  // export let onClick: (e: MouseEvent) => void;
  export let onClick = () => undefined;
  export let className = "";
  export let isAddon = false;
  export let type = "button";
  export let isLoading = false;
  export let disabled = false;

  const usedClassName = `button ${className}`;
</script>

<button
  class="{usedClassName}"
  class:is-addon="{isAddon}"
  class:is-loading="{isLoading}"
  on:click="{onClick}"
  type="{type}"
  disabled="{disabled}"
>
  <slot />
</button>

<style lang="scss">
  @import "../../styles/typography";

  .button {
    @include typography;
    letter-spacing: 1.5px;
    // &.is-elveticaNeue-lt-std{
    //   font-family: "Helvetica Neue LT Std", sans-serif;
    // }
    &:hover {
      background-color: transparent !important;
      color: white;
      border-color: white;
    }

    &.font-weigt-400 {
      font-weight: 400;
    }

    &:focus {
      background-color: transparent !important;
      color: white !important;
      border-color: white;
    }

    &:not(.is-text) {
      background-color: transparent;
      border-radius: 0;
      width: 100%;
    }

    &.is-addon {
      background-color: #9f9f9f;
      border: none;
      font-size: 0.625rem;
      line-height: 0.75rem;
    }
  }
</style>
