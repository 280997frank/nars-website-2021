<script lang="ts">
  import { fetchProfile } from "@/api/wallet";
  import RedCoinIcon from "@/components/Atoms/Icons/RedCoin.svelte";
  import NavatarHead from "@/components/Atoms/NavatarHead.svelte";
  import CoinInfoModal from "@/components/Molecules/InfoCoin.svelte";
  import { chineseCharsPattern } from "@/constants/validationSchema";
  import { userData } from "@/stores/profile";
  import { retailerName } from "@/stores/retailer";
  import { replaceEnVersionWithHelvetica100 } from "@/utils/regexHelper";
  import { useMutation } from "@sveltestack/svelte-query";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  // import { toasts } from "svelte-toasts";

  let isModalCoinInfoOpen = false;
  let username = "";
  let chineseFormatName = "";

  const Info = "/images/icon-info.svg";
  const Camera = "/images/Camera.png";
  const ArrowRightCamera = "/images/arrow-right-camera.png";
  // let userData;

  const mutationGetProfile = useMutation(fetchProfile, {
    onError(error: Error) {
      console.log("GET TASK ERROR", error.message);
    },
  });

  onMount(() => {
    if (!$userData) {
      $mutationGetProfile.mutate();
    }
  });

  $: {
    if ($mutationGetProfile.isSuccess) {
      const newData = $mutationGetProfile.data;
      $userData = newData;
    }
  }

  $: {
    if ($userData) {
      username = $userData.firstName;
      chineseFormatName = $userData.lastName + $userData.firstName;
    }
  }

  function openProfile() {
    // Do nothing
  }
</script>

<div class="profile-wrap">
  <div class="title-top">
    {@html $_("profile.nwallet")}
    <div class="img-wrapper" on:click="{() => (isModalCoinInfoOpen = true)}">
      <img class="img-icon" src="{Info}" alt="Info" width="32" height="32" />
    </div>
  </div>
  {#if $mutationGetProfile.isLoading}
    <div id="loading">{$_("nwallet.loading")}</div>
  {/if}
  {#if $userData}
    <div class="avatar-wrap">
      <div class="left-section">
        <div class="image-wrapper">
          <NavatarHead
            width="{80}"
            height="{80}"
            onNavatarClick="{openProfile}"
          />
          <!-- <img
            class="img-avatar"
            src="{Avatar}"
            alt=""
            width="80"
            height="80"
          /> -->
        </div>
        <div class="content-wrapper">
          <h3 class="title-name">
            {@html chineseCharsPattern.test(username)
              ? chineseFormatName
              : replaceEnVersionWithHelvetica100(username)}
          </h3>
          <div class="title-coin">
            <RedCoinIcon width="{16}" height="{16}" />
            <h5 class="coin-total helvetica-neue">
              {$userData.ncoins}
            </h5>
          </div>
        </div>
      </div>
      <div
        class="right-section"
        on:click="{() => navigate(`/${$retailerName}/qrcode`)}"
      >
        <img
          class="camera-icon"
          src="{Camera}"
          alt="Camera"
          width="60"
          height="50"
        />
        <img
          class="arrow-right"
          src="{ArrowRightCamera}"
          width="19"
          height="32"
          alt=""
        />
      </div>
    </div>
  {/if}
  <CoinInfoModal
    isOpen="{isModalCoinInfoOpen}"
    onClose="{() => (isModalCoinInfoOpen = false)}"
  />
</div>

<style lang="scss">
  @import "../../styles/_typography.scss";
  .profile-wrap {
    color: #fff;
    padding: 1rem;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
  }
  .title-top {
    display: flex;
    font-size: 24px;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    font-weight: 400;
  }
  .img-wrapper {
    width: 28px;
    display: flex;
    justify-content: center;
    align-items: baseline;
    padding-top: 8px;
    height: 100%;
  }
  .img-icon {
    cursor: pointer;
    width: 28px;
  }

  .camera-icon {
    cursor: pointer;
    height: 28px;
    width: auto;
  }

  .arrow-right {
    cursor: pointer;
    width: 13px;
    margin-left: 13px;
  }

  .avatar-wrap {
    display: flex;
    justify-content: space-between;
  }
  .image-wrapper {
    background-color: #e6001e;
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin-right: 0.625rem;
  }
  /* .img-avatar {
    width: 100%;
    border-radius: inherit;
  } */
  .left-section {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  .content-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;
  }
  .title-name {
    @include typography;
    text-align: left;
    text-transform: uppercase;
    font-size: 24px;
    // height: 25px;
    line-height: 28.8px;
    font-weight: 250;
  }
  .title-coin {
    @include typography;
    font-weight: 250;
    font-size: 20px;
    display: flex;
    align-items: center;
    padding-top: 0.5rem;
  }
  .coin-total {
    font-size: 18px;
    padding-left: 4px;
    // padding-top: 5px;
  }
  .right-section {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
</style>
