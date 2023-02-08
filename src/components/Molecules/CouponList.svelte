<script lang="ts">
  import { sendAnalytics } from "@/api/analytics";
  import type { TCoupon } from "@/api/wallet";
  import dayjs from "dayjs";
  import {
    getAvailableCoupons,
    getHistoryCoupons,
    // setDateWord,
  } from "@/api/wallet";
  // import { toasts } from "svelte-toasts";
  import RedCoinIcon from "@/components/Atoms/Icons/RedCoin.svelte";
  import { AnalyticsType } from "@/interfaces/analytics";
  import { couponAnalyticsId } from "@/stores/analytics";
  import {
    // replaceEnVersionWithHelvetica,
    replaceEnVersionWithHelvetica100,
  } from "@/utils/regexHelper";
  import { useMutation } from "@sveltestack/svelte-query";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  export let title = "";
  export let type = "";
  export let height = 0;
  export let setPageType: (arg0: string) => string;
  export let setRedemData: (arg0: TCoupon) => object;

  let dataAvailable: TCoupon[] = [];
  let dataHistory: TCoupon[] = [];

  const redemClick = async (data: TCoupon) => {
    setRedemData(data);
    let command: string;
    let analyticsType: AnalyticsType;

    if (data.status === "available") {
      command = "redeem";
      analyticsType = AnalyticsType.COUPON_REDEEM;
    } else {
      command = "use";
      analyticsType = AnalyticsType.COUPON_USE;
    }

    try {
      const result = await sendAnalytics({
        type: analyticsType,
        entryType: "start",
        couponId: data.id,
      });
      $couponAnalyticsId = result.data.id;
    } catch (error) {
      console.error(error);
    } finally {
      setPageType(command);
    }
  };

  height = window.innerHeight;

  const mutationGetAvailableCoupons = useMutation(getAvailableCoupons, {
    onError(error: Error) {
      console.log("GET TASK ERROR", error.message);
    },
  });
  const mutationGetHistoryCoupons = useMutation(getHistoryCoupons, {
    onError(error: Error) {
      console.log("GET TASK ERROR", error.message);
    },
  });

  onMount(() => {
    if (type === "available") {
      $mutationGetAvailableCoupons.mutate();
    } else {
      $mutationGetHistoryCoupons.mutate();
    }
  });

  $: {
    if ($mutationGetAvailableCoupons.isSuccess) {
      const newData = $mutationGetAvailableCoupons.data.data;
      dataAvailable = newData;
    } else if ($mutationGetHistoryCoupons.isSuccess) {
      const newDataHistory = $mutationGetHistoryCoupons.data.data;
      dataHistory = newDataHistory;
    }
  }
</script>

<div class="coupon-container">
  <h1 class="title">{title}</h1>
  <div class="list-wrapper">
    {#if type === "available"}
      {#if $mutationGetAvailableCoupons.isLoading}
        <div id="loading">{$_("nwallet.loading")}</div>
      {/if}
      {#each dataAvailable as item (item.id)}
        <div class="list-item">
          <div class="left-item">
            <img
              class="coupon-thumbnail"
              src="{item.image}"
              alt=""
              loading="lazy"
            />
          </div>
          <div class="right-item">
            <div class="item-wrapper">
              <h5 class="right-item-title">
                {@html replaceEnVersionWithHelvetica100(item.name)}
              </h5>
              <h6 class="right-item-expiry">
                {$_("nwallet.expiryDate")}
                <span class="helvetica-neue">
                  {dayjs(item.expiryDate).format("YYYY/MM/DD")}
                </span>
                <!-- {@html replaceEnVersionWithHelvetica(setDateWord())} -->
              </h6>
              <div class="right-item-coin">
                <RedCoinIcon width="{18}" height="{18}" />
                <div class="helvetica-neue-thin">{item.price}</div>
              </div>
            </div>
            <button
              on:click="{() => redemClick(item)}"
              class="right-item-button redem"
            >
              {item.status === "redeemed"
                ? $_("nwallet.use1")
                : $_("nwallet.redeem")}
            </button>
          </div>
        </div>
      {/each}
    {/if}
    {#if type === "history"}
      {#if $mutationGetHistoryCoupons.isLoading}
        <div id="loading">{$_("nwallet.loading")}</div>
      {/if}
      {#each dataHistory as item (item.id)}
        <div class="list-item">
          <div class="left-item">
            <img src="{item.image}" alt="" style="width:100%" loading="lazy" />
          </div>
          <div class="right-item">
            <div class="item-wrapper">
              <h5 class="right-item-title">{item.name}</h5>
              <h6 class="right-item-expiry">
                {$_("nwallet.expiryDate")}
                <span class="helvetica-neue">
                  {dayjs(item.expiryDate).format("YYYY/MM/DD")}
                </span>
                <!-- {setDateWord(dayjs(item.expiryDate).format("YYYY/MM/DD"))} -->
              </h6>
              <div class="right-item-coin">
                <RedCoinIcon width="{18}" height="{18}" />
                <div class="helvetica-neue-thin-text">{item.price}</div>
              </div>
            </div>
            <button class="right-item-button used">{$_("nwallet.used")}</button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .coupon-container {
    flex: 1;
    overflow-y: auto;
  }

  #loading {
    opacity: 0.5;
    font-weight: bold;
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    color: #fff;
    padding: 1rem;
    font-size: 14px;
    margin: 0;
  }
  .list-wrapper {
    display: flex;
    flex-direction: column;
    // max-height: 40vh;
    max-height: 100%;
    overflow-y: auto;
    background-color: white;
  }
  .list-item {
    background-color: #fff;
    width: 100%;
    min-height: 150px;
    border-bottom: 1px solid #000;
    display: flex;
    flex-direction: row;
  }
  .left-item {
    width: 40%;
    position: relative;

    .coupon-thumbnail {
      object-fit: cover;
      object-position: center center;
      width: 75%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .right-item {
    width: 60%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .right-item-title {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 250;
  }
  .right-item-expiry {
    font-size: 10px;
  }
  .item-wrapper {
    display: flex;
    flex-direction: column;
  }
  .right-item-coin {
    padding: 10px 0;
    display: flex;
    align-items: center;
    flex-direction: row;
    margin: 5px 0 8px;
  }
  .right-item-button {
    padding: 5px 15px;
    width: 60%;
    font-size: 13px;
    cursor: pointer;
    text-align: center;
    // padding-top: 7px;
  }
  .helvetica-neue-thin {
    max-height: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 18px;
    display: flex;
    align-items: center;
    margin-left: 5px;
    padding-top: 5px;
  }
  .redem {
    background-color: #000000;
    color: #fff;
  }
  .used {
    background-color: #595959;
    color: #fff;
  }
</style>
