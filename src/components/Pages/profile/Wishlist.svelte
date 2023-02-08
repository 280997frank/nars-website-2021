<script lang="ts">
  // import { toasts } from "svelte-toasts";
  import { sendAnalytics } from "@/api/analytics";
  import {
    deleteWishProductById,
    getWishlist,
    getWishProductById,
    WishlistData,
  } from "@/api/profile";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileFooter from "@/components/Molecules/ProfileFooter.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import { AnalyticsType } from "@/interfaces/analytics";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { getAccessToken } from "@/utils";
  import { generateWishlistImage } from "@/utils/canvas";
  import { replaceEnVersionWithHelvetica300 } from "@/utils/regexHelper";
  import { useMutation } from "@sveltestack/svelte-query";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let retailerName: string;

  $retailerNameStore = retailerName;

  let dataWishlist: WishlistData[] = [];
  let containerWidth = 0;
  let isGeneratingImage = false;
  let isImageOpen = false;
  let imageUrl = "";
  // let imageBase64Urls: string[] = [];

  const mutationGetWishlist = useMutation(getWishlist, {
    onError(error: Error) {
      console.log("Wishlist Error", error.message);
    },
  });

  const mutationGetWishProductById = useMutation(getWishProductById, {
    onError(error: Error) {
      console.log("Wishlist Error", error.message);
    },
  });

  const mutationDeleteWishProductById = useMutation(deleteWishProductById, {
    onError(error: Error) {
      console.log("Wishlist Error", error.message);
    },
    onSuccess() {
      console.log("Success");
    },
  });

  const onClickDownload = async () => {
    try {
      isGeneratingImage = true;
      const imgUrl = await generateWishlistImage({
        data: dataWishlist,
        width: containerWidth,
        // imageBase64Urls,
      });

      await sendAnalytics({
        type: AnalyticsType.DOWNLOAD_WISHLIST,
        entryType: "start",
      });

      imageUrl = imgUrl;
      isImageOpen = true;
    } catch (error) {
      console.log("Download Error", error.message);
    } finally {
      isGeneratingImage = false;
    }
  };

  function closeModal() {
    isImageOpen = false;
  }

  async function openStorePage(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    }
  ) {
    let hasFired = false;
    const { productId, storeUrl } = e.currentTarget.dataset;
    // history.pushState({}, "", `/${retailerName}/profile/wishlist`);
    window.gtag("event", "click", {
      event_category: "alwayson_button_purchase",
      event_label: "shop_now",
      event_callback: open,
    });

    setTimeout(open, 1000);

    async function open() {
      try {
        if (!hasFired) {
          hasFired = true;
          await sendAnalytics({
            type: AnalyticsType.SHOP_NOW,
            entryType: "start",
            productId,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        // window.location.replace(storeUrl);
        window.location.assign(storeUrl);
      }
    }
  }

  /*  function generateBase64Url(e: Event) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = <HTMLImageElement>e.target;

    canvas.width = img.width;
    canvas.height = img.height;

    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    imageBase64Urls[Number(this.dataset.index)] = canvas.toDataURL();
  } */

  onMount(() => {
    $mutationGetWishlist.mutate();
    const parentContainer = document.getElementById(
      "parent-container"
    ) as HTMLDivElement;
    containerWidth = parentContainer.clientWidth;
  });

  $: {
    if ($mutationGetWishlist.isSuccess) {
      const newData = $mutationGetWishlist.data.data;
      const newDataWishlist =
        newData.length > 0
          ? newData.map((item) => {
              return {
                ...item,
                product: {
                  ...item.product,
                  name: replaceEnVersionWithHelvetica300(item.product.name),
                },
              };
            })
          : newData;
      dataWishlist = newDataWishlist;
    }

    if ($mutationDeleteWishProductById.isSuccess) {
      $mutationDeleteWishProductById.reset();
      $mutationGetWishlist.mutate();
    }
  }
</script>

<Layout isPrivate>
  <Navbar
    backTitle="{$_('backButton.profile')}"
    onBackButtonClick="{() => navigate(`/${retailerName}/profile`)}"
  />
  <div id="capture" class="mt-3" style="position: absolute;">
    <div class="columns">
      <div class="column">
        <span class="wishlist-title">{$_("wishlist.title")}</span>
      </div>
      <div class="column end">
        <span>
          {@html replaceEnVersionWithHelvetica300(
            $_("wishlist.item", { values: { qty: dataWishlist.length } })
          )}
        </span>
      </div>
    </div>
    <!-- style="height:{`${window.innerHeight - 274}px`}" -->
    <div class="scroll-list">
      {#each dataWishlist as item, index (item.id)}
        <div class="box wishlist-item">
          <article class="media">
            <div class="media-left">
              <figure class="image is-96x96">
                <img
                  src="{item.product.productThumbnail
                    ? `${process.env.VITE_BACKEND_URL}/download/file?url=${item.product.productThumbnail}`
                    : ''}"
                  alt=""
                  crossorigin="anonymous"
                  data-index="{index}"
                />
                <!-- on:load="{generateBase64Url}" -->
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <div
                  class="title-item is-uppercase"
                  on:click="{() => {
                    $mutationGetWishProductById.mutate({
                      productId: item.product.id,
                    });
                  }}"
                >
                  {@html item.product.name}
                  <br />
                  <div class="is-flex is-align-items-baseline">
                    <div
                      class="hex-color child"
                      style="{`background:${
                        item.productVariant?.hexCode || 'transparent'
                      };border:1px solid ${
                        item.productVariant &&
                        item.productVariant.hexCode.toLowerCase() === '#ffffff'
                          ? 'lightgrey'
                          : 'transparent'
                      }`}"
                    ></div>
                    {#if item.productVariant}
                      <div class="is-uppercase child">
                        {@html replaceEnVersionWithHelvetica300(
                          item.productVariant.name
                        )}
                      </div>
                    {/if}
                  </div>
                  <button
                    class="button is-black shop-button"
                    data-product-id="{item.product.id}"
                    data-store-url="{item.product.storeUrl}"
                    on:click="{openStorePage}"
                  >
                    {$_("wishlist.shopNow")}
                  </button>
                </div>
                <div class="btn-delete">
                  <img
                    src="/images/delete-btn.png"
                    alt=""
                    style="width:20px"
                    on:click="{async () => {
                      $mutationDeleteWishProductById.mutate({
                        wishlistId: item.id,
                      });
                    }}"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
      {/each}
    </div>
    <div class="download-icon">
      <button
        class="button is-outlined download-list is-fullwidth"
        class:is-loading="{isGeneratingImage}"
        disabled="{/* imageBase64Urls.length !== dataWishlist.length || */
        !dataWishlist.length}"
        on:click="{onClickDownload}"
      >
        {#if !isGeneratingImage}
          <span class="icon">
            <img src="/images/icon-download.png" alt="" />
          </span>
        {/if}
        <span class="download-text">
          {$_("wishlist.downloadList")}
        </span>
      </button>
    </div>
  </div>
  <div class="modal" class:is-active="{isImageOpen}">
    <div class="modal-background" on:click="{closeModal}"></div>
    <div class="modal-content has-text-centered">
      <img src="{imageUrl}" alt="" />
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      on:click="{closeModal}"></button>
  </div>
  {#if getAccessToken()}
    <ProfileFooter />
  {/if}
</Layout>

<style lang="scss">
  $scrollbar-thumb: grey;
  $scrollbar-track: transparent;

  .columns {
    display: flex;
    justify-content: space-between;
    .column {
      span {
        &.wishlist-title {
          font-size: 24px;
          color: white;
          font-weight: 250;
        }
      }
      &.end {
        text-align: right;
        font-size: 18px;
        color: white;
        font-weight: 250;
      }
    }
  }

  #capture {
    display: flex;
    flex-direction: column;
    height: calc(100% - 13rem);
    max-height: calc(100% - 13rem);
    width: 100%;
    padding: 0 0.75rem 0.75rem;
  }

  .scroll-list {
    overflow: hidden;
    overflow-y: auto;
    display: block;

    // scrollbar-width: thin;
    position: static;
    will-change: transform;
    // scrollbar-color: $scrollbar-thumb $scrollbar-track;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar-thumb {
      background-color: $scrollbar-thumb;
    }

    &::-webkit-scrollbar-track {
      background-color: $scrollbar-track;
    }

    &::-webkit-scrollbar {
      background-color: $scrollbar-track;
      width: 5px;
    }
    .wishlist-item {
      padding: 5px;
      padding-bottom: 1rem;
      border-radius: 0;
      margin-bottom: 5px;
      .media-content {
        overflow: initial;
        .content {
          position: relative;
        }
      }
      .hex-color {
        width: 14px;
        height: 14px;
        background: #ad6d5f;
        display: block;
        float: left;
        margin-right: 0.5rem;
        margin-top: 2px;
        /* display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 12px 60px;
        border-radius: 0;
        padding-top: 16px;
        margin-top: 17px; */
      }
      .title-item {
        font-size: 16px;
        margin-right: 24px;
        .shop-button {
          width: 130px;
          height: 30px;
          display: block;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          // padding: 16px 60px 12px;
          border-radius: 0;
          margin-top: 17px;
        }
      }
      .btn-delete {
        position: absolute;
        right: 1rem;
        bottom: -10px;
        cursor: pointer;
      }
      .figure {
        img {
          width: 120px;
          height: 120px;
        }
      }
    }
  }

  .download-icon {
    position: absolute;
    width: 100%;
    padding: 0.75rem;
    bottom: -3.5rem;
    left: 50%;
    transform: translateX(-50%);

    .button {
      border-color: white;
      background-color: black;
      border-radius: 0;
      color: white;
      .icon {
        padding-right: 10px;
      }
      /* .download-text {
        padding-top: 6px;
      } */
    }
  }

  .is-96x96 {
    img {
      max-height: 100%;
      object-fit: cover;
    }
  }
</style>
