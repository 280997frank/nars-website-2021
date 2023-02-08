<script lang="ts">
  import { onMount } from "svelte";
  import type { Event } from "three";
  import queryString from "query-string";

  import Post from "@/components/Molecules/Post.svelte";

  import { getPostsBYCategory, TPostData, typePost } from "@/api/post";

  interface TParsedQueryString {
    postId?: string;
    type?: string;
  }

  // export let dataDummy =[];
  export let tabActive = 2;
  let newBatch: TPostData[] = [];
  let dataPostsByCategory: TPostData[] = [];
  let PAGE = 1;
  let LIMIT = 10;
  let totalpage = 1;
  let firstTime = true;
  let TYPE = "by-nars";

  let value: TParsedQueryString = queryString.parse(window.location.search);
  let postId = value.postId === undefined ? "" : value.postId;
  let typeCate = value.type === undefined ? "" : value.type;

  const scrollIntoViewId = (postId: string) => {
    setTimeout(function () {
      const elmnt = document.getElementById(postId);
      var contentPosts = document.getElementById("parent-container-nars");
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
      postId: typeCate === "by-nars" ? postId : "",
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
    const onScroll = (e: Event) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop === clientHeight && totalpage > PAGE) {
        PAGE += 1;
        fetchData(LIMIT, PAGE, TYPE);
      }
    };

    // Update elemScrollTop every time the user scrolls
    const elem = document.getElementById(
      "parent-container-nars"
    ) as HTMLDivElement;
    elem.addEventListener("scroll", onScroll, false);

    return () => {
      elem.removeEventListener("scroll", onScroll, false);
    };
  });
</script>

<div class="by-nars-content">
  {#each dataPostsByCategory as item (item.id)}
    {#if tabActive === 2}
      <Post
        data="{item}"
        idList="{dataPostsByCategory.map((post) => post.id)}"
      />
    {/if}
  {/each}
</div>

<style lang="scss">
  .by-nars-content {
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    width: 100%;
  }
</style>
