<script lang="ts">
  import type { PostModule, PostModuleAsset } from "@/api/post";
  type SortableItem = PostModuleAsset | PostModule;

  export let postModuleAssets: PostModuleAsset[];

  function sortItem(a: SortableItem, b: SortableItem) {
    if (a.index < b.index) {
      return -1;
    }

    if (a.index > b.index) {
      return 1;
    }

    return 0;
  }
  function sizeColumn(size: number) {
    if (size === 1) {
      return "is-full";
    }
    if (size === 2) {
      return "is-6";
    }
    if (size === 3) {
      return "is-4";
    }
    if (size === 4) {
      return "is-6";
    }
    if (size >= 5) {
      return "is-full";
    }

    return "is-3";
  }
</script>

<div class="columns is-multiline is-mobile">
  {#each postModuleAssets.sort(sortItem) as postModuleAsset (postModuleAsset.id)}
    <div class="column {sizeColumn(postModuleAssets.length)}">
      <figure class="image is-1by1">
        <img src="{postModuleAsset.url}" alt="" loading="lazy" />
      </figure>
    </div>
  {/each}
</div>

<style lang="scss">
  .content-grid {
    padding: 10px;
  }

  .image {
    position: relative;
    width: 100%;

    img {
      width: 100%;
      object-fit: cover !important;
      // height: 100px;
    }
  }

  .columns {
    padding: 10px !important;
  }
  .column {
    padding: 0.2rem !important;
  }
</style>
