<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { useMutation } from "@sveltestack/svelte-query";
  // import { toasts } from "svelte-toasts";
  import { _, locale } from "svelte-i18n";
  import { v4 as uuidv4 } from "uuid";

  import Spinner from "@/components/Atoms/Spinner.svelte";
  import ChangeLocation from "@/components/Organisms/ChangeLocation.svelte";
  import WelcomeModal from "@/components/Organisms/WelcomeModal.svelte";

  import {
    getAccessToken,
    setAccessToken,
    setWeChatToken,
    setUsername,
    setProfilePicture,
    setGuestId,
    getGuestId,
  } from "@/utils";

  import { isMiniProgram } from "@/stores/miniProgram";
  import {
    isWelcomeModalShown,
    isSignupFormShown,
  } from "@/stores/welcomeModal";
  import { updateField } from "@/stores/signupForm";
  import { isHamburgerShown } from "@/stores/navbar";
  import {
    retailerName,
    featuredProducts,
    supportedLanguages,
  } from "@/stores/retailer";

  import { getOpenId } from "@/api/auth";
  import { completeTask, EAvailableTasks } from "@/api/tasks";
  import { fetchRetailers, getMyRetailerByName } from "@/api/retailer";

  import { fetchNavatar } from "@/utils/navatar/generate";

  export let isPrivate = false;
  export let isOverflowable = false;
  export let isFlex = false;

  let isChecking = true;
  let isRetailerNameInvalid = false;
  let isRetailerListOpen = false;

  function updateMiniProgramStatus() {
    console.log("end", Date.now());
    console.log("The website runs inside WeChat Mini Program");
    $isMiniProgram = true;
  }

  async function checkRetailerName(name: string) {
    try {
      const retailerDetail = await getMyRetailerByName(name);
      $featuredProducts = retailerDetail.featuredProducts
        .filter(({ isFeatured }) => isFeatured)
        .map(({ id, featured3dModel }) => ({
          id,
          model3dUrl: featured3dModel,
        }));

      if (
        Array.isArray(retailerDetail?.languages) &&
        retailerDetail.languages.length > 0
      ) {
        $supportedLanguages = retailerDetail.languages;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  function onRetailerSelect(e: Event) {
    const button = <HTMLButtonElement>e.target;
    const slug = button.dataset.slug;
    location.replace(`/${slug}`);
  }

  function toggleRetailerList() {
    isRetailerListOpen = !isRetailerListOpen;
  }

  /* function openGamePage() {
    navigate("/lobby");
  } */

  const mutationOpenId = useMutation(getOpenId, {
    onError(error: Error) {
      console.log("Open ID Error", error.message);
    },
  });

  const mutationRetailerList = useMutation(fetchRetailers, {
    onError(error: Error) {
      console.log("Retailer Error", error.message);
    },
  });

  function switchLanguage(lang: string) {
    localStorage.setItem("locale", lang);
    $locale = lang;
  }

  onMount(async () => {
    window.gtag(
      "set",
      "page_path",
      window.location.pathname + window.location.search
    );
    window.gtag("event", "page_view");

    const token = getAccessToken();

    checkRetailerName($retailerName)
      .then((isRetailerValid) => {
        if (!isRetailerValid) {
          isRetailerNameInvalid = true;
          $mutationRetailerList.mutate();
        } else {
          if (isPrivate) {
            if (token) {
              isChecking = false;
            } else {
              console.log("Unauthenticated");
              navigate(`/${$retailerName}`);
            }
          } else {
            isChecking = false;
          }

          if (!token && !getGuestId()) {
            setGuestId(uuidv4());
          }

          if (!isChecking) {
            const token = getAccessToken();
            const parsedUrl = new URL(window.location.href);
            const code = parsedUrl.searchParams.get("code");
            const state = parsedUrl.searchParams.get("state");

            if (code && (state === "LOGIN" || state === "SIGNUP")) {
              $mutationOpenId.mutate(code);
            } else if (token) {
              // openGamePage();
              completeTask(EAvailableTasks.MonthlyGift)
                .then(() => {
                  console.log("NCOINS earned from monthly gift");
                })
                .catch((error) => {
                  console.error(error, error.stack);
                });

              fetchNavatar()
                .then(() => {
                  console.log("Navatar fetched and rendered");
                })
                .catch((error) => {
                  console.log("Navatar Error", error.message);
                });
            } else {
              /* if (automaticallyShowWelcomeModal) {
            setTimeout(() => {
              $isWelcomeModalShown = true;
            }, 2000);
          } */
            }
          }
        }
      })
      .catch((error) => console.error(error));

    document.addEventListener(
      "WeixinJSBridgeReady",
      updateMiniProgramStatus,
      false
    );

    return () => {
      document.removeEventListener(
        "WeixinJSBridgeReady",
        updateMiniProgramStatus,
        false
      );
    };
  });

  $: {
    if ($mutationOpenId.isSuccess) {
      if ($mutationOpenId.data.token) {
        setWeChatToken("access", $mutationOpenId.data.access_token);
        setWeChatToken("refresh", $mutationOpenId.data.refresh_token);
        setAccessToken($mutationOpenId.data.token);
        setProfilePicture($mutationOpenId.data.thumbnail || "");
        setUsername(
          `${$mutationOpenId.data.firstName || "N/A"} ${
            $mutationOpenId.data.lastName ?? ""
          }`.trim()
        );
        console.log("Login Success");
        // openGamePage();
        fetchNavatar()
          .then(() => {
            console.log("Navatar fetched and rendered");
          })
          .catch((error) => {
            console.log("Navatar Error", error.message);
          });
      } else {
        let gender = "";
        switch ($mutationOpenId.data.profile.sex) {
          case 1:
            gender = "male";
            break;
          case 2:
            gender = "female";
            break;
        }

        setWeChatToken("access", $mutationOpenId.data.access_token);
        setWeChatToken("refresh", $mutationOpenId.data.refresh_token);

        // Set some values to form signup
        updateField("nickname", $mutationOpenId.data.profile.nickname);
        updateField("gender", gender);
        updateField("country", $mutationOpenId.data.profile.country);
        updateField("city", $mutationOpenId.data.profile.city);
        updateField("province", $mutationOpenId.data.profile.province);
        updateField("openId", $mutationOpenId.data.openid);
        updateField("thumbnail", $mutationOpenId.data.profile.headimgurl);

        // Show signup form
        // isWelcomeModalShown.update(() => true);
        // isSignupFormShown.update(() => true);
        $isWelcomeModalShown = true;
        $isSignupFormShown = true;
      }
    }

    if ($mutationRetailerList.isSuccess) {
      if ($mutationRetailerList.data.length === 1) {
        location.replace(`/${$mutationRetailerList.data[0].slugName}`);
      }
    }

    if ($supportedLanguages.length === 1) {
      switchLanguage($supportedLanguages[0]);
    } else if ($supportedLanguages.length > 1) {
      const activeLang = localStorage.getItem("locale");
      if (!activeLang) {
        switchLanguage("zh-CN");
      }
    }
  }
</script>

<svelte:head>
  <meta
    http-equiv="Cache-Control"
    content="no-cache, no-store, must-revalidate"
  />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>{$_("programmeName")}</title>
</svelte:head>
<main>
  <div
    class="container"
    class:is-overflowable="{isOverflowable && !$isHamburgerShown}"
    class:is-flex="{isFlex}"
    class:is-flex-direction-column="{isFlex}"
    id="parent-container"
  >
    {#if isChecking}
      <div id="loading">
        {$_("nwallet.loading")}
      </div>
    {:else}
      <ChangeLocation />
      <slot />
    {/if}
    <div class="modal" class:is-active="{$mutationOpenId.isLoading}">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="spinner-container has-text-centered">
          <Spinner />
          <p>Retrieving data...</p>
        </div>
      </div>
    </div>
    <div
      class="modal retailer-select"
      class:is-active="{isRetailerNameInvalid}"
    >
      <div class="modal-background"></div>
      <div
        class="modal-content"
        class:is-ready="{$mutationRetailerList.isSuccess}"
      >
        <div class="has-text-centered">
          {#if $mutationRetailerList.isLoading}
            <Spinner />
          {:else}
            <div class="dropdown" class:is-active="{isRetailerListOpen}">
              <div class="dropdown-trigger">
                <button
                  class="button"
                  aria-haspopup="true"
                  aria-controls="retailer-dropdown"
                  on:click="{toggleRetailerList}"
                >
                  <span>SELECT RETAILER</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="retailer-dropdown" role="menu">
                <div class="dropdown-content">
                  {#if $mutationRetailerList.isSuccess}
                    {#each $mutationRetailerList.data as retailer (retailer.id)}
                      <button
                        class="dropdown-item"
                        data-slug="{retailer.slugName}"
                        on:click="{onRetailerSelect}"
                      >
                        {retailer.name}
                      </button>
                    {/each}
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
    <WelcomeModal />
  </div>
</main>

<style lang="scss">
  $scrollbar-thumb: grey;
  $scrollbar-track: transparent;

  main {
    // min-height: 100vh;
    // height: 100vh;
    height: 100%;
    background-color: black;
    cursor: auto;
  }

  .container {
    height: 100%;
    height: -webkit-fill-available;
    max-height: 100vh;
    overflow: hidden;
    background-color: black;
    width: 100vw;
    scrollbar-width: thin;
    scrollbar-color: $scrollbar-thumb $scrollbar-track;

    // @media (min-width: 48em) {
    @media (min-width: 53vh) {
      // min-width: 25rem;
      // width: 25vw;
      width: 52.1vh;
    }

    &.is-overflowable {
      overflow-y: auto;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $scrollbar-thumb;
    }

    &::-webkit-scrollbar-track {
      background-color: $scrollbar-track;
    }

    &::-webkit-scrollbar {
      background-color: white;
      width: 5px;
    }
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

  .spinner-container {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    background-color: rgba(50, 50, 50, 0.5);
    padding: 1rem;
    border-radius: 0.5rem;
    color: white;
  }

  .modal-content {
    width: auto;
  }

  .modal.retailer-select {
    .modal-content {
      background-color: black;
      color: white;
      padding: 2rem;

      &.is-ready {
        height: 30vh;
      }

      .dropdown-item {
        text-transform: uppercase;
        cursor: pointer;
        padding: 0.5rem;
        background-color: transparent;
        border: none;

        &:hover {
          background-color: grey;
          color: white;
        }
      }
    }
  }
</style>
