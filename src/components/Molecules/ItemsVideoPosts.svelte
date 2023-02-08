<script lang="ts">
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
  // const replaceAllTags = (text: string) => {
  //   return text.replace(/<\/?[^>]+(>|$)/g, "");
  // };
</script>

<div class="item-video-post" id="{data.id}">
  <AuthorPost
    authorImage="{data.authorImage}"
    authorLayout="{data.platform}"
    nameAuthor="{data.authorName}"
    timeAuthor="{data.date}"
  />
  <div class="title">
    <p>{data.title}</p>
  </div>
  <div class="video-post">
    <video
      class="video"
      muted="{false}"
      autoPlay="{false}"
      loop
      playsInline
      controls
    >
      <source
        src="{(Array.isArray(data.postAssets) &&
          data.postAssets.length &&
          data.postAssets[0].url) ||
          ''}"
        type="video/mp4"
      />
    </video>
  </div>
  <div class="desc-post">{@html data.content}</div>
  <ExpressionButtons {...dataExpresions} />
  {#if data.postProducts.length >= 1}
    <RecommendedProductPost
      postId="{data.id}"
      postType=""
      dataProduct="{data.postProducts}"
    />
  {/if}
</div>

<style lang="scss">
  @use "../../styles/posts" as t;
  .item-video-post {
    border-bottom: 1px solid gray;
    padding-bottom: 1rem;
  }
  .video-post {
    width: 100%;
    .video {
      width: 100%;
    }
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
    color: white !important;
  }
</style>
