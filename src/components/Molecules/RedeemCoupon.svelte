<script lang="ts">
  // import { toasts } from "svelte-toasts";
  import { sendAnalytics } from "@/api/analytics";

  import { redeemCoupon } from "@/api/wallet";
  import Coupon from "@/components/Atoms/Coupon.svelte";
  import CoinIcon from "@/components/Atoms/Icons/RedCoin.svelte";
  import { AnalyticsType } from "@/interfaces/analytics";
  import { couponAnalyticsId } from "@/stores/analytics";
  import { useMutation } from "@sveltestack/svelte-query";
  import { _ } from "svelte-i18n";
  import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
  // let close = "/icons/close.png";

  export let setPageType: (arg0: string) => string;
  export let data;

  const redemClick = (id: string) => {
    const payload = {
      couponId: id,
    };
    $mutationRedemCoupons.mutate(payload);
  };

  const mutationRedemCoupons = useMutation(redeemCoupon, {
    onError(error: Error) {
      console.log("GET TASK ERROR", error.message);
    },
  });

  $: {
    if ($mutationRedemCoupons.isSuccess) {
      sendAnalytics({
        type: AnalyticsType.COUPON_REDEEM,
        entryType: "end",
        id: $couponAnalyticsId,
      })
        .then(() => console.log("Coupon redemption tracked"))
        .catch((error) => console.error(error))
        .finally(() => {
          console.log("Redeem Coupon Success");
          setPageType("detail");
        });
    }
  }
</script>

<div class="content-container">
  <div class="header">
    <!-- <img src="{close}" alt="close icon" height="20" width="20" /> -->
    <button on:click="{() => setPageType('detail')}" class="btn-close">
      <span class="icon">
        <IoIosClose />
      </span>
    </button>
  </div>
  <div class="content">
    <div class="content-title">
      <h1 class="content-title-text">{$_("nwallet.confirmRedemption")}</h1>
      <h4 class="content-subtitle-text">
        <CoinIcon />
        <span>
          {$_("nwallet.forTheRedemption", {
            values: { price: data.price },
          })}
        </span>
      </h4>
    </div>
    <Coupon
      coin="{data.price}"
      date="{data.expiryDate}"
      name="{data.name}"
      thumbnail="{data.image || ''}"
    />
    <div class="content-description">
      {@html $_("nwallet.couponRadeemDesc")}
    </div>
    <button class="btn-confirm" on:click="{() => redemClick(data.id)}">
      {$_("nwallet.confirm")}
    </button>
  </div>
</div>

<style lang="scss">
  @import "../../styles/typography";
  .content-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .header {
    // width: 100%;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    color: #fff;
    font-weight: 500;
    width: 86%;
  }
  .content {
    height: 400px;
    box-sizing: border-box;
    padding: 1rem;
    background-color: #fff;
    color: #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 86%;
  }
  .content-title {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .content-description {
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 100;
    line-height: 1rem;
    font-size: 0.9rem;
  }
  .content-title-text {
    width: 100%;
    @include typography;
    font-size: 35px;
    text-align: center;
    text-transform: uppercase;
    color: #000;
  }
  .content-subtitle-text {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 0;
    span {
      @include typography;
      font-size: 1rem;
      text-align: center;
      text-transform: uppercase;
      color: #000;
      font-weight: 250;
      padding-top: 5px;
    }
  }
  .btn-confirm {
    background-color: #000;
    color: #fff;
    width: 230px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
  }

  .btn-close {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    margin-right: -8px;
    color: white;

    .icon {
      width: 40px;
      height: 40px;
    }
  }
</style>
