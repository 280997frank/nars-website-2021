<script lang="ts">
  import {
    fetchProfile,
    fetchRetailers /* updateRetailer */,
  } from "@/api/retailer";
  // import { navigate } from "svelte-routing";
  // import isNil from "lodash/isNil";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import type { Retailer } from "@/interfaces/retailer";
  import { isChangeLocationModalShow } from "@/stores/changeLocation";
  import { userData } from "@/stores/profile";
  import { availableRetailersQty, retailerName } from "@/stores/retailer";
  import { replaceEnVersionWithHelvetica100 } from "@/utils/regexHelper";
  import { onMount } from "svelte";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";

  let retailer: string;
  let listRetailer: Retailer[] = [];
  let isOptionShow = false;
  let loading = false;

  $: {
    if (listRetailer.length) {
      retailer =
        listRetailer.find(
          ({ slugName }) =>
            slugName.toLowerCase() === $retailerName.toLowerCase()
        )?.name || "Unknown Retailer";
    }
  }

  function selectOption(e: Retailer) {
    // loading = true;
    retailer = e.name;
    setOptionShow();
    updateData(/* e.id,  */ e.slugName);
  }

  function setOptionShow() {
    if ($availableRetailersQty > 1) {
      isOptionShow = !isOptionShow;
    }
  }

  async function updateData(/* params: string, */ paramName: string) {
    /*     const req = await updateRetailer(params);
    $userData = req;
    loading = false;

    if (!isNil(req)) {
      location.replace(`?retailer=${encodeURI(paramName)}`);
    } */
    // navigate(`/${paramName}`);
    location.pathname = `/${paramName}`;
  }

  function closeModal() {
    // goToRoom("entry");
    // $isHamburgerShown = false;
    $isChangeLocationModalShow = false;
  }

  async function fetchAll() {
    loading = true;
    try {
      return await Promise.all([fetchRetailers(), fetchProfile()]);
    } catch (error) {
      console.error(error.message);
      loading = false;
    }
  }

  onMount(async () => {
    loading = true;
    const req = await fetchAll();
    if (Array.isArray(req) && req.length) {
      listRetailer = req[0].map((item) => {
        return { ...item };
      });

      $availableRetailersQty = listRetailer.length;

      if ($userData === null) {
        $userData = req[1];
      }
    }

    loading = false;
  });
</script>

<div
  class="changelocation-modal"
  class:is-hidden="{!$isChangeLocationModalShow}"
>
  <Navbar backTitle="{$_('nwallet.back')}" onBackButtonClick="{closeModal}" />
  <p class="my-6">
    {@html $_("locationMenu.upperDescription")}
  </p>
  <p class="mt-4 lh-05">{$_("locationMenu.youreNowIn")}</p>
  <h2 class="mt-1 mb-5">
    {@html loading
      ? $_("nwallet.loading")
      : retailer
      ? replaceEnVersionWithHelvetica100(retailer)
      : "Unknown Retailer !"}
  </h2>
  <div class="select-input" class:is-hidden="{$availableRetailersQty < 2}">
    <div
      class="selected pt-1x is-flex is-justify-content-center"
      on:click="{setOptionShow}"
    >
      {$_("locationMenu.changeRetailer")}
      <!-- src="/images/dropdown.svg" -->
      <img
        class="btn-icon"
        class:is-active="{isOptionShow}"
        src="/icons/arrow.png"
        width="29"
        height="48"
        alt=""
      />
    </div>
    <div class="options" class:is-active="{isOptionShow}">
      {#each listRetailer as item (item.id)}
        <span on:click="{() => selectOption(item)}">{item.name}</span>
      {/each}
    </div>
  </div>
  <hr />
  <h1 class="title">{$_("locationMenu.findAStore")}</h1>
  <p class="paragraf">{@html $_("locationMenu.lowerDescription")}</p>
  <a
    href="https://onlinestores.narstravelretail.com/"
    target="_blank"
    class="button custume-btn"
    rel="noopener noreferrer"
  >
    {$_("locationMenu.seeAllShops")}
  </a>
</div>

<style lang="scss">
  @import "../../styles/typography";
  .changelocation-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    padding: 0 0 1rem;
    z-index: 99;
    overflow-y: auto;
  }

  /* .custume-btn {
    padding-top: 0.7rem;
  } */

  .lh-05 {
    margin-bottom: -4px;
  }

  .paragraf {
    width: 80%;
    margin: 2rem auto 2.5rem;
    // margin-bottom: 2.5rem;
  }

  .title {
    @include typography;
    font-size: 2rem;
    line-height: 2rem;
  }

  hr {
    background-color: rgba(41, 41, 41, 1);
    height: 1px;
    margin: 50px 0;
  }

  h2 {
    @include typography;
    font-size: large;
    text-align: center;
    text-transform: lowercase;
  }

  p {
    @include paragraph;
    margin: 10px 0;
  }

  a {
    text-decoration: none !important;
  }

  .select-input {
    border: 1px solid white;
    padding: 5px 0;
    width: 100%;
    margin: auto;
    text-align: center;

    .selected {
      text-transform: uppercase;
      cursor: pointer;
      align-items: center;
      width: inherit;
      cursor: inherit;
      .btn-icon {
        margin-left: 10px;
        transition: 0.2s;
        position: relative;
        width: 0.5rem;
        // margin-bottom: 4px;

        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        &.is-active {
          transform: rotate(-90deg);
          -moz-transform: rotate(-90deg);
          -webkit-transform: rotate(-90deg);
        }
      }
    }
    .options {
      color: white;
      display: none;
      flex-direction: column;
      align-items: center;
      span {
        text-transform: uppercase;
        padding: 5px 0;
        cursor: pointer;
      }
      &.is-active {
        display: flex;
      }
    }
  }

  .button {
    @include typography;
    letter-spacing: 1.5px;

    &:hover {
      background-color: grey !important;
      color: white;
    }

    &:focus {
      background-color: #f5f5f5 !important;
      color: #363636 !important;
    }

    &:not(.is-text) {
      background-color: transparent;
      border-radius: 0;
      width: 100%;
    }
  }
</style>
