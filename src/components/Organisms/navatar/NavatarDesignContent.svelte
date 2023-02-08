<script lang="ts">
  import { sendAnalytics } from "@/api/analytics";
  import {
    fetchHairColorList,
    fetchLookbookList,
    fetchModelList,
    fetchProductsByLookbookId,
    fetchSkintonesByLookbookId,
    getNavatar,
    saveNavatar,
  } from "@/api/navatar";
  import { fetchProfile } from "@/api/retailer";
  import { completeTask, EAvailableTasks } from "@/api/tasks";
  import { addProductToWishlist } from "@/api/product";
  import Spinner from "@/components/Atoms/Spinner.svelte";
  import Tabs from "@/components/Molecules/Tabs.svelte";
  import { AnalyticsType } from "@/interfaces/analytics";
  import { SkintonesEnum, TGetNavatarResponse } from "@/interfaces/navatar";
  import {
    hairColorsStore,
    headsStore,
    lookbookProductsStore,
    lookbookSkintonesStore,
    lookbooksStore,
    outfitStore,
    selectedNavatarModel,
    showLookbookNavatar,
  } from "@/stores/navatar";
  import { footerHeight, userData } from "@/stores/profile";
  import { isFromNavatarPage } from "@/stores/room";
  import {
    changeHeadModel,
    changeOutfitModel,
    initScene,
    releaseUsedMemory,
    removeListener,
  } from "@/utils/navatar/NavatarDesign";
  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  import { fade } from "svelte/transition";
  import type { Scene, PerspectiveCamera, WebGLRenderer } from "three";

  export let retailerName: string;

  let currentTab = 1;
  let el: HTMLCanvasElement;
  let myNavatar: TGetNavatarResponse;
  let PAGE = 1;
  let TOTAL_PAGE = 1;
  let LIMIT = 6;
  let isDirectLookBook = false;
  let threeObjects: {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: PerspectiveCamera;
  };
  let canvasContainerHeight = 0;
  let canvasContainerWidth = 0;
  type EventError = Event & {
    currentTarget: EventTarget & HTMLImageElement;
  };

  let fallback = "https://via.placeholder.com/200x200?text=Image+is+Error.";
  const handleError = (ev: EventError) => (ev.currentTarget.src = fallback);

  const getLookbookIndex = (): number => {
    return $lookbooksStore.findIndex(
      (item) => item.id === $selectedNavatarModel.lookBookId
    );
  };

  $: loading = false;
  const init = async () => {
    let lookbookId = $lookbooksStore ? $lookbooksStore[0].id : "";

    try {
      loading = true;
      // if ($lookbooksStore) {
      //   $selectedNavatarModel.lookBookId = $lookbooksStore[0].id;
      // }
      // fetch lookbooks from API
      // if (!$lookbooksStore) {
      const lookbookList = await fetchLookbookList(
        $userData.gender,
        PAGE,
        LIMIT
      );
      TOTAL_PAGE = lookbookList.totalPage;
      $lookbooksStore = lookbookList.data;
      // }

      // fetch hairColor from API
      if (!$hairColorsStore) {
        const hairColorList = await fetchHairColorList();
        $hairColorsStore = hairColorList;
      }

      // // fetch head from API
      if (!$headsStore) {
        const headList = await fetchModelList(1, 25, "head");

        $headsStore = headList.data.filter(
          (head) => head.gender === $userData.gender
        );
      }

      // // fetch body from API
      if (!$outfitStore) {
        const outfitList = await fetchModelList(1, 20, "outfit");

        $outfitStore = outfitList.data.filter(
          (outfit) => outfit.gender === $userData.gender
        );
      }

      myNavatar = await getNavatar();
      if (lookbookId) {
        $selectedNavatarModel.lookBookId = lookbookId;
      }
    } catch (error) {
      console.log({ error });
      console.log("Lookbook Error", error.message);
    } finally {
      loading = false;
    }
  };

  onMount(async () => {
    loading = true;
    if ($userData === null) {
      $userData = await fetchProfile();
      init();
    } else {
      init();
    }
    initScene(el)
      .then(({ threeObject }) => {
        threeObjects = threeObject;
      })
      .catch((error) => console.error(error))
      .finally(() => (loading = false));

    document.documentElement.style.setProperty(
      "--footer-height",
      `${$footerHeight}px`
    );
  });

  $: {
    if (myNavatar && myNavatar.data && !isDirectLookBook) {
      $selectedNavatarModel.lookBookId = myNavatar.data.lookBookId;
    }
  }

  $: {
    if (
      myNavatar &&
      myNavatar.data.lookBookId &&
      $selectedNavatarModel.lookBookId &&
      $lookbooksStore.length > 0 &&
      threeObjects
    ) {
      releaseUsedMemory(threeObjects.renderer, threeObjects.scene);
      removeListener();
      switch (currentTab) {
        case 1:
          {
            loading = true;
            const productsPromise = fetchProductsByLookbookId(
              $selectedNavatarModel.lookBookId
            );
            const skintonesPromise = fetchSkintonesByLookbookId(
              $selectedNavatarModel.lookBookId,
              ""
            );
            Promise.all([productsPromise, skintonesPromise])
              .then((result) => {
                $lookbookProductsStore = result[0];
                $lookbookSkintonesStore = result[1];
                loading = false;
              })
              .catch((error) => {
                loading = false;
                console.error(error);
              });
          }
          break;
        case 2: {
          loading = true;
          fetchSkintonesByLookbookId($selectedNavatarModel.lookBookId, "")
            .then((skintones) => {
              $lookbookSkintonesStore = skintones;
              loading = false;
            })
            .catch((error) => {
              loading = false;
              console.error(error);
            });
          break;
        }
        case 3:
          if (!$selectedNavatarModel.hairColor)
            $selectedNavatarModel.hairColor = $hairColorsStore.data[0].colorHex;

          if (!$selectedNavatarModel.headModel)
            $selectedNavatarModel.headModel = $headsStore[0].product3dModel;
          break;
        case 4:
          if (!$selectedNavatarModel.bodyModel)
            $selectedNavatarModel.bodyModel = $outfitStore[0].product3dModel;
          break;
      }
    }
  }

  $: {
    try {
      if ($lookbookSkintonesStore && $lookbookSkintonesStore.data[0]) {
        $selectedNavatarModel.lookBookTexture =
          $lookbookSkintonesStore.data[0].url;
      }
    } catch (error) {
      console.error(error.message);
      // toasts.warning("Choose your lookbook");
    } finally {
      loading = false;
    }
  }

  onDestroy(() => {
    releaseUsedMemory(threeObjects.renderer, threeObjects.scene);
    removeListener();
  });

  const save = async () => {
    try {
      loading = true;
      const payload = {
        hairColorHex: $selectedNavatarModel.hairColor,
        head3dModel: $selectedNavatarModel.headModel,
        lookBookId: $selectedNavatarModel.lookBookId,
        lookBookTexture: $selectedNavatarModel.lookBookTexture,
        outfit3dModel: $selectedNavatarModel.bodyModel,
        skinToneHex: $selectedNavatarModel.skintone,
      };
      await saveNavatar(payload);

      try {
        await sendAnalytics({
          type: AnalyticsType.SAVE_NAVATAR,
          entryType: "start",
          ...payload,
        });
      } catch (error) {
        console.error(error);
      }
      navigate(`/${retailerName}/profile/navatar-result`);
      await init();
    } catch (error) {
      console.log("Save Error", error.message);
    } finally {
      loading = false;
    }
  };

  const reset = () => {
    if (myNavatar && myNavatar.data) {
      $selectedNavatarModel.bodyModel = myNavatar.data.outfit3dModel;
      $selectedNavatarModel.hairColor = myNavatar.data.hairColorHex;
      $selectedNavatarModel.headModel = myNavatar.data.head3dModel;
      $selectedNavatarModel.lookBookId = myNavatar.data.lookBookId;
      $selectedNavatarModel.lookBookTexture = myNavatar.data.lookBookTexture;
      $selectedNavatarModel.skintone = myNavatar.data.skinToneHex;
    } else {
      $selectedNavatarModel.bodyModel = $outfitStore[0].product3dModel;
      $selectedNavatarModel.hairColor = $hairColorsStore.data[0].colorHex;
      $selectedNavatarModel.headModel = $headsStore[0].product3dModel;
      $selectedNavatarModel.lookBookId = $lookbooksStore[0].id;
      $selectedNavatarModel.lookBookTexture =
        $lookbookSkintonesStore.data[0].url;
      $selectedNavatarModel.skintone = $lookbookSkintonesStore.data[0].hexCode;
    }
  };

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

  $: {
    if ($lookbookProductsStore && $showLookbookNavatar) {
      $selectedNavatarModel.lookBookId = $showLookbookNavatar.id;
      $showLookbookNavatar = null;
    }
  }
</script>

<div
  style="{currentTab !== 4 ? 'min-height: 20rem' : 'min-height: 20rem;'}"
  id="canvas-container-designer"
  bind:clientHeight="{canvasContainerHeight}"
  bind:clientWidth="{canvasContainerWidth}"
>
  <div class="reset-save-buttons">
    <button id="reset" on:click="{reset}">
      <img src="/icons/undo-icon.svg" alt="undo-icon" />
    </button>
    <button id="save" on:click="{save}">{$_("navatar.save")}</button>
  </div>

  <canvas class="navatar-container" bind:this="{el}"></canvas>
</div>

{#if currentTab < 4 && $lookbooksStore && $lookbookSkintonesStore && $lookbookProductsStore && $hairColorsStore && $headsStore && $outfitStore && $selectedNavatarModel.skintone && $selectedNavatarModel.hairColor && $selectedNavatarModel.lookBookTexture && $selectedNavatarModel.headModel && threeObjects}
  {#await changeHeadModel($selectedNavatarModel.skintone, $selectedNavatarModel.hairColor, $selectedNavatarModel.lookBookTexture, $selectedNavatarModel.headModel, threeObjects)}
    <div id="loading"><Spinner /></div>
  {/await}
{/if}

{#if currentTab === 4 && $lookbooksStore && $lookbookSkintonesStore && $lookbookProductsStore && $hairColorsStore && $headsStore && $outfitStore && $selectedNavatarModel.skintone && $selectedNavatarModel.hairColor && $selectedNavatarModel.lookBookTexture && $selectedNavatarModel.headModel && threeObjects}
  {#await changeOutfitModel($selectedNavatarModel.skintone, $selectedNavatarModel.hairColor, $selectedNavatarModel.lookBookTexture, $selectedNavatarModel.headModel, $selectedNavatarModel.bodyModel, threeObjects)}
    <div id="loading"><Spinner /></div>
  {/await}
{/if}

{#if loading}
  <div id="loading"><Spinner /></div>
{/if}

<Tabs
  bind:activeTabValue="{currentTab}"
  items="{[
    { label: $_('navatar.lookbook'), value: 1 },
    { label: $_('navatar.skinTone'), value: 2 },
    { label: $_('navatar.head'), value: 3 },
    { label: $_('navatar.outfit'), value: 4 },
  ]}"
  flex="{currentTab === 4 ? '0 1 auto' : '1 0 auto'}"
/>

{#if 1 === currentTab && $lookbooksStore && $lookbookSkintonesStore}
  <div class="tab-body" id="lookbook">
    <h1 class="tab-panel-header">
      {@html $_("navatar.letsTry")}
    </h1>
    <div class="tab-panel">
      {#each $lookbooksStore as lookbook, i}
        <div
          class="lookbook-tab-content"
          style="cursor: pointer;"
          on:click="{() => {
            $selectedNavatarModel.lookBookId = lookbook.id;
            completeTask(EAvailableTasks.TryOnLook, lookbook.id)
              .then(() => {
                console.log('NCOINS earned from trying a lookbook');
              })
              .catch((error) => {
                console.error(error, error.stack);
              });
          }}"
        >
          <img
            src="{lookbook.thumbnail}"
            alt=""
            class:lookbook-selected="{$selectedNavatarModel.lookBookId ===
              lookbook.id}"
            class="lookbook-thumbnails"
          />
          <p style="width: 100%; text-align: center">{lookbook.name}</p>
          <div class="coin-section">
            <img
              src="/icons/ncoins-red.svg"
              width="20"
              height="20"
              alt=""
              style="{$selectedNavatarModel.lookBookId === lookbook.id
                ? 'filter: brightness(100%)'
                : 'filter: brightness(50%)'}"
            />
            <!-- TODO: NCOINS HERE -->
            <span class="helvetica-neue-thin">+100</span>
          </div>
          <span
            class:selected="{$selectedNavatarModel.lookBookId === lookbook.id}"
          ></span>
        </div>
        {#if $selectedNavatarModel.lookBookId && Math.floor(i / 3) === Math.floor(getLookbookIndex() / 3) && (i + 1) % 3 === 0}
          <div class="lookbook-description" in:fade out:fade>
            <div
              style="width: 100%; display: flex; justify-content: center; margin-bottom: 1rem;"
            >
              <svg
                width="17"
                height="10"
                viewBox="0 0 17 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 1L8.5 9L1 1" stroke="white" stroke-miterlimit="10"
                ></path>
              </svg>
            </div>
            <p>{$_("navatar.productsUsed")}</p>
            <div class="product-images">
              {#if $lookbookProductsStore && Array.isArray($lookbookProductsStore.data?.lookBookProducts)}
                {#each $lookbookProductsStore.data.lookBookProducts as products (products.product.id)}
                  <div
                    class="item"
                    on:click="{() => {
                      $isFromNavatarPage = true;
                      navigate(
                        `/${retailerName}/product/${products.product.id}`
                      );
                    }}"
                    on:error="{handleError}"
                  >
                    <img
                      src="{products.product.productThumbnail}"
                      alt="{products.product.name}"
                    />
                    <span
                      class="btn-plus"
                      data-product-id="{products.product.id}"
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
        {/if}
      {/each}
    </div>
    <!-- <InfiniteScroll
      elementScroll="{document.getElementById('lookbook')}"
      hasMore="{PAGE < TOTAL_PAGE}"
      threshold="{3}"
      on:loadMore="{async () => {
        try {
          PAGE++;
          const response = await fetchLookbookList(
            $userData.gender,
            PAGE,
            LIMIT
          );
          $lookbooksStore = [...$lookbooksStore, ...response.data];
        } catch (error) {
          console.error(error.message);
        }
      }}"
    /> -->
  </div>
{/if}

{#if 2 === currentTab && $lookbookSkintonesStore}
  <div class="tab-body">
    <!-- <h1 class="tab-panel-header">{@html $_("navatar.BasedOnFoundationSkus")}</h1> -->
    <h1 class="tab-panel-header">{@html $_("navatar.BestSellers")}</h1>
    <div class="tab-panel">
      {#each $lookbookSkintonesStore.data as skintone (skintone.id)}
        {#if skintone.type === SkintonesEnum.BEST_SELLER}
          <div
            class="skintones"
            on:click="{() => {
              $selectedNavatarModel.skintone = skintone.hexCode;
            }}"
            class:skintone-selected="{$selectedNavatarModel.skintone ===
              skintone.hexCode}"
          >
            <div
              style="{`width: 100%; height: 100%; background: ${skintone.hexCode}`}"
            ></div>
          </div>
        {/if}
      {/each}
    </div>
    <div style="border-bottom: 1px solid grey; margin-bottom: 10px;"></div>
    <h1 class="tab-panel-header">{@html $_("navatar.Regular")}</h1>
    <div class="tab-panel">
      {#each $lookbookSkintonesStore.data as skintone (skintone.id)}
        {#if skintone.type === SkintonesEnum.REGULAR}
          <div
            class="skintones"
            on:click="{() => {
              $selectedNavatarModel.skintone = skintone.hexCode;
            }}"
            class:skintone-selected="{$selectedNavatarModel.skintone ===
              skintone.hexCode}"
          >
            <div
              style="{`width: 100%; height: 100%; background: ${skintone.hexCode}`}"
            ></div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

{#if 3 === currentTab && hairColorsStore}
  <div class="tab-body">
    <div class="colortones">
      {#each $hairColorsStore.data as haircolor (haircolor.id)}
        <span
          class="colortone"
          style="{`background: ${haircolor.colorHex}`}"
          class:haircolor-selected="{$selectedNavatarModel.hairColor ===
            haircolor.colorHex}"
          on:click="{() =>
            ($selectedNavatarModel.hairColor = haircolor.colorHex)}"></span>
      {/each}
    </div>
    <div class="tab-panel">
      {#each $headsStore as head (head.id)}
        <div class="tab-content">
          <img
            src="{head.thumbnail === ''
              ? 'https://via.placeholder.com/100x100'
              : head.thumbnail}"
            alt="{head.name}"
            title="{head.name}"
            on:click="{() => {
              $selectedNavatarModel.headModel = head.product3dModel;
            }}"
          />
          <span
            class:selected="{$selectedNavatarModel.headModel ===
              head.product3dModel}"></span>
        </div>
      {/each}
    </div>
  </div>
{/if}

{#if 4 === currentTab && $outfitStore}
  <div class="tab-body-outfit">
    <div class="tab-panel-outfit">
      {#each $outfitStore as body (body.id)}
        <div class="tab-content-outfit">
          <img
            src="{body.thumbnail === ''
              ? 'https://via.placeholder.com/100x100'
              : body.thumbnail}"
            alt="{body.name}"
            title="{body.name}"
            on:click="{() => {
              $selectedNavatarModel.bodyModel = body.product3dModel;
            }}"
          />
          <span
            class:selected="{$selectedNavatarModel.bodyModel ===
              body.product3dModel}"></span>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  @import "../../../styles/canvas";

  .tab-body {
    padding-bottom: 80px;
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

  .reset-save-buttons {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 10px;
    bottom: 10px;
    width: 100%;
    z-index: 10;

    #save {
      background-color: black;
      color: white;
      padding: 0 1rem;
      height: 35px;
      min-width: 80px;
      text-align: center;
      font-size: 0.8rem;
      cursor: pointer;
      border: none;
    }

    #reset {
      cursor: pointer;
      background-color: black;
      color: white;
      border-radius: 50%;
      padding: 7px;
      height: 35px;
      width: 35px;
      text-align: center;
      border: none;
      img {
        width: 80%;
        margin: 0 auto;
        display: block;
      }
    }
  }

  #canvas-container-designer {
    position: relative;
  }

  .navatar-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .tab-panel {
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-flow: row dense;
    row-gap: 1rem;
    justify-items: center;
    color: white;
    gap: 16px;

    .lookbook-description {
      border-top: 1px solid grey;
      padding-top: 1rem;
      width: 100%;
      display: block;
      grid-column: 1 / span 3;

      p {
        grid-row: 1;
      }

      .product-images {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        position: relative;
        .item {
          position: relative;
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
          img {
            filter: brightness(100%);
            min-height: 100px;
            max-height: 150px;
            height: auto;
            width: auto;
            cursor: pointer;
          }
        }
      }
    }

    .coin-section {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      margin: 5px 0;
    }

    .tab-content {
      img {
        height: 100px;
        width: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      // flex-direction: column;
      // align-items: center;
    }

    .lookbook-tab-content {
      .lookbook-thumbnails {
        padding: 5px;
        height: auto;
        width: auto;
        @media screen and (min-width: 1400px) {
          height: auto;
          width: 150px;
        }
      }
      img {
        cursor: pointer;
        filter: brightness(50%);
      }
    }

    .lookbook-selected {
      filter: brightness(100%) !important;
      border: 1px solid white;
      padding: 4px !important;
    }

    .skintones {
      height: 100px;
      width: 100px;
      cursor: pointer;
      margin-bottom: 15px;
    }

    .skintone-selected {
      border: 1px solid white;
      padding: 5px;
    }

    .selected {
      height: 10px;
      width: 10px;
      background-color: red;
      border-radius: 50%;
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
  }

  .colortones {
    margin: 1rem;
    overflow-x: auto;
    white-space: nowrap;

    .colortone {
      cursor: pointer;
      // border: 1px solid grey;
      width: 50px;
      height: 50px;
      display: inline-block;
      margin: 0 10px;
    }
    .haircolor-selected {
      border: 1px solid white;
      padding: 5px;
    }
  }

  .tab-panel-header {
    padding: 0.3rem 1rem;
    color: white;
    text-transform: uppercase;
    width: 100%;
    display: block;
  }

  .tab-body {
    background-color: #242424;
    // height: 100%;
    overflow-y: auto;
    // height: calc(60% - 180px);
    margin-bottom: var(--footer-height);
  }

  .tab-body-outfit {
    background-color: #242424;
    // height: 100%;
    overflow-y: auto;
    // height: calc(50% - 180px);
    flex: 1;
    margin-bottom: var(--footer-height);

    .tab-panel-outfit {
      padding: 1rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-flow: row dense;
      row-gap: 1rem;
      justify-items: center;
      color: white;
      gap: 16px;

      .tab-content-outfit {
        img {
          height: 6.25rem;
          max-height: 6.25rem;
          width: auto;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        // flex-direction: column;
        // align-items: center;
      }

      .selected {
        height: 10px;
        width: 10px;
        background-color: red;
        border-radius: 50%;
        margin-left: auto;
        margin-right: auto;
        display: block;
      }
    }
  }
</style>
