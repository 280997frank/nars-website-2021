<script lang="ts">
  import type { IAccordionOption } from "@/interfaces/accordion";
  import { Accordion } from "svelte-collapsible";
  import AccordionItem from "./AccordionItem.svelte";

  export let data: IAccordionOption[] = [];

  let key: null | string = null;
</script>

<Accordion bind:key>
  {#each data as item (item.key)}
    <AccordionItem key="{key}" item="{item}" />
  {/each}
</Accordion>

<style lang="scss">
  :global(.accordion) {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    max-width: 450px;
    margin: 0 auto;
  }
</style>
