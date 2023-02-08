<script lang="ts">
  import type { IAccordionOption } from "@/interfaces/accordion";
  import { replaceEnVersionWithHelvetica } from "@/utils/regexHelper";
  import { AccordionItem } from "svelte-collapsible";

  export let item: IAccordionOption;
  export let key: null | string = null;

  let arrow = "/icons/arrow.png";
</script>

<AccordionItem key="{item.key}">
  <div
    slot="header"
    class="header is-flex-direction-row is-justify-content-space-between is-align-items-center"
  >
    <div
      class="is-gap is-flex is-flex-direction-row is-align-items-center w100"
    >
      {#if item.icon}
        <div class="icon">
          <svelte:component this="{item.icon}" />
        </div>
      {/if}
      <div>
        <h2>{@html replaceEnVersionWithHelvetica(item.title)}</h2>
      </div>
    </div>
    <div class="icon" class:is-active="{key === item.key}">
      <img src="{arrow}" alt="icon" height="15" width="8" />
    </div>
  </div>

  <div slot="body" class="body">
    {@html replaceEnVersionWithHelvetica(item.text)}
  </div>
</AccordionItem>

<style lang="scss">
  @use "../../styles/flexbox" as flex;
  @use "../../styles/typography" as typography;

  :global(.accordion-item) {
    margin: 10px 0;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 0.5em;
    padding-bottom: 8px;
    padding-right: 0;
    .w100 {
      width: 100%;
    }
  }

  .header h2 {
    margin: 0;
    padding: 0;
    font-weight: 300;
    font-size: 16px;
    color: white;
    text-transform: uppercase;
  }

  .icon {
    color: white;
    width: 25px;
    height: 25px;
    transition: transform 0.4s;

    &.is-active {
      transform: rotate(90deg);
    }
  }

  .is-gap {
    @include flex.zod-gap;
  }

  .body {
    padding: 0.5em 2em 0 0.5em;
    text-align: justify;
    color: white !important;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 350;
  }
</style>
