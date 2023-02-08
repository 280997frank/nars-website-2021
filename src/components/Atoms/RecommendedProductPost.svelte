<script lang="ts">
  import {
    GuestAnalyticsType,
    sendAnalytics,
    sendGuestAnalytics,
  } from "@/api/analytics";
  import { addWishlistPost, TPostProduct } from "@/api/post";
  import { completeTask, EAvailableTasks } from "@/api/tasks";
  import { AnalyticsType } from "@/interfaces/analytics";
  import { UrlBacktoPost } from "@/stores/post";
  import { retailerName } from "@/stores/retailer";
  import { isFromPostPage } from "@/stores/room";
  import { getAccessToken, getGuestId } from "@/utils";
  import { useMutation } from "@sveltestack/svelte-query";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let dataProduct: TPostProduct[] = [];
  export let postId: string;
  export let postType: string;

  const pathname = window.location.pathname;
  let urlParams = `?postId=${postId}`;

  if (postType) {
    urlParams += `&type=${postType}`;
  }

  const newUrlBack = pathname + urlParams;

  const mutationAddWishlistPost = useMutation(addWishlistPost, {
    onSuccess() {
      // console.log("Added to wishlist");
      console.info("Added to wishlist");
    },
    onError(error: Error) {
      // console.log("Error", error.message);
      console.error("Error", error.message);
    },
  });

  const handleAddWishlist = async (
    productId: string,
    productVariantId = ""
  ) => {
    try {
      await sendAnalytics({
        type: AnalyticsType.PRODUCT_ADD_WISHLIST,
        entryType: "start",
        productId,
      });
    } catch (err) {
      // console.log("Error", err.message);
      console.error("Analytics Error", err.message);
    } finally {
      $mutationAddWishlistPost.mutate({
        productId,
        productVariantId,
      });
    }
  };

  type EventError = Event & {
    currentTarget: EventTarget & HTMLImageElement;
  };

  let fallback = "https://via.placeholder.com/200x200?text=Image+is+Error.";
  const handleError = (ev: EventError) => (ev.currentTarget.src = fallback);
  const goToDetailProduct = (id: string) => {
    //
    navigate(`/${$retailerName}/product/${id}`);
  };

  $: {
    if ($mutationAddWishlistPost.isSuccess) {
      completeTask(EAvailableTasks.AddProductToWishlist)
        .then(() => {
          console.log("NCOINS earned from adding product to wishlist");
        })
        .catch((error) => {
          console.error(error, error.stack);
        });
    }
  }
</script>

<div class="recommended-product column">
  <div class="columns title-recommended-product">
    <p>{$_("community.recommendedProduct")}</p>
  </div>
  <div class="columns is-mobile is-multiline list-recommended-product">
    {#each dataProduct as data (data.id)}
      {#if data.product}
        <div class="column is-one-third item-recommen">
          <figure
            class="image is-square"
            title="{data.product.name}"
            on:click="{async () => {
              try {
                if (getAccessToken()) {
                  await sendAnalytics({
                    type: AnalyticsType.CR_FEATURED,
                    entryType: 'start',
                    postId,
                    productId: data.product.id,
                  });
                } else {
                  await sendGuestAnalytics({
                    type: GuestAnalyticsType.CR_FEATURED,
                    entryType: 'start',
                    postId,
                    productId: data.product.id,
                    guestId: getGuestId(),
                  });
                }
              } catch (error) {
                console.error(error);
              }

              $UrlBacktoPost = newUrlBack;
              $isFromPostPage = true;
              goToDetailProduct(data.product.id);
            }}"
          >
            <img
              class="has-ratio"
              src="{data.product.productThumbnail || ''}"
              title="{data.product.name}"
              alt=""
              on:error="{handleError}"
            />
          </figure>
          <div
            class="btn-plus"
            title="{$_('discovery.addToWishlist')}"
            on:click="{() => {
              window.gtag('event', 'click', {
                event_category: 'alwayson_button_purchase',
                event_label: 'add_to_wishlist',
              });

              handleAddWishlist(
                data.productId,
                data.product.productVariants[0]?.id
              );
            }}"
          >
            +
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  p {
    color: gray;
    font-size: small;
    font-weight: 400;
  }
  .item-recommen {
    position: relative;
    padding: 5px !important;
  }
  .title-recommended-product {
    padding: 10px;
    padding-bottom: 0px;
  }
  .list-recommended-product {
    /* padding: 10px; */
    padding-top: 0%;
  }
  .btn-plus {
    background-color: black;
    color: white;
    position: absolute;
    right: 10%;
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
    object-fit: cover !important;
    cursor: pointer;
  }
</style>
