<script lang="ts">
  import { fetchHelpList } from "@/api/help";
  import type { IAccordionOption } from "@/interfaces/accordion";
  import type { IHelpListResponse } from "@/interfaces/help";
  import { onMount } from "svelte";
  import { Accordion } from "svelte-collapsible";
  import AccordionItem from "../Atoms/AccordionItem.svelte";
  import InfiniteScroll from "../Atoms/InfiniteScroll.svelte";
  import Spinner from "../Atoms/Spinner.svelte";

  let data: IAccordionOption[] = [];
  let loading = false;
  let page = 1;
  let newBatch = [];
  let elementScroll: number;
  let key: null | string = null;

  async function fetchData() {
    const response = await fetchHelpList(page);
    if (response.data.length > 0) {
      newBatch = response.data.map((item: IHelpListResponse) => {
        return {
          key: item.id,
          title: item.question,
          text: item.answer,
        };
      });
    } else {
      newBatch = response.data;
    }
  }

  onMount(async () => {
    loading = true;
    await fetchData();
    loading = false;
  });

  $: data = [...data, ...newBatch];
</script>

{#if data.length > 0}
  <Accordion bind:key>
    {#each data as item (item.key)}
      <AccordionItem key="{key}" item="{item}" />
    {/each}
    <InfiniteScroll
      elementScroll="{elementScroll}"
      hasMore="{newBatch.length > 0}"
      threshold="{100}"
      on:loadMore="{() => {
        page++;
        fetchData();
      }}"
    />
  </Accordion>
{:else if loading}
  <div class="spinner">
    <Spinner />
  </div>
{:else}
  <p>No data</p>
{/if}
<svelte:window bind:scrollY="{elementScroll}" />

<style lang="scss">
  :global(.accordion) {
    width: 100%;
    height: 100%;
    overflow: hidden auto;
    max-width: 450px;
    margin: 0 auto;
  }
  .spinner {
    position: absolute;
    left: 50%;
    top: 45%;
  }
</style>
