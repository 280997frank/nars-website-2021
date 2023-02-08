<script lang="ts">
  // import { toasts } from "svelte-toasts";
  import { sendAnalytics } from "@/api/analytics";
  import {
    addProductToWishlist,
    reactProduct,
    removeReactProduct,
  } from "@/api/product";
  import { completeTask, EAvailableTasks } from "@/api/tasks";
  import Button from "@/components/Atoms/Button.svelte";
  import { AnalyticsType } from "@/interfaces/analytics";
  import type { IProductDetail, IProductVariants } from "@/interfaces/product";
  import { isWelcomeModalShown } from "@/stores/welcomeModal";
  import { getAccessToken } from "@/utils";
  import { _ } from "svelte-i18n";

  export let dataFooter: IProductDetail;
  export let choosedVarian: IProductVariants;
  let LikeFalse = "/icons/LikeIconFalse.png";
  let LikeTrue = "/icons/LikeIconTrue.png";
  let ClapFalse = "/icons/clapIconFalse.png";
  let ClapTrue = "/icons/clapIconTrue.png";
  let LoveFalse = "/icons/loveIconFalse.png";
  let LoveTrue = "/icons/loveIconTrue.png";
  let loading = false;

  async function addToWishlist() {
    loading = true;
    try {
      window.gtag("event", "click", {
        event_category: "alwayson_button_purchase",
        event_label: "add_to_wishlist",
      });

      await addProductToWishlist({
        productId: dataFooter.id,
        productVariantId: choosedVarian?.id || "",
      });
      loading = false;
      console.log(`Added to wishlist!`);

      await completeTask(EAvailableTasks.AddProductToWishlist);
      console.log("NCOINS earned from adding product to wishlist");

      await sendAnalytics({
        type: AnalyticsType.PRODUCT_ADD_WISHLIST,
        entryType: "start",
        productId: dataFooter.id,
      });
    } catch (error) {
      loading = false;
      console.log(error.message);
    }
  }

  async function removeReactRequest(type: string) {
    if (getAccessToken()) {
      try {
        await removeReactProduct({ productId: dataFooter.id, type });
        dataFooter[`${type}s`] -= 1;
        dataFooter[`is${type.charAt(0).toUpperCase()}${type.slice(1)}`] = false;
        console.log(
          `Remove ${type.charAt(0).toUpperCase()}${type.slice(1)} success !`
        );
      } catch (error) {
        console.log(error.message);
      }
    } else {
      const container = document.getElementById("parent-container");
      container.scrollTop = 0;
      $isWelcomeModalShown = true;
    }
  }

  async function reactRequest(type: string) {
    if (getAccessToken()) {
      try {
        await reactProduct({ productId: dataFooter.id, type });
        dataFooter[`${type}s`] += 1;
        dataFooter[`is${type.charAt(0).toUpperCase()}${type.slice(1)}`] = true;
        console.log(
          ` ${type.charAt(0).toUpperCase()}${type.slice(1)} success!`
        );

        completeTask(EAvailableTasks.ReactToAProduct);
        console.log("NCOINS earned from reacting to a product");
      } catch (error) {
        console.log(error.message);
      }
    } else {
      const container = document.getElementById("parent-container");
      container.scrollTop = 0;
      $isWelcomeModalShown = true;
    }
  }
</script>

<div class="response-wrapper">
  <div>
    <Button isLoading="{loading}" onClick="{addToWishlist}">
      {$_("discovery.addToWishlist")}
    </Button>
  </div>
  <div
    class="response-btn"
    on:click="{() =>
      dataFooter.isLike ? removeReactRequest('like') : reactRequest('like')}"
  >
    <img
      class="btn-react"
      src="{dataFooter.isLike ? LikeTrue : LikeFalse}"
      alt="likes button"
      width="20"
    />
    <span class="helvetica-neue">{dataFooter ? dataFooter.likes : 0}</span>
  </div>
  <div
    class="response-btn"
    on:click="{() =>
      dataFooter.isLove ? removeReactRequest('love') : reactRequest('love')}"
  >
    <img
      class="btn-react"
      src="{dataFooter.isLove ? LoveTrue : LoveFalse}"
      alt="likes button"
      width="20"
    />
    <span class="helvetica-neue">{dataFooter ? dataFooter.loves : 0}</span>
  </div>
  <div
    class="response-btn"
    on:click="{() =>
      dataFooter.isClap ? removeReactRequest('clap') : reactRequest('clap')}"
  >
    <img
      class="btn-react"
      src="{dataFooter.isClap ? ClapTrue : ClapFalse}"
      alt="likes button"
      width="20"
    />
    <span class="helvetica-neue">{dataFooter ? dataFooter.claps : 0}</span>
  </div>
</div>

<style lang="scss">
  @mixin flex-row {
    display: flex;
    flex-direction: row;
  }
  @mixin center-element {
    justify-content: center;
    align-items: center;
  }
  @mixin flex-column {
    display: flex;
    flex-direction: column;
  }
  .response-wrapper {
    position: fixed;
    bottom: 0px;
    width: inherit;
    height: 70px;
    margin-left: -15px;
    padding: 10px 0;
    background-color: black;
    justify-content: space-around;
    align-items: center;
    z-index: 3;
    @include flex-row;
    .response-btn {
      // width: fit-content;
      // height: 100%;
      @include flex-row;
      @include center-element;
      align-items: flex-start;
      margin-top: 12px;
      cursor: pointer;
      img {
        cursor: poiter;
      }
      span {
        margin-left: 5px;
        color: white;
      }
    }
  }
</style>
