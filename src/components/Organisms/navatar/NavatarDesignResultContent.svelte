<script lang="ts">
  import { sendAnalytics } from "@/api/analytics";
  import { completeTask, EAvailableTasks } from "@/api/tasks";
  import { addProductToWishlist } from "@/api/product";
  import { AnalyticsType } from "@/interfaces/analytics";
  import {
    lookbookProductsStore,
    selectedNavatarModel,
  } from "@/stores/navatar";
  import { isFromNavatarPage } from "@/stores/room";
  import { footerHeight } from "@/stores/profile";
  import { getAccessToken } from "@/utils";
  import {
    createScene,
    releaseUsedMemory,
    removeListener,
    share,
  } from "@/utils/navatar/NavatarDesignResult";
  import { onDestroy, onMount } from "svelte";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let retailerName: string;
  let el: HTMLCanvasElement;
  let products: {
    productId: string;
    image: string;
  }[];
  let requestId = 0;

  $: loading = false;
  $: modalOpen = false;
  $: modalImage = "";

  async function addToWishlist(this: HTMLSpanElement, e: Event) {
    e.stopPropagation();

    try {
      window.gtag("event", "click", {
        event_category: "alwayson_button_purchase",
        event_label: "add_to_wishlist",
      });

      await addProductToWishlist({
        productId: this.dataset.productId,
        productVariantId: "",
      });
      console.log(`Added to wishlist!`);

      await completeTask(EAvailableTasks.AddProductToWishlist);
      console.log("NCOINS earned from adding product to wishlist");

      await sendAnalytics({
        type: AnalyticsType.PRODUCT_ADD_WISHLIST,
        entryType: "start",
        productId: this.dataset.productId,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  onMount(() => {
    if (getAccessToken() && $selectedNavatarModel && $lookbookProductsStore) {
      loading = true;
      const temp: {
        productId: string;
        image: string;
      }[] = [];
      $lookbookProductsStore.data.lookBookProducts.map((product) => {
        const tempData = {
          productId: product.product.id,
          image: product.product.productThumbnail,
        };
        temp.push(tempData);
      });
      products = temp;

      createScene(
        el,
        "navatar-container-designer-result",
        $selectedNavatarModel.skintone,
        $selectedNavatarModel.hairColor,
        $selectedNavatarModel.lookBookTexture,
        $selectedNavatarModel.headModel,
        $selectedNavatarModel.bodyModel
      )
        .then((requestId_) => {
          requestId = requestId_;
          loading = false;
        })
        .catch((error) => {
          console.log({ error });
          loading = false;
        });
    } else {
      navigate(`/${retailerName}/profile/navatar`);
    }

    document.documentElement.style.setProperty(
      "--footer-height",
      `${$footerHeight}px`
    );
  });

  onDestroy(() => {
    cancelAnimationFrame(requestId);
    removeListener();
    releaseUsedMemory();
  });
</script>

<div class="canvas-container" id="navatar-container-designer-result">
  <button
    id="edit-navatar-designer"
    on:click="{() => navigate(`/${retailerName}/profile/navatar`)}"
  >
    {$_("navatar.edit")}
  </button>
  <canvas class="navatar-container" bind:this="{el}"></canvas>
  {#if loading}
    <div id="loading-x">{$_("nwallet.loading")}</div>
  {/if}
</div>
<div class="avatar-design-result-content">
  <div
    class="share-button"
    on:click="{() => {
      loading = true;
      const qrCodePath = '/images/qr-code-navatar.png';
      share(qrCodePath, products)
        .then((imageUrl) => {
          modalImage = imageUrl;
          modalOpen = true;

          const link = document.createElement('a');
          link.download = 'share.png';
          link.href = imageUrl;
          link.click();
          loading = false;
        })
        .catch((error) => {
          console.log({ error });
          console.log('Share Error', error.message || error.errmsg);
          loading = false;
        });
    }}"
  >
    {#if loading}
      <div id="loading-x">{$_("nwallet.loading")}</div>
    {:else}
      <img src="/images/uploadIcon.svg" alt="" />&nbsp;
      <span style="padding: 10px"> {$_("navatar.shareMyLook")}</span>
    {/if}
  </div>
  <div class="modal" class:is-active="{modalOpen}">
    <div class="modal-background" on:click="{() => (modalOpen = false)}"></div>
    <div class="modal-content has-text-centered is-relative">
      <button
        class="modal-close is-large"
        aria-label="close"
        on:click="{() => (modalOpen = false)}"></button>
      <img src="{modalImage}" alt="" />
    </div>
  </div>
  <h1 style="margin-top: 1rem">{$_("navatar.productsUsed")}</h1>
  <div class="product-contents">
    {#if Array.isArray(products)}
      {#each products as product (product.productId)}
        <div class="item">
          <img
            src="{product.image}"
            alt=""
            on:click="{() => {
              $isFromNavatarPage = true;
              navigate(`/${retailerName}/product/${product.productId}`);
            }}"
          />
          <span
            class="btn-plus"
            data-product-id="{product.productId}"
            on:click="{addToWishlist}"
          >
            +
          </span>
        </div>
      {/each}
    {:else}
      <p>This lookbook doesn't have any products</p>
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../../../styles/canvas";

  .canvas-container {
    position: relative;
    height: 22rem;
  }

  .modal {
    z-index: 11;
  }

  #loading-x {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: 0.5;
    background-color: black;
    font-weight: bold;
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #edit-navatar-designer {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: black;
    color: white;
    height: 35px;
    min-width: 80px;
    text-align: center;
    font-size: 0.8rem;
    cursor: pointer;
    border: none;
  }

  .navatar-container {
    width: 100%;
    height: 100%;
  }

  .avatar-design-result-content {
    color: white;
    display: block;
    align-items: center;
    padding: 1rem 1rem 0 1rem;
    margin-top: 0.5rem;
    overflow-y: auto;
    flex: 1;
    margin-bottom: var(--footer-height);
    // height: calc(50% - 150px);
    // height: 40vh;

    .share-button {
      margin-left: auto;
      margin-right: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 10px 1rem;
      width: 80%;
      height: 50px;
      color: white;
      background-color: black;
      border: 1px solid white;
      cursor: pointer;
    }

    .product-contents {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      justify-items: flex-start;
      justify-content: flex-start;
      padding-bottom: 1rem;

      .item {
        position: relative;

        img {
          min-height: 100px;
          max-height: 150px;
          height: auto;
          width: auto;
          cursor: pointer;
        }

        .btn-plus {
          background-color: black;
          color: white;
          position: absolute;
          right: 6%;
          bottom: 10%;
          height: 25px;
          width: 25px;
          line-height: 26px;
          font-size: 12px;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
        }
      }
    }

    .modal-close {
      position: absolute !important;
      top: 5px;
    }
  }
</style>
