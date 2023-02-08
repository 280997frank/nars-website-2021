<script lang="ts">
  import Carousel from "svelte-carousel";

  import type { PostModuleAsset } from "@/api/post";

  export let dataImages: PostModuleAsset[] = [];
  let imagesScroll: HTMLDivElement;

  const handleArrowLeft = () => {
    //  const arrowLeft = document.getElementById('imagesScroll')
    //  arrowLeft.scrollLeft -= 50;
    imagesScroll.scrollLeft -= 50;
    //  console.log("left", arrowLeft)
  };
  function handleArrowRight() {
    // const arrowLeft = document.getElementById('imagesScroll')
    // arrowLeft.scrollLeft += 50;
    imagesScroll.scrollLeft += 50;
    // console.log("right", arrowLeft)
  }
  type EventError = Event & {
    currentTarget: EventTarget & HTMLImageElement;
  };

  let fallback = "https://via.placeholder.com/200x200?text=Image+is+Error.";
  const handleError = (ev: EventError) => (ev.currentTarget.src = fallback);
</script>

<div>
  <Carousel let:currentPageIndex let:showPage arrows="{false}">
    <div slot="dots" class="custom-dots">
      <div class="columns">
        <p class="arrows-left" on:click="{() => handleArrowLeft()}">&#9666;</p>
        <div id="imagesScroll" class="card-body" bind:this="{imagesScroll}">
          <div class="is-center">
            {#each dataImages as item, pageIndex (item.id)}
              <!-- <figure class="image is-16x9"> -->
              <img
                class="item-imageScroll
              {currentPageIndex == pageIndex ? 'rounded' : 'img-thumbnail'}"
                on:click="{() => showPage(pageIndex)}"
                src="{item.url}"
                alt=""
                loading="lazy"
                on:error="{handleError}"
              />
              <!-- </figure> -->
            {/each}
          </div>
        </div>
        <p class="arrows-right" on:click="{() => handleArrowRight()}">
          &#9656;
        </p>
      </div>
    </div>
    {#each dataImages as item (item.id)}
      <img class="image-core" src="{item.url}" alt="" loading="lazy" />
    {/each}
  </Carousel>
</div>

<style lang="scss">
  .columns {
    padding: 10px;
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100vw;
  }

  .card-body {
    max-width: 85vw;
    height: auto;
    overflow-x: scroll !important;
    margin-right: auto;
    margin-left: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .is-center {
    display: flex;
    justify-content: start;
    align-items: center;
    /* white-space: nowrap; */
    /* overflow-x: auto; */
    /* position: relative; */
  }

  img {
    max-width: 100%;
    height: auto;
  }
  .image-core {
    /* width: 100vw; */
    width: 100vw;
    height: auto;
    margin-top: auto;
    margin-bottom: auto;
    position: relative;
    padding: 10px;
  }
  /* .rounded {
    border: 1px white solid;
  } */
  .img-thumbnail {
    -webkit-filter: brightness(40%);
    filter: brightness(40%);
  }
  .item-imageScroll {
    min-width: 55px !important;
    width: 55px !important;
    max-width: 55px !important;
    height: 55px !important;
    padding: 1px;
    object-fit: cover !important;
  }
  .card-body::-webkit-scrollbar {
    width: 5px;
    display: none;
  }
  .card-body::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  .card-body::-webkit-scrollbar-thumb {
    background: grey;
    border-radius: 10px;
  }
  .arrows-left {
    color: white;
    margin: auto;
    cursor: pointer;
    position: absolute;
    left: 4%;
    top: 55%;
    transform: translateY(-55%);
  }
  .arrows-right {
    color: white;
    margin: auto;
    cursor: pointer;
    position: absolute;
    right: 4%;
    top: 55%;
    transform: translateY(-55%);
  }
</style>
