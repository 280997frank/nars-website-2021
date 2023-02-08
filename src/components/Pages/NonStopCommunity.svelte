<script lang="ts">
  import { link } from "svelte-routing";
  import { navigate } from "svelte-routing";
  import Layout from "@/components/Templates/Layout.svelte";

  import { retailerName as retailerNameStore } from "@/stores/retailer";

  export let retailerName: string;

  $retailerNameStore = retailerName;
</script>

<Layout isOverflowable="{true}" isPrivate="{true}">
  <a class="button is-primary" href="/posts" use:link>page 1</a>
  <a
    class="button is-primary"
    href="/posts?type=by-the-community&postId=d65f877b-65b0-4974-9ea9-5dc6983eea8d"
    use:link
  >
    page community
  </a>
  <button
    class="button is-primary"
    on:click="{() =>
      navigate(
        `/${retailerName}/posts?type=by-nars&postId=35f15068-5f31-4b8c-8e9c-4be5c138d2a8`
      )}"
  >
    page nars
  </button>
</Layout>

<style lang="scss">
</style>
