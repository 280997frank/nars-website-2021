<script lang="ts">
  import { JustifiedGrid } from "@egjs/svelte-grid";
  import AuthorPost from "@/components/Atoms/AuthorPost.svelte";
  import RecommendedProductPost from "@/components/Atoms/RecommendedProductPost.svelte";
  import ExpressionButtons from "@/components/Atoms/ReactionButtons.svelte";
  import type { TPostAssest, TPostProduct } from "@/api/post";
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
    isLike: boolean;
    totalLike: number;
    isLove: boolean;
    totalLove: number;
    isClap: boolean;
    totalClap: number;
  }
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
    isLike: false,
    totalLike: 0,
    isLove: false,
    totalLove: 0,
    isClap: false,
    totalClap: 0,
  };
  let dataExpresions = {
    id: data.id,
    isLike: data.isLike,
    totalLike: data.totalLike,
    isLove: data.isLove,
    totalLove: data.totalLove,
    isClap: data.isClap,
    totalClap: data.totalClap,
  };

  let dataImages = data.postAssets || [];
  // const replaceAllTags = (text: string) => {
  //   return text.replace(/<\/?[^>]+(>|$)/g, "");
  // };
</script>

<div class="item-weibo-post" id="{data.id}">
  <AuthorPost
    authorImage="{data.authorImage}"
    authorLayout="{data.platform}"
    nameAuthor="{data.authorName}"
    timeAuthor="{data.date}"
  />
  <div class="title">
    <p>{data.title}</p>
  </div>

  <div class="content-grid">
    <JustifiedGrid
      gap="{5}"
      defaultDirection="{'start'}"
      columnRange="{[1, 3]}"
      rowRange="{2}"
      sizeRange="{[200, 100]}"
      isCroppedSize="{false}"
      displayedRow="{-1}"
    >
      {#each dataImages as item (item.id)}
        <div class="image" data-grid-width="100" data-grid-height="100">
          <img src="{item.url}" alt="" loading="lazy" />
        </div>
      {/each}
    </JustifiedGrid>
  </div>
  <div class="desc-post">{@html data.content}</div>
  <ExpressionButtons {...dataExpresions} />
  {#if data.postProducts.length >= 1}
    <RecommendedProductPost
      postType=""
      postId="{data.id}"
      dataProduct="{data.postProducts}"
    />
  {/if}
</div>

<style lang="scss">
  @use "../../styles/posts" as t;
  .item-weibo-post {
    border-bottom: 1px solid gray;
    padding-bottom: 1rem;
  }
  .content-grid {
    padding: 10px;
  }
  .desc-post {
    @include t.descPost;
  }

  .title {
    font-weight: 200;
    padding-left: 10px;
    padding-right: 10px;
    text-transform: uppercase;
  }
  .title:not(:last-child) {
    margin-bottom: 0%;
  }
  p {
    color: white;
  }
  .image {
    position: relative;
    width: 100%;
  }

  .image img {
    width: 100%;
  }
</style>
