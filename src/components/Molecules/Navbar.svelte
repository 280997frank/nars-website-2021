<script lang="ts">
  import NavbarMenu from "@/components/Molecules/NavbarMenu.svelte";
  import { isChangeLocationModalShow } from "@/stores/changeLocation";
  import { isHamburgerShown } from "@/stores/navbar";
  import { navbarHeight } from "@/stores/profile";
  import { retailerName } from "@/stores/retailer";
  import { currentRoom } from "@/stores/room";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  import MediaQuery from "../Atoms/MediaQuery.svelte";

  export let onBackButtonClick = () => null;
  export let showBackButton = true;
  export let backTitle = $_("backButton.nonstopHall");

  let height: number;

  function goToHome() {
    $currentRoom = "entry";
    $isHamburgerShown = false;
    $isChangeLocationModalShow = false;
    navigate(`/${$retailerName}`);
  }

  function onHamburgerClick() {
    $isHamburgerShown = !$isHamburgerShown;
  }

  $: {
    if (height) {
      $navbarHeight = height;
    }
  }
</script>

<NavbarMenu isActive="{$isHamburgerShown}" />
<nav
  id="navbar"
  class="navbar"
  aria-label="main navigation"
  bind:clientHeight="{height}"
>
  <div class="navbar-brand">
    <MediaQuery query="(max-width: 480px)" let:matches>
      <button
        class="button back"
        class:is-visible="{showBackButton && !$isHamburgerShown}"
        on:click="{onBackButtonClick}"
      >
        <img src="/images/back-button.png" alt="" width="16" height="16" />
        <span
          class="back-title {matches
            ? 'back-title-mobile'
            : 'back-title-desktop'}"
        >
          {@html backTitle}
        </span>
      </button>
    </MediaQuery>
    <button class="navbar-item" on:click="{goToHome}">
      <img
        src="/images/nars-header-logo.svg"
        width="240"
        height="102"
        alt="NARS"
      />
    </button>

    <button
      class="navbar-burger"
      class:is-active="{$isHamburgerShown}"
      aria-label="menu"
      aria-expanded="{$isHamburgerShown}"
      data-target="navbarBasicExample"
      on:click="{onHamburgerClick}"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  </div>
</nav>

<style lang="scss">
  .navbar {
    background-color: transparent;
    z-index: 12;

    /* &.has-top-padding {
      padding-top: 1rem;
    } */
  }

  .navbar-brand {
    justify-content: space-between;
    position: relative;
    width: 100%;
    margin: 0 !important;

    .navbar-item {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: transparent;
      border: none;
      cursor: pointer;

      img {
        max-height: unset;
        width: 5rem;
      }
    }
  }

  .back.button {
    height: auto;
    width: auto;
    background-color: transparent;
    border: none;
    padding: 0;
    visibility: hidden;

    &.is-visible {
      visibility: visible;
    }

    img {
      width: 16px;
      margin: 0 0.5rem;
    }

    span.back-title {
      text-align: start;
      font-size: 10px;
      line-height: 11px;
      color: white;
      font-weight: 250;
      letter-spacing: 1px;
    }

    span.back-title-desktop {
      margin-top: -1px;
    }

    span.back-title-mobile {
      margin-top: 1px;
    }
  }

  .navbar-burger {
    margin-left: 0;
    display: block;
    outline: none !important;
    box-shadow: none !important;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    span {
      background-color: white;
    }
  }
</style>
