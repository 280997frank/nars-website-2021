<script lang="ts">
  import queryString from "query-string";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  // import { navigate } from "svelte-routing";

  import ByCommunity from "@/components/Organisms/ByCommunityTab.svelte";
  import ByNarsTab from "@/components/Organisms/ByNarsTab.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  // import {dataDummy} from "@/constants/posts"
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import NextPostButton from "@/components/Atoms/NextPostButton.svelte";

  // import { currentRoom } from "@/stores/room";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  // import { isWelcomeModalShown } from "@/stores/welcomeModal";

  import { goToRoom, getAccessToken } from "@/utils";
  import { currentRoom } from "@/stores/room";

  interface TParsedQueryString {
    postId?: string;
    type?: string;
  }

  type PostType = "by-the-community" | "by-nars";

  export let retailerName: string;

  $retailerNameStore = retailerName;

  let tabActive = 1;
  let value: TParsedQueryString = queryString.parse(window.location.search);
  // let postId = value.postId === undefined ? "" : value.postId;
  let postType = value.type === undefined ? "by-the-community" : value.type;

  const setActiveTab = (tab: number) => {
    tabActive = tab;
  };

  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  };

  const getDataByParam = async (postType: PostType) => {
    try {
      // console.log("postType 1", postType);
      // console.log("postId 1", postId);

      switch (postType) {
        case "by-the-community":
          setActiveTab(1);
          break;

        case "by-nars":
          setActiveTab(2);
          break;

        default:
          break;
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  onMount(() => {
    getDataByParam(postType as PostType);
    window.addEventListener("resize", appHeight, false);
    appHeight();

    return () => {
      window.removeEventListener("resize", appHeight, false);
    };
  });
</script>

<Layout isOverflowable="{false}">
  {#if getAccessToken()}
    <Navbar
      onBackButtonClick="{() => goToRoom($currentRoom)}"
      backTitle="{$currentRoom === 'hall'
        ? $_('backButton.nonstopHall')
        : $_('backButton.nonstopCommunity')}"
    />
  {:else}
    <Navbar onBackButtonClick="{() => goToRoom()}" />
  {/if}
  <div class="column content-posts is-gapless card" id="contentPosts">
    <div class="tab-selector" id="tabSelector">
      <button
        class="{`button btn-community ${tabActive === 1 ? 'is-active' : ''}`}"
        on:click="{() => setActiveTab(1)}"
      >
        <p>{@html $_("community.byTheCommunity")}</p>
      </button>
      <button
        class="{`button btn-nars ${tabActive === 2 ? 'is-active' : ''}`}"
        on:click="{() => setActiveTab(2)}"
      >
        <p>{@html $_("community.byNARS")}</p>
      </button>
    </div>

    <div
      id="parent-container-community"
      class="{`content-post content-posts-container ${
        tabActive === 1 ? 'is-block' : ''
      }`}"
    >
      <!-- {#if tabActive === 1 } -->
      <ByCommunity tabActive="{tabActive}" />
      <!-- {/if} -->
      <NextPostButton typeParent="parent-container-community" />
    </div>
    <div
      id="parent-container-nars"
      class="{`content-post content-posts-container ${
        tabActive === 2 ? 'is-block' : ''
      }`}"
    >
      <!-- {#if tabActive === 2 } -->
      <ByNarsTab tabActive="{tabActive}" />
      <!-- {/if} -->
      <NextPostButton typeParent="parent-container-nars" />
    </div>
  </div>
</Layout>

<style lang="scss">
  $scrollbar-thumb: rgba(0, 0, 0, 0.5);
  $scrollbar-track: transparent;

  :root {
    --app-height: 100%;
  }
  .content-posts {
    padding: 0%;
    background-color: #000000e6;
    // height: auto !important;
    // overflow-y: hidden !important;
  }

  .content-posts-container {
    overflow-y: auto;
    // height: calc(100vh - 97px);
    height: calc(var(--app-height) - 97px);
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

  .tab-selector {
    display: flex;
    width: 100%;
    flex: none;
    background-color: transparent;
    padding: 10px;
    padding-top: 0;
    border-bottom: 1px solid gray;
  }
  .button {
    background-color: transparent;
    color: gray;
    border: none;
    border-radius: 0;
    font-size: 16px;
    /* border-bottom: 1px solid white; */
  }
  .btn-community {
    flex: 1;
  }
  .btn-community.is-active {
    color: white;
    p {
      border-bottom: 1px solid white;
    }
  }
  .btn-nars {
    width: 50%;
  }
  .btn-nars.is-active {
    color: white;
    p {
      border-bottom: 1px solid white;
    }
  }

  .content-post.is-block {
    display: block;
  }
  @media screen and (min-width: 480px) {
    // .post-content {
    //   width: 450px;
    // }
  }
</style>
