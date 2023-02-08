<script lang="ts">
  import { onMount } from "svelte";
  // import { navigate } from "svelte-routing";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";

  import Button from "@/components/Atoms/Button.svelte";
  import NavatarHead from "@/components/Atoms/NavatarHead.svelte";

  import { isChangeLocationModalShow } from "@/stores/changeLocation";
  import { isHamburgerShown } from "@/stores/navbar";
  import {
    lookbookProductsStore,
    navatarFace,
    selectedNavatarModel,
  } from "@/stores/navatar";
  import { currentRoom } from "@/stores/room";
  import { retailerName } from "@/stores/retailer";
  import { userData } from "@/stores/profile";
  import {
    isWelcomeModalShown,
    isExploreButtonShown,
  } from "@/stores/welcomeModal";

  import {
    createScene,
    releaseUsedMemory,
    removeListener,
    share,
  } from "@/utils/navatar/NavatarDesignResult";
  import { getAccessToken, goToRoom } from "@/utils";
  import { fetchProductsByLookbookId } from "@/api/navatar";
  import UploadIcon from "@/components/Atoms/Icons/UploadIcon.svelte";

  import { sendAnalytics } from "@/api/analytics";

  import { AnalyticsType } from "@/interfaces/analytics";

  export let isActive: boolean;

  let products = [];
  let el: HTMLCanvasElement;
  let loadingShare = false;
  $: modalOpen = false;
  $: modalImage = "";

  let placeholderNavatar = "";

  function openChangeLocationModal() {
    $isHamburgerShown = false;
    $isChangeLocationModalShow = true;
  }

  function resizeWhenScrolled() {
    let navbar = document.getElementById("navbar") as HTMLDivElement;
    let navbarMenu = document.getElementById(
      "navbarBasicExample"
    ) as HTMLDivElement;
    const offsetHeight = navbar ? navbar.offsetHeight : 0;
    let top: number = offsetHeight + 15;
    navbarMenu.style.top = `${top}px`;
  }

  function navigateTo(param: string) {
    location.assign(param);
    // location.pathname = param;
    // $isHamburgerShown = false;
    // $isChangeLocationModalShow = false;
    // navigate(param);
  }

  function shareFunction() {
    loadingShare = true;
    fetchProductsByLookbookId($selectedNavatarModel.lookBookId)
      .then((result) => {
        $lookbookProductsStore = result;
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
        // loadingShare = false;
        createScene(
          el,
          "navatar-container-navbar-menu",
          $selectedNavatarModel.skintone,
          $selectedNavatarModel.hairColor,
          $selectedNavatarModel.lookBookTexture,
          $selectedNavatarModel.headModel,
          $selectedNavatarModel.bodyModel
        ).then(() => {
          const qrCodePath = "/images/qr-code-menu.png";
          share(qrCodePath, products)
            .then((imageUrl) => {
              modalImage = imageUrl;
              modalOpen = true;
              loadingShare = false;

              const link = document.createElement("a");
              link.download = "share.png";
              link.href = imageUrl;
              link.click();
            })
            .catch((error) => {
              loadingShare = false;
              console.log({ error });
              // toasts.error("Share Error", error.message || error.errmsg);
              console.error("Share Error", error.message || error.errmsg);
            });
        });
      })
      .catch((error) => {
        loadingShare = false;
        // toasts.error("get product Error", error.message || error.errmsg);
        console.error("get product Error", error.message || error.errmsg);
      });
  }

  async function openRoom(room: string) {
    let analyticsType = AnalyticsType.MENU_NONSTOP_HALL;
    let mustBeAuthenticated = true;

    switch (room) {
      case "play":
        analyticsType = AnalyticsType.MENU_NONSTOP_PLAY;
        break;
      case "community":
        analyticsType = AnalyticsType.MENU_NONSTOP_COMMUNITY;
        break;
      case "discovery":
        analyticsType = AnalyticsType.MENU_NONSTOP_DISCOVERY;
        break;
      default:
        mustBeAuthenticated = false;
    }

    if (getAccessToken()) {
      try {
        await sendAnalytics({
          type: analyticsType,
          entryType: "start",
        });
      } catch (error) {
        console.error(error);
      } finally {
        goToRoom(room);
      }
    } else if (mustBeAuthenticated) {
      $isHamburgerShown = false;
      $isExploreButtonShown = false;
      $isWelcomeModalShown = true;
    } else {
      // goToRoom(room);
      $isHamburgerShown = false;
    }
  }

  onMount(() => {
    resizeWhenScrolled();

    window.addEventListener("resize", resizeWhenScrolled, false);

    return () => {
      window.removeEventListener("resize", resizeWhenScrolled, false);
      removeListener();
      releaseUsedMemory();
    };
  });

  $: {
    if ($userData?.gender === "male") {
      placeholderNavatar = "/images/placeholder-male-navatar.png";
    } else {
      placeholderNavatar = "/images/placeholder-female-navatar.png";
    }
  }
</script>

<div
  class="container-modal"
  class:is-active="{isActive}"
  id="navbarBasicExample"
>
  <NavatarHead
    width="{90}"
    height="{90}"
    isHidden
    useWhiteBackground
    onNavatarClick="{() => {
      //
    }}"
  />
  {#if loadingShare}
    <div id="loading-x">{$_("nwallet.loading")}</div>
  {/if}
  <div class="canvas-container" id="navatar-container-navbar-menu">
    <canvas class="navatar-container" bind:this="{el}"></canvas>
  </div>
  <div></div>
  <div class="img">
    <svg
      width="2236"
      height="1882"
      viewBox="0 0 2236 1882"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <image class="img-menu" href="{$_('burgerMenu.mapImage')}"></image>
      <!-- <a on:click="{() => openRoom('hall')}" href="{'#'}">
        <rect
          id="avatar"
          x="360.5"
          y="237.5"
          width="201"
          height="220"
          fill="#24FF00"
          stroke-width="0"></rect>
      </a> -->
      <a on:click="{() => openRoom('play')}" href="{'#'}">
        <rect x="1000" width="650" height="500" fill="transparent"></rect>
      </a>
      <a on:click="{() => openRoom('community')}" href="{'#'}">
        <rect y="350" width="500" height="500" fill="transparent"></rect>
      </a>
      <a on:click="{() => openRoom('discovery')}" href="{'#'}">
        <rect x="1499" y="1000" width="750" height="700" fill="transparent"
        ></rect>
      </a>
      <a on:click="{() => openRoom('hall')}" href="{'#'}">
        <rect x="372" y="1250" width="600" height="500" fill="transparent"
        ></rect>
      </a>
      <image
        class:is-current-user="{$currentRoom === 'discovery'}"
        class="nonStopDiscovery"
        href="{$navatarFace || placeholderNavatar}"
        x="1700"
        y="950"></image>
      <image
        class:is-current-user="{$currentRoom === 'play'}"
        class="nonStopPlay"
        href="{$navatarFace || placeholderNavatar}"
        x="1300"
        y="50"></image>
      <image
        class:is-current-user="{$currentRoom === 'community'}"
        class="nonStopCommunity"
        href="{$navatarFace || placeholderNavatar}"
        x="150"
        y="300"
      >
      </image>
      <image
        class:is-current-user="{$currentRoom === 'hall'}"
        class="nonStopHall"
        href="{$navatarFace || placeholderNavatar}"
        x="840"
        y="650"></image>
    </svg>
  </div>
  <div class="footer-modal">
    <div class="footer-modal-btn-icon">
      <button
        class="button"
        on:click="{() => navigateTo(`/${$retailerName}/profile/settings`)}"
      >
        <img src="/images/cogIcon.svg" alt="{$_('profile.settings')}" />
      </button>
      <button
        class="button"
        disabled="{loadingShare || !getAccessToken()}"
        on:click="{shareFunction}"
      >
        <UploadIcon fill="white" />
      </button>
    </div>
    <div>
      <Button onClick="{openChangeLocationModal}">
        {$_("burgerMenu.changeLocation")}
      </Button>
    </div>
  </div>
</div>

<div class="modal" class:is-active="{modalOpen}">
  <div class="modal-background" on:click="{() => (modalOpen = false)}"></div>
  <div class="modal-content has-text-centered">
    <img src="{modalImage}" alt="image_shared" />
  </div>
  <button
    class="modal-close is-large"
    aria-label="close"
    on:click="{() => (modalOpen = false)}"></button>
</div>

<style lang="scss">
  rect {
    cursor: pointer;
  }

  .modal {
    z-index: 99;
  }

  #loading-x {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: 1;
    background-color: black;
    font-weight: bold;
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container-modal {
    background-color: #000000;
    z-index: 10;
    display: flex;
    flex-direction: column;
    position: absolute;
    color: white;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
    transform: translateY(-130vh);
    transition: 0.3s;
    z-index: 12;

    .canvas-container {
      position: absolute;
      height: 22rem;
      width: 100%;
      top: 0;
      left: 0;
      z-index: -9999;
      opacity: 0;
    }

    .navatar-container {
      position: relative;
      width: 100% !important;
      height: 100% !important;
    }

    .footer-modal {
      width: 100%;
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      &-btn-icon {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        /* img {
          margin-right: 15px;
        } */
      }
    }
    &.is-active {
      transform: translateY(0);
    }
    .img {
      height: 100%;
      max-width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 100vw;
        height: auto;
        object-fit: contain;
        object-position: center;
        .img-menu {
          width: auto;
          height: 95%;
        }
        .nonStopDiscovery,
        .nonStopPlay,
        .nonStopCommunity,
        .nonStopHall {
          display: none;
        }
        .nonStopDiscovery {
          width: 320px;
        }
        .nonStopPlay {
          width: 200px;
        }
        .nonStopCommunity {
          width: 250px;
        }
        .nonStopHall {
          width: 300px;
        }
        .is-current-user {
          display: inline-block;
        }
      }
    }
  }
  .button {
    background-color: transparent;
    border: none;
    padding: 0;
  }
</style>
