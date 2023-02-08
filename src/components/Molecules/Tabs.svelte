<script lang="ts">
  import { onMount } from "svelte";

  import type { OptionData } from "@/interfaces/form";

  export let items: OptionData<number>[] = [];
  export let activeTabValue: number;
  export let flex: string;

  onMount(() => {
    // Set default tab value
    if (Array.isArray(items) && items.length && items[0].value) {
      activeTabValue = items[0].value;
    }
  });

  const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul style="flex: {flex}">
  {#if Array.isArray(items)}
    {#each items as item (item.value)}
      <li class="{activeTabValue === item.value ? 'active' : ''}">
        <span on:click="{handleClick(item.value)}">{item.label}</span>
      </li>
    {/each}
  {/if}
</ul>

<style lang="scss">
  ul {
    display: flex;
    @media screen and (min-width: 1024px) {
      justify-content: space-evenly;
    }
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    background-color: #242424;
    // overflow-y: auto;
    white-space: nowrap;
  }

  span {
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  li.active > span {
    color: white;
    // font-size: 1.2rem;
  }
</style>
