<script lang="ts">
  // import { JustifiedGrid } from "@egjs/svelte-grid";
  import {
    GuestAnalyticsType,
    sendAnalytics,
    sendGuestAnalytics,
  } from "@/api/analytics";
  import type {
    PostModule,
    PostModuleAsset,
    TPostAssest,
    TPostProduct,
  } from "@/api/post";
  import { ModuleType } from "@/api/post";
  import AuthorPost from "@/components/Atoms/AuthorPost.svelte";
  import ImagePostModal from "@/components/Atoms/ImagePostModal.svelte";
  import ExpressionButtons from "@/components/Atoms/ReactionButtons.svelte";
  import RecommendedProductPost from "@/components/Atoms/RecommendedProductPost.svelte";
  import SwipeImages from "@/components/Atoms/SwipeImages.svelte";
  import { AnalyticsType } from "@/interfaces/analytics";
  import { nextPostId } from "@/stores/post";
  import { getAccessToken, getGuestId } from "@/utils";
  import { replaceEnVersionWithHelvetica100 } from "@/utils/regexHelper";
  import { onMount } from "svelte";

  // import WeiboPostImg from "../Atoms/WeiboPostImg.svelte";

  interface TData {
    id: string;
    title: string;
    type: string;
    platform: string;
    isFeatured: boolean;
    date: string;
    authorName: string;
    authorImage: string;
    content: string;
    layout: string;
    postAssets: TPostAssest[];
    postProducts: TPostProduct[];
    postModules: PostModule[];
    isLike: boolean;
    totalLike: number;
    isLove: boolean;
    totalLove: number;
    isClap: boolean;
    totalClap: number;
  }

  type SortableItem = PostModuleAsset | PostModule;

  export let idList: string[] = [];
  export let data: TData = {
    id: "",
    title: "",
    type: "",
    platform: "",
    isFeatured: false,
    date: "",
    authorName: "",
    authorImage: "",
    content: "",
    layout: "",
    postAssets: [],
    postProducts: [],
    postModules: [],
    isLike: false,
    totalLike: 0,
    isLove: false,
    totalLove: 0,
    isClap: false,
    totalClap: 0,
  };

  let hasSentAnalytics = false;
  let dataExpresions = {
    id: data.id,
    isLike: data.isLike,
    totalLike: data.totalLike,
    isLove: data.isLove,
    totalLove: data.totalLove,
    isClap: data.isClap,
    totalClap: data.totalClap,
  };
  let post: HTMLElement;
  let imageUrl = "";
  let isOpenImageWeibo = false;
  function setImageurl(imgUrl: string) {
    imageUrl = imgUrl;
    isOpenImageWeibo = true;
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
      return "is-4";
    }
    return "is-4";
  }

  function sortItem(a: SortableItem, b: SortableItem) {
    if (a.index < b.index) {
      return -1;
    }

    if (a.index > b.index) {
      return 1;
    }

    return 0;
  }

  function setNextPost(entries: IntersectionObserverEntry[]) {
    const intersectingEntry = entries.find((entry) => entry.isIntersecting);

    if (intersectingEntry) {
      const index = idList.findIndex(
        (id) => id === intersectingEntry.target.id
      );
      if (index >= 0) {
        $nextPostId = idList[index + 1];
      }
    }
  }

  async function trackVideoPlay() {
    try {
      if (!hasSentAnalytics) {
        if (getAccessToken()) {
          await sendAnalytics({
            type: AnalyticsType.CR_VIDEO,
            entryType: "start",
            postId: data.id,
          });
        } else {
          await sendGuestAnalytics({
            type: GuestAnalyticsType.CR_VIDEO,
            entryType: "start",
            postId: data.id,
            guestId: getGuestId(),
          });
        }

        hasSentAnalytics = true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  onMount(() => {
    const observer = new IntersectionObserver(setNextPost, { threshold: 0.15 });
    observer.observe(post);
  });
</script>

<article class="item-post" id="{data.id}" bind:this="{post}">
  <AuthorPost
    authorImage="{data.authorImage}"
    authorLayout="{data.platform}"
    nameAuthor="{data.authorName}"
    timeAuthor="{data.date}"
    type="{data.type}"
  />
  <h1 class="title mb-5">
    {@html replaceEnVersionWithHelvetica100(data.title)}
  </h1>
  {#each data.postModules.sort(sortItem) as postModule (postModule.id)}
    {#if postModule.type === ModuleType.RED}
      <div class="Red-post">
        <SwipeImages dataImages="{postModule.postModuleAssets || []}" />
      </div>
    {:else if postModule.type === ModuleType.VIDEO}
      <div class="video-post">
        <video
          class="video"
          muted="{false}"
          autoPlay="{false}"
          loop
          playsInline
          controls
          on:play="{trackVideoPlay}"
        >
          <source
            src="{(Array.isArray(postModule.postModuleAssets) &&
              postModule.postModuleAssets.length &&
              postModule.postModuleAssets[0].url) ||
              ''}"
            type="video/mp4"
          />
        </video>
      </div>
    {:else if postModule.type === ModuleType.WEIBO}
      <div class="content-grid">
        <!-- <WeiboPostImg postModuleAssets={postModule.postModuleAssets}/> -->
        <div class="columns is-multiline is-mobile">
          {#each postModule.postModuleAssets.sort(sortItem) as postModuleAsset (postModuleAsset.id)}
            <div
              class="column {sizeColumn(postModule.postModuleAssets.length)}"
              on:click="{() => {
                if (postModule.postModuleAssets.length > 1) {
                  setImageurl(postModuleAsset.url);
                }
              }}"
            >
              <figure
                class="image"
                class:is-1by1="{postModule.postModuleAssets.length > 1}"
              >
                <img src="{postModuleAsset.url}" alt="" loading="lazy" />
              </figure>
            </div>
          {/each}
        </div>
        <!-- <JustifiedGrid
          gap="{5}"
          defaultDirection="{'start'}"
          columnRange="{[1, 3]}"
          rowRange="{2}"
          sizeRange="{[200, 200]}"
          isCroppedSize="{true}"
          displayedRow="{-1}"
        >
          {#each postModule.postModuleAssets.sort(sortItem) as postModuleAsset (postModuleAsset.id)}
            <div class="image" data-grid-width="100" data-grid-height="100" >
              <img src="{postModuleAsset.url}" alt="" loading="lazy" style="object-fit: contain;" />
            </div>
          {/each}
        </JustifiedGrid> -->
      </div>
    {:else if postModule.type === ModuleType.TEXT}
      <div class="desc-post">
        {@html replaceEnVersionWithHelvetica100(postModule.content)}
        <!-- {@html postModule.content} -->
      </div>
    {/if}
  {/each}
  {#if data.postProducts.length >= 1}
    <div class="mt-5">
      <RecommendedProductPost
        postId="{data.id}"
        postType="{data.type}"
        dataProduct="{data.postProducts}"
      />
    </div>
  {/if}
  <ExpressionButtons {...dataExpresions} />
  <ImagePostModal
    isOpen="{isOpenImageWeibo}"
    imgUrl="{imageUrl}"
    onClose="{() => (isOpenImageWeibo = false)}"
  />
</article>

<style lang="scss">
  @use "../../styles/posts" as t;
  .item-post {
    border-bottom: 1px solid gray;
    padding-bottom: 1rem;

    &:not(:last-of-type) {
      margin-bottom: 2rem;
    }
  }
  .desc-post {
    @include t.descPost;
    font-family: "Noto Sans", sans-serif !important;
  }
  .title {
    font-weight: 200;
    padding-left: 10px;
    padding-right: 10px;
    text-transform: uppercase;
    color: white;
  }
  .title:not(:last-child) {
    margin-bottom: 0%;
  }
  .columns {
    padding: 10px !important;
  }
  .column {
    padding: 5px !important;
  }

  .video-post {
    width: 100%;
    .video {
      width: 100%;
    }
  }

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
</style>
