<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  export let threshold = 0;
  export let horizontal = false;
  export let elementScroll = null;
  export let hasMore = true;

  const dispatch = createEventDispatcher();
  let isLoadMore = false;
  let component: HTMLDivElement;

  const onScroll = (e: { target: EventTarget & HTMLDivElement }) => {
    const offset = horizontal
      ? e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft
      : e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop;

    if (offset <= threshold) {
      if (!isLoadMore && hasMore) {
        dispatch("loadMore");
      }
      isLoadMore = true;
    } else {
      isLoadMore = false;
    }
  };

  onMount(() => {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;

      element.addEventListener("scroll", onScroll, false);
      element.addEventListener("resize", onScroll, false);

      return () => {
        element.removeEventListener("scroll", onScroll, false);
        element.removeEventListener("resize", onScroll, false);
      };
    }
  });
</script>

<div bind:this="{component}" style="width:0px"></div>
{#if isLoadMore && hasMore}
  <p>{$_("nwallet.loading")}</p>
{/if}

<style lang="scss">
  p {
    text-align: center;
  }
</style>
