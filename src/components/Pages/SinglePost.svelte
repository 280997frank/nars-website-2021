<script lang="ts">
  import { onMount } from "svelte";
  import { useMutation } from "@sveltestack/svelte-query";
  import { _ } from "svelte-i18n";

  import Post from "@/components/Molecules/Post.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import Spinner from "@/components/Atoms/Spinner.svelte";

  import { retailerName as retailerNameStore } from "@/stores/retailer";

  import { goToRoom, getAccessToken } from "@/utils";

  import { getPostById } from "@/api/post";

  export let retailerName: string;
  export let postId: string;

  $retailerNameStore = retailerName;

  const mutationPostById = useMutation(getPostById, {
    onError(error: Error) {
      console.error("Post by ID Error", error.message);
      goToRoom();
    },
  });

  onMount(() => {
    $mutationPostById.mutateAsync(postId);
  });
</script>

<Layout isFlex>
  {#if getAccessToken()}
    <Navbar
      onBackButtonClick="{() => goToRoom('community')}"
      backTitle="{$_('backButton.nonstopCommunity')}"
    />
  {:else}
    <Navbar onBackButtonClick="{() => goToRoom()}" />
  {/if}

  <div class="column content-posts is-gapless card" id="contentPosts">
    <div
      id="parent-container-community"
      class="content-post content-posts-container is-block"
    >
      <div class="by-community-content">
        {#if $mutationPostById.isLoading}
          <div class="spinner">
            <Spinner />
          </div>
        {/if}
        {#if $mutationPostById.isSuccess}
          <Post data="{$mutationPostById.data.data}" idList="{[postId]}" />
        {/if}
      </div>
    </div>
  </div>
</Layout>

<style lang="scss">
  $scrollbar-thumb: rgba(0, 0, 0, 0.5);
  $scrollbar-track: transparent;

  .spinner {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content-posts {
    padding: 0;
    background-color: rgba(0, 0, 0, 0.9);
    height: -webkit-fill-available;
    flex: 1;
    overflow-y: auto;
    // height: auto !important;
    // overflow-y: hidden !important;
  }

  .by-community-content {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    height: -webkit-fill-available;
    width: 100%;
  }

  .content-posts-container {
    overflow-y: auto;
    // height: calc(100vh - 97px) !important;
    scrollbar-width: thin;
    scrollbar-color: $scrollbar-thumb $scrollbar-track;
    scrollbar-gutter: stable;
    &::-webkit-scrollbar-thumb {
      background-color: $scrollbar-thumb;
    }

    &::-webkit-scrollbar-track {
      background-color: $scrollbar-track;
    }

    &::-webkit-scrollbar {
      background-color: white;
    }
  }

  .content-post {
    display: none;
    overflow-y: auto;
    // height: auto;
    width: 100%;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    overflow-x: hidden;
    margin-bottom: 1rem !important;
  }

  .content-post.is-block {
    display: block;
  }
</style>
