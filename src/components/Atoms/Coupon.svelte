<script lang="ts">
  // import { setDateWord } from "@/api/wallet";
  import CoinIcon from "@/components/Atoms/Icons/RedCoin.svelte";
  import { replaceEnVersionWithHelvetica100 } from "@/utils/regexHelper";
  import { _ } from "svelte-i18n";
  import dayjs from "dayjs";

  let productA = "/images/productA.png";

  export let name: string;
  export let date: string;
  export let coin: number;
  export let thumbnail: string;
</script>

<div class="list-item">
  <div class="left-item">
    <img class="coupon-thumbnail" src="{thumbnail || productA}" alt="" />
  </div>
  <div class="right-item">
    <div class="item-wrapper">
      <h5 class="right-item-title">
        {@html replaceEnVersionWithHelvetica100(name)}
      </h5>
      <h6 class="right-item-expiry">
        {$_("nwallet.expiryDate")}
        <span class="helvetica-neue-bolder">
          {dayjs(date).format("YYYY/MM/DD")}
        </span>
        <!-- {@html replaceEnVersionWithHelvetica100(setDateWord(date))} -->
      </h6>
      <div class="right-item-coin">
        <CoinIcon />
        <span class="helvetica-neue-thin">-{coin}</span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .list-item {
    background-color: #fff;
    width: 100%;
    min-height: 150px;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right-item-title {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 250;
  }
  .right-item-expiry {
    font-size: 10px;
    font-weight: 250;
  }
  .item-wrapper {
    display: flex;
    flex-direction: column;
  }
  .right-item-coin {
    display: flex;
    align-items: center;
    flex-direction: row;
    span {
      padding-top: 5px;
      padding-left: 5px;
      font-size: 18px;
      font-weight: 250;
    }
  }
</style>
