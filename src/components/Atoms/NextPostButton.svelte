<script lang="ts">
  import { onMount } from "svelte";

  import { nextPostId } from "@/stores/post";

  let isImageError = false;
  let containerWidth = 0;
  export let typeParent = "";

  function handleImageError() {
    isImageError = true;
  }

  function moveToNextPost() {
    const nextPost = document.getElementById($nextPostId);
    // const tabSelector = document.getElementById("tabSelector");
    var contentPosts = document.getElementById(typeParent);
    // var navbar = document.getElementById("navbar");

    if (nextPost) {
      // navbar.style.marginTop = "40px";
      // contentPosts.style.marginTop = "-40px";
      // tabSelector.style.paddingTop = "25px";

      // nextPost.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      // nextPost.parentNode.scrollTop = nextPost.offsetTop;
      // window.scroll({top: nextPost.offsetTop, behavior: 'smooth'});
      // nextPost.scrollTop = nextPost.offsetTop;
      contentPosts.scrollTop =
        nextPost.offsetTop - (contentPosts.offsetTop - 30);
      // console.log('typeParent', typeParent)
    }
  }

  onMount(() => {
    function onResize() {
      const parentContainer = document.getElementById("parent-container");
      containerWidth = parentContainer.clientWidth;
    }

    onResize();

    document.addEventListener("resize", onResize, false);

    return () => {
      document.removeEventListener("resize", onResize, false);
    };
  });
</script>

<button
  class="button next-post"
  class:is-error="{isImageError}"
  on:click="{moveToNextPost}"
  style="right: calc(50% - {containerWidth}px / 2 + min(1.25rem, 10%))"
>
  <img
    src="/images/next-post-icon.png"
    alt="NEXT"
    width="64"
    height="64"
    on:error="{handleImageError}"
  />
</button>

<style lang="scss">
  .button.next-post {
    background-color: transparent;
    border: none;
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
    position: fixed;
    bottom: 1.25rem;
    // right: 1.25rem;

    &.is-error {
      background-color: black;
      border: 1px solid white;
      color: white;
    }
  }
</style>
