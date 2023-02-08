<script lang="ts">
  import {
    GuestAnalyticsType,
    sendAnalytics,
    sendGuestAnalytics,
  } from "@/api/analytics";
  import { getDetailProductById } from "@/api/product";
  import { completeTask, EAvailableTasks } from "@/api/tasks";
  import Spinner from "@/components/Atoms/Spinner.svelte";
  import FooterDetailProduct from "@/components/Molecules/FooterDetailProduct.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import { AnalyticsType } from "@/interfaces/analytics";
  import type { TLookbook } from "@/interfaces/navatar";
  import {
    ILookbookProducts,
    IProductDetail,
    IProductImages,
    IProductModules,
    IProductVariants,
    ModuleType,
  } from "@/interfaces/product";
  import {
    // lookbooksStore,
    backFromNavatar,
    showLookbookNavatar,
  } from "@/stores/navatar";
  import { UrlBacktoPost } from "@/stores/post";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import {
    currentRoom,
    isFromGamePage,
    isFromNavatarPage,
    isFromPostPage,
  } from "@/stores/room";
  import { getAccessToken, getGuestId, goToRoom } from "@/utils";
  import { shareProduct } from "@/utils/navatar/NavatarDesignResult";
  import {
    saveOpenedProductId,
    shouldSendCompleteTaskRequest,
  } from "@/utils/product";
  import {
    replaceEnVersionWithHelvetica,
    replaceEnVersionWithHelvetica100,
  } from "@/utils/regexHelper";
  import queryString from "query-string";
  import { onMount } from "svelte";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  type SortableItem = IProductModules;
  type SortableImages = IProductImages;

  export let id: string;
  export let retailerName: string;

  const renderTitle = () => {
    if ($isFromNavatarPage) {
      return $_("backButton.profile");
    } else if ($isFromPostPage) {
      return $_("backButton.nonstopCommunity");
    } else if ($isFromGamePage) {
      return $_("backButton.backToGame");
    } else {
      return $currentRoom === "hall"
        ? $_("backButton.nonstopHall")
        : $_("backButton.nonstopDiscovery");
    }
  };

  $retailerNameStore = retailerName;

  let indexImg: string;
  let imageChoosed: string;
  let choosedVarian: IProductVariants;
  let canvas: HTMLDivElement;
  let imagesScroll: HTMLDivElement;
  let clientHeight = 0;
  let data: IProductDetail;
  let lookbookProducts: ILookbookProducts[] = [];
  let modalOpen = false;
  let modalImage = "";
  let showListColor = false;
  let indexVariant = 0;
  let indexThumbnail = 0;
  let hasSentAnalytics = false;
  let loading = false;
  let isVariants = false;
  let thumbnailCarouselWidth = 0;

  const location = queryString.parse(window.location.search);

  let colorVariantPage = {
    from: 0,
    to: 16,
    page: 1,
    perPage: 16,
  };

  const changeFocusImg = (img: string, id: string) => {
    const selectedVariant = data.productVariants[indexVariant];
    imageChoosed = img;
    indexImg = id;
    indexThumbnail = selectedVariant.productThumbnails.findIndex(
      (x) => x.id === id
    );
  };

  const pickedVariant = (picked: IProductVariants) => {
    choosedVarian = picked;
    showListColor = false;
    indexVariant = data.productVariants.findIndex(
      (x) => x.hexCode === picked.hexCode
    );
    changeFocusImg(
      choosedVarian.productThumbnails[0].thumbnail,
      choosedVarian.productThumbnails[0].id
    );
  };

  const scrollToDown = () => {
    const selectedVariant = data.productVariants[indexVariant];
    if (indexThumbnail >= selectedVariant.productThumbnails.length - 1) {
      indexThumbnail = -1;
      imagesScroll.scrollTop = 0;
    }
    if (indexThumbnail >= 3) {
      imagesScroll.scrollTop =
        imagesScroll.scrollHeight - imagesScroll.clientHeight;
    }
    // console.log("imagesScroll down", imagesScroll.scrollTop)
    let i = (indexThumbnail += 1);
    changeFocusImg(
      selectedVariant.productThumbnails[i].thumbnail,
      selectedVariant.productThumbnails[i].id
    );
  };
  const scrollToUP = () => {
    const selectedVariant = data.productVariants[indexVariant];
    if (indexThumbnail < 1) {
      // imagesScroll.scrollTop = imagesScroll.scrollHeight + imagesScroll.clientHeight;
      indexThumbnail = selectedVariant.productThumbnails.length;
      setTimeout(function () {
        imagesScroll.scrollTop =
          imagesScroll.scrollHeight - imagesScroll.clientHeight;
      }, 100);
    }

    if (indexThumbnail >= 3) {
      imagesScroll.scrollTop -= 50;
    }
    let i = (indexThumbnail -= 1);
    changeFocusImg(
      selectedVariant.productThumbnails[i].thumbnail,
      selectedVariant.productThumbnails[i].id
    );
  };

  const rightArrow = (total: number) => {
    const { from, to, page, perPage } = colorVariantPage;
    const totalPage = Math.ceil(total / 16);
    if (page < totalPage) {
      colorVariantPage = {
        ...colorVariantPage,
        from: from + perPage,
        to: to + perPage,
        page: page + 1,
      };
    } else {
      colorVariantPage = {
        ...colorVariantPage,
        from: 0,
        to: 16,
        page: 1,
      };
    }
  };

  const leftArrow = (total: number) => {
    const { from, to, page, perPage } = colorVariantPage;
    const totalPage = Math.ceil(total / 16);
    if (page === 1) {
      colorVariantPage = {
        ...colorVariantPage,
        from: perPage * (totalPage - 1),
        to: perPage * totalPage,
        page: totalPage,
      };
    } else {
      colorVariantPage = {
        ...colorVariantPage,
        from: from - perPage,
        to: to - perPage,
        page: page - 1,
      };
    }
  };

  const getDetail = async () => {
    try {
      const res = await getDetailProductById(id);
      data = res.data;
      if (data.productVariants.length > 0) {
        pickedVariant(data.productVariants[0]);
        changeFocusImg(
          data.productVariants[0].productThumbnails[0].thumbnail,
          data.productVariants[0].productThumbnails[0].id
        );
        isVariants = true;
      }

      if (data.lookBookProducts.length > 0) {
        data.lookBookProducts.map((item) => {
          if (item.lookBook) {
            lookbookProducts.push(item);
          }
        });
      }
    } catch (error) {
      goToRoom(`/${retailerName}`);
      console.error(error.message);
    }
  };

  const setLookbook = (data: TLookbook) => {
    // $lookbooksStore = data;
    showLookbookNavatar.set(data[0]);
    navigate(`/${retailerName}/profile/navatar`);
  };

  async function trackVideoPlay() {
    try {
      if (!hasSentAnalytics) {
        if (getAccessToken()) {
          await sendAnalytics({
            type: AnalyticsType.PRODUCT_VIDEOPLAY,
            entryType: "start",
            productId: id,
          });
        } else {
          await sendGuestAnalytics({
            type: GuestAnalyticsType.PRODUCT_VIDEOPLAY,
            entryType: "start",
            productId: id,
            guestId: getGuestId(),
          });
        }

        hasSentAnalytics = true;
      }
    } catch (error) {
      console.error(error);
    }
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

  function sortImages(a: SortableImages, b: SortableImages) {
    if (a.index < b.index) {
      return -1;
    }

    if (a.index > b.index) {
      return 1;
    }

    return 0;
  }

  onMount(() => {
    if (id) {
      getDetail().then(async () => {
        saveOpenedProductId(id);

        if (shouldSendCompleteTaskRequest()) {
          try {
            await completeTask(EAvailableTasks.BrowseThreeProducts);
            console.log("NCOINS earned from browsing three products");
          } catch (error) {
            console.error(error, error.stack);
          }
        }
      });
    }
  });

  $: {
    if (clientHeight && !thumbnailCarouselWidth) {
      const GAP = 5; // 5px from .imgs
      const arrow = document.querySelector(".btn-arrow-img");
      thumbnailCarouselWidth =
        ((clientHeight - 4 * GAP - 2 * arrow.clientHeight) / 5) * 0.855;
    }
  }
</script>

<Layout>
  <Navbar
    backTitle="{renderTitle()}"
    onBackButtonClick="{() => {
      if ($isFromNavatarPage) {
        $isFromNavatarPage = false;
        navigate(`/${retailerName}/profile/navatar`);
      } else if ($isFromPostPage) {
        $isFromPostPage = false;
        navigate($UrlBacktoPost);
      } else if ($isFromGamePage) {
        $isFromGamePage = false;
        navigate(`/${retailerName}/game`);
      } else {
        if (location.category) {
          goToRoom(`${$currentRoom}&category=${location.category}`);
        } else {
          goToRoom($currentRoom);
        }
      }
    }}"
  />
  <div class="wrapper">
    <!-- Product Thumbnails -->
    {#if data && !!data.productVariants.length}
      <div class="img-wrapper is-flex is-flex-direction-row">
        <div class="main-img" bind:this="{canvas}">
          {#if data}
            <figure class="image is-square" bind:clientHeight>
              <img src="{imageChoosed}" alt="" />
            </figure>
          {/if}
        </div>
        <!-- width: {thumbnailCarouselWidth}px -->
        <div
          class="list-img is-flex is-flex-direction-column"
          style="max-height: {clientHeight}px !important; width: {thumbnailCarouselWidth}px"
        >
          <img
            on:click="{scrollToUP}"
            class:is-visible="{true}"
            class="btn-arrow-img mb-2"
            src="/icons/arrow.png"
            width="29"
            height="48"
            alt=""
          />
          <div
            id="imagesScroll"
            class="imgs is-flex is-flex-direction-column"
            bind:this="{imagesScroll}"
          >
            {#each data.productVariants[indexVariant].productThumbnails as item (item.id)}
              <div
                on:click="{() => changeFocusImg(item.thumbnail, item.id)}"
                class="item-img image is-square"
                class:is-active="{item.id === indexImg}"
              >
                <img src="{item.thumbnail}" alt="" />
              </div>
            {/each}
          </div>
          <img
            on:click="{scrollToDown}"
            class="btn-arrow-img mt-2"
            class:is-visible="{true}"
            src="/icons/arrow.png"
            width="29"
            height="48"
            alt=""
          />
        </div>
      </div>
    {/if}
    {#if data && data.productVariants.length === 0}
      <div class="img-wrapper">
        <div class="main-img my-2" bind:this="{canvas}">
          <img src="{data.productThumbnail}" alt="" />
        </div>
      </div>
    {/if}
    <!-- New Arrival Label -->
    <div class="label my-4">
      {#if data}
        <span class:is-visible="{data.isNewArrival}">New Arrival</span>
      {/if}
    </div>
    <!-- Title -->
    <div
      class="title-text is-flex is-flex-direction-row is-justify-content-space-between my-4"
      class:is-visible="{!isVariants}"
    >
      <span>
        {@html data
          ? replaceEnVersionWithHelvetica(data.name)
          : $_("nwallet.loading")}
      </span>
      {#if (data && data.productThumbnail) || imageChoosed}
        <button
          class="download-image"
          on:click="{async () => {
            try {
              loading = true;
              const img = await shareProduct(
                {
                  name: data.name,
                  choosedColor: {
                    color: choosedVarian ? choosedVarian.hexCode : '',
                    label: choosedVarian ? choosedVarian.name : '',
                  },
                  url: imageChoosed ?? data.productThumbnail,
                },
                canvas
              );

              modalImage = img;
              modalOpen = true;
              loading = false;
              const link = document.createElement('a');
              link.download = 'share-product.png';
              link.href = img;
              link.click();
            } catch (error) {
              loading = false;
              console.log('error ', error);
              console.log('Share Error', error.message || error.errmsg);
            }
            try {
              await sendAnalytics({
                type: AnalyticsType.PRODUCT_SHARE,
                entryType: 'start',
                productId: id,
              });
            } catch (error) {
              console.error(error);
            }
          }}"
        >
          <img src="/images/uploadIcon.svg" width="16" height="24" alt="" />
        </button>
      {/if}
    </div>
    <!-- Product Variants Swatch -->
    {#if data && !!data.productVariants.length}
      <div class="color-pickup is-flex is-flex-direction-row">
        {#if data.productVariants.length > 16}
          <img
            class="btn-arrow"
            on:click="{() => leftArrow(data.productVariants.length)}"
            src="/icons/arrow.png"
            alt=""
            width="29"
            height="48"
          />
        {/if}
        <div class="color-list">
          {#each data.productVariants.filter((_, key) => key >= colorVariantPage.from && key < colorVariantPage.to) as item (item.id)}
            <span
              on:click="{() => pickedVariant(item)}"
              style="background-color: {item.hexCode};"
              class:is-active="{choosedVarian.id === item.id}"></span>
          {/each}
        </div>
        {#if data.productVariants.length > 16}
          <img
            class="btn-arrow"
            on:click="{() => rightArrow(data.productVariants.length)}"
            src="/icons/arrow.png"
            alt=""
            width="29"
            height="48"
          />
        {/if}
      </div>
    {/if}
    <!-- Product Variants Dropdown -->
    {#if data && !!data.productVariants.length}
      <div class="color-dropdown is-flex is-flex-direction-column">
        <div
          class="color-picked is-flex is-flex-direction-row is-justify-content-space-between"
          on:click="{() => (showListColor = !showListColor)}"
        >
          <div class="is-flex is-flex-direction-row">
            <span
              style="background-color: {data && choosedVarian.hexCode};"
              class="color-box"></span>
            <div class="color-text">
              {@html data
                ? replaceEnVersionWithHelvetica100(choosedVarian.name)
                : $_("nwallet.loading")}
            </div>
          </div>
          <img
            class="btn-arrow-down-list-color"
            class:is-visible="{showListColor}"
            src="/icons/arrow.png"
            width="29"
            height="48"
            alt=""
          />
        </div>
        {#if data && !!data.productVariants.length}
          {#each data.productVariants.filter((item) => item.hexCode !== choosedVarian.hexCode) as item (item.id)}
            <div
              class="color-list-dropdown is-flex is-flex-direction-row is-justify-content-flex-start"
              class:is-visible="{showListColor}"
            >
              <div
                class="is-flex is-flex-direction-row is-pointer"
                on:click="{() => pickedVariant(item)}"
              >
                <span
                  style="background-color: {item.hexCode};"
                  class="color-box"></span>
                <div class="color-text">
                  {@html replaceEnVersionWithHelvetica100(item.name)}
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
    {#if data}
      {#each data.productModules.sort(sortItem) as productModule (productModule.id)}
        {#if productModule.type === ModuleType.TEXT}
          <p class="text-content my-3">
            {@html replaceEnVersionWithHelvetica100(productModule.text)}
            <!-- {@html productModule.text} -->
          </p>
        {:else if productModule.type === ModuleType.IMAGE}
          {#each productModule.productImages.sort(sortImages) as image (image.id)}
            <img class="my-2" src="{image.image}" alt="" width="100%" />
          {/each}
        {:else if productModule.type === ModuleType.LOOKBOOK}
          {#if data.lookBookProducts.length > 0}
            {#each lookbookProducts as item, i (item.id)}
              <div
                class="lookbook-image my-2 is-flex"
                class:is-reverse="{i % 2}"
              >
                <img
                  class="lookbook-image-product"
                  src="{item.lookBook.thumbnailProduct}"
                  alt="{item.lookBook.name}"
                />
                <h3>{item.lookBook.name}</h3>
                <button
                  class="button lookbook"
                  on:click="{async () => {
                    try {
                      await sendAnalytics({
                        type: AnalyticsType.PRODUCT_TRY,
                        entryType: 'start',
                        productId: id,
                        lookBookId: item.lookBook.id,
                      });
                    } catch (error) {
                      console.error(error);
                    }
                    backFromNavatar.set(
                      window.location.pathname + window.location.search
                    );
                    setLookbook({
                      id: item.lookBook.id,
                      name: item.lookBook.name,
                      thumbnail: item.lookBook.thumbnail,
                      thumbnailProduct: item.lookBook.thumbnailProduct,
                      isActive: item.lookBook.isActive,
                    });
                  }}"
                >
                  <img src="/images/daylook-ico.svg" alt="" />
                </button>
              </div>
            {/each}
          {/if}
        {:else if productModule.type === ModuleType.VIDEO}
          <div class="product-video">
            <h3 class="my-2">{productModule.videoTitle}</h3>
            <video
              muted="{false}"
              autoPlay="{false}"
              loop
              playsInline
              controls
              on:play="{trackVideoPlay}"
            >
              <source src="{productModule.videoUrl}" type="video/mp4" />
            </video>
          </div>
        {/if}
      {/each}
    {/if}

    {#if data}
      <FooterDetailProduct
        dataFooter="{data}"
        choosedVarian="{choosedVarian}"
      />
    {/if}
  </div>
  {#if loading}
    <div id="loading"><Spinner /></div>
  {/if}
</Layout>

<div class="modal" class:is-active="{modalOpen}">
  <div class="modal-background" on:click="{() => (modalOpen = false)}"></div>
  <div class="modal-content has-text-centered">
    <img src="{modalImage}" alt="" />
  </div>
  <button
    class="modal-close is-large"
    aria-label="close"
    on:click="{() => (modalOpen = false)}"></button>
</div>

<style lang="scss">
  @import "../../../styles/typography";

  .is-pointer {
    cursor: pointer;
  }

  #loading {
    background-color: grey;
    opacity: 0.5;
    font-weight: bold;
    color: black;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 25;
  }

  @mixin box-color {
    // min-width: 30px;
    height: 30px;
    cursor: pointer;
  }

  .wrapper {
    // @include flex-column;
    // font-family: "Noto Sans", sans-serif;
    height: 100%;
    height: -webkit-fill-available;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 5px 15px;
    width: inherit;
    // position: relative;
    padding-bottom: 150px;

    @supports (-webkit-touch-callout: none) {
      padding-bottom: 70px;
    }

    &::-webkit-scrollbar {
      width: 0;
    }
    .img-wrapper {
      width: 100%;
      // height: 305px;
      max-height: min-content;
      overflow: hidden;
      gap: 5px;
      .main-img {
        width: inherit;
        height: inherit;
        flex-grow: 1;
        img {
          object-fit: cover;
          object-position: center;
          transition: 0.3s;
          width: auto;
          height: 100%;
          margin: 0 auto;
        }
      }
      .list-img {
        height: inherit;
        // max-height: inherit;
        // width: 50px;
        // max-width: 50px;
        // min-width: 50px;
        // justify-content: space-between;
        align-items: center;
        overflow: hidden;
        // margin-left: 7px;
        .btn-arrow-img {
          margin: 2px 0;
          cursor: pointer;
          display: none;
          transform: rotate(90deg);
          width: 0.5rem;

          &:first-child {
            transform: rotate(-90deg);
            display: none;
          }
          &.is-visible {
            display: inline-block;
          }
        }
        .imgs {
          scrollbar-width: none;
          overflow: auto;
          gap: 5px;
          height: 100%;
          width: 100%;
          &::-webkit-scrollbar {
            width: 0;
          }
          .item-img {
            position: relative;
            cursor: pointer;
            img {
              width: 100%;
              object-fit: cover;
              height: 100%;
            }
            &::after {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              height: 100%;
              right: 0;
              background-color: rgba($color: #000000, $alpha: 0.6);
            }
            &.is-active {
              &::after {
                background-color: transparent;
              }
            }
          }
        }
      }
    }
    .label {
      // margin: 10px 0;
      width: 100%;
      position: relative;
      border-bottom: 1px solid rgba(41, 41, 41, 1);
      span {
        display: none;
        background-color: red;
        padding: 5px 10px;
        width: fit-content;
        font-size: 1rem;
        font-weight: 300;
        color: white;
        &.is-visible {
          display: inline-block;
        }
      }
    }
    .title-text {
      color: white;
      align-items: center;

      &.is-visible {
        border-bottom: 1px solid rgba(41, 41, 41, 1);
      }
      span {
        // @include typography;
        font-weight: 100;
        font-size: 24px;
        text-align: left;
        text-transform: uppercase;
      }
      button {
        border: none;
        background-color: transparent;
        img {
          min-width: 16px;
        }
      }
    }

    .color-pickup {
      width: 100%;
      // max-width: auto;
      position: relative;
      // padding: 0 10px;
      img {
        position: absolute;
        bottom: 50%;
        top: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
        width: 0.5rem;
        cursor: pointer;

        &:first-child {
          left: -6px;
          transform: translate(-50%, -50%) rotate(180deg);
        }
        &:last-child {
          right: -13px;
          // transform: rotate(-90deg);
        }
      }
      .color-list {
        scrollbar-width: 0;
        width: 100%;
        // padding-left: 1.5%;
        // padding-right: 1.5%;
        flex-wrap: wrap;
        grid-template-columns: repeat(auto-fill, 12.5%);
        display: grid;
        overflow: hidden;
        &::-webkit-scrollbar {
          width: 0;
        }
        span {
          @include box-color;
          width: unset;
          height: 0;
          padding-bottom: 100%;
          margin: 1px;
          &:hover,
          &.is-active {
            transform: scale(1.2);
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
          }
        }
      }
    }
    .color-dropdown {
      margin: 15px 0;
      width: 100%;
      padding: 6px 0;
      border-bottom: 1px solid rgba(41, 41, 41, 1);
      border-top: 1px solid rgba(41, 41, 41, 1);

      .color-picked {
        cursor: pointer;
      }

      .color-picked,
      .color-list-dropdown {
        justify-content: space-between;
        align-items: center;
        width: inherit;
        div {
          padding: 2px 0;
          justify-content: space-between;
          align-items: center;
          span:first-child {
            @include box-color;
            width: 30px;
            display: inline-block;
          }
          .color-text {
            font-size: 0.8rem;
            color: white;
            margin-top: 1px;
            margin-left: 10px;
            text-transform: uppercase;
          }
        }
        .btn-arrow-down-list-color {
          transition: 0.3s;
          cursor: pointer;
          width: 0.5rem;
          transform: rotate(90deg);

          &.is-visible {
            transform: rotate(-90deg);
          }
        }
      }
      .color-list-dropdown {
        height: 0;
        overflow: hidden;
        transition: 0.4s;
        // .color-item-dropdown {
        //   width: inherit;
        // }
        &.is-visible {
          height: fit-content;
        }
      }
    }
    .lookbook-image {
      position: relative;
      justify-content: flex-start;
      flex-direction: row;
      align-items: flex-end;
      height: 300px;
      // max-height: fit-content;
      &.is-reverse {
        flex-direction: row-reverse;
      }
      &-product {
        width: 60%;
        height: inherit;
        object-fit: cover;
        object-position: center;
      }
      h3 {
        @include paragraph;
        font-size: 1.7rem;
        margin: 5px 15px;
        text-align: left;
        writing-mode: vertical-rl;
        text-orientation: sideways;
        height: inherit;
        word-wrap: break-word;
        transform: rotate(180deg);
        transform-origin: 0, 0;
      }
    }
    .product-video {
      margin-top: 1.8rem;
      h3 {
        @include paragraph;
        text-align: left;
        font-size: 1.6rem;
      }
      video {
        width: 100%;
      }
    }
    .text-content {
      @include paragraph;
      text-align: left;
      font-size: 15px;
      font-weight: 200;
      // line-height: 1.2;
      overflow: hidden;
      & :global(strong) {
        color: white;
        font-weight: 400;
      }
      & :global(em) {
        font-style: italic;
      }
      & :global(u) {
        text-decoration: underline;
      }
    }

    .button.lookbook {
      background-color: transparent;
      border: none;
      padding: 0;
    }

    .download-image {
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  }
</style>
