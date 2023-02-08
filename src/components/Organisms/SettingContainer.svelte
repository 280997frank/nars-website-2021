<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";
  import { v4 as uuidv4 } from "uuid";

  import Button from "@/components/Atoms/Button.svelte";
  import Spinner from "@/components/Atoms/Spinner.svelte";
  import Language from "@/components/Molecules/Language.svelte";

  import { fetchProfile } from "@/api/retailer";
  import { logout } from "@/api/auth";

  import { SETTING_MENUS } from "@/constants/settingMenus";

  import { footerHeight, navbarHeight, userData } from "@/stores/profile";
  import { retailerName } from "@/stores/retailer";
  import { isWelcomeModalShown } from "@/stores/welcomeModal";

  import { getAccessToken, removeAccessToken, setGuestId } from "@/utils/index";
  // import { showNotifIconStore } from "@/stores/notifications";

  let arrow = "/icons/arrow.png";

  interface IMenu {
    key: string;
    icon: string;
    title: string;
    route: string;
    mustBeAuthenticated: boolean;
  }

  let menus: IMenu[] = [];
  let loading = false;
  let isLoggingOut = false;

  const parentContainer = document.getElementById(
    "parent-container"
  ) as HTMLDivElement;

  let mainHeight = parentContainer.clientHeight;

  const getProfile = async () => {
    try {
      loading = true;
      menus = mappingMenus();
      if ($userData === null) {
        $userData = await fetchProfile();
      }
      loading = false;
    } catch (error) {
      console.log(error.message);
      loading = false;
    }
  };

  const token = getAccessToken();

  onMount(async () => {
    await getProfile();
  });

  $: {
    if ($navbarHeight && $footerHeight) {
      mainHeight = mainHeight - $navbarHeight - $footerHeight;
    }
  }

  async function handleLogout() {
    try {
      isLoggingOut = true;
      // $showNotifIconStore = false;
      await logout();
    } catch (error) {
      console.error(error.message);
    } finally {
      removeAccessToken();
      setGuestId(uuidv4());
      // navigate("/");
      location.replace(`/${$retailerName}`);
    }
  }

  function mappingMenus() {
    return SETTING_MENUS.map((menu) => {
      return {
        ...menu,
      };
    });
  }
</script>

{#if loading}
  <div class="spinner">
    <Spinner />
  </div>
{/if}
<main class="main" style="--content-height: {mainHeight}px">
  <h1 class="title">{$_("settings.title")}</h1>
  <!-- <div class="language">
    <Language />
  </div> -->
  <div class="list">
    <div
      class="language list-item is-flex-direction-row is-justify-content-space-between is-align-items-center"
    >
      <Language />
    </div>
    {#each menus as item (item.key)}
      <div
        class="list-item is-flex-direction-row is-justify-content-space-between is-align-items-center"
        on:click="{() => {
          const pageToOpen = `/${$retailerName}${item.route}`;
          if (item.mustBeAuthenticated) {
            if (token) {
              navigate(pageToOpen);
            } else {
              $isWelcomeModalShown = true;
            }
          } else {
            navigate(pageToOpen);
          }
        }}"
      >
        <div class="is-gap is-flex is-flex-direction-row is-align-items-center">
          <div class="icon">
            <img src="{item.icon}" alt="" width="32" height="32" />
          </div>
          <div class="menu-title">
            <h2 class="menu-name">{$_(`settings.${item.title}`)}</h2>
          </div>
        </div>
        <div class="icon">
          <img src="{arrow}" alt="" height="8" width="8" />
        </div>
      </div>
    {/each}
  </div>
  {#if token}
    <div class="button-container">
      <Button onClick="{handleLogout}" isLoading="{isLoggingOut}">
        {$_("settings.logout")}
      </Button>
    </div>
  {/if}
</main>

<style lang="scss">
  @use "../../styles/flexbox" as flex;
  @use "../../styles/typography" as t;

  .main {
    height: var(--content-height);
    padding: 0 16px;
  }

  .list {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .list-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    /* &.is-active {
      background-color: white !important;
      // ul{
      //   background-color: white;
      //   li{
      //     .accordion-item-header{
      //       .header{
      //         .icon{
      //           transform: rotate(90deg);
      //         }
      //       }
      //     }
      //   }
      // }
    } */
  }

  .menu-title h2 {
    @include t.typography;
    padding-top: 5px;
  }

  .title {
    @include t.typography;
    font-weight: 300;
    font-size: 1.875rem;
    line-height: 2.25rem;
    margin-top: 1rem;
    text-align: start;
    text-transform: uppercase;
  }

  .icon {
    color: white;
    width: 25px;
    height: 25px;
  }

  .is-gap {
    @include flex.zod-gap;
  }

  .language {
    margin-bottom: 0;
  }

  .button-container {
    width: 160px;
    position: fixed;
    bottom: 90px;
  }

  .menu-name {
    margin: 2px 0 2px 0;
    padding: 0 !important;
  }

  .spinner {
    position: absolute;
    left: 50%;
    top: 45%;
  }
</style>
