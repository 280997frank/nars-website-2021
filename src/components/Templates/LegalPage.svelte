<script lang="ts">
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  import Navbar from "@/components/Molecules/Navbar.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import TitleWithIcon from "@/components/Atoms/TitleWithIcon.svelte";

  // import { userData } from "@/stores/profile";
  import { navbarHeight } from "@/stores/profile";

  import { getAccessToken } from "@/utils";

  export let retailerName: string;
  export let pageTitle: string;
</script>

<Layout>
  {#if getAccessToken()}
    <Navbar
      onBackButtonClick="{() => navigate(`/${retailerName}/profile/settings`)}"
      backTitle="{$_('profile.settings')}"
    />
  {:else}
    <Navbar
      onBackButtonClick="{() => navigate(`/${retailerName}`)}"
      backTitle="{$_('backButton.nonstopHall')}"
    />
  {/if}
  <main class="main" style="max-height: calc(100% - {$navbarHeight}px)">
    <TitleWithIcon title="{pageTitle}">
      <img
        src="{pageTitle === $_('settings.privacyPolicy')
          ? '/icons/icon-privacy.svg'
          : '/icons/icon-tnc.svg'}"
        alt=""
        width="25px"
        height="25px"
      />
    </TitleWithIcon>
    <slot name="content" />
  </main>
</Layout>

<style lang="scss">
  .main {
    height: -webkit-fill-available;
    // max-height: 900px;
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
    color: white;
  }
</style>
