<script lang="ts">
  import { onMount } from "svelte";
  import type { Event } from "three";
  import queryString from "query-string";
  import { _ } from "svelte-i18n";
  import Post from "@/components/Molecules/Post.svelte";

  import { getPostsBYCategory, TPostData, typePost } from "@/api/post";

  interface TParsedQueryString {
    postId?: string;
    type?: string;
  }
  // export let dataDummy =[];
  export let tabActive = 1;
  let newBatch: TPostData[] = [];
  let dataPostsByCategory: TPostData[] = [];
  let PAGE = 1;
  let LIMIT = 10;
  let totalpage = 1;
  let TYPE = "by-the-community";

  let firstTime = true;

  let value: TParsedQueryString = queryString.parse(window.location.search);
  let postId = value.postId === undefined ? "" : value.postId;
  let typeCate = value.type === undefined ? "" : value.type;

  const scrollIntoViewId = (postId: string) => {
    setTimeout(function () {
      const elmnt = document.getElementById(postId);
      var contentPosts = document.getElementById("parent-container-community");
      // window.location.hash = postId;
      if (elmnt) {
        contentPosts.scrollTop =
          elmnt.offsetTop - (contentPosts.offsetTop - 30);

        // elmnt.scrollIntoView({ behavior: "smooth" });
        // elmnt.style.display = "block";
      }
    }, 1000);
  };

  async function fetchData(limit: number, page: number, type: string) {
    const response = await getPostsBYCategory({
      limit: limit,
      page: page,
      type: type as typePost,
      orderBy: "createdAt",
      sortBy: "DESC",
      postId: typeCate === "by-the-community" ? postId : "",
    });
    page = response.page;
    newBatch = response.data;
    totalpage = response.totalPage;
    // console.log('firstTime', firstTime)
    if (firstTime) {
      scrollIntoViewId(postId);
    }
    firstTime = false;
    // console.log('firstTime1', firstTime)
  }

  onMount(async () => {
    // load first batch onMount
    await fetchData(LIMIT, PAGE, TYPE);
  });

  $: dataPostsByCategory = [...dataPostsByCategory, ...newBatch];

  onMount(() => {
    // Update elemScrollTop every time the user scrolls
    const onScroll = (e: Event) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop === clientHeight && totalpage > PAGE) {
        PAGE += 1;
        fetchData(LIMIT, PAGE, TYPE);
      }
    };

    const elem = document.getElementById(
      "parent-container-community"
    ) as HTMLDivElement;
    elem.addEventListener("scroll", onScroll, false);

    return () => {
      elem.removeEventListener("scroll", onScroll, false);
    };
  });
</script>

<div class="by-community-content">
  {#each dataPostsByCategory as item (item.id)}
    {#if tabActive === 1}
      <Post
        data="{item}"
        idList="{dataPostsByCategory.map((post) => post.id)}"
      />
    {/if}
  {/each}
</div>
<div class="post-credit"><p>{$_("community.disclaimer")}</p></div>

<style lang="scss">
  .by-community-content {
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    width: 100%;
  }
  .post-credit {
    height: 7rem;
    width: 100%;
    text-align: center;
    display: flex;
    padding-bottom: 1rem;
    p {
      color: white;
      font-size: 12px;
      text-decoration: underline;
      margin: auto;
      font-weight: lighter;
    }
  }
</style>
